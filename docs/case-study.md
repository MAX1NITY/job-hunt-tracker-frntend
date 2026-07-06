# Case Study: Job Hunt Tracker

A full-stack app for tracking LinkedIn cold-outreach — React frontend, FastAPI
backend, Supabase (Postgres + Auth) as the data layer, both sides deployed to
Vercel. This doc explains the *why* behind the decisions that aren't obvious
from reading the code, aimed at someone learning how these pieces fit together.

## Why Supabase Auth instead of hand-rolled auth?

Rolling your own auth means: password hashing, session tokens, refresh-token
rotation, OAuth handshakes with Google, email verification flows, and a table
to store all of it securely. Supabase Auth is Postgres + a hosted auth service
that does all of that and hands back a **JWT** — a signed token that proves
"this request came from user X" without the backend needing to touch
passwords at all.

The frontend never talks to the FastAPI backend to log in. It talks to
Supabase directly:

```js
// src/hooks/useAuth.js
function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/login` },
  })
}
```

This kicks off the **OAuth Authorization Code flow with PKCE**: the browser
is redirected to Google, the user consents, Google redirects back to Supabase
with a code, Supabase exchanges it for tokens, and finally redirects back to
our app with a session. The backend is never involved in any of this — it
only ever sees the *result* (a JWT), never the login itself. That's the
appeal: an entire category of security work (correctly implementing OAuth)
is outsourced to a provider whose whole job is to get it right.

**A bug we hit along the way:** the redirect initially pointed at `/`, and
React Router's redirect-to-`/login` logic stripped the `?code=` query param
before Supabase's client library got a chance to read it, silently breaking
login. Fix was to point `redirectTo` straight at `/login`. The lesson: with
PKCE flows, the redirect URL must be a route that survives long enough for
the auth library to consume its query params — client-side routing can beat
it to the punch.

## Why Row Level Security (RLS), when the API already filters by `user_id`?

Every backend query already does this:

```python
# backend/api/index.py
res = (
    supabase.table(TABLE)
    .select("*")
    .eq("user_id", user_id)
    .execute()
)
```

So why also enable RLS in Postgres?

```sql
-- contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can only access their own contacts"
ON contacts
USING (auth.uid() = user_id);
```

Because **the `.eq("user_id", ...)` filter is a convention, not a guarantee.**
It only protects the data if every single query in every single endpoint
remembers to include it. Forget one `.eq()` call in one new endpoint six
months from now, and you've leaked every user's contacts to every other user.

RLS moves that guarantee from "application code we hope is correct" to
"a rule the database itself enforces, on every query, from every client,
forever." Even a `SELECT *` with no `WHERE` clause at all still only returns
rows the policy allows. It's defense in depth: the FastAPI filter is the fast
path (avoids relying on RLS alone for query planning), RLS is the backstop
that makes forgetting the filter a non-event instead of a data breach.

This project actually uses the Supabase **service role key** in the backend
(`SUPABASE_SERVICE_KEY`), which *bypasses* RLS by design — it's a trusted
server context. So in this specific setup, RLS is a safety net for the case
where a future endpoint forgets `user_id` filtering, or where the anon/authed
key path is used elsewhere later. The `.eq("user_id", ...)` filter is what's
actually doing the enforcement today; RLS is what keeps that enforcement from
being optional. Worth knowing which one is actually load-bearing when you
read code like this elsewhere — a service-role key with RLS-only "protection"
and no application-level filter is not protected at all.

## Why verify the JWT via `supabase.auth.get_user()` instead of decoding it manually?

The first version of the backend decoded the JWT itself using the shared
`SUPABASE_JWT_SECRET` and a library like `PyJWT`. That's a legitimate
approach — it's faster (no network round-trip) — but it's also one more
place to get a cryptographic detail wrong (algorithm confusion, clock skew,
secret rotation), and this project hit exactly that: a secret-format
mismatch caused every request to 401 even with valid tokens.

The fix was to delegate verification back to Supabase:

```python
def get_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        response = supabase.auth.get_user(credentials.credentials)
        return response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
```

Trade-off made explicitly: one extra network call per request, in exchange
for "Supabase's own SDK verifies its own tokens" instead of re-implementing
that logic locally. For a low-traffic personal tool, that's the right trade.
A high-throughput API would want local JWKS-based verification to avoid the
round trip — but would need to get the crypto right, which is exactly the
class of bug this project ran into.

## Why is CORS wide open (`ALLOWED_ORIGINS=*`) in production?

Normally a wildcard CORS policy is a smell. Here it's deliberate:

```python
_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()] or ["*"]

app.add_middleware(CORSMiddleware, allow_origins=_origins, ...)
```

CORS is a **browser-enforced** restriction on which origins can read a
response — it protects against a malicious site making authenticated
requests to this API using a *victim's browser session*. But this API
doesn't use cookies for auth; every request carries an explicit
`Authorization: Bearer <token>` header that the calling JavaScript had to
go fetch from Supabase itself. A malicious site can't forge that header
without already having the user's token, at which point CORS wasn't the
thing protecting them anyway. Combined with Vercel preview deployments
getting a random hash per branch (so an allow-list would need updating on
every PR), wildcard origins were a reasonable call here — *because* the real
authorization boundary is the bearer token, not the browser's origin check.

This would be the wrong call for a cookie-based session API, where the
browser attaches credentials automatically and CORS is the only thing
stopping another site from riding on them.

## Why convert camelCase ↔ snake_case at the API boundary instead of picking one?

```python
def to_row(data: dict, user_id: str = None) -> dict:
    return {
        "name": data.get("name"),
        "linkedin_url": data.get("linkedinUrl"),
        "follow_up_date": data.get("followUpDate") or None,
        ...
    }

def to_contact(row: dict) -> dict:
    return {
        "name": row["name"],
        "linkedinUrl": row.get("linkedin_url") or "",
        "followUpDate": str(row["follow_up_date"]) if row.get("follow_up_date") else None,
        ...
    }
```

JavaScript convention is camelCase; SQL/Postgres convention is snake_case.
Rather than fight one of those conventions (e.g. naming JS variables
`follow_up_date`, which every JS linter and style guide will flag), the
conversion happens once, at the one place data crosses the boundary. Every
line of frontend code gets to assume camelCase; every line of SQL gets to
assume snake_case. The alternative — picking one casing and using it
everywhere — means either awkward JS or awkward SQL. This is a common enough
pattern that it's worth recognizing on sight: a thin translation layer at a
system boundary, so neither side has to compromise its own idioms.

## Testing strategy

Two different test setups because the two apps have fundamentally different
things worth testing:

**Backend (`pytest`)** — the interesting logic is (1) pure data conversion
(`to_row`/`to_contact`), (2) auth (does a bad token get rejected?), and (3)
that each endpoint calls Supabase with the *right* filters — especially
`user_id`, since that's the line between "your data" and "someone else's
data". The Supabase client is mocked (`unittest.mock.MagicMock`) so tests run
in milliseconds with no network and no real database:

```python
def test_update_contact_scopes_to_owning_user(auth_client, fake_supabase):
    chain = fake_supabase.table.return_value.update.return_value.eq.return_value.eq.return_value
    chain.execute.return_value.data = [SAMPLE_ROW]

    res = auth_client.put("/contacts/row-1", json={"name": "Ada", "company": "X"})

    second_eq = fake_supabase.table.return_value.update.return_value.eq.return_value.eq
    second_eq.assert_called_with("user_id", "user-123")  # the actual security check
```

That last assertion is the point of the test: it's not just checking the
HTTP status, it's checking that the query was actually scoped to the
authenticated user — the exact thing that, if a future refactor dropped it,
would leak data across accounts (see the RLS section above — this is the
"application filter" half of that defense-in-depth pair).

**Frontend (`vitest` + Testing Library)** — component tests render real
components and interact with them the way a user would (`userEvent.type`,
`userEvent.click`), rather than testing implementation details. One test is
a direct regression test for a real bug this project shipped:

```js
// Regression test for: VITE_API_URL with a trailing slash produced
// requests like `${BASE}/contacts` -> "https://api.example.com//contacts".
it('strips a trailing slash from VITE_API_URL before building request URLs', async () => {
  vi.stubEnv('VITE_API_URL', 'https://api.example.com/')
  ...
  expect(fetch).toHaveBeenCalledWith('https://api.example.com/contacts', expect.anything())
})
```

Writing a test *for* a bug after fixing it is worth doing deliberately: it's
the cheapest way to guarantee that specific mistake can't silently come back
in a future refactor.

**End-to-end (Playwright)** sits above both of those: it drives a real
browser against the real app, so it catches the class of bug that unit
tests structurally can't — wrong route wiring, a form that doesn't actually
submit, CSS that hides a working button. The hard part for *this* app is
that logging in for real means a Google OAuth redirect, which isn't
something CI can click through. The fix is to seed the thing the app
actually reads — supabase-js persists its session to `localStorage` under a
key derived from the project URL (`sb-<project-ref>-auth-token`) — before
the page's own scripts run:

```js
await page.addInitScript(
  ({ key, session }) => window.localStorage.setItem(key, JSON.stringify(session)),
  { key: STORAGE_KEY, session: FAKE_SESSION }
)
```

`useAuth()`'s `getSession()` call finds this on mount and treats it as a
real logged-in session — no network call, because the session's
`expires_at` is far enough in the future that supabase-js doesn't think it
needs to refresh. The backend is stubbed the same way real APIs get stubbed
in E2E tests — `page.route()` intercepts calls to it and returns canned
JSON — which keeps this test about the frontend's own behavior, not FastAPI
or a real database. (One easy mistake here: a route glob like `**/contacts`
also matches the SPA's own `/contacts` page navigation, not just the API
call, and will happily "answer" the browser's page load with a JSON body
instead of the app's HTML. Scoping the intercept to the API's exact origin —
`http://localhost:8000/contacts` — avoids that.)

## Input validation: a second boundary, not a replacement for the first

The original `ContactIn` model accepted any string for every field. It
still relies on Postgres constraints (`NOT NULL` on `name`/`company`) as the
last line of defense, but by the time bad data reaches Postgres, the only
feedback a user gets is a generic 500. Validating at the FastAPI boundary —
blank-name rejection, `EmailStr`, a real `date` type, a `Literal` of the five
known statuses — turns that into a `422` with a specific, actionable reason,
*before* anything touches the database:

```python
@field_validator("email", "followUpDate", mode="before")
@classmethod
def blank_string_to_none(cls, v):
    # The frontend sends "" for unset optional fields; EmailStr/date
    # reject "" outright, so treat blank the same as omitted.
    return v or None
```

That `mode="before"` validator is worth noticing: pydantic validators
normally run *after* type coercion, but `""` isn't a valid email or date, so
it'd fail before ever reaching a validator that could rewrite it to `None`.
`mode="before"` runs on the raw input, ahead of type coercion — the only way
to intercept "wrong type entirely" rather than "wrong value of the right
type." This is the same idea as the RLS/`user_id`-filter pair above:
defense in depth, applied to data shape instead of data ownership. Each
layer (frontend `required` attributes, this API validation, Postgres
constraints) catches what the layer before it could plausibly miss.

## Error monitoring: opt-in by construction

Sentry is wired into both apps, but neither `sentry_sdk.init()` (backend)
nor `Sentry.init()` (frontend) runs unless a `SENTRY_DSN`/`VITE_SENTRY_DSN`
env var is actually set:

```python
if sentry_dsn := os.getenv("SENTRY_DSN"):
    sentry_sdk.init(dsn=sentry_dsn, traces_sample_rate=0.1)
```

The point of gating it like this — rather than, say, leaving a
`# TODO: add Sentry` comment — is that the integration is *done*: reviewing
it, writing it, and testing that it doesn't break anything happens once,
now, while the code is fresh. Turning it on later is a one-line env var
change on Vercel, not a code change that needs re-testing. Nothing runs, no
account is required, and no data leaves the app until that variable exists.

## CI

Both repos run their test suite (and lint/build, for the frontend) on every
push and PR via GitHub Actions — see `.github/workflows/ci.yml` in each repo.
The goal isn't "100% coverage," it's a fast, free check that catches the
things this project's own history shows are easy to get wrong: auth scoping,
env var parsing, and boundary conversions.

## What's next

See the main [README](../README.md) and [roadmap](roadmap.md) for what's
already shipped. Ideas for further hardening are tracked there too —
pagination, input validation on the backend, rate limiting, and error
monitoring are the next things worth adding as this app sees more real use.

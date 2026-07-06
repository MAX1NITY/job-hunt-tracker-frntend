# Session Notes

## 2026-06-25 — Full build, all 3 phases completed

### What was done

Built the entire app from scratch in a single session. Scaffolded with `npm create vite@latest --template react`, chose plain React (no TypeScript, no Tailwind) per CLAUDE.md.

---

### Phase 1 — Frontend + localStorage

All components built with plain CSS, one file per component (CLAUDE.md convention):

- `src/data/mockContacts.js` — 5 seed contacts for Brisbane SaaS targets (Buildkite, Octopus Deploy, Deputy, Employment Hero, Canva). Loaded into localStorage on first visit.
- `src/utils/storage.js` — `getContacts`, `saveContacts`, `addContact`, `updateContact`, `deleteContact`
- `src/components/StatusBadge` — colour-coded pill per status using CSS vars
- `src/components/ContactCard` — shows name, role, company, badge, notes preview, follow-up date with overdue warning
- `src/components/ContactForm` — modal for add and edit, shared component
- `src/components/DashboardBar` — count per status across top
- `src/pages/ContactsPage` — wires everything: filter tabs, search, CRUD, modal state
- `src/App.jsx` — react-router-dom with `/` → `/contacts` redirect

---

### Phase 2 — FastAPI + Supabase

Backend lives in `../backend/` (separate from the React project).

**Supabase table schema (final, after auth migration):**
```sql
CREATE TABLE contacts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  role           TEXT,
  company        TEXT NOT NULL,
  email          TEXT,
  linkedin_url   TEXT,
  status         TEXT NOT NULL DEFAULT 'Not Contacted',
  follow_up_date DATE,
  notes          TEXT,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
-- RLS enabled, policy: auth.uid() = user_id (for authenticated role)
```

- `backend/api/index.py` — FastAPI app, GET/POST/PUT/DELETE `/contacts`, handles camelCase ↔ snake_case conversion in `to_row()` / `to_contact()`
- `backend/requirements.txt` — fastapi, supabase, python-dotenv, uvicorn
- `backend/vercel.json` — routes all traffic to `api/index.py` for Vercel Python serverless
- Frontend: `src/utils/api.js` replaced `storage.js`, `ContactsPage` updated for async + loading/error states

**Run backend locally:**
```
cd backend
.venv\Scripts\uvicorn api.index:app --reload
```

---

### Phase 2 (continued) — Google OAuth + Auth

- `src/lib/supabase.js` — Supabase client (anon key, safe for frontend)
- `src/hooks/useAuth.js` — session state via `onAuthStateChange`, `signInWithGoogle`, `signOut`
- `src/pages/LoginPage.jsx` — centred card with Google sign-in button
- `src/App.jsx` — protected routes: `/contacts` requires session, `/login` redirects away if already authed
- `src/utils/api.js` — every request includes `Authorization: Bearer <access_token>` from current session
- Backend: JWT verified via `supabase.auth.get_user(token)` (not manual PyJWT decode — avoids secret mismatch issues)
- All queries filter by `user_id` so each user only sees their own contacts
- `vercel.json` added to frontend for SPA fallback (fixes 404 on `/login` direct load)

**Supabase settings required:**
- Auth → Providers → Google → enabled (requires Google Cloud OAuth 2.0 credentials)
- Auth → URL Configuration → Site URL: `https://job-hunt-tracker-frntend.vercel.app`
- Auth → URL Configuration → Redirect URLs: add `/login` suffix variants for both prod and localhost

**Vercel env vars:**

| Project | Key | Value |
|---|---|---|
| Frontend | `VITE_SUPABASE_URL` | `https://qlgcpjtuulgjzokmspif.supabase.co` |
| Frontend | `VITE_SUPABASE_ANON_KEY` | anon JWT (from Supabase API Keys) |
| Frontend | `VITE_API_URL` | `https://job-hunt-tracker-bkend.vercel.app` |
| Backend | `SUPABASE_URL` | `https://qlgcpjtuulgjzokmspif.supabase.co` |
| Backend | `SUPABASE_SERVICE_KEY` | service_role key |
| Backend | `ALLOWED_ORIGINS` | `*` |

---

### Phase 3 — Polish + Deploy

- `src/hooks/useToast.js` + `src/components/Toast` — auto-dismissing toasts (3s) for add/update/delete actions
- `src/components/ContactCardSkeleton` — shimmer animation shown during initial load (3 placeholder cards)
- Empty states: two distinct states — "No contacts yet" (with Add CTA) vs "No results" (with Clear filters CTA)
- Mobile: `form-row` collapses to 1 column on <540px, dashboard bar hides divider on <480px
- Email field on contact card — click to copy to clipboard (mailto: doesn't work without a default email client)

---

### Bugs fixed

**1. Double-slash URL (`//contacts`)**
- Cause: `VITE_API_URL` env var on Vercel had a trailing slash
- Fix: `src/utils/api.js` strips trailing slash with `.replace(/\/$/, '')`

**2. CORS blocked on Vercel**
- Cause: `ALLOWED_ORIGINS` blank → `"".split(",")` = `[""]`. Also preview URLs have random hashes.
- Fix: backend filters empty strings, falls back to `["*"]`. Set `ALLOWED_ORIGINS=*` on Vercel.

**3. OAuth redirect stripping PKCE code**
- Cause: Supabase redirected to `/` with `?code=`, React Router redirected to `/login` stripping the code before Supabase could exchange it.
- Fix: `redirectTo` set to `${origin}/login` so Supabase lands directly on the right page.

**4. 404 on `/login` direct load (Vercel)**
- Cause: Vercel tried to serve `/login` as a real file — SPA routes don't exist as files.
- Fix: `vercel.json` in frontend with `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`

**5. 401 on `/contacts` despite valid session**
- Cause: Manual PyJWT decode with `SUPABASE_JWT_SECRET` was failing (secret format mismatch).
- Fix: Switched to `supabase.auth.get_user(token)` — delegates verification to Supabase directly.

**6. Vite env vars missing in Vercel build**
- Cause: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` not set in Vercel frontend project. Vite bakes these in at build time so they must be set before deploying.
- Fix: Added both to Vercel frontend env vars and redeployed.

---

### Infrastructure

| | Detail |
|---|---|
| Frontend repo | github.com/MAX1NITY/job-hunt-tracker-frntend |
| Backend repo | github.com/MAX1NITY/job-hunt-tracker-bkend |
| Frontend URL | https://job-hunt-tracker-frntend.vercel.app |
| Backend URL | https://job-hunt-tracker-bkend.vercel.app |
| Supabase project | qlgcpjtuulgjzokmspif.supabase.co |
| Backend venv | `backend/.venv` — activate: `.venv\Scripts\activate` |

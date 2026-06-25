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

**Supabase table schema:**
```sql
CREATE TABLE contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  role          TEXT,
  company       TEXT NOT NULL,
  linkedin_url  TEXT,
  status        TEXT NOT NULL DEFAULT 'Not Contacted',
  follow_up_date DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
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

### Phase 3 — Polish + Deploy

- `src/hooks/useToast.js` + `src/components/Toast` — auto-dismissing toasts (3s) for add/update/delete actions
- `src/components/ContactCardSkeleton` — shimmer animation shown during initial load (3 placeholder cards)
- Empty states: two distinct states — "No contacts yet" (with Add CTA) vs "No results" (with Clear filters CTA)
- Mobile: `form-row` collapses to 1 column on <540px, dashboard bar hides divider on <480px

---

### Bugs fixed during session

**1. Double-slash URL (`//contacts`)**
- Cause: `VITE_API_URL` env var on Vercel had a trailing slash
- Fix: `src/utils/api.js` strips trailing slash with `.replace(/\/$/, '')`

**2. CORS blocked on Vercel**
- Cause: `ALLOWED_ORIGINS` env var was blank on Vercel, causing `"".split(",")` → `[""]` (no origins allowed). Also Vercel preview deployments have random-hash URLs not in the allowlist.
- Fix: `backend/api/index.py` now filters empty strings and falls back to `["*"]`. `ALLOWED_ORIGINS=*` set on Vercel backend project.

---

### Infrastructure

| | Detail |
|---|---|
| Frontend repo | github.com/MAX1NITY/job-hunt-tracker-frntend |
| Backend repo | github.com/MAX1NITY/job-hunt-tracker-bkend |
| Frontend URL | https://job-hunt-tracker-frntend.vercel.app |
| Backend URL | https://job-hunt-tracker-bkend.vercel.app |
| Supabase project | qlgcpjtuulgjzokmspif.supabase.co |
| Backend venv | `backend/.venv` (gitignored) |

**Note:** Service role key was shared in chat during setup — consider regenerating it in Supabase → Settings → API → Regenerate service_role key, then update the Vercel env var on the backend project.

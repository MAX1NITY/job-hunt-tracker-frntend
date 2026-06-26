# Job Hunt Tracker — Roadmap

## Phase 1 — Frontend + localStorage ✓

- [x] Scaffold project with Vite + React
- [x] Define contact data shape in `src/data/mockContacts.js`
- [x] Build localStorage utility functions (get, save, update, delete)
- [x] Contact card component
- [x] Add new contact form/modal
- [x] Status badge component (colour coded per status)
- [x] Contacts list view
- [x] Edit contact
- [x] Delete contact
- [x] Filter by status
- [x] Search by name or company
- [x] Dashboard summary bar (count per status)
- [x] Follow-up date display + highlight overdue

## Phase 2 — Auth + Backend (FastAPI + Supabase) ✓

## Phase 2 — Auth + Backend (FastAPI + Supabase)

- [x] Set up Supabase project and contacts table
- [x] FastAPI backend with CRUD endpoints
- [x] Swap localStorage for API calls
- [x] Deploy backend (Vercel)
- [ ] Add email field to contacts table in Supabase
- [ ] Add email field to contact form on frontend
- [ ] Enable Google OAuth in Supabase Auth dashboard
- [ ] Add user_id foreign key to contacts table
- [ ] Enable Row Level Security (RLS) on contacts table
- [ ] RLS policy: users can only read/write their own rows
- [ ] Protect all FastAPI endpoints with JWT from Supabase Auth
- [ ] Google Sign In button on frontend
- [ ] Redirect to dashboard after login
- [ ] Each user sees only their own contacts

## Phase 3 — Polish + Deploy ✓

- [x] Deploy frontend to Vercel
- [x] Mobile responsiveness audit
- [x] Empty states and loading skeletons
- [x] Toast notifications for actions

## Live URLs

- Frontend: https://job-hunt-tracker-frntend.vercel.app
- Backend: https://job-hunt-tracker-bkend.vercel.app
- Database: Supabase (qlgcpjtuulgjzokmspif)

## Session Notes

@docs/session-notes.md

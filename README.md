# Job Hunt Tracker

A personal pipeline tracker for LinkedIn cold outreach — add contacts, track
status (Not Contacted → Messaged → Replied → Interview → Closed), set
follow-up dates, and see it all in one dashboard.

**Live:** https://job-hunt-tracker-frntend.vercel.app
**Backend repo:** https://github.com/MAX1NITY/job-hunt-tracker-bkend

## Stack

- React + Vite (JSX, no TypeScript, plain CSS with CSS variables)
- Supabase for auth (Google OAuth) — the frontend talks to Supabase directly
  for login, and to the FastAPI backend (with a JWT) for contact data
- react-router-dom for client-side routing

See [docs/case-study.md](docs/case-study.md) for the reasoning behind the
auth, security, and API design decisions, and [docs/roadmap.md](docs/roadmap.md)
for what's shipped and what's next.

## Dev Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server
npm run build     # production build
npm run lint      # oxlint
npm test          # run the unit/component test suite once
npm run test:watch  # run tests in watch mode
npm run test:e2e  # run Playwright end-to-end tests
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
VITE_SENTRY_DSN=   # optional — leave blank to disable error monitoring
```

## Testing

Two layers:

- **Unit/component** — [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com).
  Tests live next to the code they cover (`ContactForm.jsx` / `ContactForm.test.jsx`).
- **End-to-end** — [Playwright](https://playwright.dev), in `e2e/`. Seeds a fake
  Supabase session into `localStorage` and stubs the backend via `page.route()`,
  so it exercises real routing/rendering without needing a live Google OAuth
  flow or database.

CI runs lint, unit tests, a production build, and the E2E suite on every push
and PR — see `.github/workflows/ci.yml`.

## Error Monitoring

[Sentry](https://sentry.io) is wired up (`src/lib/sentry.js`, an
`ErrorBoundary` around `<App />` in `main.jsx`) but stays completely inert
until `VITE_SENTRY_DSN` is set — no account or network calls otherwise. Create
a free Sentry project and set the DSN as a Vercel env var to turn it on.

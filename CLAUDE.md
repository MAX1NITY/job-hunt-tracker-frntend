# Job Hunt Tracker

## Project Overview

Personal job search pipeline tracker for managing LinkedIn cold outreach.
Targeting Brisbane SaaS startups using the Wonsulting/Jonathan Javier method.

## Tech Stack

- Frontend: React + Vite (JSX, no TypeScript, no Tailwind)
- Styling: Plain CSS with CSS variables (one .css file per component/page)
- Backend (Phase 2): FastAPI + Supabase (PostgreSQL)
- Deployment: Vercel

## Dev Commands

- Install: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure

- `src/components/` — reusable UI components + their .css files
- `src/pages/` — page-level components + their .css files
- `src/hooks/` — custom React hooks
- `src/utils/` — helper functions
- `src/data/` — mock data (swapped for API calls in Phase 2)
- `docs/` — architecture, roadmap, and session notes

## Styling Conventions

- One .css file per component or page, named to match (e.g. ContactCard.css)
- CSS variables defined in index.css under :root
- Dark mode by default
- Mobile-first layout
- Use class names in kebab-case (e.g. .contact-card, .status-badge)

## Design Tokens (index.css)

```css
:root {
  --bg: #0f0f0f;
  --surface: #1a1a1a;
  --surface-2: #242424;
  --border: #2e2e2e;
  --text-primary: #f0f0f0;
  --text-muted: #888;
  --accent: #7c5cbf;
  --accent-light: #a78bfa;
  --radius: 10px;
}
```

## Status Colours

```css
--status-not-contacted: #555;
--status-messaged: #3b82f6;
--status-replied: #f59e0b;
--status-interview: #10b981;
--status-closed: #ef4444;
```

## Core Data Shape

```js
{
  id: string,
  user_id: string,          // links to authenticated user
  name: string,
  role: string,
  company: string,
  email: string | null,     // hiring manager email
  linkedinUrl: string,
  status: 'Not Contacted' | 'Messaged' | 'Replied' | 'Interview' | 'Closed',
  followUpDate: string | null,
  notes: string,
  createdAt: string,
  updatedAt: string
}
```

## Current Phase

Phase 1 — Frontend only with localStorage. No backend yet.
See @docs/roadmap.md for full plan.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One person: the owner, running a LinkedIn cold-outreach job search aimed at Brisbane SaaS startups (Wonsulting / Jonathan Javier method). Nobody else uses or sees the app. Used mostly on a laptop or desktop, next to LinkedIn, while sending messages and logging replies.

## Product Purpose

A personal pipeline tracker: add the people contacted, move each through Not Contacted → Messaged → Replied → Interview → Closed, set follow-up dates, and see at a glance who needs a nudge today. Success is never losing track of a conversation or missing a follow-up.

## Positioning

Built for one person's outreach method rather than a general CRM: five fixed stages, follow-up dates with overdue highlighting, and nothing else.

## Operating Context

Short, frequent sessions at a desk: open the app, check overdue follow-ups, update a status after a LinkedIn reply, add a new contact after sending a connection request. Unlocked once per device with a shared access key (no accounts).

## Capabilities and Constraints

- Contacts: name, role, company, optional email, LinkedIn URL, status, follow-up date, notes, created/updated timestamps.
- Create, edit, delete; filter by status; search by name or company; summary count per status; overdue follow-up highlighting.
- React + Vite, plain CSS with CSS variables, one .css file per component; no Tailwind, no TypeScript.
- Backend: FastAPI + Neon, `X-Access-Key` header. Deployed on Vercel.

## Brand Commitments

- Dark mode by default must stay (owner's decision, 2026-11-24). Everything else about the current look is replaceable.

## Evidence on Hand

Real data is the owner's own contacts; there are no testimonials, users or metrics, and none should be invented.

## Product Principles

1. Today's follow-ups first: what needs action now beats everything else on screen.
2. Fast to update: changing a status or adding a contact takes seconds.
3. A tool for one: no onboarding, marketing copy or team features.

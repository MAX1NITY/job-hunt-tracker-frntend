---
version: 1
slug: "src-pages-contactspage-jsx"
primary_target: "src/pages/ContactsPage.jsx"
related_targets: ["src/pages/AccessPage.jsx"]
---

## Scope

Contacts page (the whole app shell) plus the access-key screen. Mode: Operate. One user, desktop-first in use, must work on mobile.

## Direction contract

THESIS: The category standard, played straight at Attio's craft level: a calm dark record table with a stage sidebar and a detail panel. Refuses the old card grid with a separate summary bar and filter pills.

OWN-WORLD: Neutral graphite greys (four surface steps, two border steps), one blue accent for primary action and selection, five muted status hues used only as 8px dots and soft pills. Inter at 13–14px, tabular figures for counts and dates, hairline row dividers, 6–8px radii, no shadows except on overlays.

STORY: Open the app, see every contact in one table with today's and overdue follow-ups called out in the Follow-up column, filter by stage from the sidebar, click a row to read notes and act on it in the side panel, add a contact from the top bar.

FIRST VIEWPORT: Left 232px sidebar: app name, "All contacts" plus five stage views each with dot and count, Lock at the bottom. Main: 52px top bar with view title and count, search, "+ Add Contact" primary at right. Under it the table: Name (initials avatar, name, role), Company, Status, Follow-up, LinkedIn. Selecting a row opens a 380px detail panel at right with fields, notes, Edit and Delete. Below 900px the sidebar becomes a scrolling stage strip, rows stack, and the panel is a full-screen sheet.

FORM: canon (standing exit chosen by the user), benchmark Attio; seed: 08497a35ff6f3358

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints

Keep dark mode. Keep test-pinned labels: "+ Add Contact", "Lock", "Access key", "Unlock", "Add Contact", "Save Changes", "Saving...", "No contacts yet", "Contact added", .modal, status-badge classes.

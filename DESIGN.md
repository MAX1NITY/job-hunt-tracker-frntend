---
name: Job Hunt Tracker
description: A calm dark record table for one person's LinkedIn outreach pipeline.
colors:
  bg: "#0e0f11"
  surface: "#141518"
  surface-2: "#1b1c20"
  surface-3: "#232429"
  border: "#25272c"
  border-strong: "#33353c"
  text-primary: "#ececee"
  text-secondary: "#a3a6ad"
  text-muted: "#8a8e96"
  accent: "#5b7cfa"
  accent-hover: "#6d8bff"
  accent-soft: "rgba(91, 124, 250, 0.14)"
  danger: "#f0605d"
  warning: "#f2c94c"
  status-not-contacted: "#8b8f97"
  status-messaged: "#4ea7fc"
  status-replied: "#f2c94c"
  status-interview: "#4cb782"
  status-closed: "#eb5757"
typography:
  headline:
    fontFamily: "Inter, 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
    fontFeature: "'cv11', 'ss01'"
  title:
    fontFamily: "Inter, 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
    fontFeature: "'cv11', 'ss01'"
  body:
    fontFamily: "Inter, 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'cv11', 'ss01'"
  body-sm:
    fontFamily: "Inter, 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'cv11', 'ss01'"
  label:
    fontFamily: "Inter, 'Segoe UI Variable Text', 'Segoe UI', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
    fontFeature: "'cv11', 'ss01'"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-3}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.danger}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "34px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "32px"
    width: "280px"
  sidebar-item:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "30px"
  sidebar-item-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
  sidebar-item-active:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.text-primary}"
  table-row:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    padding: "0 12px"
    height: "44px"
  table-row-hover:
    backgroundColor: "{colors.surface}"
  table-row-selected:
    backgroundColor: "{colors.accent-soft}"
  table-header:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "34px"
  status-badge:
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "22px"
  detail-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    padding: "24px"
    width: "380px"
  modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
    width: "560px"
  toast:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
---

# Design System: Job Hunt Tracker

## Overview

**Creative North Star: "The Quiet Ledger"**

A dark record table played straight, at the craft level of Attio: one table of every contact, a stage sidebar on the left, a docked detail panel on the right. The surface is graphite, the type is small and even, and almost nothing competes for attention except the two things that need action: an overdue or due-today follow-up, and the one blue primary button. Density is CRM-normal, 44px rows at 13–14px Inter, so a full pipeline fits in one viewport without scrolling.

Depth comes from four tonal surface steps and hairline borders, not shadows. Colour is rationed: one blue accent carries primary action and selection, and five muted status hues appear only as small dots and soft-tinted pills. Dark mode is a binding brand commitment, not a theme option; the system is designed dark-first and ships no light palette.

The world refuses the card grid, separate summary bar and filter pills it replaced. Stage filtering lives in the sidebar with counts; status lives in the row.

**Key Characteristics:**
- Graphite neutrals in four surface steps and two border steps; no pure black, no pure white text.
- One blue accent for primary action, focus and selection only.
- Five status hues, used only as 6–8px dots and 14%-tinted pills.
- Inter at 12/13/14/15/20px, tabular figures for counts and dates.
- Hairline 1px dividers; 6–8px radii on controls, 12px on the modal.
- Shadows only on overlays (modal, toast).

## Colors

A cool graphite ramp with one saturated blue and a small, muted set of status hues.

### Primary
- **Signal Blue** (accent): the "+ Add Contact" and "Unlock" buttons, the focus ring, the input focus border, the brand mark, and (at 14% as **Selection Wash**, accent-soft) the selected table row and the 3px focus halo on inputs. **Lifted Blue** (accent-hover) is its hover state only.

### Secondary
- **Overdue Coral** (danger): overdue follow-up dates in the table and detail panel, the confirm-delete button text, the error toast dot, and the access-key error notice (at 10% fill, 35% border).
- **Today Amber** (warning): follow-ups due today. Shares its value with the Replied status hue.

### Status hues
- **Stone** (status-not-contacted), **Sky** (status-messaged), **Amber** (status-replied), **Sage** (status-interview), **Brick** (status-closed): the five pipeline stages in order. They appear as the 8px sidebar dot, the 6px dot inside the status pill, and the pill's tint (14% fill, 28% border via `color-mix`). Sage doubles as the success toast dot and Sky as the info toast dot.

### Neutral
- **Graphite Floor** (bg): the page, the sticky top bar and the sticky table header.
- **Graphite Raised** (surface): sidebar, detail panel, modal, search field, row hover.
- **Graphite Control** (surface-2): secondary buttons, form inputs, select fields, ghost-button hover, skeleton base.
- **Graphite Lift** (surface-3): active sidebar view, avatar circles, toast body, secondary-button hover.
- **Hairline** (border): row dividers, top bar and panel edges, section rules inside the detail panel.
- **Hairline Strong** (border-strong): control outlines (inputs, secondary buttons, modal, toast), scrollbar thumb.
- **Bone** (text-primary): names, values, headings.
- **Ash** (text-secondary): companies, sub-lines, form labels, ghost-button text.
- **Smoke** (text-muted): roles, counts, column headers, field labels, placeholders, icons, empty values. Also the hover border on inputs.

### Named Rules
**The One Blue Rule.** The accent marks exactly three things: the primary action, keyboard focus, and the current selection. Never use it for decoration, links in body copy, or status.

**The Dot-and-Pill Rule.** Status hues never fill a surface, colour text, or tint a row. They live in an 8px dot or a pill at 14% fill / 28% border with Bone text.

**The Follow-up Voice Rule.** Only follow-up urgency raises its voice: Overdue Coral and Today Amber at weight 500, with a calendar icon in the same colour. Every other date stays Ash.

## Typography

**Body Font:** Inter (with Segoe UI Variable Text, Segoe UI, system-ui), loaded at 400/500/600, with `cv11` and `ss01` enabled.

**Character:** One family, small sizes, weight doing the hierarchy. Headings tighten to -0.01em; everything else sits at default tracking.

### Hierarchy
- **Headline** (600, 20px, 1.3): the contact's name in the detail panel; the access screen title.
- **Title** (600, 15px): the top-bar view title, modal title, empty/error state heading.
- **Body** (400, 14px, 1.5): the base size; contact names in rows (at 500), form input text, the access-key input.
- **Body small** (400, 13px): companies, roles, buttons (at 500), sidebar items, search text, detail field labels and values, toasts. Notes and state bodies run at line-height 1.6, capped at 65ch.
- **Label** (500, 12px): table column headers, status pills, sidebar counts, follow-up cells.

### Named Rules
**The Tabular Count Rule.** Every count and date that can line up (sidebar counts, top-bar count, follow-up cells) uses `font-variant-numeric: tabular-nums`.

**The No Shouting Rule.** No uppercase, no tracking-wide labels, nothing above 20px inside the app. Hierarchy comes from weight (400/500/600) and the three text greys.

## Layout

Mobile-first, one breakpoint at 900px that changes the shell's structure; a second at 600px governs the modal.

- **Desktop (≥900px):** a flex row of a 232px sticky sidebar (full viewport height, 12px 8px padding), the flexible workspace, and, when a row is selected, a 380px sticky detail panel at full height. The top bar is sticky, 52px tall, padded 0 20px: view title and tabular count on the left, a 280px search field, then the primary button. The table header sticks at `top: 52px` beneath it. Columns: Name 44% (20px left inset), Company 24%, Status 140px, Follow-up 120px, LinkedIn 48px; cells padded 0 12px; 44px rows.
- **Below 900px:** the sidebar becomes a horizontal, scrolling strip of stage views on Graphite Raised with a right-edge fade mask and Lock pinned at its end. The top bar wraps, putting search on its own full-width row. Each table row becomes a 3-column grid (32px / 1fr / auto): name and status on line one, company and follow-up under them; the role and LinkedIn column are hidden. The detail panel becomes a full-screen fixed sheet.
- **Modal:** a bottom sheet below 600px (12px top corners, max 92vh); a centred 560px dialog with a two-column field grid at 600px and up.
- **Toasts:** a centred bottom stack inset 16px on mobile; bottom-right, inset 24px, on desktop.

Spacing runs on a 4px base, mostly 4 / 8 / 12 / 16 / 20 / 24. Empty, error and no-match states sit left-aligned in a 420px column, 64px from the top.

## Elevation & Depth

Flat by default. Depth is tonal: Graphite Floor for the page, Graphite Raised for docked panels, Graphite Control for interactive fields, Graphite Lift for the active or emphasised element, all separated by 1px hairlines. There is a single shadow token, used only by elements that float above the page.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.35)`): the add/edit modal and toasts. The modal scrim is `rgba(5, 6, 8, 0.66)`.
- **Focus halo** (`box-shadow: 0 0 0 3px` Selection Wash): text inputs and the access-key field on focus, alongside a Signal Blue border.

### Named Rules
**The Floating-Only Shadow Rule.** A shadow means "this is above the page and will go away". Docked panels, the sidebar, rows and buttons never cast one.

## Shapes

Gently rounded rectangles. Controls (buttons, inputs, search, select, sidebar items, notices) use 6px; toasts use 8px; small inline targets (copy-email, LinkedIn link, row link icon, skeleton bars) use 4px; the modal uses 12px. Status pills and the skeleton badge are full pills; avatars, status dots and toast dots are circles. The brand mark is a filled Signal Blue rounded square (6px at 22px in the sidebar, 9px at 36px on the access screen) holding a white "J". Borders are always 1px. Icons are hand-drawn 24-unit stroke icons at 1.75 stroke, round caps and joins, rendered at 15–16px in `currentColor`.

## Components

### Buttons
Compact and quiet; colour is reserved for the one primary.
- **Shape:** 32px tall, 0 12px padding, 6px radius, 13px/500, 6px gap for an icon, 1px border (transparent unless stated).
- **Primary:** Signal Blue fill, white text; hover to Lifted Blue. On the access screen it grows to 38px at 14px.
- **Secondary:** Graphite Control fill, Hairline Strong border, Bone text; hover to Graphite Lift. Used for Edit and Cancel.
- **Ghost:** transparent, Ash text; hover to Graphite Control fill with Bone text. Used for Lock, close and the trash icon.
- **Danger:** transparent with Hairline Strong border and Overdue Coral text; hover fills Coral at 12% with a 40% Coral border. It appears only as the second, confirming click on delete.
- **States:** colour transitions run 120ms. Primary, secondary and danger press to `scale(0.98)`; ghost does not. Disabled is 50% opacity with `not-allowed`. Keyboard focus is the global 2px Signal Blue outline at 2px offset.

### Status pills
- **Style:** 22px tall, 0 8px padding, full-pill radius, 12px/500 Bone text, preceded by a 6px dot in the stage hue; fill and border are the stage hue at 14% and 28%.
- **States:** none; pills are read-only. Status is changed from the select in the detail panel.

### Inputs / Fields
- **Form input:** 34px tall, 0 10px padding, Graphite Control fill, Hairline Strong border, 6px radius, 14px text, Smoke placeholder. Textareas start at 88px and resize vertically. Selects use a custom 12px Smoke chevron.
- **Hover:** border lightens to Smoke.
- **Focus:** Signal Blue border plus a 3px Selection Wash halo.
- **Labels:** 13px/500 Ash above the field with a 6px gap; "(required)"-style hints in Smoke at 400.
- **Search field:** 32px, Graphite Raised fill, leading search icon; on focus the border goes Signal Blue and the fill steps to Graphite Control, with no halo.
- **Error:** the access screen shows a 6px-radius notice in Coral at 10% fill and 35% border above the field.

### Navigation (stage sidebar)
- **Style:** brand row (mark plus "Job Hunt Tracker" at 14px/600), a 12px/500 Smoke group heading, then "All contacts" (users icon) and the five stages (8px dot), each with a right-aligned tabular count in Smoke. Lock sits at the bottom as a ghost button.
- **Items:** 30px tall, 0 8px padding, 6px radius, 13px Ash. Hover: Graphite Control fill, Bone text. Active (`aria-pressed`): Graphite Lift fill, Bone text.
- **Mobile:** the horizontal scrolling strip described in Layout, with brand and heading hidden.

### Contact table (signature)
- **Rows:** 44px, hairline bottom border, transparent at rest; hover Graphite Raised (100ms); selected row Selection Wash. The whole row is clickable; the name is a real button for keyboard access.
- **Name cell:** a 24px Graphite Lift circle with 10px/600 Ash initials, the name at 14px/500, then the role inline in 13px Smoke, ellipsised.
- **Follow-up cell:** 12px Ash date; "Today" in Today Amber and "Nd overdue" in Overdue Coral, both 500 with a matching calendar icon; an em dash in Smoke when unset.
- **LinkedIn cell:** a 28px icon target in Smoke that brightens on row hover and fills Graphite Lift on its own hover.
- **Loading:** skeleton rows of 44px with 4px-radius shimmer bars sweeping Graphite Control to Graphite Lift over 1.4s.

### Detail panel (signature)
- **Container:** Graphite Raised, 1px Hairline left edge, 380px wide and full height on desktop; a full-screen sheet below 900px.
- **Bar:** 52px with a ghost close on the left, secondary Edit and a ghost trash icon on the right; trash turns into the danger button on first click to confirm.
- **Body:** 24px padding. Headline name, Ash "role · company" sub-line, then a definition grid (96px Smoke labels, 32px-min Bone values) between two hairlines. Status is an inline select; email copies to clipboard on click; LinkedIn opens in a new tab. Notes sit under a 13px/500 Smoke heading at line-height 1.6, max 65ch.
- **Motion:** enters over 240ms on `cubic-bezier(0.16, 1, 0.3, 1)`, sliding 16px from the right on desktop and 12px up on mobile.

### Modal (add / edit contact)
- **Container:** Graphite Raised, Hairline Strong border, 12px radius, Overlay shadow, over a 66% scrim. 52px header with a 15px/600 title and a 32px ghost close; 20px form padding with 16px gaps; actions right-aligned above a hairline.
- **Motion:** scrim fades in over 160ms; the dialog rises 16px and scales from 0.98 over 220ms on the ease-out curve.

### Toast
- **Style:** Graphite Lift, Hairline Strong border, 8px radius, Overlay shadow, 10px 14px padding, 13px/500, max 360px, led by an 8px dot: Sage for success, Coral for error, Sky for info.
- **Motion:** rises 10px and scales from 0.97 over 260ms on the ease-out curve.

## Do's and Don'ts

### Do:
- **Do** build every new surface from the four graphite steps and two hairlines; raise emphasis by stepping one surface up, not by adding a shadow.
- **Do** keep controls at 32px tall (34px for form inputs, 30px for sidebar items) with 6px radii and 13px/500 labels.
- **Do** show stage only through the dot-and-pill treatment, and follow-up urgency only through Overdue Coral and Today Amber.
- **Do** use tabular figures for any count or date that sits in a column.
- **Do** honour `prefers-reduced-motion`; the global rule already collapses transitions and animations to 0.01ms.
- **Do** design dark-first; dark mode is the product, not a theme.

### Don't:
- **Don't** add a light theme or pure white (#ffffff) surfaces; white is only for text on Signal Blue.
- **Don't** use Signal Blue for anything except primary action, focus and selection.
- **Don't** put shadows on docked elements (sidebar, panel, rows, buttons); the Overlay shadow is for the modal and toasts only.
- **Don't** reintroduce the card grid, a separate summary bar, or filter pills; stages filter from the sidebar and counts live there.
- **Don't** fill rows, text or large areas with status hues.
- **Don't** use uppercase or wide tracking for labels or headers.

---
id: T-007
title: Dashboard is usable at 360px width
source: docs/specs/owner-sales-dashboard.md
covers: [R8]
status: todo
depends_on: [T-002, T-003, T-004, T-005, T-006]
size: S
---

## Context
The owner may check the page from a phone on the local network or a narrow window. All panels exist by now; make them fit.

## Scope
- `dashboard/static/index.html` (and CSS): viewport meta tag, single-column layout below ~600px, no horizontal scroll at 360px, readable font sizes.

## Acceptance criteria
- [ ] Viewport meta tag present.
- [ ] CSS has a narrow-screen rule that stacks panels in one column.
- [ ] No fixed widths larger than 360px; tables or lists wrap or scroll inside their panel.
- [ ] Headline pace and progress remain at the top at 360px.

## Test plan
- Pytest text checks on the HTML/CSS for the meta tag and media query. Manual check in browser devtools at 360px. Run `cd dashboard && python3 -m pytest`.

## Out of scope
- Dark theme, native app, serving beyond localhost.

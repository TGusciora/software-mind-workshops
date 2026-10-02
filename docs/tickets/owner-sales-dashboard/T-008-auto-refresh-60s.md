---
id: T-008
title: Auto-refresh dashboard data every 60 seconds
source: docs/specs/owner-sales-dashboard.md
covers: [R9]
status: todo
depends_on: [T-002, T-003, T-004, T-005, T-006]
size: S
---

## Context
Could-have: keep the page current without manual reload, so the timestamp (R7) stays meaningful.

## Scope
- `dashboard/static/index.html`: fetch the API endpoints every 60 s and re-render in place; update the "Data as of" timestamp each time.
- On a failed refresh, show the error state and keep retrying on the next tick.

## Acceptance criteria
- [ ] Data refreshes every 60 seconds without a full page reload.
- [ ] Timestamp updates on each successful refresh.
- [ ] A failed refresh shows the error state; a later success clears it.
- [ ] Only GET requests are made (read-only).

## Test plan
- Pytest text check that the page contains a 60000 ms interval and uses GET only. Manual: run with changing DB and watch the update. Run `cd dashboard && python3 -m pytest`.

## Out of scope
- Websockets, push updates, user-configurable interval.

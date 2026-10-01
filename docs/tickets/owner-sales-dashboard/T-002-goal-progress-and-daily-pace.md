---
id: T-002
title: Show progress toward $3M and required vs actual daily pace
source: docs/specs/owner-sales-dashboard.md
covers: [R2]
status: done
depends_on: [T-001]
size: S
---

## Context
The owner must see in under 10 seconds whether sales are on pace for $3M by 2027-09-11. This is the headline number of the page.

## Scope
- `dashboard/data.py`: add `pace(summary, today)` returning goal progress %, days remaining to `orders.SALES_GOAL_DATE`, required daily pace (remaining / days left), actual daily pace (revenue / days since first non-cancelled order, minimum 1 day), and an `ahead`/`behind` flag. Reuse `goal_progress_pct`, `remaining_to_goal` from `sales_summary()`; do not recompute them.
- Include it in `/api/summary`; render a progress bar, percentage and "required $X/day vs actual $Y/day, Ahead/Behind" at the top of the page.
- Handle zero orders (actual pace $0, behind) and past goal date (days left clamped, no division by zero).

## Acceptance criteria
- [x] Progress percentage equals `sales_summary()["goal_progress_pct"]`.
- [x] Required daily pace = remaining_to_goal / days left to 2027-09-11; actual daily pace shown beside it.
- [x] Clear "Ahead" or "Behind" label.
- [x] Empty DB and date-past-goal cases render without error.

## Test plan
- Unit tests for `pace()` with fixed `today`: normal, empty DB, goal met, after goal date. Run `cd dashboard && python3 -m pytest`.

## Out of scope
- Today's numbers (T-006), charts, forecasting.

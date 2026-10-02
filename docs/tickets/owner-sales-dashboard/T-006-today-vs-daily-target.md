---
id: T-006
title: Show today's revenue and order count against the $8,300/day target
source: docs/specs/owner-sales-dashboard.md
covers: [R6]
status: todo
depends_on: [T-001]
size: S
---

## Context
The owner needs a daily check against the pace in plans/30-day-plan.md (about $8,300/day).

## Scope
- `dashboard/data.py`: `today_sales(today)` summing non-cancelled orders whose `created_at` falls on today's date; target constant `DAILY_TARGET = 8300` defined once.
- Render today's revenue, order count, and percent of target on the page.

## Acceptance criteria
- [ ] Only non-cancelled orders created today count; cancelled excluded.
- [ ] Shows revenue, order count and % of $8,300.
- [ ] Zero orders today shows $0 and 0%.

## Test plan
- Seed orders on today and yesterday plus a cancelled one; assert with fixed `today`. Run `cd dashboard && python3 -m pytest`.

## Out of scope
- Configurable targets, per-day history.

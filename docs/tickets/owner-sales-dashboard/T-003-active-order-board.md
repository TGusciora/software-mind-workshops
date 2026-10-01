---
id: T-003
title: Show active orders grouped by status
source: docs/specs/owner-sales-dashboard.md
covers: [R3]
status: done
depends_on: [T-001]
size: S
---

## Context
The owner wants a live view of the kitchen pipeline. The MCP tool `order_board()` wraps `orders.board()`; the dashboard calls `orders.board()` directly so numbers match.

## Scope
- `dashboard/data.py`: `load_board()` returns `orders.board()` (same DB-readable guard as T-001).
- Add `/api/board` (or include in summary) and a section in `index.html` with a column or list per status: count, plus order id, pizzas, fulfillment, total.

## Acceptance criteria
- [x] Counts per status equal `orders.board()["counts"]` for the same DB.
- [x] Delivered and cancelled orders are not shown.
- [x] Empty status groups show a count of 0, not a missing section.
- [x] DB error shows the shared error state from T-001.

## Test plan
- Seed orders in several statuses, advance some with `orders.set_status`, compare API output with `orders.board()`. Run `cd dashboard && python3 -m pytest`.

## Out of scope
- Changing order status from the page (read-only).
- Customer phone or address display (not needed by the spec).

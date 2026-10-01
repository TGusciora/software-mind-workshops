---
id: T-001
title: Owner dashboard page shows sales totals, data timestamp and an error state
source: docs/specs/owner-sales-dashboard.md
covers: [R1, R7]
status: done
depends_on: []
size: M
---

## Context
First slice of the owner dashboard: a local, read-only, standalone page that shows revenue, order count and average order straight from `orders.sales_summary()`, so the numbers have one source of truth. Precondition: feat/sales-summary is merged (A4).

## Scope
- Create `dashboard/` at the repo root (beside `orders-mcp/`, not inside it).
- `dashboard/app.py`: stdlib `http.server` (no new dependencies), binds to 127.0.0.1 only, serves `/` (HTML) and `/api/summary` (JSON).
- `dashboard/data.py`: adds `orders-mcp/` to `sys.path`, imports `orders`, and exposes `load_summary()` returning `sales_summary()` plus `generated_at` (UTC ISO).
- Before calling any `orders` function, check that `orders.DB_PATH` exists and is readable. If not, return an error (never call `orders.connect()` on a missing file, because it would create the DB).
- `dashboard/static/index.html`: shows revenue, orders, average order, cancelled count; shows "Data as of <timestamp>"; shows a clear error banner when the API reports an error.
- `dashboard/README.md`: how to run (`ORDERS_DB=... python3 dashboard/app.py`).

## Acceptance criteria
- [x] Revenue, order count and average order equal `sales_summary()` output for the same DB; cancelled orders are excluded from them (R1).
- [x] Page displays the data timestamp (R7).
- [x] With a missing or unreadable DB, the API returns an error JSON and the page shows a readable error instead of a blank or stack trace; no DB file is created (R7).
- [x] The dashboard code contains no INSERT/UPDATE/DELETE and does not call any `orders` write function; a test confirms the DB file bytes are unchanged after a request (R7).
- [x] Server binds only to 127.0.0.1 and has no login (A5).

## Test plan
- `dashboard/test_dashboard.py` (pytest, same style as `orders-mcp/test_orders.py`): temp `ORDERS_DB` with seeded orders including a cancelled one; assert totals; assert error path on missing path; assert DB hash unchanged.
- Run: `cd dashboard && python3 -m pytest`. Manual: open `http://127.0.0.1:8080/`.

## Out of scope
- Pace vs goal, board, top pizzas, stock, today, mobile layout, auto-refresh.
- Any edit to `orders-mcp/` files.

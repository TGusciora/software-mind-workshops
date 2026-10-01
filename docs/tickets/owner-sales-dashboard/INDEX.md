# Tickets: Owner Sales Dashboard

Source: `docs/specs/owner-sales-dashboard.md` (approved 2026-10-01).

**Precondition: do not start execution until branch `feat/sales-summary` is merged** (spec A4). `sales_summary()` is still in flux in uncommitted `orders-mcp/` changes; tickets must build on the merged version. Do not touch those uncommitted changes or `brain.md` before then.

Execution order: revenue-critical path first (R1, R2, R3, R7 in T-001 to T-003), then R4 to R6, R8, R9. T-001 to T-003 plus T-005 to T-006 complete milestones M1 and M2 content; T-007 finishes M2; T-008 is M3.

| Order | ID | Title | Covers | Depends on | Size | Status |
|---|---|---|---|---|---|---|
| 1 | [T-001](T-001-dashboard-page-sales-totals-and-error-state.md) | Dashboard page shows sales totals, data timestamp and error state | R1, R7 | none | M | done |
| 2 | [T-002](T-002-goal-progress-and-daily-pace.md) | Progress toward $3M and required vs actual daily pace | R2 | T-001 | S | todo |
| 3 | [T-003](T-003-active-order-board.md) | Active orders grouped by status | R3 | T-001 | S | todo |
| 4 | [T-004](T-004-top-five-pizzas.md) | Top 5 pizzas by units and revenue | R4, R10 | T-001 | S | todo |
| 5 | [T-005](T-005-low-stock-panel.md) | OUT/LOW inventory items and affected pizzas | R5 | T-001 | M | todo |
| 6 | [T-006](T-006-today-vs-daily-target.md) | Today's revenue and orders vs $8,300/day | R6 | T-001 | S | todo |
| 7 | [T-007](T-007-mobile-360px-layout.md) | Usable at 360px width | R8 | T-002 to T-006 | S | todo |
| 8 | [T-008](T-008-auto-refresh-60s.md) | Auto-refresh every 60 seconds | R9 | T-002 to T-006 | S | todo |

## Planning notes
- Stack: Python stdlib `http.server` in a new `dashboard/` folder, importing `orders-mcp/orders.py` (user decision: Python, reusing `orders.py`). Tests use pytest like the MCP folders. No new dependencies.
- Local only, bound to 127.0.0.1, no login (A5). Strictly read-only.
- R10: no ticket edits `recipes/`; pizza names are shown as stored. Pineapple rule untouched.
- Out of scope per spec, so no tickets: order entry, stock editing, auth, multi-store, customer views, charts.

## Open questions
1. **A6, single location (unconfirmed).** Is there one location only? Tickets assume no per-store split.
2. **`orders.connect()` writes.** It creates the DB directory and runs schema creation, which conflicts with "never writes" (R7). Tickets guard on the file existing and use read-only connections for new queries. Confirm that calling `orders.sales_summary()` and `orders.board()` on an existing DB is acceptable, or whether a read-only `connect` should be added to `orders.py` after the merge.
3. **`low_stock_report()` lives in the MCP server file.** T-005 moves its logic into `inventory-mcp/inventory.py` so the dashboard avoids the `mcp` dependency. Confirm this small refactor of inventory-mcp is acceptable.
4. **Pace definition.** "Actual daily pace" is assumed to be revenue divided by days since the first non-cancelled order. Confirm, or give a start date.
5. **Timezone for "today" (R6).** Assumed UTC, matching `orders.now()`. Confirm if the owner wants Texas local time.
6. **Sample data.** Orders and stock are sample data, so the dashboard will look flat until real orders flow.

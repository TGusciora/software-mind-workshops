# Owner Sales Dashboard

Status: APPROVED by the user on 2026-10-01. Open assumptions: A6 (single location); stack defaults to Python reusing `orders.py`. Execution waits for feat/sales-summary to merge.

## Summary
A single read-only web page for the owner that shows progress toward the $3M-by-2027-09-11 goal, today's orders, and low-stock risks. It reads data that already exists (orders MCP SQLite DB and inventory `stock.json`). It does not take orders or change data.

## Goals & vision
- Goal: let the owner see in under 10 seconds whether sales are on pace for $3M by 2027-09-11 (about $250K/month, about $8,300/day per plans/30-day-plan.md).
- Success metric: owner opens it daily; pace and "behind/ahead" are visible without running any MCP tool.
- Later (not v1): per-store views, charts over time, customer-facing view.

Revenue rationale: recommended over a customer-facing or inventory-first dashboard because pace-vs-goal and best-seller visibility directly drive pricing, menu and marketing decisions that move revenue.

## Users
- Primary: the owner (single user). Needs revenue vs goal, order volume, best sellers, stock risks.
- Not in v1: store managers, customers.

## Scope
### In scope (v1)
Read-only dashboard with the metrics in R1-R7.
### Out of scope
Order entry or status changes, editing stock, authentication beyond local access, multi-store split, customer-facing views, new paid dependencies.

## Requirements
- R1 (must): Show total revenue, order count and average order, cancelled orders excluded, matching `sales_summary()` output.
- R2 (must): Show progress toward $3M as a percentage and as "required daily pace vs actual daily pace" to 2027-09-11.
- R3 (must): Show active orders grouped by status, matching `order_board()`.
- R4 (must): Show top 5 pizzas by units and by revenue.
- R5 (must): Show OUT/LOW inventory items and the pizzas they affect, matching `low_stock_report()`.
- R6 (must): Show today's revenue and order count against the $8,300/day target.
- R7 (must): Page shows its data timestamp and a clear error state if the DB is unreadable. It never writes to the DB.
- R8 (should): Usable at 360px width.
- R9 (could): Auto-refresh every 60 seconds.
- R10 (must): If any menu or pizza names are displayed, they come from `recipes/` unchanged; no recipe is edited (pineapple rule untouched).

## Technology (proposed, assumption)
- Reuse the pattern already in `pizza-creator/` (Node/Express + Vite client, SQLite), or a small Python page beside `orders-mcp/` that imports `orders.py` functions directly. Reason: no new dependencies and no duplicated revenue logic. Recommendation: Python, reusing `orders.py` and inventory code, to keep one source of truth for numbers.
- Alternative: add a dashboard tab to the pizza-creator portal.

## Constraints & assumptions
- A1 (confirmed): "Pizza portal" is a new standalone page, not a pizza-creator feature. The repo has no portal as such; `pizza-creator/` is a builder with no orders or checkout.
- A2 (confirmed): Audience is the owner only.
- A3: Data sources are the orders SQLite DB (`orders.db`, path via `ORDERS_DB`) and `inventory-mcp/stock.json`. Inventory numbers are sample data today.
- A4 (confirmed: build after the merge): Orders MCP has uncommitted changes on branch feat/sales-summary (`sales_summary` is in flux). The dashboard must build on that work once merged, not duplicate it.
- A5 (confirmed): Local use only, no login.
- A6 (unconfirmed assumption): Single location; no per-store split.

## Risks & open questions
- Sales data is likely empty or sample; the dashboard will look flat until real orders flow.
- Dependency on the in-progress sales-summary branch.

Resolved by the user (2026-10-01):
1. Audience: owner only.
2. Portal: a new standalone page.
3. Metrics: revenue vs $3M pace, orders and average order, top pizzas, live order board and low stock (all promoted to must).
4. Hosting: local. 5. Auth: none. 6. Sequencing: start after feat/sales-summary merges.

Still open: single location (A6) and Python vs Node stack (recommendation: Python reusing `orders.py`).

## Milestones
- M1: R1-R3, R7 against real orders DB.
- M2: R4-R6, R8.
- M3: R9 and polish. Dates to be set after open questions are answered.

---
id: T-005
title: Show OUT/LOW inventory items and the pizzas they affect
source: docs/specs/owner-sales-dashboard.md
covers: [R5]
status: todo
depends_on: [T-001]
size: M
---

## Context
`low_stock_report()` currently lives inside the MCP tool in `inventory-mcp/server.py`, which imports the `mcp` package. To keep one source of truth without requiring the MCP runtime, move the logic into `inventory-mcp/inventory.py` and have both the tool and the dashboard call it.

## Scope
- `inventory-mcp/inventory.py`: add `low_stock_report()` (body moved from the tool, plus any helper it needs from `server.py`, e.g. `_item_view`). `inventory-mcp/server.py`: tool becomes a thin wrapper with identical output. Do not touch `orders-mcp/` or `brain.md`.
- `dashboard/data.py`: `load_low_stock()` calls it, reading `inventory-mcp/stock.json`.
- Page section listing OUT items first, then LOW, with `used_in` pizzas and counts of OUT and LOW.

## Acceptance criteria
- [ ] Dashboard output equals the MCP tool's `low_stock_report()` for the same `stock.json` (same items, order, counts, `used_in`).
- [ ] Existing `inventory-mcp/test_inventory.py` still passes unchanged.
- [ ] Unreadable or missing `stock.json` shows an error for this section only; the rest of the page still renders.
- [ ] Dashboard never writes `stock.json`.

## Test plan
- Add tests in `inventory-mcp/test_inventory.py` for the moved function; add dashboard test comparing to it. Run `cd inventory-mcp && python3 -m pytest` and `cd dashboard && python3 -m pytest`.

## Out of scope
- Updating stock, reorder actions, replacing the sample stock data (A3).

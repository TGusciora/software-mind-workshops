---
id: T-004
title: Show top 5 pizzas by units and by revenue
source: docs/specs/owner-sales-dashboard.md
covers: [R4, R10]
status: todo
depends_on: [T-001]
size: S
---

## Context
Best-seller visibility drives pricing, menu and marketing decisions. No existing `orders.py` function returns this, so the dashboard adds a read-only query.

## Scope
- `dashboard/data.py`: `top_pizzas(limit=5)` aggregating `order_items` joined to `orders` where status != cancelled, returning two ranked lists (units, revenue = quantity * unit_price). Open the DB read-only (`file:...?mode=ro` URI), never via a write path.
- Render two lists on the page. Pizza names come from `order_items.pizza` (recipe file stems from `recipes/`), shown unchanged.

## Acceptance criteria
- [ ] Two lists of at most 5 pizzas, ranked by units and by revenue; ties broken by name for stable output.
- [ ] Cancelled orders excluded, consistent with R1.
- [ ] Fewer than 5 pizzas or no orders renders without error.
- [ ] No file under `recipes/` is modified or read for edits; a test asserts the dashboard module opens recipes for nothing, and names are displayed verbatim (R10).

## Test plan
- Seeded DB with known quantities and a cancelled order; assert both rankings and tie-breaking. Run `cd dashboard && python3 -m pytest`.

## Out of scope
- Charts, time ranges, per-store split.

# Pizza Inventory MCP

MCP server (stdio) for checking ingredient stock against the recipes in `recipes/`.
It's registered in `.mcp.json` as `pizza-inventory` and runs with `uv run --script inventory-mcp/server.py`.

## Tools
| Tool | What it does |
|---|---|
| `check_ingredient(name)` | Amount on hand, unit and status (OK / LOW / OUT) |
| `list_inventory(status?)` | All items, optionally filtered by status |
| `what_can_we_make()` | Each pizza: how many we can make and the limiting ingredient, or what's missing |
| `can_make(pizza, quantity)` | Whether an order can be filled, with shortfalls |
| `low_stock_report()` | OUT/LOW items with reorder quantity and the pizzas they affect |
| `update_stock(name, amount, mode)` | `add` (negative to use up stock) or `set` after a count |

## Data
- `stock.json`: `on_hand`, `unit`, `reorder_point`, `aliases` per item. An item is **LOW** when `on_hand <= reorder_point` and **OUT** at 0.
- Recipe ingredients are matched by name, with prep notes stripped (`"Pineapple chunks, drained"` becomes `pineapple chunks`), then via aliases.
- "to taste" and "pinch" items only need to be in stock; their amounts aren't tracked.
- The seeded numbers are **sample data**. Replace them with a real count.

## Test
```bash
cd inventory-mcp && uv run --with pytest --with "mcp<2" pytest -q
```
`test_every_recipe_ingredient_is_tracked` fails when a recipe uses an ingredient that isn't in `stock.json`.

# Pizza Orders MCP

MCP server (stdio, SQLite) for placing, tracking and cancelling pizza orders.
It's registered in `.mcp.json` as `pizza-orders` and runs with `uv run --script orders-mcp/server.py`.

## Status flow
`received → preparing → in_oven → ready → out_for_delivery → delivered`

- Pickup orders skip `out_for_delivery`.
- Orders move one step at a time; skipping a step or going back is refused.
- `cancelled` is a terminal status. It's allowed **only while `received` or `preparing`**, gives a full refund and needs a reason.

## Tools
| Tool | What it does |
|---|---|
| `get_menu()` | Pizzas and prices, read from the recipe files in `recipes/` |
| `place_order(customer_name, phone, items, fulfillment, address?, notes?)` | Creates an order in `received` status |
| `track_order(order_id)` | Status, progress, ETA, next step, whether it can be cancelled, and a timestamped timeline |
| `list_orders(status?, active_only?, limit?)` | Order summaries, newest first |
| `advance_order(order_id, status?, note?)` | Moves the order to its next status |
| `check_cancellation(order_id)` | Whether the order can be cancelled, why, and the refund (changes nothing) |
| `cancel_order(order_id, reason)` | Cancels the order, subject to the rule above |
| `order_board()` | Active orders grouped by status (kitchen/dispatch view) |
| `sales_summary()` | Revenue, order count and average order (cancelled orders excluded) and progress toward the $3M goal |

## Resources
`orders://statuses`, `menu://pizzas`, `orders://active`, `orders://{order_id}`

## Prompts
`take_order`, `customer_status_update`, `handle_cancellation`, `shift_report`

## Data
- `orders.db` holds three tables: `orders`, `order_items` and `status_events`. It's gitignored, and you can change its path with `ORDERS_DB`.
- The ETA is the sum of `STAGE_MINUTES` for the stages still ahead, counted from when the current status started.

## Test
```bash
cd orders-mcp && uv run --with pytest --with "mcp<2" pytest -q
```

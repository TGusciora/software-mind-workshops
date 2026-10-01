# /// script
# requires-python = ">=3.11"
# dependencies = ["mcp>=1.2,<2"]
# ///
"""Pizza order tracking MCP server (stdio, SQLite).

Run: uv run --script orders-mcp/server.py
"""

import json

from mcp.server.fastmcp import FastMCP

import orders as od

mcp = FastMCP("pizza-orders")


def _safe(fn, *args, **kwargs) -> dict:
    try:
        return fn(*args, **kwargs)
    except od.OrderError as e:
        return {"error": str(e)}


# ---------- tools ----------

@mcp.tool()
def get_menu() -> dict:
    """Pizzas that can be ordered, with menu prices (read from recipes/)."""
    return {"pizzas": od.load_menu()}


@mcp.tool()
def place_order(customer_name: str, phone: str, items: list[dict], fulfillment: str = "delivery",
                address: str | None = None, notes: str | None = None) -> dict:
    """Place an order. items: [{"pizza": "pepperoni", "quantity": 2}, ...].
    fulfillment: 'delivery' (needs address) or 'pickup'. New orders start as 'received'."""
    return _safe(od.place_order, customer_name, phone, items, fulfillment, address, notes)


@mcp.tool()
def track_order(order_id: int) -> dict:
    """Live status of an order: current status, progress, ETA, next step, whether it can
    still be cancelled, and the timestamped timeline of every status change."""
    return _safe(od.get_order, order_id)


@mcp.tool()
def list_orders(status: str | None = None, active_only: bool = False, limit: int = 50) -> list[dict] | dict:
    """List orders, newest first. Filter by status (received, preparing, in_oven, ready,
    out_for_delivery, delivered, cancelled) or active_only=True for everything not finished."""
    if status and status not in od.STATUSES + [od.CANCELLED]:
        return {"error": f"Unknown status '{status}'."}
    return od.list_orders(status, active_only, limit)


@mcp.tool()
def advance_order(order_id: int, status: str | None = None, note: str | None = None) -> dict:
    """Move an order to its next status (received -> preparing -> in_oven -> ready ->
    out_for_delivery -> delivered; pickup skips out_for_delivery). Pass `status` to assert
    the expected step; skipping or going back is refused."""
    return _safe(od.set_status, order_id, status, note)


@mcp.tool()
def check_cancellation(order_id: int) -> dict:
    """Say whether an order can be cancelled right now, why, and the refund. Doesn't change anything."""
    return _safe(od.cancellation_check, order_id)


@mcp.tool()
def cancel_order(order_id: int, reason: str) -> dict:
    """Cancel an order. Only allowed while it is 'received' or 'preparing' (full refund);
    once it's in the oven the cancellation is refused. A reason is required."""
    return _safe(od.cancel_order, order_id, reason)


@mcp.tool()
def order_board() -> dict:
    """Kitchen/dispatch board: active orders grouped by status, oldest first, with counts."""
    return od.board()


@mcp.tool()
def sales_summary() -> dict:
    """Revenue, order count and average order (cancelled orders excluded) and progress toward the $3M goal."""
    return od.sales_summary()


# ---------- resources ----------

@mcp.resource("orders://statuses", mime_type="application/json")
def statuses() -> str:
    """Status flow, typical minutes per stage, and which statuses allow cancellation."""
    return json.dumps({"flow": od.STATUSES, "terminal": ["delivered", od.CANCELLED],
                       "pickup_skips": ["out_for_delivery"], "stage_minutes": od.STAGE_MINUTES,
                       "cancellable": sorted(od.CANCELLABLE)}, indent=2)


@mcp.resource("menu://pizzas", mime_type="application/json")
def menu() -> str:
    """Current menu with prices."""
    return json.dumps(od.load_menu(), indent=2)


@mcp.resource("orders://active", mime_type="application/json")
def active_orders() -> str:
    """All unfinished orders, grouped by status."""
    return json.dumps(od.board(), indent=2)


@mcp.resource("orders://{order_id}", mime_type="application/json")
def order(order_id: str) -> str:
    """One order with its full timeline and ETA."""
    return json.dumps(_safe(od.get_order, int(order_id)), indent=2)


# ---------- prompts ----------

@mcp.prompt()
def take_order(customer_request: str) -> str:
    """Turn a customer's request into an order."""
    return (f"A customer says: \"{customer_request}\"\n\n"
            "1. Call get_menu and match what they asked for to menu pizzas; ask if anything is ambiguous.\n"
            "2. Collect name, phone, and delivery address (or confirm pickup).\n"
            "3. Read back the items and total, then call place_order.\n"
            "4. Give the customer their order number and ETA from the result.")


@mcp.prompt()
def customer_status_update(order_id: int) -> str:
    """Write a short, friendly status message for a customer."""
    return (f"Call track_order for order {order_id}. Write a 2–3 sentence message to the customer: "
            "where the order is now, the ETA in local time, and, if can_cancel is true, that they can "
            "still cancel. No internal notes.")


@mcp.prompt()
def handle_cancellation(order_id: int, reason: str) -> str:
    """Handle a customer's cancellation request by the rules."""
    return (f"The customer wants to cancel order {order_id} because: \"{reason}\".\n"
            "Call check_cancellation first. If allowed, confirm the refund with the customer, then call "
            "cancel_order with the reason. If not allowed, explain why (it's already in the oven or later) "
            "and offer an alternative such as a discount on the next order. Never cancel without the check.")


@mcp.prompt()
def shift_report() -> str:
    """Summarize the shift's orders."""
    return ("Call order_board and list_orders(limit=500). Report: orders per status, revenue from "
            "delivered orders, cancellations and their reasons, orders past their ETA, and the most "
            "ordered pizzas. Keep it short, with a table.")


if __name__ == "__main__":
    mcp.run()

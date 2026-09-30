# /// script
# requires-python = ">=3.11"
# dependencies = ["mcp>=1.2,<2"]
# ///
"""Pizza inventory MCP server (stdio).

Run: uv run inventory-mcp/server.py
"""

from mcp.server.fastmcp import FastMCP

import inventory as inv

mcp = FastMCP("pizza-inventory")


def _item_view(key: str, item: dict) -> dict:
    return {
        "item": key,
        "on_hand": item["on_hand"],
        "unit": item["unit"],
        "reorder_point": item["reorder_point"],
        "status": inv.item_status(item),
    }


def _find_recipe(recipes: dict, pizza: str) -> str | None:
    q = pizza.lower().replace(" ", "-")
    if q in recipes:
        return q
    hits = [name for name in recipes if q in name]
    return hits[0] if len(hits) == 1 else None


@mcp.tool()
def check_ingredient(name: str) -> dict:
    """Check whether an ingredient is in stock: amount on hand, unit and status (OK / LOW / OUT)."""
    stock = inv.load_stock()
    key = inv.resolve(stock, name)
    if key is None:
        return {"error": f"No stock item matches '{name}'. Use list_inventory to see tracked items."}
    return _item_view(key, stock["items"][key])


@mcp.tool()
def list_inventory(status: str | None = None) -> list[dict]:
    """List all stock items. Optionally filter by status: OK, LOW or OUT."""
    stock = inv.load_stock()
    rows = [_item_view(k, v) for k, v in sorted(stock["items"].items())]
    if status:
        rows = [r for r in rows if r["status"] == status.upper()]
    return rows


@mcp.tool()
def what_can_we_make() -> dict:
    """List every pizza on the menu with how many we can make from current stock,
    the limiting ingredient, and what is missing for pizzas we cannot make."""
    stock = inv.load_stock()
    available, unavailable = [], []
    for name, reqs in inv.load_recipes(stock).items():
        count, missing, limiting = inv.max_pizzas(stock, reqs)
        if count > 0:
            available.append({"pizza": name, "can_make": count, "limited_by": limiting})
        else:
            unavailable.append({"pizza": name, "missing": missing})
    available.sort(key=lambda p: p["can_make"])
    return {"available": available, "unavailable": unavailable}


@mcp.tool()
def can_make(pizza: str, quantity: int = 1) -> dict:
    """Check if we can make `quantity` of a pizza (e.g. 'pepperoni', 'brisket-bbq-pizza').
    Lists any ingredient shortfalls."""
    stock = inv.load_stock()
    recipes = inv.load_recipes(stock)
    name = _find_recipe(recipes, pizza)
    if name is None:
        return {"error": f"No single recipe matches '{pizza}'.", "menu": sorted(recipes)}
    count, missing, limiting = inv.max_pizzas(stock, recipes[name])
    shortfalls = []
    for r in recipes[name]:
        item = stock["items"].get(r.item)
        if item and r.amount and item["unit"] == r.unit and item["on_hand"] < r.amount * quantity:
            shortfalls.append({"item": r.item, "need": r.amount * quantity,
                               "on_hand": item["on_hand"], "unit": r.unit})
    return {"pizza": name, "requested": quantity, "can_make": count >= quantity,
            "max_possible": count, "limited_by": limiting,
            "missing": missing, "shortfalls": shortfalls}


@mcp.tool()
def low_stock_report() -> dict:
    """Flag items that are OUT or at/below their reorder point (LOW), with the pizzas each one affects."""
    stock = inv.load_stock()
    recipes = inv.load_recipes(stock)
    flagged = []
    for key, item in sorted(stock["items"].items()):
        status = inv.item_status(item)
        if status == "OK":
            continue
        row = _item_view(key, item)
        row["reorder_qty_to_par"] = max(round(item["reorder_point"] * 2 - item["on_hand"], 2), 0)
        row["used_in"] = [n for n, reqs in recipes.items() if any(r.item == key for r in reqs)]
        flagged.append(row)
    flagged.sort(key=lambda r: (r["status"] != "OUT", -len(r["used_in"])))
    return {"out": sum(r["status"] == "OUT" for r in flagged),
            "low": sum(r["status"] == "LOW" for r in flagged),
            "items": flagged}


@mcp.tool()
def update_stock(name: str, amount: float, mode: str = "add") -> dict:
    """Change stock for an item. mode='add' adds amount (use a negative number to use up stock),
    mode='set' sets the on-hand amount after a count."""
    stock = inv.load_stock()
    key = inv.resolve(stock, name)
    if key is None:
        return {"error": f"No stock item matches '{name}'."}
    item = stock["items"][key]
    if mode == "set":
        item["on_hand"] = amount
    elif mode == "add":
        item["on_hand"] = round(item["on_hand"] + amount, 2)
    else:
        return {"error": "mode must be 'add' or 'set'"}
    if item["on_hand"] < 0:
        return {"error": f"Would take {key} below zero."}
    inv.save_stock(stock)
    return _item_view(key, item)


if __name__ == "__main__":
    mcp.run()

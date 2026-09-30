"""Order logic: SQLite storage, status flow, tracking and cancellation rules.

The menu is read straight from recipes/*.md (title + menu price), so prices
never drift from the recipes. Every status change is written to
status_events, which is what tracking and the timeline are built from.
"""

import os
import re
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RECIPES_DIR = ROOT.parent / "recipes"
DB_PATH = Path(os.environ.get("ORDERS_DB", ROOT / "orders.db"))

STATUSES = ["received", "preparing", "in_oven", "ready", "out_for_delivery", "delivered"]
CANCELLED = "cancelled"

# Minutes each status usually lasts; used for the ETA.
STAGE_MINUTES = {"received": 3, "preparing": 7, "in_oven": 8, "ready": 5, "out_for_delivery": 20}

# Cancellation is allowed only before the pizza goes in the oven.
CANCELLABLE = {"received", "preparing"}

SCHEMA = """
CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone         TEXT NOT NULL,
    address       TEXT,
    fulfillment   TEXT NOT NULL CHECK (fulfillment IN ('delivery', 'pickup')),
    notes         TEXT,
    status        TEXT NOT NULL,
    total         REAL NOT NULL,
    created_at    TEXT NOT NULL,
    updated_at    TEXT NOT NULL,
    cancel_reason TEXT
);
CREATE TABLE IF NOT EXISTS order_items (
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    pizza      TEXT NOT NULL,
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    unit_price REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS status_events (
    order_id INTEGER NOT NULL REFERENCES orders(id),
    status   TEXT NOT NULL,
    at       TEXT NOT NULL,
    note     TEXT
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
"""


class OrderError(ValueError):
    pass


def now() -> datetime:
    return datetime.now(timezone.utc)


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(SCHEMA)
    return conn


# ---------- menu ----------

def load_menu() -> dict[str, float]:
    """{'pepperoni-pizza': 18.0, ...} from the menu price line in each recipe."""
    menu = {}
    for path in sorted(RECIPES_DIR.glob("*.md")):
        m = re.search(r"Menu price:\*\*\s*\$([0-9]+(?:\.[0-9]+)?)", path.read_text())
        if m:
            menu[path.stem] = float(m.group(1))
    return menu


def find_pizza(menu: dict, pizza: str) -> str:
    q = pizza.strip().lower().replace(" ", "-")
    for exact in (q, f"{q}-pizza"):
        if exact in menu:
            return exact
    hits = [name for name in menu if q in name]
    if len(hits) == 1:
        return hits[0]
    raise OrderError(f"No single pizza matches '{pizza}'." + (f" Candidates: {hits}" if hits else ""))


# ---------- status flow ----------

def flow(fulfillment: str) -> list[str]:
    """Pickup orders skip out_for_delivery (ready -> delivered means handed over)."""
    return [s for s in STATUSES if fulfillment == "delivery" or s != "out_for_delivery"]


def next_status(order: sqlite3.Row) -> str | None:
    steps = flow(order["fulfillment"])
    if order["status"] not in steps:
        return None
    i = steps.index(order["status"])
    return steps[i + 1] if i + 1 < len(steps) else None


def _event(conn, order_id: int, status: str, note: str | None = None) -> str:
    at = now().isoformat(timespec="seconds")
    conn.execute("INSERT INTO status_events VALUES (?, ?, ?, ?)", (order_id, status, at, note))
    return at


def _get(conn, order_id: int) -> sqlite3.Row:
    row = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
    if row is None:
        raise OrderError(f"Order {order_id} not found.")
    return row


# ---------- operations ----------

def place_order(customer_name: str, phone: str, items: list[dict], fulfillment: str = "delivery",
                address: str | None = None, notes: str | None = None) -> dict:
    if fulfillment not in ("delivery", "pickup"):
        raise OrderError("fulfillment must be 'delivery' or 'pickup'.")
    if fulfillment == "delivery" and not (address or "").strip():
        raise OrderError("Delivery orders need an address.")
    if not items:
        raise OrderError("An order needs at least one pizza.")
    menu = load_menu()
    lines = []
    for it in items:
        qty = int(it.get("quantity", 1))
        if qty < 1:
            raise OrderError("Quantity must be at least 1.")
        name = find_pizza(menu, str(it.get("pizza", "")))
        lines.append((name, qty, menu[name]))
    total = round(sum(q * p for _, q, p in lines), 2)
    with connect() as conn:
        ts = now().isoformat(timespec="seconds")
        cur = conn.execute(
            "INSERT INTO orders (customer_name, phone, address, fulfillment, notes, status, total,"
            " created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'received', ?, ?, ?)",
            (customer_name, phone, address, fulfillment, notes, total, ts, ts))
        oid = cur.lastrowid
        conn.executemany("INSERT INTO order_items VALUES (?, ?, ?, ?)",
                         [(oid, n, q, p) for n, q, p in lines])
        _event(conn, oid, "received")
    return get_order(oid)


def eta(order: sqlite3.Row, events: list[sqlite3.Row]) -> str | None:
    """Estimated finish: time spent in the current stage counts toward its budget."""
    if order["status"] in ("delivered", CANCELLED):
        return None
    steps = flow(order["fulfillment"])
    remaining = steps[steps.index(order["status"]):-1]
    started = datetime.fromisoformat(events[-1]["at"])
    minutes = sum(STAGE_MINUTES[s] for s in remaining)
    return max(started + timedelta(minutes=minutes), now()).isoformat(timespec="seconds")


def get_order(order_id: int) -> dict:
    with connect() as conn:
        o = _get(conn, order_id)
        items = conn.execute("SELECT pizza, quantity, unit_price FROM order_items WHERE order_id = ?",
                             (order_id,)).fetchall()
        events = conn.execute("SELECT status, at, note FROM status_events WHERE order_id = ? ORDER BY rowid",
                              (order_id,)).fetchall()
    steps = flow(o["fulfillment"])
    return {
        "order_id": o["id"],
        "customer_name": o["customer_name"],
        "phone": o["phone"],
        "address": o["address"],
        "fulfillment": o["fulfillment"],
        "notes": o["notes"],
        "status": o["status"],
        "progress": (f"{steps.index(o['status']) + 1}/{len(steps)}" if o["status"] in steps else None),
        "next_status": next_status(o),
        "can_cancel": o["status"] in CANCELLABLE,
        "eta": eta(o, events),
        "total": o["total"],
        "items": [dict(i) for i in items],
        "timeline": [dict(e) for e in events],
        "cancel_reason": o["cancel_reason"],
        "created_at": o["created_at"],
        "updated_at": o["updated_at"],
    }


def set_status(order_id: int, status: str | None = None, note: str | None = None) -> dict:
    """Move an order forward. With no status, go to the next step. Only one step
    forward at a time; no going back, and nothing moves after delivered/cancelled."""
    with connect() as conn:
        o = _get(conn, order_id)
        nxt = next_status(o)
        if nxt is None:
            raise OrderError(f"Order {order_id} is {o['status']} and can't move further.")
        target = status or nxt
        if target != nxt:
            raise OrderError(f"Order {order_id} is {o['status']}; the only allowed next status is {nxt}.")
        ts = _event(conn, order_id, target, note)
        conn.execute("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?", (target, ts, order_id))
    return get_order(order_id)


def cancellation_check(order_id: int) -> dict:
    with connect() as conn:
        o = _get(conn, order_id)
    ok = o["status"] in CANCELLABLE
    reason = ("Not in the oven yet; full refund." if ok else
              "Already cancelled." if o["status"] == CANCELLED else
              f"Order is {o['status']}; cancellation is only allowed while received or preparing.")
    return {"order_id": order_id, "status": o["status"], "can_cancel": ok,
            "refund": o["total"] if ok else 0.0, "reason": reason}


def cancel_order(order_id: int, reason: str) -> dict:
    if not reason.strip():
        raise OrderError("A cancellation reason is required.")
    check = cancellation_check(order_id)
    if not check["can_cancel"]:
        raise OrderError(check["reason"])
    with connect() as conn:
        # Guard against a status change between the check and the update.
        ts = now().isoformat(timespec="seconds")
        cur = conn.execute(
            "UPDATE orders SET status = ?, cancel_reason = ?, updated_at = ? WHERE id = ? AND status IN (%s)"
            % ",".join("?" * len(CANCELLABLE)),
            (CANCELLED, reason, ts, order_id, *CANCELLABLE))
        if cur.rowcount == 0:
            raise OrderError("Order moved on before it could be cancelled.")
        _event(conn, order_id, CANCELLED, reason)
    return {**get_order(order_id), "refund": check["refund"]}


def list_orders(status: str | None = None, active_only: bool = False, limit: int = 50) -> list[dict]:
    sql, args = "SELECT id FROM orders", []
    if status:
        sql += " WHERE status = ?"
        args.append(status)
    elif active_only:
        sql += " WHERE status NOT IN ('delivered', 'cancelled')"
    sql += " ORDER BY id DESC LIMIT ?"
    args.append(limit)
    with connect() as conn:
        ids = [r["id"] for r in conn.execute(sql, args)]
    return [_summary(get_order(i)) for i in ids]


def _summary(o: dict) -> dict:
    return {k: o[k] for k in ("order_id", "customer_name", "fulfillment", "status",
                              "progress", "eta", "total", "updated_at")} | {
        "pizzas": ", ".join(f"{i['quantity']}x {i['pizza']}" for i in o["items"])}


def board() -> dict:
    """Active orders grouped by status, oldest first: the kitchen/dispatch view."""
    groups = {s: [] for s in STATUSES[:-1]}
    for o in reversed(list_orders(active_only=True, limit=500)):
        groups[o["status"]].append(o)
    return {"counts": {s: len(v) for s, v in groups.items()}, "orders": groups}

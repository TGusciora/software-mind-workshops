"""Dashboard data: read-only wrapper around orders.sales_summary()."""

import os
import sqlite3
import sys
from datetime import date, datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "orders-mcp"))
import orders  # noqa: E402


def first_order_date(path: Path) -> date | None:
    """UTC date of the first non-cancelled order, read over a read-only connection."""
    conn = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
    try:
        first = conn.execute("SELECT MIN(created_at) FROM orders WHERE status != ?",
                             (orders.CANCELLED,)).fetchone()[0]
    finally:
        conn.close()
    return datetime.fromisoformat(first).date() if first else None


def pace(summary: dict, today: date, first_order: date | None = None) -> dict:
    """Goal progress and required vs actual daily pace. Progress and remaining come from sales_summary()."""
    remaining = summary["remaining_to_goal"]
    days_left = max((date.fromisoformat(summary["goal_date"]) - today).days, 0)
    # On or after the goal date everything still missing is due now: divide by 1, never by 0.
    required = round(remaining / max(days_left, 1), 2)
    days_selling = max((today - first_order).days, 1) if first_order else 1
    actual = round(summary["revenue"] / days_selling, 2)
    ahead = remaining == 0 or (days_left > 0 and actual >= required)
    return {
        "goal_progress_pct": summary["goal_progress_pct"],
        "days_left": days_left,
        "required_daily_pace": required,
        "actual_daily_pace": actual,
        "ahead": ahead,
        "label": "Ahead" if ahead else "Behind",
    }


def load_summary() -> dict:
    """sales_summary() plus pace and generated_at (UTC ISO), or {"error": ...} if the DB is unusable."""
    path = Path(orders.DB_PATH)
    # Never call orders.connect() on a missing file: it would create the DB.
    if not path.is_file() or not os.access(path, os.R_OK):
        return {"error": f"Orders database not found or not readable: {path}"}
    try:
        summary = orders.sales_summary()
        summary["pace"] = pace(summary, orders.now().date(), first_order_date(path))
    except Exception as exc:  # sqlite3.Error etc.; show a readable message, not a stack trace
        return {"error": f"Could not read orders: {exc}"}
    return {**summary, "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds")}

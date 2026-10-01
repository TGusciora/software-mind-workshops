"""Dashboard data: read-only wrapper around orders.sales_summary()."""

import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "orders-mcp"))
import orders  # noqa: E402


def load_summary() -> dict:
    """sales_summary() plus generated_at (UTC ISO), or {"error": ...} if the DB is unusable."""
    path = Path(orders.DB_PATH)
    # Never call orders.connect() on a missing file: it would create the DB.
    if not path.is_file() or not os.access(path, os.R_OK):
        return {"error": f"Orders database not found or not readable: {path}"}
    try:
        summary = orders.sales_summary()
    except Exception as exc:  # sqlite3.Error etc.; show a readable message, not a stack trace
        return {"error": f"Could not read orders: {exc}"}
    return {**summary, "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds")}

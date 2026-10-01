# Owner dashboard

Local, read-only sales page. Binds to 127.0.0.1 only; no login.

    ORDERS_DB=/path/to/orders.db python3 dashboard/app.py

Open http://127.0.0.1:8080/ (set `PORT` to change). Numbers come from `orders.sales_summary()`.
The top of the page shows progress toward the $3M goal and required vs actual daily pace (`data.pace()`, UTC dates):
required = remaining / days left to the goal date; actual = revenue / days since the first non-cancelled order (minimum 1).
If the DB is missing or unreadable the page shows an error; the DB is never created.

Tests: `cd dashboard && python3 -m pytest`

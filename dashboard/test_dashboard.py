import hashlib
import json
import os
import threading
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

import pytest

import data
import app

orders = data.orders


@pytest.fixture
def db(tmp_path, monkeypatch):
    monkeypatch.setattr(orders, "DB_PATH", tmp_path / "orders.db")
    return orders.DB_PATH


@pytest.fixture
def server():
    srv = app.make_server(0)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    yield srv
    srv.shutdown()
    srv.server_close()


def get(srv, path):
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{srv.server_address[1]}{path}") as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def seed():
    for _ in range(2):
        orders.place_order("Ana", "512-555-0100", [{"pizza": "pepperoni", "quantity": 2}], address="1 Main")
    orders.cancel_order(orders.place_order("Bo", "512-555-0101", [{"pizza": "pepperoni"}],
                                           address="2 Main")["order_id"], "changed mind")


def test_totals_match_sales_summary_and_exclude_cancelled(db):
    seed()
    out = data.load_summary()
    exp = orders.sales_summary()
    assert (out["revenue"], out["orders"], out["average_order"]) == (72.0, 2, 36.0)
    assert out["cancelled_orders"] == 1
    assert {k: out[k] for k in exp} == exp
    assert set(out) == set(exp) | {"pace", "generated_at"}  # T-001 fields untouched, pace is a new key
    assert out["generated_at"].endswith("+00:00")


def test_missing_db_returns_error_and_creates_nothing(db, server):
    status, body = get(server, "/api/summary")
    assert status == 500 and "error" in json.loads(body)
    assert not db.exists()


@pytest.mark.skipif(os.geteuid() == 0, reason="root can read any file")
def test_unreadable_db_returns_readable_error(db, server):
    seed()
    db.chmod(0o000)
    try:
        status, body = get(server, "/api/summary")
    finally:
        db.chmod(0o600)
    payload = json.loads(body)
    assert status == 500 and "not readable" in payload["error"]
    assert "Traceback" not in body.decode()


def test_server_socket_is_bound_to_loopback_and_needs_no_credentials(server):
    assert server.server_address[0] == "127.0.0.1"
    status, _ = get(server, "/")  # no auth header sent
    assert status == 200


def test_page_has_timestamp_and_error_banner(server):
    _, body = get(server, "/")
    html = body.decode()
    assert "Data as of" in html and 'id="error"' in html


def test_db_bytes_unchanged_after_request(db, server):
    seed()
    before = hashlib.sha256(db.read_bytes()).hexdigest()
    status, _ = get(server, "/api/summary")
    assert status == 200
    assert hashlib.sha256(db.read_bytes()).hexdigest() == before


def test_binds_local_only_and_no_write_calls():
    assert app.HOST == "127.0.0.1"
    src = Path(data.__file__).read_text() + Path(app.__file__).read_text()
    for word in ("INSERT", "UPDATE", "DELETE", "place_order", "set_status", "cancel_order"):
        assert word not in src


def summary(revenue):
    return {"revenue": revenue, "goal_date": "2027-09-11", "goal_progress_pct": round(revenue / 30000, 4),
            "remaining_to_goal": max(3_000_000 - revenue, 0)}


def test_pace_normal_behind_and_ahead():
    # 100 days left, 10 days of selling
    p = data.pace(summary(1_000_000), date(2027, 6, 3), date(2027, 5, 24))
    assert (p["days_left"], p["required_daily_pace"], p["actual_daily_pace"]) == (100, 20000.0, 100000.0)
    assert p["ahead"] is True and p["label"] == "Ahead"
    p = data.pace(summary(100_000), date(2027, 6, 3), date(2027, 5, 24))
    assert (p["required_daily_pace"], p["actual_daily_pace"]) == (29000.0, 10000.0)
    assert p["ahead"] is False and p["label"] == "Behind"


def test_pace_empty_db_is_zero_and_behind():
    p = data.pace(summary(0), date(2027, 6, 3), None)
    assert (p["actual_daily_pace"], p["required_daily_pace"], p["label"]) == (0.0, 30000.0, "Behind")
    assert p["goal_progress_pct"] == 0


def test_pace_first_order_today_counts_as_one_day():
    assert data.pace(summary(500), date(2027, 6, 3), date(2027, 6, 3))["actual_daily_pace"] == 500.0


def test_pace_goal_met_is_ahead():
    p = data.pace(summary(3_200_000), date(2027, 6, 3), date(2026, 6, 3))
    assert (p["required_daily_pace"], p["label"]) == (0.0, "Ahead")
    assert data.pace(summary(3_200_000), date(2027, 12, 1), date(2026, 6, 3))["label"] == "Ahead"


@pytest.mark.parametrize("today", [date(2027, 9, 11), date(2027, 12, 1)])
def test_pace_on_or_after_goal_date_clamps_days_and_does_not_divide_by_zero(today):
    p = data.pace(summary(1_000_000), today, date(2026, 9, 11))
    assert (p["days_left"], p["required_daily_pace"], p["label"]) == (0, 2_000_000.0, "Behind")


def test_api_pace_progress_equals_sales_summary(db, server):
    seed()
    status, body = get(server, "/api/summary")
    p = json.loads(body)["pace"]
    exp = orders.sales_summary()
    today = orders.now().date()
    days_left = max((date.fromisoformat(orders.SALES_GOAL_DATE) - today).days, 0)
    assert status == 200 and p["goal_progress_pct"] == exp["goal_progress_pct"]
    assert p["days_left"] == days_left
    assert p["required_daily_pace"] == round(exp["remaining_to_goal"] / max(days_left, 1), 2)
    assert p["actual_daily_pace"] == 72.0  # first order placed today -> 1 day
    assert p["label"] in ("Ahead", "Behind")


def test_api_empty_db_renders_pace_without_error(db, server):
    orders.connect().close()  # schema only, zero orders
    status, body = get(server, "/api/summary")
    p = json.loads(body)["pace"]
    assert status == 200 and (p["actual_daily_pace"], p["label"]) == (0.0, "Behind")


def test_first_order_date_ignores_cancelled_and_empty(db):
    orders.connect().close()
    assert data.first_order_date(db) is None
    orders.cancel_order(orders.place_order("Bo", "512-555-0101", [{"pizza": "pepperoni"}],
                                           address="2 Main")["order_id"], "changed mind")
    assert data.first_order_date(db) is None
    seed()
    assert data.first_order_date(db) == orders.now().date()


def test_page_has_goal_bar_pace_line_and_label(server):
    html = get(server, "/")[1].decode()
    for needle in ('id="goalbar"', 'id="goalpct"', 'id="required"', 'id="actual"', 'id="pacelabel"', "p.label"):
        assert needle in html
    assert html.index('id="goal"') < html.index('id="stats"')  # headline sits at the top

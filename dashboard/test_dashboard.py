import hashlib
import json
import os
import threading
import urllib.error
import urllib.request
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

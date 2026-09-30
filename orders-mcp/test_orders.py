import pytest

import orders as od


@pytest.fixture(autouse=True)
def db(tmp_path, monkeypatch):
    monkeypatch.setattr(od, "DB_PATH", tmp_path / "orders.db")


def place(**kw):
    args = dict(customer_name="Ana", phone="512-555-0100", items=[{"pizza": "pepperoni", "quantity": 2}],
                fulfillment="delivery", address="1 Main St, Austin")
    return od.place_order(**(args | kw))


def test_menu_reads_prices_from_recipes():
    assert od.load_menu()["pepperoni-pizza"] == 18.0


def test_place_order_prices_and_starts_received():
    o = place()
    assert o["status"] == "received"
    assert o["total"] == 36.0
    assert o["items"][0]["pizza"] == "pepperoni-pizza"
    assert o["eta"] and o["can_cancel"]


def test_delivery_needs_address():
    with pytest.raises(od.OrderError):
        place(address=None)


def test_full_delivery_flow():
    oid = place()["order_id"]
    for expected in od.STATUSES[1:]:
        assert od.set_status(oid)["status"] == expected
    o = od.get_order(oid)
    assert [e["status"] for e in o["timeline"]] == od.STATUSES
    assert o["eta"] is None
    with pytest.raises(od.OrderError):
        od.set_status(oid)


def test_pickup_skips_out_for_delivery():
    oid = place(fulfillment="pickup", address=None)["order_id"]
    for _ in range(3):
        od.set_status(oid)
    assert od.set_status(oid)["status"] == "delivered"


def test_no_skipping_steps():
    oid = place()["order_id"]
    with pytest.raises(od.OrderError):
        od.set_status(oid, "in_oven")


def test_cancel_allowed_before_oven():
    oid = place()["order_id"]
    od.set_status(oid)  # preparing
    o = od.cancel_order(oid, "changed mind")
    assert o["status"] == "cancelled" and o["refund"] == 36.0


def test_cancel_refused_once_in_oven():
    oid = place()["order_id"]
    od.set_status(oid)
    od.set_status(oid)  # in_oven
    assert od.cancellation_check(oid)["can_cancel"] is False
    with pytest.raises(od.OrderError):
        od.cancel_order(oid, "too slow")


def test_board_groups_active_orders():
    a = place()["order_id"]
    place()
    od.set_status(a)
    b = od.board()
    assert b["counts"]["received"] == 1 and b["counts"]["preparing"] == 1

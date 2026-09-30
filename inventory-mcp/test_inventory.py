import json

import pytest

import inventory as inv


@pytest.fixture
def stock(tmp_path, monkeypatch):
    data = {"items": {
        "pizza dough ball": {"on_hand": 36, "unit": "oz", "reorder_point": 24, "aliases": []},
        "pizza sauce": {"on_hand": 3, "unit": "oz", "reorder_point": 6, "aliases": ["tomato sauce"]},
        "cilantro": {"on_hand": 0, "unit": "oz", "reorder_point": 1, "aliases": []},
    }}
    f = tmp_path / "stock.json"
    f.write_text(json.dumps(data))
    monkeypatch.setattr(inv, "STOCK_FILE", f)
    return inv.load_stock()


def test_normalize_strips_prep_notes():
    assert inv.normalize("Pineapple chunks, drained (double)") == "pineapple chunks"


def test_parse_quantity():
    assert inv.parse_quantity("2.5 oz (~40 slices)") == (2.5, "oz")
    assert inv.parse_quantity("2 eggs") == (2, "each")
    assert inv.parse_quantity("1") == (1, "each")
    assert inv.parse_quantity("to taste") == (0, "")


def test_resolve_alias(stock):
    assert inv.resolve(stock, "Tomato sauce") == "pizza sauce"


def test_status(stock):
    items = stock["items"]
    assert inv.item_status(items["pizza dough ball"]) == "OK"
    assert inv.item_status(items["pizza sauce"]) == "LOW"
    assert inv.item_status(items["cilantro"]) == "OUT"


def test_max_pizzas_limited_by_smallest(stock):
    reqs = [inv.Requirement("pizza dough ball", "Dough", 12, "oz"),
            inv.Requirement("pizza sauce", "Sauce", 3, "oz")]
    assert inv.max_pizzas(stock, reqs) == (1, [], "pizza sauce")


def test_unmeasured_item_out_blocks_pizza(stock):
    reqs = [inv.Requirement("pizza dough ball", "Dough", 12, "oz"),
            inv.Requirement("cilantro", "Cilantro (finish)", 0, "")]
    assert inv.max_pizzas(stock, reqs)[:2] == (0, ["Cilantro (finish)"])


def test_every_recipe_ingredient_is_tracked():
    stock = inv.load_stock()
    for name, reqs in inv.load_recipes(stock).items():
        for r in reqs:
            assert r.item in stock["items"], f"{name}: {r.label}"

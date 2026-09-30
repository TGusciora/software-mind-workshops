"""Inventory logic: parse recipes/*.md, match ingredients to stock, report status.

Stock lives in stock.json. Each item has an amount on hand, a unit and a
reorder point. Recipes are read straight from recipes/ so the menu and the
stock checks never drift apart.
"""

import json
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RECIPES_DIR = ROOT.parent / "recipes"
STOCK_FILE = ROOT / "stock.json"

# Quantities like "to taste" or "pinch" are not measured; we only need some on hand.
UNMEASURED = {"to taste", "pinch"}


@dataclass
class Requirement:
    item: str          # normalized stock key
    label: str         # ingredient text as written in the recipe
    amount: float      # 0 for unmeasured quantities
    unit: str


def normalize(name: str) -> str:
    """'Pineapple chunks, drained (double)' -> 'pineapple chunks'."""
    name = re.sub(r"\(.*?\)", "", name)
    name = name.split(",")[0]
    return re.sub(r"\s+", " ", name).strip().lower()


def parse_quantity(text: str) -> tuple[float, str]:
    text = re.sub(r"\(.*?\)", "", text).strip().lower()
    if text in UNMEASURED:
        return 0.0, ""
    m = re.match(r"([\d.]+)\s*(\w*)", text)
    if not m:
        return 0.0, ""
    unit = m.group(2) or "each"
    if unit in ("egg", "eggs"):
        unit = "each"
    return float(m.group(1)), unit


def load_stock() -> dict:
    return json.loads(STOCK_FILE.read_text())


def save_stock(stock: dict) -> None:
    STOCK_FILE.write_text(json.dumps(stock, indent=2) + "\n")


def alias_index(stock: dict) -> dict[str, str]:
    index = {}
    for key, item in stock["items"].items():
        index[key] = key
        for alias in item.get("aliases", []):
            index[alias.lower()] = key
    return index


def resolve(stock: dict, name: str) -> str | None:
    """Find the stock key for an ingredient name (exact, alias, then substring)."""
    index = alias_index(stock)
    key = normalize(name)
    if key in index:
        return index[key]
    matches = sorted({v for k, v in index.items() if key in k or k in key})
    return matches[0] if len(matches) == 1 else None


def load_recipes(stock: dict) -> dict[str, list[Requirement]]:
    recipes = {}
    for path in sorted(RECIPES_DIR.glob("*.md")):
        reqs = []
        for line in path.read_text().splitlines():
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) != 3 or cells[0] in ("Ingredient", "") or cells[0].startswith(("**", "---")):
                continue
            amount, unit = parse_quantity(cells[1])
            reqs.append(Requirement(resolve(stock, cells[0]) or normalize(cells[0]), cells[0], amount, unit))
        if reqs:
            recipes[path.stem] = reqs
    return recipes


def item_status(item: dict) -> str:
    if item["on_hand"] <= 0:
        return "OUT"
    if item["on_hand"] <= item["reorder_point"]:
        return "LOW"
    return "OK"


def max_pizzas(stock: dict, reqs: list[Requirement]) -> tuple[int, list[str], str | None]:
    """How many of a recipe we can make, what is missing, and the limiting item."""
    items = stock["items"]
    best, limiting, missing = None, None, []
    for r in reqs:
        item = items.get(r.item)
        if item is None:
            missing.append(f"{r.label} (not tracked in stock)")
            continue
        if r.amount == 0:
            if item["on_hand"] <= 0:
                missing.append(r.label)
            continue
        if item["unit"] != r.unit:
            missing.append(f"{r.label} (unit mismatch: recipe {r.unit}, stock {item['unit']})")
            continue
        n = int(item["on_hand"] // r.amount)
        if n == 0:
            missing.append(r.label)
        if best is None or n < best:
            best, limiting = n, r.item
    if missing:
        return 0, missing, limiting
    return best or 0, [], limiting

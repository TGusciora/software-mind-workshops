import { describe, expect, it } from "vitest";
import {
  MAX_TOPPINGS,
  canAddTopping,
  groupByCategory,
  hasBase,
  totalPrice,
  validatePizza,
} from "./pizzaLogic";

const base = { id: 1, name: "Classic dough", category: "base", unit_price: 3.5 };
const sauce = { id: 2, name: "Tomato sauce", category: "sauce", unit_price: 1 };
const cheese = { id: 3, name: "Mozzarella", category: "cheese", unit_price: 1.75 };
const pepperoni = { id: 4, name: "Pepperoni", category: "topping", unit_price: 1.5 };
const mushrooms = { id: 5, name: "Mushrooms", category: "topping", unit_price: 1 };

describe("groupByCategory", () => {
  it("groups ingredients by category", () => {
    const groups = groupByCategory([base, sauce, cheese, pepperoni, mushrooms]);
    expect(groups.base).toEqual([base]);
    expect(groups.topping).toEqual([pepperoni, mushrooms]);
  });
});

describe("totalPrice", () => {
  it("sums unit prices of selected ingredients", () => {
    expect(totalPrice([base, pepperoni, mushrooms])).toBeCloseTo(6);
  });

  it("returns 0 for no ingredients", () => {
    expect(totalPrice([])).toBe(0);
  });
});

describe("hasBase", () => {
  it("returns true when a base is selected", () => {
    expect(hasBase([base, pepperoni])).toBe(true);
  });

  it("returns false when no base is selected", () => {
    expect(hasBase([pepperoni])).toBe(false);
  });
});

describe("canAddTopping", () => {
  it("allows adding toppings under the max", () => {
    expect(canAddTopping([base])).toBe(true);
  });

  it("blocks adding toppings at the max", () => {
    const maxedOut = [base, ...Array.from({ length: MAX_TOPPINGS }, (_, i) => ({
      id: 100 + i,
      name: `Topping ${i}`,
      category: "topping",
      unit_price: 1,
    }))];
    expect(canAddTopping(maxedOut)).toBe(false);
  });
});

describe("validatePizza", () => {
  it("requires a base", () => {
    expect(validatePizza([pepperoni])).toMatch(/base/i);
  });

  it("passes when a base is present", () => {
    expect(validatePizza([base])).toBeNull();
  });
});

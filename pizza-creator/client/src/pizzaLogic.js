export const MAX_TOPPINGS = 5;
export const SIZES = ["10 inch", "12 inch", "14 inch", "16 inch"];

export function groupByCategory(ingredients) {
  return ingredients.reduce((groups, ingredient) => {
    const list = groups[ingredient.category] ?? [];
    return { ...groups, [ingredient.category]: [...list, ingredient] };
  }, {});
}

export function totalPrice(selectedIngredients) {
  return selectedIngredients.reduce((sum, i) => sum + i.unit_price, 0);
}

export function hasBase(selectedIngredients) {
  return selectedIngredients.some((i) => i.category === "base");
}

export function toppingCount(selectedIngredients) {
  return selectedIngredients.filter((i) => i.category === "topping").length;
}

export function canAddTopping(selectedIngredients) {
  return toppingCount(selectedIngredients) < MAX_TOPPINGS;
}

export function validatePizza(selectedIngredients) {
  if (!hasBase(selectedIngredients)) {
    return "Please select a base before saving your pizza.";
  }
  return null;
}

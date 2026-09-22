export const MAX_TOPPINGS = 5;
export const SIZES = ["10 inch", "12 inch", "14 inch", "16 inch"];
export const CATEGORY_ORDER = ["base", "sauce", "cheese", "topping"];

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

// Selections are kept in category order so the summary reads like a pizza
// (base, sauce, cheese, toppings) instead of in click order.
export function sortByCategory(selectedIngredients) {
  return [...selectedIngredients].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );
}

// Clicking an ingredient toggles it. Base/sauce/cheese allow one choice each, so
// picking a new one replaces the current pick in that category.
export function toggleIngredient(selectedIngredients, ingredient) {
  if (selectedIngredients.some((i) => i.id === ingredient.id)) {
    return {
      selectedIngredients: selectedIngredients.filter((i) => i.id !== ingredient.id),
      message: null,
      blocked: false,
    };
  }

  if (ingredient.category === "topping") {
    if (!canAddTopping(selectedIngredients)) {
      return {
        selectedIngredients,
        message: `Topping limit of ${MAX_TOPPINGS} reached — remove one to add another.`,
        blocked: true,
      };
    }
    return {
      selectedIngredients: [...selectedIngredients, ingredient],
      message: null,
      blocked: false,
    };
  }

  const replaced = selectedIngredients.find((i) => i.category === ingredient.category);
  const withoutCategory = selectedIngredients.filter((i) => i.category !== ingredient.category);
  return {
    selectedIngredients: [...withoutCategory, ingredient],
    message: replaced ? `Swapped ${replaced.name} for ${ingredient.name}.` : null,
    blocked: false,
  };
}

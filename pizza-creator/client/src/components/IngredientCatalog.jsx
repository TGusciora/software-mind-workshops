import { groupByCategory } from "../pizzaLogic";

const CATEGORY_LABELS = {
  base: "Base",
  sauce: "Sauce",
  cheese: "Cheese",
  topping: "Toppings",
};

export default function IngredientCatalog({ ingredients, selectedIds, onAdd }) {
  const groups = groupByCategory(ingredients);
  const categories = ["base", "sauce", "cheese", "topping"];

  return (
    <div className="ingredient-catalog">
      <h2>Ingredients</h2>
      {categories.map((category) => (
        <div key={category} className="ingredient-group">
          <h3>{CATEGORY_LABELS[category]}</h3>
          <ul>
            {(groups[category] ?? []).map((ingredient) => (
              <li key={ingredient.id}>
                <span>{ingredient.name}</span>
                <span className="price">${ingredient.unit_price.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => onAdd(ingredient)}
                  disabled={category === "topping" && selectedIds.has(ingredient.id)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

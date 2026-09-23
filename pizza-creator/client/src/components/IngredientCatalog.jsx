import { CATEGORY_ORDER, MAX_TOPPINGS, groupByCategory, toppingCount } from "../pizzaLogic";

const CATEGORY_LABELS = {
  base: "Base",
  sauce: "Sauce",
  cheese: "Cheese",
  topping: "Toppings",
};

const CATEGORY_HINTS = {
  base: "Required — pick one",
  sauce: "Pick one",
  cheese: "Pick one",
};

export default function IngredientCatalog({
  ingredients,
  loading,
  selectedIds,
  selectedIngredients,
  onToggle,
}) {
  const groups = groupByCategory(ingredients);
  const used = toppingCount(selectedIngredients);
  const toppingsFull = used >= MAX_TOPPINGS;

  return (
    <div className="ingredient-catalog">
      <h2>Ingredients</h2>

      {loading && <p className="muted">Loading ingredients…</p>}

      {!loading &&
        CATEGORY_ORDER.map((category) => (
          <div key={category} className="ingredient-group">
            <h3>
              {CATEGORY_LABELS[category]}
              <span className="hint">
                {category === "topping"
                  ? `${used} of ${MAX_TOPPINGS} chosen`
                  : CATEGORY_HINTS[category]}
              </span>
            </h3>
            <ul>
              {(groups[category] ?? []).map((ingredient) => {
                const selected = selectedIds.has(ingredient.id);
                const blocked = category === "topping" && toppingsFull && !selected;

                return (
                  <li key={ingredient.id} className={selected ? "selected" : undefined}>
                    <span>{ingredient.name}</span>
                    <span className="price">${ingredient.unit_price.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => onToggle(ingredient)}
                      disabled={blocked}
                      aria-pressed={selected}
                      title={
                        blocked ? `Topping limit of ${MAX_TOPPINGS} reached` : undefined
                      }
                      aria-label={`${selected ? "Remove" : "Add"} ${ingredient.name}`}
                    >
                      {selected ? "Added ✓" : "Add"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
    </div>
  );
}

import { MAX_TOPPINGS, SIZES, sortByCategory, toppingCount, totalPrice } from "../pizzaLogic";

export default function PizzaBuilder({
  size,
  onSizeChange,
  selectedIngredients,
  onRemove,
  selectionMessage,
  onStartOver,
}) {
  const summary = sortByCategory(selectedIngredients);

  return (
    <div className="pizza-builder">
      <div className="panel-header">
        <h2>Your Pizza</h2>
        {selectedIngredients.length > 0 && (
          <button type="button" className="link-button" onClick={onStartOver}>
            Start over
          </button>
        )}
      </div>

      <label htmlFor="pizza-size">Size</label>
      <select id="pizza-size" value={size} onChange={(e) => onSizeChange(e.target.value)}>
        {SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <p aria-live="polite" className={selectionMessage?.blocked ? "warning" : "muted"}>
        {selectionMessage?.text ?? ""}
      </p>

      {summary.length === 0 ? (
        <p className="muted">No ingredients selected yet. Start with a base.</p>
      ) : (
        <ul className="pizza-summary">
          {summary.map((ingredient) => (
            <li key={ingredient.id}>
              <span>{ingredient.name}</span>
              <span className="price">${ingredient.unit_price.toFixed(2)}</span>
              <button
                type="button"
                onClick={() => onRemove(ingredient)}
                aria-label={`Remove ${ingredient.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="total">
        Total: ${totalPrice(selectedIngredients).toFixed(2)}
        <span className="hint">
          {size} · {toppingCount(selectedIngredients)} of {MAX_TOPPINGS} toppings
        </span>
      </p>
    </div>
  );
}

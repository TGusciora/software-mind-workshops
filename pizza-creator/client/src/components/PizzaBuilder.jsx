import { SIZES, totalPrice } from "../pizzaLogic";

export default function PizzaBuilder({
  size,
  onSizeChange,
  selectedIngredients,
  onRemove,
  toppingLimitMessage,
}) {
  return (
    <div className="pizza-builder">
      <h2>Your Pizza</h2>

      <label>
        Size
        <select value={size} onChange={(e) => onSizeChange(e.target.value)}>
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      {toppingLimitMessage && <p className="warning">{toppingLimitMessage}</p>}

      {selectedIngredients.length === 0 ? (
        <p>No ingredients selected yet.</p>
      ) : (
        <ul className="pizza-summary">
          {selectedIngredients.map((ingredient) => (
            <li key={ingredient.id}>
              <span>{ingredient.name}</span>
              <span className="price">${ingredient.unit_price.toFixed(2)}</span>
              <button type="button" onClick={() => onRemove(ingredient)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="total">Total: ${totalPrice(selectedIngredients).toFixed(2)}</p>
    </div>
  );
}

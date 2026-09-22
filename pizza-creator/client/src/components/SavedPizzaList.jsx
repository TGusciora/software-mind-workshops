import { sortByCategory } from "../pizzaLogic";

export default function SavedPizzaList({ pizzas, onSelect, selectedPizza }) {
  return (
    <div className="saved-pizza-list">
      <h2>Saved Pizzas</h2>
      {pizzas.length === 0 ? (
        <p className="muted">No saved pizzas yet.</p>
      ) : (
        <ul>
          {pizzas.map((pizza) => {
            const isOpen = selectedPizza?.id === pizza.id;
            return (
              <li key={pizza.id} className={isOpen ? "selected" : undefined}>
                <button
                  type="button"
                  className="saved-pizza-button"
                  onClick={() => onSelect(pizza.id)}
                  aria-current={isOpen ? "true" : undefined}
                >
                  {pizza.name} ({pizza.size}) — ${pizza.totalPrice.toFixed(2)}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selectedPizza && <SavedPizzaDetail pizza={selectedPizza} />}
    </div>
  );
}

export function SavedPizzaDetail({ pizza }) {
  return (
    <div className="saved-pizza-detail">
      <h3>{pizza.name}</h3>
      <p className="muted">Size: {pizza.size}</p>
      <ul>
        {sortByCategory(pizza.ingredients).map((ingredient) => (
          <li key={ingredient.id}>
            <span>{ingredient.name}</span>
            <span className="price">${ingredient.unit_price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="total">Total: ${pizza.totalPrice.toFixed(2)}</p>
    </div>
  );
}

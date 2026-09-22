export default function SavedPizzaList({ pizzas, onSelect, selectedPizza }) {
  return (
    <div className="saved-pizza-list">
      <h2>Saved Pizzas</h2>
      {pizzas.length === 0 ? (
        <p>No saved pizzas yet.</p>
      ) : (
        <ul>
          {pizzas.map((pizza) => (
            <li key={pizza.id}>
              <button type="button" onClick={() => onSelect(pizza.id)}>
                {pizza.name} ({pizza.size})
              </button>
            </li>
          ))}
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
      <p>Size: {pizza.size}</p>
      <ul>
        {pizza.ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} (${ingredient.unit_price.toFixed(2)})
          </li>
        ))}
      </ul>
      <p className="total">Total: ${pizza.totalPrice.toFixed(2)}</p>
    </div>
  );
}

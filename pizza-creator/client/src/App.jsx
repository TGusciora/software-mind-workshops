import { useEffect, useState } from "react";
import IngredientCatalog from "./components/IngredientCatalog.jsx";
import PizzaBuilder from "./components/PizzaBuilder.jsx";
import SaveDialog from "./components/SaveDialog.jsx";
import SavedPizzaList from "./components/SavedPizzaList.jsx";
import { fetchIngredients, fetchPizza, fetchPizzas, savePizza } from "./api.js";
import { SIZES, canAddTopping, validatePizza } from "./pizzaLogic.js";

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [size, setSize] = useState(SIZES[0]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [toppingLimitMessage, setToppingLimitMessage] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetchIngredients().then(setIngredients).catch((err) => setLoadError(err.message));
    refreshPizzas();
  }, []);

  function refreshPizzas() {
    fetchPizzas().then(setPizzas).catch((err) => setLoadError(err.message));
  }

  function handleAdd(ingredient) {
    setToppingLimitMessage(null);

    if (ingredient.category === "topping") {
      if (selectedIngredients.some((i) => i.id === ingredient.id)) return;
      if (!canAddTopping(selectedIngredients)) {
        setToppingLimitMessage("Topping limit reached. Remove one to add another.");
        return;
      }
      setSelectedIngredients([...selectedIngredients, ingredient]);
      return;
    }

    // base/sauce/cheese: only one of each category at a time
    const withoutCategory = selectedIngredients.filter((i) => i.category !== ingredient.category);
    setSelectedIngredients([...withoutCategory, ingredient]);
  }

  function handleRemove(ingredient) {
    setToppingLimitMessage(null);
    setSelectedIngredients(selectedIngredients.filter((i) => i.id !== ingredient.id));
  }

  async function handleSave(name) {
    setConfirmation(null);
    const validationError = validatePizza(selectedIngredients);
    if (validationError) {
      setSaveError(validationError);
      return;
    }
    if (!name || !name.trim()) {
      setSaveError("Please give your pizza a name.");
      return;
    }

    try {
      const saved = await savePizza({
        name: name.trim(),
        size,
        ingredientIds: selectedIngredients.map((i) => i.id),
      });
      setSaveError(null);
      setConfirmation(saved);
      refreshPizzas();
    } catch (err) {
      setSaveError(err.message);
    }
  }

  async function handleSelectPizza(id) {
    try {
      const pizza = await fetchPizza(id);
      setSelectedPizza(pizza);
    } catch (err) {
      setLoadError(err.message);
    }
  }

  const selectedIds = new Set(selectedIngredients.map((i) => i.id));

  return (
    <div className="app">
      <header>
        <h1>Pizza Creator</h1>
      </header>

      {loadError && <p className="error">{loadError}</p>}

      <main>
        <IngredientCatalog ingredients={ingredients} selectedIds={selectedIds} onAdd={handleAdd} />

        <div className="builder-column">
          <PizzaBuilder
            size={size}
            onSizeChange={setSize}
            selectedIngredients={selectedIngredients}
            onRemove={handleRemove}
            toppingLimitMessage={toppingLimitMessage}
          />
          <SaveDialog onSave={handleSave} error={saveError} confirmation={confirmation} />
        </div>

        <SavedPizzaList pizzas={pizzas} onSelect={handleSelectPizza} selectedPizza={selectedPizza} />
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import IngredientCatalog from "./components/IngredientCatalog.jsx";
import PizzaBuilder from "./components/PizzaBuilder.jsx";
import SaveDialog from "./components/SaveDialog.jsx";
import SavedPizzaList from "./components/SavedPizzaList.jsx";
import { fetchIngredients, fetchPizza, fetchPizzas, savePizza } from "./api.js";
import { SIZES, toggleIngredient, validatePizza } from "./pizzaLogic.js";

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(true);
  const [size, setSize] = useState(SIZES[0]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectionMessage, setSelectionMessage] = useState(null);
  const [name, setName] = useState("");
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetchIngredients()
      .then(setIngredients)
      .catch((err) => setLoadError(err.message))
      .finally(() => setIngredientsLoading(false));
    refreshPizzas();
  }, []);

  function refreshPizzas() {
    fetchPizzas().then(setPizzas).catch((err) => setLoadError(err.message));
  }

  // Any edit invalidates the previous save feedback, so the confirmation never
  // describes a pizza that is no longer on screen.
  function clearSaveFeedback() {
    setSaveError(null);
    setConfirmation(null);
  }

  function handleToggle(ingredient) {
    const result = toggleIngredient(selectedIngredients, ingredient);
    setSelectedIngredients(result.selectedIngredients);
    setSelectionMessage(result.message ? { text: result.message, blocked: result.blocked } : null);
    clearSaveFeedback();
  }

  function handleSizeChange(nextSize) {
    setSize(nextSize);
    clearSaveFeedback();
  }

  function handleNameChange(nextName) {
    setName(nextName);
    clearSaveFeedback();
  }

  function handleStartOver() {
    setSelectedIngredients([]);
    setSize(SIZES[0]);
    setName("");
    setSelectionMessage(null);
    clearSaveFeedback();
  }

  async function handleSave() {
    const validationError = validatePizza(selectedIngredients);
    if (validationError) {
      setConfirmation(null);
      setSaveError(validationError);
      return;
    }
    if (!name.trim()) {
      setConfirmation(null);
      setSaveError("Please give your pizza a name.");
      return;
    }

    setSaving(true);
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
      setConfirmation(null);
      setSaveError(err.message);
    } finally {
      setSaving(false);
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
        <p className="tagline">Build your pizza, name it, and we'll remember it.</p>
      </header>

      {loadError && (
        <p className="error" role="alert">
          {loadError}
        </p>
      )}

      <main>
        <IngredientCatalog
          ingredients={ingredients}
          loading={ingredientsLoading}
          selectedIds={selectedIds}
          selectedIngredients={selectedIngredients}
          onToggle={handleToggle}
        />

        <div className="builder-column">
          <PizzaBuilder
            size={size}
            onSizeChange={handleSizeChange}
            selectedIngredients={selectedIngredients}
            onRemove={handleToggle}
            selectionMessage={selectionMessage}
            onStartOver={handleStartOver}
          />
          <SaveDialog
            name={name}
            onNameChange={handleNameChange}
            onSave={handleSave}
            saving={saving}
            error={saveError}
            confirmation={confirmation}
          />
        </div>

        <SavedPizzaList pizzas={pizzas} onSelect={handleSelectPizza} selectedPizza={selectedPizza} />
      </main>
    </div>
  );
}

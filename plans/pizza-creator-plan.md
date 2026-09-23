# Pizza Creator — Implementation Plan

## Summary
A simple frontend feature letting customers build a custom pizza from ingredients (size, base, sauce, cheese, toppings) and save the configuration. No ordering/checkout/payment in this scope. Price is the sum of selected ingredients' costs.

**Stack:** React frontend, SQLite backend (via a small API layer, e.g. Node/Express or similar).

## Scope
- In scope: browsing ingredients, building a pizza (size, base, toppings), computing total price as a sum of ingredient costs, saving/naming a pizza configuration, viewing previously saved pizzas.
- Out of scope: checkout, payment, order fulfillment, delivery, size-based price multipliers, per-size topping limits (a flat max-topping-count rule applies instead), the `recipes/` pineapple rule (this feature is a custom builder, not a fixed recipe, so it is excluded).

## Acceptance criteria (Gherkin)

```gherkin
Feature: Build a custom pizza from ingredients
  As a customer
  I want to select a base and ingredients
  So that I can build and configure a custom pizza

  Background:
    Given the ingredient catalog contains bases, sauces, cheeses, and toppings with prices
    And each ingredient has a name, category, and unit price

  Scenario: View available ingredients grouped by category
    When I open the pizza creator
    Then I see ingredients grouped by category (base, sauce, cheese, toppings)
    And each ingredient shows its name and price

  Scenario: Select a size and base
    Given I am on the pizza creator page
    When I select the "14 inch" size
    And I select "Classic dough" as the base
    Then the base is added to my pizza
    And the running price updates to reflect the base's cost

  Scenario: Add toppings to a pizza
    Given I have selected a size and base
    When I add "Mozzarella", "Pepperoni", and "Mushrooms"
    Then all three ingredients appear in my pizza summary
    And the total price updates to include each ingredient's cost

  Scenario: Remove a topping from a pizza
    Given my pizza includes "Pepperoni" and "Mushrooms"
    When I remove "Pepperoni"
    Then "Pepperoni" no longer appears in my pizza summary
    And the total price decreases by pepperoni's cost

  Scenario: Prevent saving without a base
    Given I have not selected a base
    When I try to save my pizza
    Then I see an error message telling me to select a base
    And the pizza is not saved

  Scenario: Enforce a maximum number of toppings
    Given my pizza already has the maximum allowed toppings
    When I try to add another topping
    Then I see a message that the topping limit has been reached
    And the additional topping is not added

  Scenario: Save a custom pizza
    Given I have built a valid pizza with a base, size, and toppings
    When I click "Save my pizza"
    Then the pizza is persisted to the database
    And I see a confirmation with the pizza's name and total price (sum of ingredient costs)

  Scenario: View a previously created pizza
    Given I previously saved a custom pizza named "My Special"
    When I open "My Special" from my saved pizzas
    Then I see the same base, size, and toppings I originally selected
    And the total price matches what was saved

  Scenario: Name a custom pizza
    Given I have built a valid pizza
    When I enter "Tex-Mex Special" as the pizza name and save it
    Then the saved pizza is labeled "Tex-Mex Special"

  Scenario: Backend rejects an invalid ingredient ID
    Given the frontend sends a save request referencing an ingredient ID that does not exist
    When the backend processes the request
    Then it responds with a 400 error
    And no pizza record is created
```

## Proposed data model (SQLite)

- `ingredients` — id, name, category (base/sauce/cheese/topping), unit_price
- `pizzas` — id, name, size, created_at
- `pizza_ingredients` — pizza_id, ingredient_id (join table)

Total price = sum of `unit_price` over the pizza's linked ingredients.

## Proposed API endpoints

- `GET /api/ingredients` — list all ingredients grouped/filterable by category
- `POST /api/pizzas` — create a pizza configuration (name, size, ingredient IDs); validates base is present, ingredient IDs exist, and topping count ≤ max
- `GET /api/pizzas` — list saved pizzas
- `GET /api/pizzas/:id` — fetch one saved pizza with its ingredients and total price

## Frontend components (React)

- `IngredientCatalog` — displays ingredients grouped by category with add buttons
- `PizzaBuilder` — current selection (size, base, toppings), running total price
- `SaveDialog` — name input + save action, shows validation errors
- `SavedPizzaList` / `SavedPizzaDetail` — view previously saved pizzas

## Implementation steps

1. Set up SQLite schema (`ingredients`, `pizzas`, `pizza_ingredients`) and seed ingredient data.
2. Build backend API endpoints listed above with validation (base required, valid ingredient IDs, max topping count).
3. Build `IngredientCatalog` component to browse ingredients by category.
4. Build `PizzaBuilder` component with add/remove ingredient logic and live price calculation.
5. Build `SaveDialog` for naming and saving a configuration, wired to `POST /api/pizzas`.
6. Build `SavedPizzaList`/`SavedPizzaDetail` to view saved configurations.
7. Add tests covering the Gherkin scenarios above (unit tests for price calc/validation, integration tests for the save flow).

## Open decisions still needed before/while implementing
- Exact max topping count value.
- Whether size affects anything beyond being stored (per user: no price multiplier in this scope).

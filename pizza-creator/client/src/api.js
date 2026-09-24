const BASE_URL = "/api";

async function handle(res) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error || `Request failed with status ${res.status}`);
  }
  return body;
}

export async function fetchIngredients() {
  const res = await fetch(`${BASE_URL}/ingredients`);
  return handle(res);
}

export async function fetchPizzas() {
  const res = await fetch(`${BASE_URL}/pizzas`);
  return handle(res);
}

export async function fetchPizza(id) {
  const res = await fetch(`${BASE_URL}/pizzas/${id}`);
  return handle(res);
}

export async function savePizza({ name, size, ingredientIds }) {
  const res = await fetch(`${BASE_URL}/pizzas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, size, ingredientIds }),
  });
  return handle(res);
}

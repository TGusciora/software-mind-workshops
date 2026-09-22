import test from "node:test";
import assert from "node:assert/strict";
import { createDb } from "./db.js";
import { createApp } from "./app.js";

function setup() {
  const db = createDb(":memory:");
  const app = createApp(db);
  return { db, app };
}

async function request(app, method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      fetch(`http://localhost:${port}${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
        .then(async (res) => {
          const json = await res.json().catch(() => null);
          server.close();
          resolve({ status: res.status, body: json });
        })
        .catch((err) => {
          server.close();
          reject(err);
        });
    });
  });
}

test("GET /api/ingredients returns seeded ingredients grouped by category", async () => {
  const { app } = setup();
  const res = await request(app, "GET", "/api/ingredients");
  assert.equal(res.status, 200);
  assert.ok(res.body.length > 0);
  assert.ok(res.body.every((i) => i.name && i.category && typeof i.unit_price === "number"));
});

test("POST /api/pizzas rejects a pizza without a base", async () => {
  const { app, db } = setup();
  const topping = db.prepare("SELECT id FROM ingredients WHERE category = 'topping' LIMIT 1").get();
  const res = await request(app, "POST", "/api/pizzas", {
    name: "No Base",
    size: "14 inch",
    ingredientIds: [topping.id],
  });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /base/i);
});

test("POST /api/pizzas rejects an invalid ingredient ID", async () => {
  const { app, db } = setup();
  const base = db.prepare("SELECT id FROM ingredients WHERE category = 'base' LIMIT 1").get();
  const res = await request(app, "POST", "/api/pizzas", {
    name: "Bad Ingredient",
    size: "14 inch",
    ingredientIds: [base.id, 99999],
  });
  assert.equal(res.status, 400);
  const count = db.prepare("SELECT COUNT(*) AS c FROM pizzas").get().c;
  assert.equal(count, 0);
});

test("POST /api/pizzas rejects more than the max topping count", async () => {
  const { app, db } = setup();
  const base = db.prepare("SELECT id FROM ingredients WHERE category = 'base' LIMIT 1").get();
  const toppings = db.prepare("SELECT id FROM ingredients WHERE category = 'topping'").all();
  const res = await request(app, "POST", "/api/pizzas", {
    name: "Too Many Toppings",
    size: "14 inch",
    ingredientIds: [base.id, ...toppings.map((t) => t.id)],
  });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /topping limit/i);
});

test("POST /api/pizzas saves a valid pizza and computes total price", async () => {
  const { app, db } = setup();
  const base = db.prepare("SELECT * FROM ingredients WHERE category = 'base' LIMIT 1").get();
  const topping = db.prepare("SELECT * FROM ingredients WHERE category = 'topping' LIMIT 1").get();
  const res = await request(app, "POST", "/api/pizzas", {
    name: "Tex-Mex Special",
    size: "14 inch",
    ingredientIds: [base.id, topping.id],
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.name, "Tex-Mex Special");
  assert.equal(res.body.totalPrice, base.unit_price + topping.unit_price);
});

test("GET /api/pizzas/:id returns a previously saved pizza", async () => {
  const { app, db } = setup();
  const base = db.prepare("SELECT * FROM ingredients WHERE category = 'base' LIMIT 1").get();
  const created = await request(app, "POST", "/api/pizzas", {
    name: "My Special",
    size: "12 inch",
    ingredientIds: [base.id],
  });
  const res = await request(app, "GET", `/api/pizzas/${created.body.id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.name, "My Special");
  assert.equal(res.body.size, "12 inch");
  assert.equal(res.body.totalPrice, base.unit_price);
});

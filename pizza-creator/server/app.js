import express from "express";
import cors from "cors";
import { MAX_TOPPINGS } from "./db.js";

export function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/ingredients", (req, res) => {
    const { category } = req.query;
    const rows = category
      ? db
          .prepare("SELECT * FROM ingredients WHERE category = ? ORDER BY name")
          .all(category)
      : db.prepare("SELECT * FROM ingredients ORDER BY category, name").all();
    res.json(rows);
  });

  app.get("/api/pizzas", (req, res) => {
    const pizzas = db.prepare("SELECT * FROM pizzas ORDER BY created_at DESC").all();
    res.json(pizzas.map((p) => attachIngredients(db, p)));
  });

  app.get("/api/pizzas/:id", (req, res) => {
    const pizza = db.prepare("SELECT * FROM pizzas WHERE id = ?").get(req.params.id);
    if (!pizza) return res.status(404).json({ error: "Pizza not found" });
    res.json(attachIngredients(db, pizza));
  });

  app.post("/api/pizzas", (req, res) => {
    const { name, size, ingredientIds } = req.body ?? {};

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Pizza name is required" });
    }
    if (!size || typeof size !== "string") {
      return res.status(400).json({ error: "Pizza size is required" });
    }
    if (!Array.isArray(ingredientIds) || ingredientIds.length === 0) {
      return res.status(400).json({ error: "At least one ingredient is required" });
    }

    const ingredients = db
      .prepare(
        `SELECT * FROM ingredients WHERE id IN (${ingredientIds.map(() => "?").join(",")})`
      )
      .all(...ingredientIds);

    if (ingredients.length !== new Set(ingredientIds).size) {
      return res.status(400).json({ error: "One or more ingredient IDs do not exist" });
    }

    const hasBase = ingredients.some((i) => i.category === "base");
    if (!hasBase) {
      return res.status(400).json({ error: "A base is required" });
    }

    const toppingCount = ingredients.filter((i) => i.category === "topping").length;
    if (toppingCount > MAX_TOPPINGS) {
      return res.status(400).json({
        error: `Topping limit of ${MAX_TOPPINGS} exceeded`,
      });
    }

    const insertPizza = db.prepare("INSERT INTO pizzas (name, size) VALUES (?, ?)");
    const insertLink = db.prepare(
      "INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (?, ?)"
    );

    const create = db.transaction(() => {
      const { lastInsertRowid } = insertPizza.run(name, size);
      for (const id of new Set(ingredientIds)) {
        insertLink.run(lastInsertRowid, id);
      }
      return lastInsertRowid;
    });

    const pizzaId = create();
    const pizza = db.prepare("SELECT * FROM pizzas WHERE id = ?").get(pizzaId);
    res.status(201).json(attachIngredients(db, pizza));
  });

  return app;
}

function attachIngredients(db, pizza) {
  const ingredients = db
    .prepare(
      `SELECT i.* FROM ingredients i
       JOIN pizza_ingredients pi ON pi.ingredient_id = i.id
       WHERE pi.pizza_id = ?`
    )
    .all(pizza.id);
  const totalPrice = ingredients.reduce((sum, i) => sum + i.unit_price, 0);
  return { ...pizza, ingredients, totalPrice };
}

export { MAX_TOPPINGS };

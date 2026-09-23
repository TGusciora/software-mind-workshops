import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "pizza-creator.db");

export const MAX_TOPPINGS = 5;

export function createDb(dbPath = DB_PATH) {
  const db = new Database(dbPath === ":memory:" ? ":memory:" : dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('base', 'sauce', 'cheese', 'topping')),
      unit_price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pizzas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      size TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pizza_ingredients (
      pizza_id INTEGER NOT NULL REFERENCES pizzas(id) ON DELETE CASCADE,
      ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
      PRIMARY KEY (pizza_id, ingredient_id)
    );
  `);

  const count = db.prepare("SELECT COUNT(*) AS c FROM ingredients").get().c;
  if (count === 0) {
    seedIngredients(db);
  }

  return db;
}

function seedIngredients(db) {
  const insert = db.prepare(
    "INSERT INTO ingredients (name, category, unit_price) VALUES (?, ?, ?)"
  );
  const seed = db.transaction((rows) => {
    for (const row of rows) insert.run(...row);
  });

  seed([
    ["Classic dough", "base", 3.5],
    ["Thin crust", "base", 3.0],
    ["Stuffed crust", "base", 4.5],
    ["Tomato sauce", "sauce", 1.0],
    ["BBQ sauce", "sauce", 1.25],
    ["White garlic sauce", "sauce", 1.5],
    ["Mozzarella", "cheese", 1.75],
    ["Cheddar", "cheese", 1.75],
    ["Vegan cheese", "cheese", 2.25],
    ["Pepperoni", "topping", 1.5],
    ["Mushrooms", "topping", 1.0],
    ["Onions", "topping", 0.75],
    ["Green peppers", "topping", 0.75],
    ["Black olives", "topping", 1.0],
    ["Bacon", "topping", 1.75],
    ["Jalapenos", "topping", 0.75],
  ]);
}

export default createDb;

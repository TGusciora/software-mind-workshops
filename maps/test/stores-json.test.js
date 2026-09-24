import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const RAW = readFileSync(new URL("../stores.json", import.meta.url), "utf8");
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const HOURS_RE = /^([01]\d|2[0-3]):[0-5]\d–([01]\d|2[0-3]):[0-5]\d$/;

const parse = () => JSON.parse(RAW);

test("stores.json is a valid JSON array", () => {
  const stores = parse();
  assert.ok(Array.isArray(stores), "top level must be an array");
  assert.ok(stores.length > 0, "array must not be empty");
});

test("every id is unique and kebab-case", () => {
  const ids = parse().map((s) => s.id);
  for (const id of ids) {
    assert.match(String(id), /^[a-z0-9]+(-[a-z0-9]+)*$/, `id "${id}" must be kebab-case`);
  }
  assert.equal(new Set(ids).size, ids.length, "ids must be unique");
});

test("lat is a number in [-90, 90] and lng is a number in [-180, 180]", () => {
  for (const s of parse()) {
    assert.equal(typeof s.lat, "number", `${s.id} lat must be a number`);
    assert.equal(typeof s.lng, "number", `${s.id} lng must be a number`);
    assert.ok(s.lat >= -90 && s.lat <= 90, `${s.id} lat out of range`);
    assert.ok(s.lng >= -180 && s.lng <= 180, `${s.id} lng out of range`);
  }
});

test("every entry is open and the file has no planned/franchise/phase text", () => {
  for (const s of parse()) {
    assert.equal(s.status, "open", `${s.id} must have status "open"`);
    assert.ok(!("phase" in s), `${s.id} must not have a phase field`);
  }
  assert.doesNotMatch(RAW, /planned/i);
  assert.doesNotMatch(RAW, /franchise/i);
  assert.doesNotMatch(RAW, /phase/i);
});

test("every open store has non-empty name, address, phone and 7-day hours", () => {
  for (const s of parse()) {
    for (const key of ["name", "address", "phone"]) {
      assert.equal(typeof s[key], "string", `${s.id} ${key} must be a string`);
      assert.ok(s[key].trim().length > 0, `${s.id} ${key} must not be empty`);
    }
    assert.ok(s.hours && typeof s.hours === "object", `${s.id} must have hours`);
    assert.deepEqual(Object.keys(s.hours).sort(), [...DAYS].sort(), `${s.id} hours keys`);
    for (const day of DAYS) {
      const v = s.hours[day];
      assert.ok(
        v === "closed" || HOURS_RE.test(v),
        `${s.id} hours.${day} "${v}" must be "HH:MM–HH:MM" or "closed"`,
      );
    }
  }
});

test("stores.json holds the 3 open Austin stores from the prototype", () => {
  assert.deepEqual(
    parse().map((s) => s.name),
    ["Austin – South Congress", "Austin – Ghost Kitchen", "Austin – Mueller"],
  );
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { openStores, initialView, loadStores } from "../js/stores.js";

// Mirrors the prototype pipeline: 3 open, 9 planned, 3 franchise-test.
const FIXTURE = [
  { name: "Austin – South Congress", lat: 30.25, lng: -97.7494, status: "open" },
  { name: "Austin – Ghost Kitchen", lat: 30.3072, lng: -97.756, status: "open" },
  { name: "Austin – Mueller", lat: 30.298, lng: -97.705, status: "open" },
  { name: "Dallas – Deep Ellum", lat: 32.7845, lng: -96.7837, status: "planned" },
  { name: "Dallas – Ghost Kitchen", lat: 32.814, lng: -96.848, status: "planned" },
  { name: "Houston – Montrose", lat: 29.7449, lng: -95.39, status: "planned" },
  { name: "San Antonio – Ghost Kitchen", lat: 29.4241, lng: -98.4936, status: "franchise-test" },
  { name: "Oklahoma City", lat: 35.4676, lng: -97.5164, status: "planned" },
  { name: "Phoenix", lat: 33.4484, lng: -112.074, status: "franchise-test" },
  { name: "Denver", lat: 39.7392, lng: -104.9903, status: "planned" },
  { name: "Atlanta", lat: 33.749, lng: -84.388, status: "franchise-test" },
  { name: "Nashville", lat: 36.1627, lng: -86.7816, status: "planned" },
  { name: "Chicago", lat: 41.8781, lng: -87.6298, status: "planned" },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, status: "planned" },
  { name: "New York", lat: 40.7128, lng: -74.006, status: "planned" },
];

test("fixture has 3 open, 9 planned and 3 franchise-test stores", () => {
  const count = (st) => FIXTURE.filter((s) => s.status === st).length;
  assert.equal(count("open"), 3);
  assert.equal(count("planned"), 9);
  assert.equal(count("franchise-test"), 3);
});

test("openStores returns exactly the 3 open stores (R2)", () => {
  const result = openStores(FIXTURE);
  assert.deepEqual(
    result.map((s) => s.name),
    ["Austin – South Congress", "Austin – Ghost Kitchen", "Austin – Mueller"],
  );
  assert.ok(result.every((s) => s.status === "open"));
});

test("openStores picks up a newly opened store with no code change (R1)", () => {
  const withNew = [
    ...FIXTURE,
    { name: "Austin – Domain", lat: 30.4021, lng: -97.7253, status: "open" },
  ];
  assert.equal(openStores(withNew).length, 4);
});

test("openStores picks up a store switched from planned to open (US-03)", () => {
  const switched = FIXTURE.map((s) =>
    s.name === "Dallas – Deep Ellum" ? { ...s, status: "open" } : s,
  );
  const names = openStores(switched).map((s) => s.name);
  assert.equal(names.length, 4);
  assert.ok(names.includes("Dallas – Deep Ellum"));
});

test("openStores drops open entries without numeric lat/lng", () => {
  const bad = [
    { name: "No lat", lng: -97.7, status: "open" },
    { name: "String lat", lat: "30.2", lng: -97.7, status: "open" },
    { name: "NaN lng", lat: 30.2, lng: NaN, status: "open" },
    { name: "Null lng", lat: 30.2, lng: null, status: "open" },
    { name: "Good", lat: 30.2, lng: -97.7, status: "open" },
  ];
  assert.deepEqual(openStores(bad).map((s) => s.name), ["Good"]);
});

test("openStores returns [] for non-array input", () => {
  assert.deepEqual(openStores(undefined), []);
  assert.deepEqual(openStores({}), []);
});

test("initialView encloses every open store with maxZoom 14 (R3)", () => {
  const stores = openStores(FIXTURE);
  const view = initialView(stores);
  assert.equal(view.kind, "fit");
  assert.equal(view.maxZoom, 14);
  const [[minLat, minLng], [maxLat, maxLng]] = view.bounds;
  assert.deepEqual(view.bounds, [
    [30.25, -97.7560],
    [30.3072, -97.705],
  ]);
  for (const s of stores) {
    assert.ok(s.lat >= minLat && s.lat <= maxLat, `${s.name} lat inside bounds`);
    assert.ok(s.lng >= minLng && s.lng <= maxLng, `${s.name} lng inside bounds`);
  }
});

test("initialView for a single store returns that point with maxZoom 14", () => {
  const view = initialView([{ name: "Solo", lat: 30.25, lng: -97.7494, status: "open" }]);
  assert.deepEqual(view, {
    kind: "fit",
    bounds: [
      [30.25, -97.7494],
      [30.25, -97.7494],
    ],
    maxZoom: 14,
  });
});

test("initialView for zero stores returns { kind: 'empty' }", () => {
  assert.deepEqual(initialView([]), { kind: "empty" });
  assert.deepEqual(initialView(openStores([])), { kind: "empty" });
});

// Fake fetch helpers for loadStores (R11, US-01).
const jsonResponse = (body, status = 200) => async () => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

test("loadStores returns { ok: false } when fetch rejects", async () => {
  const fetchFn = async () => {
    throw new TypeError("Failed to fetch");
  };
  assert.deepEqual(await loadStores(fetchFn), { ok: false });
});

test("loadStores returns { ok: false } for a 404", async () => {
  assert.deepEqual(await loadStores(jsonResponse("Not found", 404)), { ok: false });
});

test("loadStores returns { ok: false } for a 500", async () => {
  assert.deepEqual(await loadStores(jsonResponse([], 500)), { ok: false });
});

test("loadStores returns { ok: false } for a body that is not JSON", async () => {
  const fetchFn = async () => ({
    ok: true,
    status: 200,
    json: async () => JSON.parse("<html>oops</html>"),
  });
  assert.deepEqual(await loadStores(fetchFn), { ok: false });
});

test("loadStores returns { ok: false } for a JSON object that is not an array", async () => {
  assert.deepEqual(await loadStores(jsonResponse({ stores: FIXTURE })), { ok: false });
});

test("loadStores returns { ok: true, stores } for a valid array", async () => {
  let requested;
  const fetchFn = async (url) => {
    requested = url;
    return jsonResponse(FIXTURE)();
  };
  assert.deepEqual(await loadStores(fetchFn), { ok: true, stores: FIXTURE });
  assert.equal(requested, "stores.json");
});

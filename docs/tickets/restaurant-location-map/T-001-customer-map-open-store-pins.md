---
id: T-001
title: Customer map page shows open-store pins from maps/stores.json
source: docs/specs/restaurant-location-map.md
covers: [R1, R2, R3, US-01, US-02, US-03]
status: done
depends_on: []
size: M
---

## Context
Customers need a public map that shows every restaurant they can actually visit. This ticket creates the single data file (`maps/stores.json`) and a new customer page (`maps/index.html`). The page shows one pin per `status: "open"` store and starts zoomed to fit all of them. The existing `maps/store-locations.html` prototype stays unchanged as the internal view and keeps its own inline data.

## Scope
- **Create `maps/stores.json`.** It is a top-level JSON array of store objects.
  - **Decision (user, 2026-09-24): the public file holds open stores only.** Copy only the 3 `status: "open"` stores from the inline `STORES` array in `maps/store-locations.html` (lines 28–43). Planned and franchise-test sites must not appear anywhere under the customer page's files, because anyone can download `stores.json` and read the expansion plan.
  - Every store has `id` (unique, kebab-case), `name`, `lat`, `lng`, `status: "open"`, `address`, `phone` and `hours` in the spec's data shape (`mon`…`sun`, each `"HH:MM–HH:MM"` or `"closed"`). Do not add `phase`.
  - `openStores` still filters on `status` as a safety net, so a non-open entry added by mistake stays hidden.
  - Use sample values (555 phone numbers) until real data arrives (see INDEX Open questions).
- **Create `maps/js/stores.js`.** It is a pure ES module with no DOM and no Leaflet.
  - `openStores(stores)` returns only entries with `status === "open"` and numeric `lat`/`lng`.
  - `initialView(stores)` returns `{ kind: "empty" }` for 0 stores. Otherwise it returns `{ kind: "fit", bounds: [[minLat, minLng], [maxLat, maxLng]], maxZoom: 14 }`. The `maxZoom` cap keeps a single store at neighbourhood zoom.
- **Create `maps/js/app.js`.** It is a browser ES module.
  - It fetches `stores.json`, calls `openStores` and creates the Leaflet map with the same OSM tile URL and attribution as the prototype.
  - It adds one `L.marker` per open store. Use an `L.divIcon` of 44×44 px with `title` set to the store name, not `L.circleMarker`, so T-003 and T-008 need no rework.
  - It then calls `map.fitBounds(bounds, { maxZoom })`.
  - For `kind: "empty"`, show the text "No restaurants are open yet, check back soon" in place of the map.
- **Create `maps/index.html`.**
  - Include a viewport meta tag and load Leaflet 1.9.4 CSS and JS from cdnjs (same URLs as the prototype).
  - Add `<div id="map">` and load `<script type="module" src="js/app.js">`.
  - Give it a customer-facing heading. It has no inline store data and no "sample data", "planned" or "franchise" wording.
- **Create `maps/package.json`.** Content: `{ "name": "maps", "private": true, "type": "module", "scripts": { "test": "node --test" } }`. Do not add `dependencies` or `devDependencies`.
- **Create the tests.** Add `maps/test/stores.test.js`, `maps/test/stores-json.test.js` and `maps/test/index-html.test.js`.
- **Create `maps/README.md`.** It covers how to add a store (edit `stores.json` only), how to serve the page locally and how to run the tests.

## Acceptance criteria
- [ ] `maps/stores.json` passes `maps/test/stores-json.test.js`. That test checks:
  - the file is a valid JSON array
  - every `id` is unique
  - `lat` is a number in [-90, 90] and `lng` is a number in [-180, 180]
  - every entry has `status: "open"`, and the file contains no "planned", "franchise" or `phase` text
  - every open store has non-empty `address` and `phone`, plus `hours` with all 7 keys `mon`…`sun`
- [ ] `openStores` passes `maps/test/stores.test.js`. Given a fixture of 3 open, 9 planned and 3 franchise-test stores, it returns exactly the 3 open ones. Adding a fourth `status: "open"` store to the fixture makes it return 4, with no code change (R1, R2).
- [ ] `initialView` returns bounds that enclose every open store with `maxZoom: 14`. For a single store it returns that point's bounds with `maxZoom: 14`. For zero stores it returns `{ kind: "empty" }`. Tested in `maps/test/stores.test.js` (R3).
- [ ] `maps/test/index-html.test.js` reads `maps/index.html` as text and asserts:
  - it has a viewport meta tag
  - it references Leaflet `1.9.4` from cdnjs
  - it loads `js/app.js` as a module
  - it has no inline store array
  - it contains no "planned" or "franchise" text
- [ ] Manual check, served over HTTP (see Test plan):
  - the page shows exactly 3 pins (Austin – South Congress, Austin – Ghost Kitchen, Austin – Mueller) with all 3 visible without panning
  - drag, scroll-wheel and +/− zoom work
  - the browser console shows no errors
- [ ] `maps/store-locations.html` is unchanged in the diff.

## Test plan
- Automated: `cd maps && npm test`. This uses Node's built-in test runner (Node 18+). There is nothing to install and no new dependencies. Tests import the pure `maps/js/stores.js` module directly. They read `maps/stores.json` and `maps/index.html` as text with `node:fs`. Do not add jsdom, Playwright or any other package.
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/. It must be served over HTTP, because `file://` blocks `fetch` and ES modules. Check the pins, the fit and pan/zoom in desktop Chrome and in DevTools device mode.

## Out of scope
- Store card on pin tap (T-002).
- Error message when `stores.json` fails to load (T-005). Until then a failed fetch may leave a blank map.
- Store count (T-007), mobile/dark-theme polish (T-003), loading indicator and performance (T-006).
- Switching `store-locations.html` to read `stores.json` (T-009).
- Real store addresses, phones and hours (external input, see Open questions).
- Planned and franchise-test sites in `stores.json` (user decision 2026-09-24, see INDEX open question 2).

## Notes
- Approved 2026-09-24. Reviewer follow-ups: `stores-json.test.js` pins the 3 store names, so relax it when real stores are added; T-005 must catch the fetch rejection in `app.js`. `fitBounds` uses `padding: [24, 24]` so edge pins are not clipped.

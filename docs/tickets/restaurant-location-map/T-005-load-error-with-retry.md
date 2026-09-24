---
id: T-005
title: Show a readable error with "Try again" when stores.json fails to load
source: docs/specs/restaurant-location-map.md
covers: [R11, US-01]
status: todo
depends_on: [T-001]
size: S
---

## Context
A blank map is a dead end, and the customer leaves. R11 says a failed data load must show a readable message instead of an empty map. US-01 gives the exact wording and a "Try again" button.

## Scope
- **Update `maps/js/stores.js`.** Add `async loadStores(fetchFn = fetch, url = "stores.json")`.
  - It returns `{ ok: true, stores }` on success.
  - It returns `{ ok: false }` on any of: a network error (rejected promise), a non-2xx response, invalid JSON, or a body that is not an array.
- **Update `maps/js/app.js`.**
  - Use `loadStores`. On failure, render "We couldn't load our restaurants. Please try again." and a `<button>Try again</button>` in place of the map.
  - The button retries the load without reloading the page. On success it removes the message and renders the map as normal.
  - Create the Leaflet map only after a successful load, or make sure a retry does not initialise it twice.
- **Update `maps/index.html`.** Style the message and the button, using the theme tokens if T-003 is merged. The button's tap target is at least 44px.
- **Update `maps/test/stores.test.js`.**

## Acceptance criteria
- [ ] With a fake `fetchFn`, `loadStores` returns `{ ok: false }` for each of: a rejected promise, a 404, a 500, a body that is not JSON, and a JSON object that is not an array.
- [ ] `loadStores` returns `{ ok: true, stores }` for a valid array.
- [ ] Manual: with `stores.json` blocked (DevTools → Network → Block request URL), the page shows the exact message and a "Try again" button, and no empty map.
- [ ] Manual: unblock the request, then click "Try again". The 3 pins appear without a page reload, and the console shows no "Map container is already initialized" error.
- [ ] The "Try again" button measures at least 44×44 px at 360px width.

## Test plan
- Extend `maps/test/stores.test.js` with fake-fetch cases, then run `cd maps && npm test`.
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/ and use DevTools request blocking.

## Out of scope
- Handling failures of map tiles or the Leaflet CDN, or partial data. The stories list this as out of scope for v1.
- Automatic retries or backoff.

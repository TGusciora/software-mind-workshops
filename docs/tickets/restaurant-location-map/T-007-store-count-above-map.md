---
id: T-007
title: Show "N restaurants" above the map
source: docs/specs/restaurant-location-map.md
covers: [R9, US-06]
status: done
depends_on: [T-001]
size: S
---

## Context
A count such as "3 restaurants" tells the customer how many options they have before they explore. The count comes from the same filtered list as the pins, so it can never mention planned sites.

## Scope
- **Update `maps/js/stores.js`.** Add `countLabel(n)`, which returns `"1 restaurant"` for 1 and `"N restaurants"` otherwise.
- **Update `maps/js/app.js`.** After a successful load, render `countLabel(openStores(...).length)` in an element above the map. Pass it the same array used to create the markers. Hide the element in the empty state and in the error state (T-005, if merged).
- **Update `maps/index.html`.** Add the count element above `#map`.
- **Update `maps/test/stores.test.js`.**

## Acceptance criteria
- [ ] `countLabel(3) === "3 restaurants"` and `countLabel(1) === "1 restaurant"`.
- [ ] Manual: with the current `stores.json`, "3 restaurants" appears above the map, not "N of M stores" as in the prototype.
- [ ] Manual: set every store to non-open in a local copy of `stores.json`. The count is hidden and only the "No restaurants are open yet, check back soon" message shows.
- [ ] At 360px width the count does not cause horizontal scroll.

## Test plan
- Extend `maps/test/stores.test.js`, then run `cd maps && npm test`.
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/.

## Out of scope
- Counts per status or per city.
- A list view of stores.

## Notes (coordinator, 2026-09-24)
- Review APPROVED against base 0584557. `npm test` 54/54.
- Minor: #map height calc(100dvh - 110px) does not allow for the ~30px count line; short screens may scroll slightly vertically (suggest 140px).
- Manual browser checks pending (human).

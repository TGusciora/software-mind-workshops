---
id: T-009
title: Internal prototype store-locations.html reads maps/stores.json
source: docs/specs/restaurant-location-map.md
covers: [R1]
status: blocked
depends_on: [T-001]
size: S
---

## Context
The spec assumes the internal prototype and the customer page share one data file. Until this ticket lands, `maps/store-locations.html` keeps its own inline copy of the stores, and the two can drift. After this ticket, adding or changing a store means editing only `maps/stores.json`, for both views. This is internal-only and has no customer impact, so it comes last.

## Scope
- **Update `maps/store-locations.html`.**
  - Remove the inline `STORES` array and `fetch("stores.json")` instead.
  - Render only after the data arrives. Keep the existing status colours, the filter checkboxes, the "N of M stores" count and the popup fields (city, state, status, phase) as they are today.
- **Update `maps/README.md`.** Note that the internal view must also be served over HTTP.
- **Add `maps/test/store-locations-html.test.js`.**

## Acceptance criteria
- [ ] `maps/test/store-locations-html.test.js` reads `maps/store-locations.html` as text. It asserts there is no inline store array (no `const STORES=[`) and that `stores.json` is fetched.
- [ ] Manual: http://localhost:8000/store-locations.html shows all 15 stores. The Open, Planned and Franchise test filters and their counts match the pre-change prototype, and the count reads "15 of 15 stores".
- [ ] Manual: adding a `status: "planned"` store to a local copy of `stores.json` makes it appear in the internal view but not on `index.html`.

## Test plan
- Automated: `cd maps && npm test`.
- Manual: `python3 -m http.server 8000 --directory maps`, then compare http://localhost:8000/store-locations.html against the `main` version.

## Out of scope
- Redesigning the internal view or making it public. The spec lists the internal pipeline view as out of scope.
- Changing which fields planned stores carry.

## Notes
- **Blocked (2026-09-24).** The user decided the public `maps/stores.json` holds open stores only, so the internal view can't read its planned and franchise-test sites from it. This ticket needs a rework (e.g. a separate internal data file that isn't deployed) before it can run.

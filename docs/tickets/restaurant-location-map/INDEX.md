# Tickets: Restaurant Location Map

Source: `docs/specs/restaurant-location-map.md`. Details are refined by `docs/stories/interactive-store-map.md` where the stories don't conflict with the spec.

Execution order: dependencies first, then the clearest revenue and customer impact. T-001 and T-002 together are the first shippable slice: a customer map with open-store pins, and cards with hours and tap-to-call. T-001 to T-003 complete the spec's v1 build milestone (R1–R7).

| Order | ID | Title | Covers | Depends on | Size | Status |
|---|---|---|---|---|---|---|
| 1 | [T-001](T-001-customer-map-open-store-pins.md) | Customer map page shows open-store pins from maps/stores.json | R1, R2, R3 (US-01, US-02, US-03) | none | M | done |
| 2 | [T-002](T-002-store-card-hours-tap-to-call.md) | Tapping a pin opens a store card with address, weekly hours and tap-to-call | R4, R5, R6 (US-07, US-08, US-10) | T-001 | M | todo |
| 3 | [T-003](T-003-mobile-360px-and-dark-theme.md) | Map and store card fit a 360px phone with 44px tap targets, in light and dark theme | R7 (US-13, US-15) | T-002 | S | todo |
| 4 | [T-004](T-004-get-directions-link.md) | Store card has a "Get directions" link that opens Google Maps | R10 (US-11) | T-002 | S | todo |
| 5 | [T-005](T-005-load-error-with-retry.md) | Show a readable error with "Try again" when stores.json fails to load | R11 (US-01) | T-001 | S | todo |
| 6 | [T-006](T-006-fast-first-render-and-loading-indicator.md) | First map render under 3 s on a 4G phone, with a loading indicator | R8 (US-12) | T-001 | S | todo |
| 7 | [T-007](T-007-store-count-above-map.md) | Show "N restaurants" above the map | R9 (US-06) | T-001 | S | todo |
| 8 | [T-008](T-008-keyboard-and-screen-reader-access.md) | Pins are keyboard-focusable and the store card is readable by screen readers | R12 (US-14) | T-002 | M | todo |
| 9 | [T-009](T-009-internal-prototype-reads-stores-json.md) | Internal prototype store-locations.html reads maps/stores.json | R1 | T-001 | S | blocked |

## Planning notes
- **Test approach.** `maps/` gets a dependency-free `package.json` with `"test": "node --test"`, the same runner as `pizza-creator/server`.
  - Logic lives in pure ES modules (`maps/js/stores.js`, `maps/js/card.js`) with no DOM and no Leaflet. Tests import them directly.
  - HTML checks read files as text with `node:fs`.
  - Browser behaviour is checked manually by serving over HTTP: `python3 -m http.server 8000 --directory maps`. `file://` blocks `fetch` and ES modules.
  - No jsdom, Playwright or other packages are added.
- **Data format.** `maps/stores.json` is a top-level array of store objects in the spec's data shape. It holds open stores only (user decision 2026-09-24); planned and franchise-test sites stay in the internal prototype.
- **Out of scope per the spec, so no tickets.** Ordering, ZIP search, admin UI, live open/closed status, analytics, "near me", and the internal pipeline view.
- **Go-live.** No ticket for deployment, because the hosting target is undecided (see below).

## Open questions
1. **Real store data (go-live blocker).** Who provides the real addresses, phone numbers and hours for the 3 open Austin stores, and when? T-001 ships sample data (555 numbers, placeholder addresses), which must not go live.
2. **Resolved 2026-09-24: public `stores.json` holds open stores only.** T-001 updated; T-009 blocked pending rework. Original question: **Planned sites are public in `stores.json`.** The spec has the customer page and the internal view share one `maps/stores.json`. On a static host, anyone can download that file and read all planned and franchise-test sites (the expansion plan), even though the page never shows them (R2). Is that acceptable? If not, we need a separate public file with open stores only. That changes T-001 and T-009, and T-009 would be dropped or reworked.
3. **Where is the map hosted, and is it embedded in the main website?** No deployment ticket is planned until this is decided.
4. **Stories vs spec conflicts.** The stories were written without the spec. They ask for items the spec omits or excludes. Tickets follow the spec. Should any of these be added?
   - **Ghost-kitchen pin and label (US-04).** "Austin – Ghost Kitchen" is open and will appear as a normal restaurant, so customers may arrive expecting dine-in. Adding this needs a store `type` field.
   - **Open-now badge (US-09).** The spec lists live open/closed status as out of scope.
   - **Today's-row highlight in hours (US-08).**
   - **Pin clustering for nearby stores (US-05).**
   - **Priority mismatches.** The stories mark directions (US-11) and accessibility (US-14) as Must. The spec rates R10 as should and R12 as could. The tickets are ordered with R10 early because it drives the success metric.
5. **Resolved 2026-09-24: show the ghost kitchen like other open stores, with Call.** Original question: **Ghost kitchens and phone/walk-in pickup.** Do ghost kitchens take phone orders and walk-in pickup? If not, T-002 and T-004 must hide Call and Get directions for them. As planned, they show both.
6. **Success metric.** Should R10 be promoted to must and a directions/call analytics event be added in v1.1? What is the target number? No analytics ticket is planned because the spec puts analytics out of scope.
7. **Internal prototype migration (T-009).** Confirm that `maps/store-locations.html` should switch to the shared `stores.json`, per the spec's assumption. Also confirm that its extra fields (`city`, `state`, `phase`) may live in that file.

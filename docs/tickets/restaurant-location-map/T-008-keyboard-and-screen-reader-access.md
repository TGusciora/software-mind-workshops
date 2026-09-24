---
id: T-008
title: Pins are keyboard-focusable and the store card is readable by screen readers
source: docs/specs/restaurant-location-map.md
covers: [R12, US-14]
status: done
depends_on: [T-002]
size: M
---

## Context
Customers who can't use a touchscreen or mouse still need to find a store and call it. R12 asks for keyboard-focusable pins and a card that screen readers can read. Using `L.marker` in T-001 means Leaflet already gives pins a `tabindex`. This ticket completes the keyboard flow and the card semantics.

## Scope
- **Update `maps/js/stores.js`.** Add `markerOptions(store)`, which returns `{ keyboard: true, title: store.name, alt: store.name }`. `app.js` uses it when creating markers.
- **Update `maps/js/app.js`.**
  - Enter on a focused pin opens its card. Check Leaflet 1.9.4's default behaviour, and add a `keydown` handler on the marker element if it doesn't.
  - Esc closes the open card and returns focus to the pin that opened it.
- **Update `maps/js/card.js`.** Make `renderCard` use semantic markup:
  - the name as a heading (`<h2>`)
  - the address in `<address>`
  - hours as a `<table>` with `<th scope="row">` day cells
  - then the phone link, then the directions link if T-004 is merged
- **Update `maps/index.html`.** Add a visible `:focus-visible` outline on pins and card links that meets 3:1 contrast against the map.
- **Update the tests.** Update `maps/test/card.test.js` and `maps/test/stores.test.js`.

## Acceptance criteria
- [ ] `markerOptions` returns `keyboard: true` and the store name as `title` and `alt`. Unit test.
- [ ] `renderCard` output has an `<h2>` with the name, an `<address>` and a hours `<table>` with row headers. Elements appear in the order name → address → hours → phone (→ directions). Unit test checking index order in the HTML string.
- [ ] Manual, keyboard only:
  - Tab moves through the 3 pins one by one with a visible focus outline
  - Enter opens that pin's card
  - Esc closes the card and returns focus to the same pin
- [ ] Manual, macOS VoiceOver (Cmd+F5): focusing a pin announces the store name, and the open card is read in the order name, address, hours, phone.

## Test plan
- Extend `maps/test/card.test.js` and `maps/test/stores.test.js`, then run `cd maps && npm test`.
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/. Test with the keyboard only, then with VoiceOver in Safari or Chrome.

## Out of scope
- Announcing open-now status or ghost-kitchen type (not in the spec, see Open questions).
- A full WCAG audit of third-party Leaflet controls.

## Notes (coordinator, 2026-09-24)
- Review APPROVED (code) against base 0cc6ac0. `npm test` 56/56.
- Minor: Esc handler uses Leaflet private fields map._popup / popup._source (pinned 1.9.4); .visually-hidden lacks margin/padding/border/clip-path of the standard pattern; focus-ring 3:1 contrast unmeasured.
- Manual keyboard (Tab/Enter/Esc) and VoiceOver checks pending (human).

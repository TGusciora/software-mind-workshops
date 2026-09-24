---
id: T-003
title: Map and store card fit a 360px phone with 44px tap targets, in light and dark theme
source: docs/specs/restaurant-location-map.md
covers: [R7, US-13, US-15]
status: todo
depends_on: [T-002]
size: S
---

## Context
Most customers open the map on a phone while on the move. R7 is a must: no horizontal scroll at 360px and tap targets of at least 44px. The spec also scopes a light/dark theme for v1. This ticket is CSS plus small popup-option changes.

## Scope
- **Update `maps/index.html` (CSS).**
  - Add colour tokens as CSS custom properties (`--bg`, `--fg`, `--muted`, `--card`, `--border`), with a `@media (prefers-color-scheme: dark)` override. The prototype's palette can be reused.
  - Apply the tokens to the page and to the Leaflet popup (`.leaflet-popup-content-wrapper`, `.leaflet-popup-tip`).
  - Give the map a responsive height, no fixed widths over 360px, and `min-width`/`min-height: 44px` on `.leaflet-popup-close-button` and on card links.
- **Update `maps/js/card.js`.** Export `TAP_TARGET_PX = 44`. `app.js` uses it for the divIcon `iconSize`.
- **Update `maps/js/app.js`.** Set the popup `maxWidth` so the card fits a 360px viewport, for example `Math.min(300, window.innerWidth - 48)`.
- **Add `maps/test/theme.test.js`.**

## Acceptance criteria
- [ ] In DevTools device mode at 360×640 with a card open:
  - `document.documentElement.scrollWidth <= 360`
  - the card's close button is fully visible without scrolling
  - part of the map stays visible around the card
- [ ] In DevTools at 360×640, each of these measures at least 44×44 px: a pin, the card close button and the phone link.
- [ ] `TAP_TARGET_PX >= 44`, and `app.js` uses it for the marker icon size. Checked in `maps/test/theme.test.js` by importing `card.js` and reading `app.js` as text.
- [ ] `maps/test/theme.test.js` parses the light and dark `--fg`/`--bg` and `--fg`/`--card` hex values from `maps/index.html`. It asserts a WCAG contrast ratio of at least 4.5:1 for each pair. Use a small helper in the test file, with no packages.
- [ ] With DevTools "Emulate CSS prefers-color-scheme: dark", the page background, text and store card switch to the dark tokens. With "light", they use the light tokens.

## Test plan
- Automated: `cd maps && npm test`.
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/ in Chrome DevTools device mode at 360×640. Check the scroll width in the console, measure the elements with the inspector, and toggle the prefers-color-scheme emulation.

## Out of scope
- Dark map tiles. OSM tiles stay as they are, and only the page chrome and card are themed.
- A manual theme toggle button.
- Keyboard focus styling (T-008).

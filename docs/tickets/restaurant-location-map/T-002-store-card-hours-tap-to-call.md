---
id: T-002
title: Tapping a pin opens a store card with address, weekly hours and tap-to-call
source: docs/specs/restaurant-location-map.md
covers: [R4, R5, R6, US-07, US-08, US-10]
status: todo
depends_on: [T-001]
size: M
---

## Context
The v1 goal is to turn map visits into store visits and phone calls. The store card is where that happens. A customer taps a pin and sees the name, full address and Mon–Sun hours, and can tap the number to call. Card rendering lives in a pure module so it can be unit-tested in Node without a browser.

## Scope
- **Create `maps/js/card.js`.** It is a pure ES module with no DOM and no Leaflet. It exports:
  - `escapeHtml(s)`: escapes `& < > " '`.
  - `telHref(phone)`: `"+1-512-555-0100"` becomes `"tel:+15125550100"`. Keep a leading `+` and digits only.
  - `formatPhone(phone)`: a +1 10-digit number becomes `"(512) 555-0100"`. Any other input is returned unchanged.
  - `hoursRows(hours)`: returns 7 `{ day: "Mon" … "Sun", text }` rows in Mon→Sun order. `"closed"` in any letter case shows as `"Closed"`, and other values show as stored. It returns `null` when `hours` is missing.
  - `renderCard(store)`: returns an HTML string with the name, address, hours and phone. All store text is escaped.
- **Update `maps/js/app.js`.** Call `marker.bindPopup(renderCard(store))` for each open store. Leaflet popups already keep one card open at a time and close on the close button or a map click.
- **Update `maps/index.html`.** Add minimal CSS for the card and the hours list.
- **Add `maps/test/card.test.js`.**

## Acceptance criteria
- [ ] For the spec's sample store, `renderCard` output contains:
  - the name "Austin – South Congress"
  - the full address "1234 S Congress Ave, Austin, TX 78704"
  - 7 hours rows in order Mon, Tue, Wed, Thu, Fri, Sat, Sun
  - "11:00–23:00" on Fri and Sat
  - "Closed" on Sun

  (R4, R6)
- [ ] The phone renders as `<a href="tel:+15125550100">(512) 555-0100</a>`. A store with no `phone` produces no `tel:` link and no empty `<a>` (R5, US-10).
- [ ] A store with no `hours` renders "Hours not available, please call to check" in place of the hours rows.
- [ ] A store whose `name` is `<img src=x onerror=alert(1)>` renders it as escaped text, not markup.
- [ ] Manual check, served over HTTP:
  - tapping each of the 3 pins opens that store's card
  - tapping a second pin replaces the first card
  - the card's close button and a tap on empty map both close it
  - in DevTools device mode, or on a real phone, tapping the number triggers the dialler or `tel:` handler

## Test plan
- Add `maps/test/card.test.js` covering `telHref`, `formatPhone`, `hoursRows` and `renderCard`, including the missing-phone, missing-hours and escaping cases.
- Run `cd maps && npm test` (Node built-in runner, no new dependencies).
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/ and click through each pin.

## Out of scope
- "Get directions" link (T-004).
- 360px layout, 44px tap sizing of the card controls and dark theme (T-003).
- Screen-reader semantics and keyboard opening of cards (T-008).
- Open-now badge and today's-row highlight. The spec lists live open/closed status as out of scope (see Open questions).
- Ghost-kitchen "Pickup & delivery only" label. It is not in the spec (see Open questions).

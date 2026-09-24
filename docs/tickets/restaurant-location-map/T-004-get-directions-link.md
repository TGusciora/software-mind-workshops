---
id: T-004
title: Store card has a "Get directions" link that opens Google Maps
source: docs/specs/restaurant-location-map.md
covers: [R10, US-11]
status: done
depends_on: [T-002]
size: S
---

## Context
Directions requests are the spec's chosen success metric. A one-tap route to the store turns a map visit into a store visit. The Google Maps URL scheme needs no API key or billing, which fits the no-paid-APIs constraint.

## Scope
- **Update `maps/js/card.js`.**
  - Add `directionsUrl(store)`, which returns `https://www.google.com/maps/dir/?api=1&destination=` + `encodeURIComponent(store.address)`.
  - In `renderCard`, add `<a href="…" target="_blank" rel="noopener">Get directions</a>` after the phone.
- **Update `maps/index.html`.** Give the link the same card-link styling as the phone link, so it gets the 44px tap target from T-003 if merged. Otherwise add `min-height: 44px`.
- **Update `maps/test/card.test.js`.**

## Acceptance criteria
- [ ] `directionsUrl` for the spec's sample store returns exactly `https://www.google.com/maps/dir/?api=1&destination=1234%20S%20Congress%20Ave%2C%20Austin%2C%20TX%2078704`.
- [ ] `renderCard` output contains a "Get directions" link with that `href`, `target="_blank"` and `rel="noopener"`.
- [ ] Every open store in `maps/stores.json` gets a directions link, including Austin – Ghost Kitchen. The test loops over `openStores(stores.json)`.
- [ ] Manual, desktop: clicking "Get directions" opens Google Maps directions to the store's address in a new tab, and the map stays open in the original tab.
- [ ] Manual, phone or DevTools device mode: the link opens Google Maps with the store as destination.

## Test plan
- Extend `maps/test/card.test.js`, then run `cd maps && npm test`.
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/, open a card and click the link.

## Out of scope
- An analytics or click-tracking event. The spec puts analytics out of scope and schedules it for v1.1 (see Open questions).
- Choosing Apple Maps vs Google Maps per device.

## Notes (coordinator, 2026-09-24)
- Code in commit 60b61b0. Review APPROVED against base 1732421. `npm test` passes (45/45).
- Minor: .card-directions could share styling with the phone link.
- Manual browser checks still pending (human).

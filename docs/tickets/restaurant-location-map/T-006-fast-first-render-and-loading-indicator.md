---
id: T-006
title: First map render under 3 s on a 4G phone, with a loading indicator
source: docs/specs/restaurant-location-map.md
covers: [R8, US-12]
status: done
depends_on: [T-001]
size: S
---

## Context
A slow map on mobile data sends a hungry customer to a competitor. R8 targets first map render in under 3 s on a mid-range phone over 4G. US-12 adds a loading indicator so slow connections don't see a blank area.

## Scope
- **Update `maps/index.html`.**
  - Add `<link rel="preconnect">` for `cdnjs.cloudflare.com` and `tile.openstreetmap.org`.
  - Add `<link rel="preload" href="stores.json" as="fetch" crossorigin>`. The fetch in `app.js` must use a matching mode so the preload is reused.
  - Add no web fonts and no third-party scripts or stylesheets other than Leaflet.
- **Update `maps/js/app.js` and `maps/index.html`.** Show a loading indicator ("Loading restaurants…") in the map area from page load until pins render. Replace it with the map, the empty-state message or the T-005 error message, whichever applies.
- **Update `maps/test/index-html.test.js`.**

## Acceptance criteria
- [ ] `maps/test/index-html.test.js` asserts:
  - the only external `<script src>` is Leaflet 1.9.4 JS
  - the only external stylesheet is Leaflet 1.9.4 CSS
  - no web-font URLs are referenced
  - `stores.json` is preloaded
- [ ] Manual, DevTools with "Slow 4G" throttling: the loading indicator is visible while `stores.json` is pending and disappears once pins render.
- [ ] Manual: a Lighthouse mobile run (Chrome DevTools, default mobile preset with simulated throttling, page served locally) shows the map with pins in under 3 s. Attach the Lighthouse Speed Index / LCP numbers or a screenshot to the PR.
- [ ] DevTools Network panel shows `stores.json` requested in parallel with Leaflet, not after `leaflet.min.js` finishes.

## Test plan
- Automated: `cd maps && npm test`.
- Manual: `python3 -m http.server 8000 --directory maps`, then open http://localhost:8000/. Use DevTools Network throttling and the Lighthouse panel. Both are built into Chrome, with no extra tools.

## Out of scope
- Self-hosting Leaflet or switching tile providers.
- CDN or hosting configuration (the hosting target is undecided, see Open questions).

## Notes (coordinator, 2026-09-24)
- Review APPROVED against base 6f46bb6. `npm test` 51/51.
- Minor: tile URL uses {s}.tile.openstreetmap.org subdomains, so the tile.openstreetmap.org preconnect does not help tiles; consider dropping {s}.
- Manual checks pending (human): Slow 4G loading indicator, Lighthouse <3 s numbers for the PR, stores.json parallel with Leaflet in Network panel.

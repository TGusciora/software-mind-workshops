# Restaurant Location Map

## Summary
A public, customer-facing store locator that shows every available (open) restaurant on a map. Clicking a pin opens a card with the store's name, address, hours, and a tap-to-call phone number. v1 is a static page that extends the existing `maps/store-locations.html` prototype and ships today (2026-09-23).

## Goals & vision
- **Goal:** Make it effortless for a customer to find a nearby restaurant and contact it, turning map visits into store visits and calls that feed the $3M / 360-day revenue target.
- **Success metric:** Number of directions requests from the map. *Not measurable in v1* (no analytics and no directions button in v1 scope, see Risks); target to be set once tracking exists.
- **Long-term vision (6–12 months):** Stay a simple, fast locator. It grows with the store count (Texas metros first, then other states) but does not become an ordering hub.

## Users
- **Customers (primary):** Hungry people on phone or desktop who want to know "is there one near me, when is it open, and how do I call it?" Key needs: fast load on mobile, readable hours, one-tap call.
- **Internal team (secondary, maintainers only):** Edit a JSON file to add or update stores; no UI needed.

## Scope
### In scope (v1)
- Interactive map (pan/zoom) showing all available restaurants.
- Store card on pin click: name, address, hours, tap-to-call phone.
- Store data in a single JSON file in the repo.
- Mobile-friendly layout, light/dark theme.

### Out of scope
- Online ordering and menus.
- Address / ZIP search (geocoding).
- Admin UI for editing stores.
- Live open/closed status (static hours only).
- Analytics / click tracking (deferred, see Risks).
- "Near me" geolocation and distance-sorted list (not selected for v1).
- Internal pipeline view (planned / franchise-test sites) — the existing prototype remains the internal view.

## Requirements
| # | Requirement | Priority |
|---|---|---|
| R1 | The map loads store data from `maps/stores.json`; adding a store requires editing only that file (no code change). | must |
| R2 | Only stores with `status: "open"` are shown to customers; planned and franchise-test stores never appear. | must |
| R3 | On load, the map auto-fits to the bounds of all displayed stores. | must |
| R4 | Clicking/tapping a pin opens a card showing name, full street address, weekly hours, and phone number. | must |
| R5 | The phone number is a `tel:` link; tapping it on a phone starts a call. | must |
| R6 | Hours display per day (Mon–Sun), with "Closed" for closed days. | must |
| R7 | The page is usable at 360px width with no horizontal scroll; pins and card buttons have ≥44px tap targets. | must |
| R8 | The page reaches first map render in under 3 s on a mid-range phone over 4G. | should |
| R9 | A store count ("N restaurants") is shown above the map. | should |
| R10 | The store card includes a "Get directions" link that opens Google Maps with the store as destination. | should |
| R11 | If `stores.json` fails to load, the page shows a readable error message instead of an empty map. | should |
| R12 | Store pins are keyboard-focusable, and the card is readable by screen readers. | could |

### Data shape (`maps/stores.json`)
```json
{
  "id": "austin-south-congress",
  "name": "Austin – South Congress",
  "address": "1234 S Congress Ave, Austin, TX 78704",
  "phone": "+1-512-555-0100",
  "lat": 30.2500,
  "lng": -97.7494,
  "status": "open",
  "hours": { "mon": "11:00–22:00", "tue": "11:00–22:00", "wed": "11:00–22:00",
             "thu": "11:00–22:00", "fri": "11:00–23:00", "sat": "11:00–23:00", "sun": "closed" }
}
```

## Technology
- **Frontend:** Single static HTML page + vanilla JS — extends the existing `maps/store-locations.html`; zero build step, so it ships today.
- **Map library:** Leaflet 1.9.4 (from cdnjs) with OpenStreetMap tiles — already used in the prototype, free, no API key or billing.
- **Data:** `maps/stores.json`, version-controlled in the repo — no backend, edits go through normal PR review.
- **Hosting:** Any static host (e.g. GitHub Pages / Netlify) — free, deploys from the repo.
- **Alternatives considered:**
  - *Component inside the pizza-creator app* (React + Express/SQLite `/api/stores`): more consistent with the app, but needs a backend deploy; too slow for a same-day ship.
  - *Google Maps embed:* familiar UI, but requires API key and billing setup.

## Constraints & assumptions
- **Constraint:** Must ship today (2026-09-23); scope is deliberately minimal.
- **Constraint:** No budget for paid map APIs.
- **Assumption:** "Available restaurants" means `status: "open"` — planned sites are hidden from customers (R2). *Challenge if you want "coming soon" pins.*
- **Assumption:** Real addresses, phones, and hours exist for the currently open stores (the prototype's data is sample data and the prototype has no hours/phone fields).
- **Assumption:** OpenStreetMap's public tile server is acceptable for current traffic (its usage policy discourages heavy commercial use).
- **Assumption:** The existing `maps/store-locations.html` stays as the internal planning view; the customer map is a new page (`maps/index.html`) sharing the same data file.
- **Assumption:** Hours are in each store's local time (all Texas stores are US Central).

## Risks & open questions
- **Success metric can't be measured in v1.** Directions requests are the chosen metric, but analytics is out of scope and the directions link is only a "should" (R10). *Open question: promote R10 to "must" and add a simple analytics event in v1.1?*
- **Sample data only.** Real store addresses, phone numbers, and hours are needed before going live. *Open question: who provides them today?*
- **OSM tile policy.** If traffic grows, switch to a hosted tile provider (e.g. MapTiler, Stadia) — small change, possible cost.
- **Hosting target undecided.** *Open question: where is the public website hosted, and does the map need to be embedded in it?*
- **Stale hours.** With no admin UI and static hours, holiday closures may be wrong; mitigated by quick JSON edits.

## Milestones
| Phase | Target date | Deliverable |
|---|---|---|
| v1 build | 2026-09-23 | `maps/stores.json` + customer map page meeting R1–R7 |
| v1 go-live | 2026-09-23 | Real data for open stores, deployed to static host |
| v1.1 | 2026-10-07 | R10 (directions) + analytics event to measure the success metric |
| Ongoing | Dallas opening (Days 61–120) | Add new stores via JSON as they open |

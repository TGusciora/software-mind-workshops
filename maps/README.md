# maps

Customer-facing restaurant map (`index.html`) and the internal prototype
(`store-locations.html`, which keeps its own inline data for now).

## Add or update a store

Edit `stores.json` only. No code change is needed. Each entry looks like:

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

- `id` is unique and kebab-case.
- `status` must be `"open"`. This file is public, so add a store only once it
  is open for business. The page also hides any entry that is not `"open"`.
- `hours` has all seven keys `mon`…`sun`; each is `"HH:MM–HH:MM"` (en dash) or `"closed"`.
- The current addresses, phone numbers (555) and hours are placeholders and
  must be replaced with real data before go-live.

Run `npm test` after editing; it validates the file.

## Serve the page locally

The page uses `fetch` and ES modules, so it must be served over HTTP (`file://` will not work):

```sh
python3 -m http.server 8000 --directory maps
```

Then open http://localhost:8000/.

## Run the tests

Uses Node's built-in test runner (Node 18+). Nothing to install.

```sh
cd maps && npm test
```

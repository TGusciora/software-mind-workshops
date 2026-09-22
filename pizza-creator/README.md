# Pizza Creator

A custom pizza builder: pick a size, base, sauce, cheese, and toppings, see a running total, and save/view configurations. No checkout or payment.

## Run it

```bash
# Terminal 1 — API (SQLite-backed, http://localhost:4000)
cd server
npm install
npm start

# Terminal 2 — frontend (http://localhost:5173, proxies /api to the server)
cd client
npm install
npm run dev
```

## Test

```bash
cd server && npm test    # API + validation tests
cd client && npm test    # pizza logic unit tests
```

## Notes

- Max toppings per pizza: 5 (`MAX_TOPPINGS` in `server/db.js`).
- Size does not affect price — total price is the sum of selected ingredients' unit prices.
- Data lives in `server/pizza-creator.db` (SQLite), auto-created and seeded on first run.

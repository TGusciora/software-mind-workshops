# Online Ordering Site - Project Specification

## 1. Goal
Let customers of our Texas pizza restaurants order online for pickup and delivery. Supports the company vision: sell $3M of pizza by 2027-09-11 (about $8.3K/day average; online should be a major share).

## 2. Assumptions
- Multi-location chain in Texas (assume 10 stores; location data is configurable).
- Menu comes from `recipes/` (12 pizzas incl. Margherita, Pepperoni, Meat Lovers, Tex-Mex Chorizo, Brisket BBQ, Hatch Chile Pineapple, Family Value). Per house rule, every pizza contains pineapple; the menu and allergen info must reflect it.
- Existing `pizza-creator/` (custom builder, client + server) is reused as the "Build your own" feature.
- Payments via Stripe; delivery via own drivers plus optional third-party (DoorDash Drive).
- Texas sales tax 6.25% plus local up to 2% (per-location rate configurable).
- Launch MVP in 10 weeks; small team (2 devs, 1 designer).

## 3. Users
Customers (guest or account), store staff (accept/prepare orders), managers/admins (menu, prices, hours, reports).

## 4. Functional Requirements
### Customer
1. Choose pickup or delivery; find store by address/ZIP/geolocation; show hours and delivery zone.
2. Browse menu with photos, sizes, prices, allergens, dietary tags.
3. Customize pizzas (toppings, size, crust) and use the existing pizza creator.
4. Cart, promo codes, tip, tax and fee breakdown, scheduled orders.
5. Checkout as guest or account; cards, Apple Pay, Google Pay.
6. Order confirmation by email/SMS; live status tracking (received, baking, out for delivery, ready).
7. Account: order history, reorder, saved addresses and payment methods, loyalty points.
### Staff/Admin
1. Order dashboard with audible alerts; accept/reject, set prep time, update status.
2. Menu management per store: prices, availability (86 an item), hours, delivery zones.
3. Promotions and coupons.
4. Reports: sales by store/day/item, average ticket, conversion, progress toward $3M.
5. Role-based access (staff, manager, admin).

## 5. Non-Functional Requirements
- Mobile-first, WCAG 2.1 AA, page load under 2.5s LCP on 4G.
- 99.9% uptime during store hours; handle Friday-night and game-day peaks (10x load).
- PCI compliance via hosted payment fields (no card data stored); HTTPS, OWASP Top 10, rate limiting.
- Privacy: comply with the Texas Data Privacy and Security Act; SMS consent (TCPA).
- Observability: logs, error tracking, alerting.

## 6. Architecture
- Frontend: React/Next.js (SSR for SEO), reuse pizza-creator client.
- Backend: Node.js API (extend pizza-creator server), PostgreSQL, Redis for cart/session.
- Integrations: Stripe, Twilio, email provider, maps/geocoding, POS bridge (Toast/Square, TBD), DoorDash Drive.
- Real-time order updates via WebSockets/SSE.
- Hosting: cloud (AWS/Vercel), CI/CD via GitHub Actions, staging and production.

## 7. Data Model (core)
Store, MenuItem, Recipe/Ingredient, Order, OrderItem, Customer, Address, Payment, Promo, User(role), LoyaltyEntry.

## 8. Milestones
1. Weeks 1-2: design, menu import from recipes, store data.
2. Weeks 3-6: menu, cart, checkout, payments, confirmations.
3. Weeks 7-8: staff dashboard, POS/delivery integration.
4. Week 9: load and security testing, accessibility audit.
5. Week 10: pilot in 2 stores, then staged rollout.
6. Post-MVP: loyalty, promos, native app, upsell recommendations.

## 9. Success Metrics
- Online sales at least 35% of revenue within 6 months; $3M total by 2027-09-11.
- Checkout conversion over 60%; average order value at least $28; order error rate under 1%.

## 10. Risks and Open Questions
- POS integration complexity; choose vendor early.
- Delivery liability and driver coverage.
- Third-party fee margins vs. food cost target (30%).
- Confirm pineapple presence is clearly labeled for customers.
- Confirm store count, POS system, and brand assets with stakeholders.

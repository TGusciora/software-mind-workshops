# Texas Pizza Online Ordering Site

## Summary
A web ordering site for our Texas pizza restaurants supporting pickup and delivery, menu browsing, custom pizza building, and card payment. It is the main revenue lever toward the company goal of $3M pizza sales by 2027-09-11.

## Goals & vision
- Goal: online orders account for $1.2M (40%) of the $3M target by 2027-09-11.
- Metrics: checkout conversion, orders/week per location, repeat-order rate.
- Vision (6-12 months): loyalty program and repeat ordering across all Texas locations; POS integration.

## Users
- Local customers ordering pickup or delivery, often on mobile, wanting fast guest checkout.
- Restaurant staff who receive and fulfil orders.

## Scope
### In scope (v1)
Location selection, menu from recipes/, custom pizza builder (reuse existing pizza-creator), cart, guest checkout, card payment, pickup/delivery choice, order confirmation and status, staff order queue.
### Out of scope
Loyalty, catering, POS integration, native apps, own delivery fleet.

## Requirements
1. Must: Customer can pick a location and see its menu in under 2 clicks.
2. Must: Menu reflects recipes in recipes/ (pineapple rule applies to recipes; menu descriptions must match them).
3. Must: Customer can build a custom pizza using the existing pizza-creator.
4. Must: Guest checkout completes in 4 or fewer clicks after cart review.
5. Must: Card payment via hosted provider; no card data touches our servers.
6. Must: Texas sales tax calculated per order.
7. Must: Customer chooses pickup or delivery; delivery only within the location's zone.
8. Must: Customer gets confirmation by email/SMS and order status page.
9. Must: Staff see new orders in a queue within 10 seconds.
10. Should: Pages load in under 3 s on 4G mobile; WCAG AA.
11. Should: Analytics for conversion funnel.
12. Could: Saved accounts and reorder.

## Technology
- Frontend: Next.js + TypeScript (SEO, mobile speed).
- Backend: Node API, reusing pizza-creator API (verify its stack; assumption).
- Data: PostgreSQL (orders are relational).
- Payments: Stripe Checkout (hosted, PCI scope minimal).
- Notifications: Twilio SMS + email.
- Hosting: Vercel + managed Postgres.
- Alternatives: Shopify/Toast Online Ordering (faster, less custom-builder control, recurring fees).

## Constraints & assumptions
- Small team (2 devs), ~$2k/month budget (assumption).
- Third-party delivery partner (assumption, e.g. DoorDash Drive).
- Existing pizza-creator is reusable (assumption).
- Location list and delivery zones supplied by business.

## Risks & open questions
- 8-week MVP is tight; buy-vs-build (Toast/Square) should be reconsidered.
- Which delivery provider? Which POS do locations use?
- Number of locations and per-location hours/menus?
- Is 40% online share realistic?

## Milestones
- Weeks 1-2 (by 2026-10-07): design, locations, menu data.
- Weeks 3-5 (by 2026-10-28): cart, checkout, payments.
- Weeks 6-7 (by 2026-11-11): delivery, notifications, staff queue.
- Week 8 (by 2026-11-18): pilot at one location, launch.
- Q1 2027: roll out to all locations, start loyalty.

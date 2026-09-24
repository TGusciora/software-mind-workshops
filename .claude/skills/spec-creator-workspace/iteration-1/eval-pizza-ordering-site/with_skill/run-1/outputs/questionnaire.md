# Questionnaire (simulated; answers chosen as a plausible user)

Restated idea: Build an online ordering site for our Texas pizza restaurants. Repo context: CLAUDE.md sets vision of $3M pizza sales by 2027-09-11; recipes/ has 12 pizzas; a pizza-creator (custom builder) frontend/API already exists on this branch.
Skipped: success metric basics partly answered by CLAUDE.md ($3M), but confirmed below.

## Round 1 - Goals and vision
1. Who is the primary user? (recommended) Hungry local customers ordering delivery/pickup / Catering and group orders / Both
   ANSWER: Local customers, pickup and delivery.
2. Success metric? (recommended) Online orders drive a meaningful share of the $3M target / Number of orders / App downloads
   ANSWER: Online orders = 40% of the $3M ($1.2M) by 2027-09-11.
3. Vision 6-12 months? (recommended) Loyalty + repeat orders across all Texas locations / Franchise-ready platform / Just ordering
   ANSWER: Loyalty and repeat orders across all locations.
4. Timeline? (recommended) MVP in 8 weeks / 3 months / 6 months
   ANSWER: MVP in 8 weeks.

## Round 2 - Scope
1. v1 must-haves? (recommended) Menu, custom pizza builder, cart, card payment, pickup/delivery, order status / plus loyalty / plus catering
   ANSWER: First option; loyalty out of scope.
2. Key flows? (recommended) Guest checkout in under 4 clicks after choosing pizza / Account required
   ANSWER: Guest checkout.
3. Constraints? (recommended) Small team (2 devs), ~$2k/mo budget, Texas sales tax, PCI via hosted provider / Larger budget
   ANSWER: Small team, hosted payments, own delivery drivers not needed (third-party delivery).
4. Integrations? (recommended) Existing pizza-creator API, POS unknown / None
   ANSWER: Reuse pizza-creator; POS integration later.

## Round 3 - Technology
Proposed: Next.js/React + TypeScript frontend; Node API (reuse existing) ; PostgreSQL; Stripe checkout; Vercel + managed Postgres; Twilio SMS.
   ANSWER: Accept, but check what pizza-creator already uses (assumption).

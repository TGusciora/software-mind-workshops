# Questionnaire: Loyalty program user stories

This run was non-interactive, so AskUserQuestion was not available. Below are the questions I would have asked, in two rounds, with options as they would have appeared (my recommendation first). Because the user could not answer, I picked the recommended option each time. Every pick is an **assumption** and is listed under "Assumptions" in the stories file.

## What was already known (not asked)

From the prompt:
- Program features the user named: points per order, free pizza rewards, birthday deals.
- Audience: our Texas pizza restaurants (several locations).
- Purpose of the output: input for a later spec.

From the repo:
- `CLAUDE.md`: the goal is $3M in pizza sales by 2027-09-11. Where a choice exists, pick the one with clearer revenue impact.
- `plans/30-day-plan.md`, week 3 (2026-09-30 to 2026-10-06): "Launch a loyalty program: every 10th pizza is free, and collect phone numbers for SMS promos." KPI: **1,500 loyalty sign-ups by day 30 (2026-10-16)**. Average ticket target: $24+.
- `plans/180-day-plan.md`: move delivery orders to our own online ordering (30% by day 60, 50% by day 180), because the delivery apps take large fees. Multiple metros and units are planned.
- `recipes/`: 14" menu pizzas cost $15 to $24. The family 16" pizza costs $22.
- No `docs/stories/` folder exists yet, so this is a new stories file. `pizza-creator/` has no checkout, so it is not the ordering system.

---

## Round 1: who and why

### Q1. Who uses the loyalty program? (multiSelect)
Header: Personas
- **Customer + cashier + store manager + owner (Recommended)**: customers join, earn and redeem. Cashiers look members up at the counter. Store managers fix disputes. The owner tracks results.
- Customer + owner only: online-only program with no in-store staff role.
- Customer + cashier only: no reporting or admin in v1.
- Customer + cashier + marketing manager + owner: a separate marketing role that runs SMS campaigns.

**Picked:** Customer + cashier + store manager + owner.
Why: the repo describes counter sales and several units, so someone at the counter has to find members, and someone in each store has to fix a missed or wrong point balance. The owner has to track the 1,500 sign-up KPI.

### Q2. What is the single most important outcome for v1?
Header: Core goal
- **More repeat orders from the same customers (Recommended)**: members order more often, which adds directly to monthly revenue.
- Move orders from DoorDash, Uber Eats and Grubhub to our own ordering: better margin on each order.
- Build an SMS contact list for promos: reach customers for game-day deals.
- Raise the average ticket: members spend more on each order.

**Picked:** More repeat orders.
Why: of the four, it has the clearest link to the $3M revenue target. The second option is a secondary goal, handled through the choice of earning channels in Q4.

### Q3. Besides points, free pizza and birthday deals, what else is in v1? (multiSelect)
Header: v1 scope
- **Counter lookup for staff, so in-store orders earn and redeem (Recommended)**
- **Owner dashboard: sign-ups, points, redemptions (Recommended)**
- **SMS marketing opt-in at sign-up (Recommended)**
- Tiers or status levels (for example Silver and Gold)

**Picked:** Counter lookup, owner dashboard, SMS opt-in. Tiers are out.
Why: the 30-day plan asks for phone numbers and SMS promos, and the 1,500 sign-up KPI needs a place to be measured. Tiers would add a lot of rules without helping hit the launch date.

### Q4. Which orders earn and redeem points?
Header: Channels
- **Our own online ordering + in-store (counter and phone orders) (Recommended)**: this gives customers a reason to skip the delivery apps.
- Our own online ordering only: simplest, but loses walk-in customers.
- All channels, including DoorDash, Uber Eats and Grubhub: most coverage, but needs integration with each app and rewards orders where we pay high fees.
- In-store only: no online changes, but works against the own-channel goal.

**Picked:** Own online ordering + in-store.
Why: it supports the 180-day plan's goal of 30-50% own-channel share and avoids integrating with the delivery apps.

---

## Round 2: targeted follow-ups

### Q5. How are points earned, and what does a free pizza cost?
Header: Points rule
- **1 point per $1 spent (food subtotal before tax, tip and fees). 200 points = one free 14" menu pizza (Recommended)**: this rewards bigger orders and supports the $24+ ticket target. It is about 10-12% back at menu price and about 2.5% at food cost.
- 1 point per pizza, 10 points = free pizza: matches the "every 10th pizza free" line in the 30-day plan. Simple, but it rewards cheap orders as much as big ones.
- Flat 10 points per order, 100 points = free pizza: rewards visits, not spend.
- 1 point per $1, 100 points = free pizza: more generous, so rewards come faster but cost twice as much.

**Picked:** 1 point per $1, 200 points = free 14" menu pizza.
Why: it is the revenue-aligned version of "every 10th pizza free". About 10 average orders ($20) earn one pizza.

### Q6. What is the birthday deal?
Header: Birthday deal
- **Free 14" cheese or one-topping pizza with any paid order, valid from 7 days before to 7 days after the birthday (Recommended)**: brings the customer back for a full-price order.
- Double points for the whole birthday month.
- 20% off one order during the birthday month.
- Free pizza with no purchase needed.

**Picked:** Free 14" cheese or one-topping pizza with any paid order, valid ±7 days.
Why: "with a paid order" makes the birthday a revenue visit, not only a cost. The 15-day window is easy to explain.

### Q7. How do customers identify themselves?
Header: Sign-in
- **Phone number + one-time SMS code. Name required, birthday (month and day only) optional (Recommended)**: no password, and it matches the 30-day plan's phone-number collection.
- Email + password account.
- Phone number only, no verification: fastest, but anyone could redeem someone else's points.
- Social login (Google or Apple).

**Picked:** Phone + SMS code, name required, birthday month and day optional.
Why: no password to forget. The code protects redemptions, and not storing the birth year avoids collecting age data.

### Q8. What must work on launch day, given the launch week of 2026-09-30?
Header: Launch priority
- **Join, earn and free-pizza redemption (online and in-store) are Must. Birthday deal and owner dashboard are Should and follow within 2 weeks (Recommended)**
- Everything the user named (points, free pizza, birthday) is Must at launch.
- Online only at launch, with in-store to follow.
- Birthday deal first (easy marketing hook), with points to follow.

**Picked:** Join + earn + redeem are Must. Birthday and dashboard are Should.
Why: the launch is one week away (per the 30-day plan), and a program without earning or redemption does not work. The birthday deal is a nice hook, but no one has a birthday reward to use until 30 days after joining anyway (see the birthday assumption).

---

## Defaults chosen without asking (not story-changing enough to use a question slot)
- Points expire after 12 months with no earning or redemption activity, with an SMS warning 30 days before.
- Cancelled or refunded orders take back the points they earned. A cancelled order that used a reward gets the reward points back.
- One reward per order. Reward pizzas earn no points and do not combine with other discounts on the same pizza.
- Catering orders do not earn points in v1.
- A birthday must be on the account at least 30 days before the birthday to unlock that year's reward.
- Members must confirm they are 13 or older when joining.

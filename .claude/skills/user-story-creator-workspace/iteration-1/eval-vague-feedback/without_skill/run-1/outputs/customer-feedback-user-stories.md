# Customer Feedback Loop: User Stories

> Status: draft, built on assumptions (see `questionnaire.md`). Date: 2026-09-23.
> This document is the input for a later spec in `docs/specs/`.

## 1. What this is and why it matters

We will collect a quick rating from customers after each order. The loop then works like this:
- Unhappy customers get a fast personal follow-up to win them back.
- Happy customers are asked for a public Google review.
- Managers see ratings by store, pizza, and channel, so they can fix problems before those problems spread to new units.

**Link to the $3M vision.** The plans have us growing from 1–3 units to 7 units in 3 metros within 180 days, at ~450 pizzas/day. At that pace, quality problems spread quietly. Each lost regular costs roughly $25 × several orders a month. Feedback earns money in three ways:
1. **Retention.** We win back unhappy customers before they leave. Repeat orders are the cheapest revenue we have.
2. **Discovery.** More and better Google reviews bring in local search traffic. This supports the Week 3 demand work in `plans/30-day-plan.md`.
3. **Menu and operations decisions.** Per-pizza and per-store ratings give data to the "double down on the best, cut the weakest" review and to each new-unit exit gate.

## 2. Personas

| Persona | Who they are | What they care about |
|---|---|---|
| **Maria, family orderer** | Orders 2–3 pizzas on Friday nights through our online ordering and is a loyalty member. Uses her phone for everything. | Food arrives hot and correct. If something goes wrong, she wants it fixed without a fight. She won't fill in long surveys. |
| **Jake, walk-in / pickup regular** | Picks up at the counter on game days and gave his phone number for loyalty points. | Speed. He'll give feedback only if it takes one tap. |
| **Dana, catering contact** | Office manager who orders 10–20 pizzas for a standing weekly lunch. | Reliability and on-time delivery for her team. She needs to hear back quickly when something goes wrong. |
| **Luis, store manager** | Runs one unit and owns its service quality and daily numbers. | Hears about problems during the shift, can make them right, and can see his store's trend. |
| **Priya, owner / ops lead** | Runs all units and takes the weekly KPI review. | Compares stores, spots failing units or recipes, and ties feedback to revenue. |
| **Sam, marketing lead** | Runs the Google Business profiles, social media, and loyalty SMS. | Review volume and star average per store, and good quotes for marketing (with permission). |

## 3. Epics

| ID | Epic | Goal | Priority |
|---|---|---|---|
| E1 | Collect feedback after an order | Get a fast, mobile-friendly rating from as many customers as possible | Must |
| E2 | Service recovery for unhappy customers | Turn 1–2 star experiences into saved customers | Must |
| E3 | Public review prompts | Grow Google review count and rating per store | Should |
| E4 | Feedback insights and reporting | Let managers and ops act on trends by store, pizza, and channel | Must (basic) / Should (advanced) |
| E5 | Catering account feedback | Keep high-value standing accounts | Should |
| E6 | Consent, privacy, and admin | Stay compliant and keep the system configurable across units | Must |

## 4. User stories

Priority uses MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't (this release).

### E1: Collect feedback after an order

**US-1.1: Receive a feedback request after my order (M)**
As **Maria**, I want to get a short text after my order arrives, so that I can tell the store how it went while it's fresh.
- *Given* an order placed through our own online ordering by a customer who opted in to SMS, *when* the order is marked delivered or picked up, *then* the customer gets one SMS with a feedback link 45–90 minutes later (configurable).
- *Given* a customer who has not opted in to SMS but has an email address, *when* the same trigger happens, *then* they get the request by email.
- *Given* a customer who got a feedback request in the last 7 days, *when* they place another order, *then* no new request is sent (frequency cap, configurable).
- *Given* an order was cancelled or refunded before completion, *when* the trigger would fire, *then* no request is sent.

**US-1.2: Rate my order in one tap (M)**
As **Jake**, I want to give a star rating straight from the link without logging in, so that giving feedback takes seconds.
- *Given* I open the feedback link on my phone, *when* the page loads, *then* I see the store name, order date, and a 1–5 star control with no login required.
- *Given* I tap a star rating, *when* I do nothing else, *then* the rating is already saved and I see a thank-you screen, with optional follow-up questions below it.
- *Given* the link is older than 7 days or has already been used, *when* I open it, *then* I see a friendly "this link has expired" message and cannot submit again.
- The page loads in under 2 seconds on 4G, and the rating flow meets WCAG 2.1 AA (large tap targets, screen-reader labels).

**US-1.3: Tell you what went wrong or right (M)**
As **Maria**, I want to pick quick reasons and add an optional comment, so that the store knows exactly what to fix.
- *Given* I gave 1–3 stars, *when* the follow-up shows, *then* I can pick tags such as *Late*, *Cold*, *Wrong / missing item*, *Taste*, *Rude service*, *Other*.
- *Given* I gave 4–5 stars, *when* the follow-up shows, *then* I can pick tags such as *Hot & fresh*, *Great taste*, *Fast*, *Friendly staff*.
- *Given* I type a comment, *when* I submit, *then* it is saved with the rating. Comments are limited to 500 characters.

**US-1.4: Rate each pizza I ordered (S)**
As **Maria**, I want to thumbs-up or thumbs-down each pizza in my order, so that the kitchen knows which recipe missed.
- *Given* my order had several menu items, *when* I reach the follow-up, *then* I see each item by recipe name with a thumbs up/down option, and each is optional.
- *Given* I rate an item, *when* the result is saved, *then* it is linked to the recipe ID in `recipes/` (for example `brisket-bbq-pizza`), so we can report on it.

**US-1.5: Tag feedback with order context (M)** *(system story)*
As **Priya**, I want every feedback record to carry its store, channel, order time, order value, and items, so that we can slice results without manual matching.
- *Given* a feedback submission, *when* it is stored, *then* it includes order ID, store ID, channel (web / phone / walk-in / catering), daypart, order total, and item list.
- *Given* an order is later edited or refunded, *when* reports run, *then* the feedback still points to the original order.

### E2: Service recovery for unhappy customers

**US-2.1: Alert the store manager about a bad rating (M)**
As **Luis**, I want to be alerted right away when a customer rates my store 1–2 stars, so that I can fix it the same day.
- *Given* a 1–2 star rating for my store, *when* it is submitted, *then* I get an alert within 5 minutes by SMS and in the feedback inbox. The alert shows the customer's first name, order details, tags, and comment.
- *Given* an alert has not been acknowledged within 2 hours during opening hours, *when* the timer runs out, *then* it escalates to the ops lead.

**US-2.2: Resolve a complaint with a make-good (M)**
As **Luis**, I want to contact the customer and give a credit or coupon from the alert, so that I can win them back without extra steps.
- *Given* an open complaint, *when* I choose "Resolve", *then* I can record the contact method (call / SMS), what happened, and optionally issue a make-good up to a set limit (default $20 or one free pizza).
- *Given* I issue a make-good, *when* it is saved, *then* the customer gets a code they can use on their next online order, and the cost is recorded against my store.
- *Given* a make-good above my limit, *when* I try to issue it, *then* ops lead approval is required.

**US-2.3: Know that someone heard me (S)**
As **Maria**, I want an automatic reply when I leave a bad rating, so that I know it wasn't ignored.
- *Given* I rated 1–2 stars, *when* I submit, *then* the thank-you screen says the store manager will contact me within 24 hours, and I can choose call or text.

**US-2.4: Track complaint response time (S)**
As **Priya**, I want to see how fast each store handles bad ratings, so that I can hold managers accountable.
- *Given* the reporting view, *when* I filter by store and date range, *then* I see the count of 1–2 star ratings, the % contacted within 24h, median time to first contact, and total make-good cost.

### E3: Public review prompts

**US-3.1: Invite happy customers to post a Google review (S)**
As **Sam**, I want customers who had a good experience to get an easy link to review that store on Google, so that our local rating and review count grow.
- *Given* a customer finishes the feedback flow, *when* the thank-you screen shows, *then* it includes a link to the Google review page for **the specific store** that made the order.
- The prompt must follow Google's review policies (see open question Q1). By default, the review link is **shown to all respondents**, with more emphasis for 4–5 stars. It is not hidden from unhappy customers.
- *Given* a customer taps the review link, *when* this happens, *then* the click is logged so we can measure the conversion rate from feedback to review.

**US-3.2: Use great quotes in marketing, with permission (C)**
As **Sam**, I want to find 5-star comments whose authors agreed to be quoted, so that I can use real customer words in social posts.
- *Given* a 5-star comment, *when* the customer ticks "OK to share my comment (first name only)", *then* the comment shows up in a "shareable quotes" list.
- Comments without that consent never appear in the list.

### E4: Feedback insights and reporting

**US-4.1: See my store's feedback at a glance (M)**
As **Luis**, I want a simple view of my store's recent ratings and comments, so that I can talk about them at the pre-shift huddle.
- *Given* I log in as a store manager, *when* I open the feedback view, *then* I see only my store's feedback: average rating (7 and 30 days), response count, top tags, and the latest comments.

**US-4.2: Compare stores, channels, and dayparts (M)**
As **Priya**, I want to compare average rating and top complaint tags across stores, channels, and dayparts, so that I can see where operations are failing.
- *Given* the ops view, *when* I pick a date range, *then* I see a table of stores with response count, average rating, % of 1–2 star ratings, top 3 tags, and trend compared with the previous period.
- *Given* a store's 7-day average drops below 4.0 **or** falls 0.3 or more below its 30-day average, *when* this happens, *then* I get an alert.

**US-4.3: See how each pizza on the menu is rated (S)**
As **Priya**, I want a thumbs-up % for each recipe, so that the monthly menu review ("cut the weakest") uses customer data as well as sales.
- *Given* per-item ratings exist (US-1.4), *when* I open the menu report, *then* each recipe shows its rating count, thumbs-up %, top negative tags, and units sold in the same period.
- Recipes with fewer than 30 ratings are marked "not enough data".

**US-4.4: Include feedback in the weekly KPI review (S)**
As **Priya**, I want feedback metrics in the weekly KPI export, so that they sit next to revenue, pizzas per day, and food cost %.
- *Given* the weekly KPI review, *when* I export, *then* the export includes response rate, average rating, % of complaints resolved within 24h, and new Google reviews, per store.

**US-4.5: Link feedback to repeat orders (C)**
As **Priya**, I want to see whether customers who got a make-good order again, so that I know recovery pays for itself.
- *Given* customers with a resolved complaint, *when* I view the recovery report, *then* I see their 30/60-day repeat order rate and revenue next to the rate for 3-star and 4–5 star customers.

**US-4.6: Pull in delivery-app ratings (C)**
As **Priya**, I want DoorDash, Uber Eats, and Grubhub ratings to appear next to our own feedback, so that I see the full picture for each store.
- *Given* app ratings are available through export or API, *when* they are imported, *then* they appear in the store view labelled by source. They are not mixed into the own-channel average.

### E5: Catering account feedback

**US-5.1: Check in after each catering order (S)**
As **Dana**, I want a short check-in after each catering delivery, so that problems with my team's lunch get fixed before next week.
- *Given* a catering order is delivered, *when* 2 hours have passed, *then* the account contact gets a feedback request with the same rating flow plus an "on time?" yes/no question.
- *Given* a catering account rates 1–3 stars, *when* they submit, *then* the store manager **and** the assigned catering sales rep are both alerted.

**US-5.2: Watch the health of catering accounts (C)**
As **Priya**, I want a health flag on each catering account based on recent feedback, so that the sales reps step in before we lose a standing order.
- *Given* an account's last 3 ratings average below 4, *when* the report runs, *then* the account is flagged "at risk" and the rep gets a task.

### E6: Consent, privacy, and admin

**US-6.1: Only message customers who agreed (M)**
As **Maria**, I want texts only if I opted in, and an easy way to stop them, so that I'm not spammed.
- *Given* a customer without SMS consent, *when* a feedback trigger fires, *then* no SMS is sent.
- *Given* a customer replies STOP, *when* the reply is received, *then* they are opted out of all SMS right away, and the opt-out is recorded with a timestamp.

**US-6.2: Protect customer data (M)**
As **Priya**, I want feedback that includes personal data to be visible only to authorized staff, so that we protect customers and stay compliant.
- Store managers see only their own store's feedback. Ops and marketing see all stores.
- Customer phone and email are masked in reports and fully visible only inside an open complaint.
- Customers can ask for their feedback and personal data to be deleted, and this is done within 30 days.

**US-6.3: Configure the feedback program (S)**
As **Priya**, I want to set send delays, frequency caps, tags, the alert threshold, make-good limits, and each store's Google review link, so that we can adjust the program without a developer.
- *Given* I change a setting, *when* I save, *then* it applies to new orders only, and the change is logged with who changed it and when.
- *Given* a new store opens, *when* I add it, *then* I can set its manager, alert contacts, and Google review link before its first order.

**US-6.4: Rate a custom Pizza Creator pizza (W, for now)**
As a customer who built a custom pizza, I want to rate it, so that popular combinations can become menu items.
- Deferred because `pizza-creator/` has no checkout yet. Revisit once custom pizzas can be ordered.

## 5. Proposed release slices

| Slice | Stories | Outcome |
|---|---|---|
| **MVP (≈4 weeks, before the holiday push)** | US-1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 4.1, 4.2, 6.1, 6.2 | Ratings are collected, bad ratings are recovered, and each store has a basic view |
| **Release 2** | US-1.4, 2.3, 2.4, 3.1, 4.3, 4.4, 5.1, 6.3 | Per-pizza data, Google review growth, catering coverage, and feedback in the KPI review |
| **Later** | US-3.2, 4.5, 4.6, 5.2, 6.4 | Proof of recovery ROI, full-channel view, and Pizza Creator ratings |

## 6. Success metrics

| Metric | Target (90 days after MVP) |
|---|---|
| Feedback response rate (requests sent → rating) | ≥ 15% |
| Average rating, own channels | ≥ 4.3 / 5 |
| 1–2 star ratings contacted within 24h | ≥ 90% |
| Repeat rate within 60 days, recovered customers | ≥ repeat rate of 3-star customers |
| New Google reviews per store per month | +50 |
| Make-good cost as % of store revenue | ≤ 0.5% |

## 7. Out of scope (this release)

- Surveying delivery-app customers directly. We don't own that contact.
- Long NPS or market-research surveys.
- Answering Google reviews from inside the tool.
- AI sentiment analysis of comments. Tags cover v1; revisit once volume is high.
- Staff or employee feedback.

## 8. Dependencies and risks

- **Own online ordering must be live** and expose order status (delivered / picked up), items, and store. This is from Week 2 of the 30-day plan.
- **Loyalty program phone capture with SMS consent.** From Week 3 of the 30-day plan.
- **An SMS provider** with STOP handling and a registered business sender (A2P 10DLC in the US).
- **Make-good codes** need support in the ordering system's coupon feature.
- **Risk: survey fatigue.** Mitigated by the frequency cap and a one-tap design.
- **Risk: managers ignore alerts.** Mitigated by escalation (US-2.1) and response-time reporting (US-2.4).

## 9. Open questions for the team

1. **Google review policy.** Google does not allow "review gating", meaning asking only happy customers for reviews. Can we confirm that showing the review link to everyone, with more emphasis for 4–5 stars, is acceptable, or should we show it the same way to all?
2. Should walk-in customers without a loyalty profile get a feedback QR code on the receipt or box?
3. Who pays for make-goods: the store's P&L or a central marketing budget?
4. Should per-pizza ratings (US-1.4) be in the MVP, given the "cut the weakest" menu review in Week 4 of the 30-day plan?
5. Do franchise or licensed units (Phase 4 of the 180-day plan) use the same program and share data with us?

# Questionnaire: customer feedback (user-story-creator)

**Prompt:** "break down a customer feedback thing for us"

**My restatement:** Build a way for our pizza customers to tell us how an order went (rating + comment), and for store managers and the owner to act on it: recover unhappy customers before they stop ordering, and learn which stores and pizzas to fix or double down on. This supports the $3M / 360-day revenue goal in CLAUDE.md.

**Already known from the repo (not asked):**
- Business goal: $3M in pizza sales by 2027-09-11 (CLAUDE.md), so "so that" clauses point at repeat orders and revenue.
- Channels: own online ordering, in-store, plus DoorDash / Uber Eats / Grubhub (`plans/30-day-plan.md`). We do not own customer contact details for delivery-app orders.
- A loyalty program collects phone numbers for SMS promos (`plans/30-day-plan.md`, week 3).
- Multiple stores across Texas metros (`plans/180-day-plan.md`, `docs/specs/restaurant-location-map.md`), so feedback must be per store.
- Week 4 of the 30-day plan asks to "double down on the best product and cut the weakest", so per-pizza feedback is useful to the owner.
- Nothing about feedback exists yet in the repo; there is no `docs/stories/` folder, so this is a new stories file.

The user was not available (non-interactive test run). Every question below is what I would have asked with AskUserQuestion. The chosen answer is my recommendation and is recorded as an **assumption** in the stories file.

---

## Round 1: who and why

### Q1. Who uses the feedback feature? (multiSelect)
1. **Customer + store manager + owner/ops lead (Recommended)**: customers give feedback, managers handle their store's issues, the owner sees trends across stores.
2. Customer + owner only: the owner handles every complaint personally.
3. Customer + store manager + menu/recipe lead: adds a separate role that reads per-pizza feedback.
4. Catering account contacts as a separate persona: corporate/standing-order clients with their own feedback flow.

**Chosen (assumption):** Option 1. Menu decisions go to the owner for now; catering feedback is out of scope for v1.

### Q2. What is the single most important outcome for v1?
1. **Win back unhappy customers fast so they order again (Recommended)**: repeat orders feed revenue most directly.
2. Learn which pizzas and stores to fix, keep or cut.
3. Grow our public star rating on Google.
4. Track a satisfaction KPI across units for the weekly review.

**Chosen (assumption):** Option 1. Options 2 and 3 are included as Should epics.

### Q3. Which capability areas are in v1? (multiSelect)
1. **Collect a rating + comment after an order (Recommended)**
2. **Alert managers about low ratings and let them recover the customer (Recommended)**
3. **Owner insights: ratings by store and by pizza (Recommended)**
4. **Invite customers to post a public Google review (Recommended)**

**Chosen (assumption):** All four. Collection and recovery are Must; insights and review invites are Should.

### Q4. How does feedback reach us in v1? (the constraint that changes the stories most)
1. **SMS link after own-channel orders, plus a QR code on the box/receipt for every order including delivery apps (Recommended)**: SMS gives the best response rate for customers we can reach; the QR code covers delivery-app orders where we have no contact details.
2. SMS link only: simpler, but misses all delivery-app customers.
3. QR code only: no consent/opt-out work, but low response rates.
4. Email after order.

**Chosen (assumption):** Option 1.

---

## Round 2: targeted follow-ups

### Q5. Can a customer leave feedback without giving contact details?
1. **Yes, contact details are optional; they give them only if they want a follow-up (Recommended)**: more responses, and consent to contact is explicit.
2. No, feedback must be tied to a known order or phone number.
3. Anonymous only; we never follow up.

**Chosen (assumption):** Option 1.

### Q6. What happens when a customer gives a low rating (1-2 stars)?
1. **The store manager is alerted within 5 minutes, must resolve within 24 hours, and can issue a make-good credit up to $25; if nobody acknowledges within 2 hours it escalates to the owner (Recommended)**
2. An automatic coupon is sent with no human involved.
3. Alert only; no compensation in v1.

**Chosen (assumption):** Option 1. The $25 cap is an open question for the owner.

### Q7. How do we invite customers to post a public review?
1. **Show the Google review invitation to every respondent after they submit, whatever their rating (Recommended)**: avoids "review gating" (only inviting happy customers), which Google's policy and the FTC consumer-review rules treat as a problem.
2. Invite only customers who gave 4-5 stars.
3. Leave public reviews out of v1.

**Chosen (assumption):** Option 1, priority Should.

### Q8. Which non-functional needs matter most to customers? (multiSelect)
1. **Form finishes in under 30 seconds on a phone and is accessible (Recommended)**
2. **English and Spanish (Recommended)**: a large share of Texas customers prefer Spanish.
3. **SMS opt-out and limited access to customer contact details (Recommended)**
4. Offline support for the in-store QR form.

**Chosen (assumption):** Options 1, 2 and 3. Offline support is out of scope.

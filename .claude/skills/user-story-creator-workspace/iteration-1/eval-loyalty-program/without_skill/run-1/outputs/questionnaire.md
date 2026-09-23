# Loyalty Program: Open Questions and Assumed Answers

The user was not available, so I answered each question myself to keep going. I based the answers on what is in the repo:
- `CLAUDE.md`: the goal is $3M in sales by 2027-09-11.
- `plans/30-day-plan.md`: "every 10th pizza is free, collect phone numbers for SMS promos", and a target of 1,500 loyalty sign-ups by day 30.
- `plans/180-day-plan.md`: grow to 3 metros and 7 units, move delivery orders to our own channel, and test franchising.
- `recipes/`: 14" pizzas cost $15–$24 and food cost is 30% or less.

**Please confirm or correct each answer before we write the spec.** If an answer changes, the stories it affects are listed after it.

---

## A. Program economics

**Q1. How do members earn points: per dollar, per pizza, or per order?**
*Assumed:* **1 point per $1** of eligible subtotal, after discounts and before tax, tip, delivery fees and gift-card purchases. We round down per order.
*Why:* A per-dollar rate rewards bigger tickets, which the plans push for ($24+ average ticket, family bundles). A per-pizza rate would reward splitting orders. The 30-day plan's "every 10th pizza free" is kept as the customer-facing message (Q2).
*Affects:* EARN-01, EARN-02.

**Q2. What does the free-pizza reward cost in points, and what can it be spent on?**
*Assumed:* **200 points = one free 14" menu pizza** (any recipe in `recipes/`, up to $24 menu value). No 16" pizzas, no custom Pizza Creator builds, and no substitutions that add cost.
*Why:* At a ~$20 average pizza price, 200 points is about 10 pizzas, which matches "every 10th pizza free". That is about a 10% reward rate for the customer. At our 30%-or-less food cost it costs us only about 2–3% of loyalty revenue.
*Affects:* REDEEM-01, REDEEM-02.

**Q3. Is there more than one reward tier (e.g. a free side at 75 points)?**
*Assumed:* **Not in v1.** We launch with one reward, the free pizza, to keep it simple for staff and customers. A reward catalog is a "Could".
*Affects:* ADMIN-03.

**Q4. Do points expire?**
*Assumed:* **Yes. Points expire after 12 months with no earning or redeeming activity.** Members get a warning 30 days before. Earned rewards (vouchers) expire 60 days after they are issued.
*Why:* This caps our liability on the books and brings lapsed customers back. We need to check with legal (Q17).
*Affects:* MEMBER-04, ADMIN-05.

**Q5. What is the birthday deal?**
*Assumed:* **A free 10" personal pizza, or $10 off an order of $20 or more.** The member picks one. It can be used from 7 days before to 7 days after their birthday, once a year. It is issued only if the birthday was on file at least 30 days before (to stop abuse), or if the member joined at least 30 days earlier.
*Affects:* BDAY-01 … BDAY-04.

**Q6. Should we give a sign-up bonus?**
*Assumed:* **Yes. 50 bonus points on the first eligible order after sign-up.** It helps us reach 1,500 sign-ups by day 30.
*Affects:* ENROLL-04.

**Q7. Do we want member tiers (Silver/Gold)?**
*Assumed:* **Not in v1** (a "Won't, this release"). We can look at it again after 90 days of data.

## B. Channels and scope

**Q8. Which order channels earn and redeem points?**
*Assumed:*
- **In-store / counter (POS):** earn and redeem.
- **Our own online ordering (web/app):** earn and redeem.
- **Phone orders:** earn and redeem through the POS, using the member's phone number.
- **DoorDash / Uber Eats / Grubhub:** **no earning or redeeming**. We can't reliably identify the customer there. Also, only rewarding our own channel supports the plan to move delivery orders to it (30% → 50%).
- **Catering / corporate accounts:** **no earning in v1.** Big tickets would inflate points. A separate B2B incentive can come later.
*Affects:* EARN-03, EARN-04, OPS-01.

**Q9. Is the program the same at every location, including future franchises?**
*Assumed:* **Yes. One statewide program.** Points earned in any company-owned unit can be used in any other. Franchise units are expected to join later. The design must let a unit be included or excluded, and must track which unit pays for each redemption.
*Affects:* ADMIN-04, REPORT-03.

**Q10. How does a member identify themselves?**
*Assumed:* **The phone number is the main ID** (as the 30-day plan says). Email is optional. We don't use a physical card. We also want an app/web QR code (a "Should").
*Affects:* ENROLL-01, OPS-01.

**Q11. Do we need a native mobile app?**
*Assumed:* **No for v1.** It will be a mobile-friendly web experience that is part of our own online ordering, plus SMS. A native app can come later.

**Q12. Which POS and online ordering platforms do we use?**
*Assumed:* **Unknown.** The stories don't depend on any vendor. The spec phase must decide whether we build this ourselves or buy a loyalty module for our POS (Toast, Square and others have them). This is the biggest decision that affects cost and time.

## C. Marketing and communication

**Q13. Which channels do we use to talk to members?**
*Assumed:* **SMS is the main channel. Email is second.** Both need a separate opt-in. Transactional messages go only to members who agreed to them. These are: points earned, reward ready, birthday deal ready, and points expiring soon.
*Affects:* MEMBER-03, PRIV-02.

**Q14. Should the loyalty program tie into game-day and seasonal promotions?**
*Assumed:* **Yes, as a "Should".** Marketing can set up time-boxed bonus-point campaigns, like "2x points on Friday-night football" or "Super Bowl Sunday", for chosen units, days and menu items.
*Affects:* ADMIN-02.

**Q15. Should we have referrals ("give 50, get 50")?**
*Assumed:* **"Could" priority.** It's not needed to launch.

## D. Compliance, fraud and operations

**Q16. What is the minimum member age?**
*Assumed:* **13 or older** to join. We collect the birthday as **month and day only** (no year), plus a checkbox confirming the member is 13+. We don't collect the birth year, to reduce the personal data we hold.
*Affects:* ENROLL-02, BDAY-01, PRIV-01.

**Q17. Legal and compliance review?**
*Assumed:* Legal needs to review:
- SMS consent and opt-out under TCPA and the CTIA guidelines
- Texas Data Privacy and Security Act (TDPSA) requests to access or delete data
- Program Terms & Conditions, including our right to change or end the program
- Points expiry
- How sales tax works on free and discounted items

The stories include hooks for each of these but don't state legal conclusions.
*Affects:* PRIV-01 … PRIV-04.

**Q18. What authority do staff have to adjust points?**
*Assumed:*
- **Crew** can apply a member to an order and redeem rewards. They can't adjust points.
- **Store managers** can add or remove up to 100 points per adjustment, with a required reason code.
- **HQ support/marketing** can make any adjustment.
- Every adjustment is logged in an audit trail.
*Affects:* OPS-03, FRAUD-02.

**Q19. What happens to points on refunds or cancellations?**
*Assumed:* Points earned on a refunded order are taken back. If the refund is partial, only the matching share is taken back. If the order used a reward, the reward is given back if the order is cancelled before it is made, and not given back after that. A balance can go negative, and future earnings pay it off first.
*Affects:* FRAUD-01.

**Q20. What are the targets for the program?**
*Assumed:*
- 1,500 sign-ups by day 30 (from the 30-day plan)
- 10,000 by day 180
- 35% or more of own-channel orders tied to a member
- Members order 20% or more often than non-members
- Reward cost of 3% of member revenue or less

These drive REPORT-01.

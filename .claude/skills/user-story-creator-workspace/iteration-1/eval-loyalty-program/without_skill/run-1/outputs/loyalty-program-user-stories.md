# Loyalty Program: User Stories

**Status:** Draft, ready to feed into the spec · **Date:** 2026-09-23
**Scope:** A loyalty program for our Texas pizza restaurants with points per order, free-pizza rewards and birthday deals.
**Assumptions:** The user wasn't available, so the program's rules come from assumed answers. See `questionnaire.md`, which uses the IDs Q1–Q20. Confirm those answers before the spec is written.

---

## 1. Why this matters (link to the $3M goal)

The vision is **$3M in pizza sales by 2027-09-11**. The loyalty program helps reach it in three ways:
1. **Customers order more often.** At our ~$20–25 ticket, the plans need about 415–450 pizzas a day. Repeat customers are the cheapest way to get there.
2. **More orders move to our own channel.** Points count only on our own ordering (not on DoorDash, Uber Eats or Grubhub). This supports the 180-day plan's KPI of 30% → 50% of delivery orders on our own channel, where margins are better.
3. **We get a list we can market to.** Phone numbers with SMS consent let us run game-day, holiday and Super Bowl pushes without paying for ads every time.

**Reward cost check:** 1 point per $1, and 200 points = one free 14" pizza (up to $24 menu value). That works out to about "every 10th pizza free", a ~10% value to the customer. Our cost is only the food cost of about $4–6, or ~2–3% of member revenue.

### Program rules at a glance (assumed; see the questionnaire)
| Rule | v1 value | Ref |
|---|---|---|
| Earn rate | 1 pt per $1 of eligible subtotal (after discounts, before tax, tip and fees), rounded down | Q1 |
| Free pizza | 200 pts = any 14" menu pizza (≤ $24) | Q2 |
| Sign-up bonus | +50 pts on the first eligible order | Q6 |
| Birthday deal | Free 10" personal pizza OR $10 off a $20+ order. Valid from 7 days before to 7 days after the birthday, once a year | Q5 |
| Points expiry | 12 months with no activity. Reward vouchers expire 60 days after they are issued | Q4 |
| Earning channels | POS/counter, phone orders, our own web ordering. **Not** third-party delivery apps or catering | Q8 |
| Identity | Mobile phone number (main ID), plus an optional QR code | Q10 |
| Minimum age | 13+. Birthday stored as month and day only | Q16 |

---

## 2. Personas

| Persona | Who they are | What they care about |
|---|---|---|
| **Maria, Regular Customer** | Orders 2–4 times a month for her family, often on game nights. Orders online or picks up. | Getting rewarded without hassle, knowing how close she is to a free pizza |
| **Jake, New / Walk-in Customer** | First visit, paying at the counter, in a hurry. | Signing up in seconds with no app download, getting a reason to come back |
| **Crew Member (Cashier)** | Takes counter and phone orders on the POS during rush hour. | Finding the member fast, redeeming a reward in one or two taps, no arguments with customers |
| **Store Manager** | Runs one unit and handles complaints and fixes. | Fixing points problems with limited authority, seeing how their store's loyalty numbers are doing |
| **Marketing Manager (HQ)** | Owns the program, promotions and SMS campaigns. | Changing rules without developers, running game-day bonus campaigns, measuring whether the program adds revenue |
| **Owner / Finance** | Watches the numbers against the $3M goal. | What rewards cost, how much outstanding points could cost us, how members' spending compares with non-members' |
| **Support Agent (HQ)** | Handles customer emails and calls. | Seeing a member's full history, fixing mistakes, handling privacy requests |

---

## 3. Epics

| Epic | Name | Goal |
|---|---|---|
| E1 | Enrollment & Account | Sign up in under 30 seconds at any of our channels |
| E2 | Earning Points | Every eligible order earns the right points automatically |
| E3 | Redeeming Rewards | A free pizza is easy to claim and hard to abuse |
| E4 | Birthday Deals | Each member gets one birthday deal a year |
| E5 | Member Experience | Members always know their balance and what's next |
| E6 | In-Store Operations | Staff can handle loyalty at the counter fast |
| E7 | Program Administration | Marketing can change the rules and run promotions |
| E8 | Reporting & Analytics | We can prove the program's return on investment and link it to the $3M goal |
| E9 | Integrity & Fraud | Refunds, abuse and edge cases don't leak value |
| E10 | Privacy, Consent & Compliance | Handle personal data and SMS lawfully and in a way customers trust |

**Priority key (MoSCoW):**
- **M** = Must for launch
- **S** = Should, soon after launch
- **C** = Could
- **W** = Won't in this release

---

## E1: Enrollment & Account

### ENROLL-01: Join at the counter with a phone number (M)
**As** Jake, a walk-in customer, **I want** to join the loyalty program by giving the cashier my phone number, **so that** I earn points on today's order without downloading anything.

**Acceptance criteria**
- **Given** a customer who isn't a member is paying at the POS, **when** the crew member enters a valid US mobile number and the customer agrees to the program terms, **then** a member account is created and linked to the current order before it is paid for.
- **Given** the phone number already belongs to a member, **when** the crew member enters it, **then** the POS links the existing account and doesn't create a duplicate.
- **Given** an account was created at the counter, **when** it is created, **then** the member gets one SMS with a link to finish their profile (name, birthday, email) **only if** they gave SMS consent (see PRIV-02).
- Joining at the counter adds no more than 20 seconds to the transaction.

### ENROLL-02: Join online during checkout (M)
**As** Maria, **I want** to create a loyalty account while I'm checking out on the website, **so that** this order counts toward a free pizza.

**Acceptance criteria**
- **Given** I'm checking out as a guest on our own ordering site, **when** I tick "Join Rewards", confirm I'm 13 or older, accept the terms and verify my phone with a one-time code, **then** my account is created and this order earns points.
- **Given** I skip verifying my phone, **when** I place the order, **then** the order goes through as a guest order and no account is created.
- **Given** I'm filling in my profile, **when** I enter my birthday, **then** I can enter only the month and day (no year).

### ENROLL-03: Add points from a recent order I made as a guest (S)
**As** Jake, **I want** my first order to count if I join within 24 hours of it, **so that** I don't feel I missed out by signing up late.

**Acceptance criteria**
- **Given** an eligible order was placed with my phone number in the last 24 hours and hasn't earned points yet, **when** I join, **then** that order's points are added to my account once.
- **Given** the order is older than 24 hours, has already earned points, or came from a third-party delivery app, **when** I join, **then** it isn't added to my account.

### ENROLL-04: Sign-up bonus (M)
**As** the Marketing Manager, **I want** new members to get 50 bonus points on their first eligible order, **so that** we hit 1,500 sign-ups by day 30.

**Acceptance criteria**
- **Given** a new member, **when** their first eligible order is completed, **then** they get 50 bonus points on top of the normal points. The bonus shows as its own line in their history.
- **Given** a phone number that belonged to an account closed in the last 12 months, **when** it joins again, **then** it doesn't get the bonus again.
- The bonus amount can be changed by an admin (see ADMIN-01).

### ENROLL-05: Manage my profile (M)
**As** Maria, **I want** to update my name, email, birthday and communication settings, **so that** my account stays correct.

**Acceptance criteria**
- **Given** I'm logged in with a one-time code sent to my phone, **when** I change my name or email, **then** the change is saved immediately.
- **Given** a birthday is already on file, **when** I try to change it, **then** I'm told to contact support. Only one self-service birthday change is allowed per 12 months (see BDAY-04).
- **Given** I want to change my phone number, **when** I verify the new number with a one-time code, **then** my account, points and rewards move to the new number.

---

## E2: Earning Points

### EARN-01: Earn points on eligible spend (M)
**As** Maria, **I want** to earn 1 point for every $1 I spend, **so that** my regular orders build toward a free pizza.

**Acceptance criteria**
- **Given** a member's order is completed on an eligible channel, **when** it is paid, **then** points = the whole-dollar part of (item subtotal after discounts and rewards), excluding tax, tip, delivery fee, service fee and gift-card purchases.
  - *Example:* $47.80 subtotal after discounts, $3.94 tax, $5 tip → **47 points**.
- **Given** the order is paid in full with a reward (the subtotal after rewards is $0), **when** it is completed, **then** 0 points are earned.
- Points are **pending** until the order is completed or picked up. They become **available** within 5 minutes of that.

### EARN-02: See points on my receipt and confirmation (M)
**As** Maria, **I want** my receipt and order confirmation to show the points I earned and my new balance, **so that** I trust the program is working.

**Acceptance criteria**
- **Given** a member order is completed, **when** the receipt is printed or emailed, or the online confirmation is shown, **then** it shows "Points earned: X", the current balance, and "Y points to your next free pizza".

### EARN-03: Earn on phone orders (M)
**As** a Crew Member, **I want** to link a phone order to a member using the caller's phone number, **so that** phone customers get points too.

**Acceptance criteria**
- **Given** I'm entering a phone order in the POS, **when** I enter the caller's number and it matches a member, **then** the member's name and balance show and the order is linked to them.
- **Given** caller ID is available, **when** the order screen opens, **then** the phone number is filled in automatically.

### EARN-04: Only eligible channels and items earn points (M)
**As** the Owner, **I want** third-party delivery apps and catering to be excluded from earning, **so that** the program pushes customers to our higher-margin channels and doesn't inflate points.

**Acceptance criteria**
- **Given** an order comes from DoorDash, Uber Eats or Grubhub, **when** it is completed, **then** no points are earned.
- **Given** an order is flagged as a catering or corporate account order, **when** it is completed, **then** no points are earned.
- **Given** an order line is a gift card, **when** points are calculated, **then** that line is excluded.
- Where a third-party app allows marketing text, it shows "Order direct at [our site] to earn Rewards". *(S, depends on each app's partner terms.)*

### EARN-05: Bonus-point campaigns (S)
**As** Maria, **I want** to earn extra points during promotions like "2x points on game day", **so that** I have a reason to order from us on those days.

**Acceptance criteria**
- **Given** an active campaign "2x points, Fridays 4pm–11pm, all Dallas units", **when** a member's eligible order at a Dallas unit is completed in that window, **then** they earn 2x the base points. The bonus shows as its own line in their history.
- **Given** more than one campaign applies, **when** points are calculated, **then** only the single best multiplier is used. Multipliers don't combine unless the campaign is set to allow it.
- Campaigns are set up in ADMIN-02.

---

## E3: Redeeming Rewards

### REDEEM-01: Unlock a free pizza reward (M)
**As** Maria, **I want** a free-pizza reward to be issued automatically when I reach 200 points, **so that** I don't have to do anything to claim it.

**Acceptance criteria**
- **Given** my available balance reaches 200 or more, **when** the points are added, **then** 200 points are converted into one "Free 14" Pizza" reward voucher that expires in 60 days. Any points left over stay in my balance.
- **Given** I have SMS or email consent, **when** a reward is issued, **then** I get one message: "Your free pizza is ready! Use it by [date]."
- I can hold more than one unused reward at once (e.g. after a big order).

> **Design choice for the spec:** The alternative is to let the member choose when to spend 200 points, rather than converting automatically. Converting automatically is simpler at the counter and creates urgency to come back. Confirm this in the spec.

### REDEEM-02: Redeem a free pizza at the counter or by phone (M)
**As** a Crew Member, **I want** to apply a member's free-pizza reward in one or two taps, **so that** the line keeps moving at rush hour.

**Acceptance criteria**
- **Given** a member with an active reward is linked to the order, **when** I open the order, **then** the POS shows "1 reward available", and tapping it applies it to the most expensive eligible 14" menu pizza on the order.
- **Given** the eligible pizza costs more than $24 or has paid add-ons, **when** the reward is applied, **then** it takes off up to $24 and the customer pays the rest.
- **Given** there is no eligible pizza on the order (e.g. only a 16" pizza or a Pizza Creator custom pizza), **when** I try to apply the reward, **then** the POS explains why and doesn't apply it.
- Only one free-pizza reward can be used per order.

### REDEEM-03: Redeem a free pizza online (M)
**As** Maria, **I want** to apply my free pizza at online checkout, **so that** I can use it on delivery or pickup from our own site.

**Acceptance criteria**
- **Given** I'm logged in with an active reward, **when** I reach checkout, **then** I see "Apply free pizza". Applying it takes the value off an eligible pizza in my cart, and the new total shows before I pay.
- **Given** I remove the eligible pizza after applying the reward, **when** the cart updates, **then** the reward is removed and goes back to my account.
- **Given** the order fails to pay or is abandoned, **when** the session ends, **then** the reward is still available on my account.

### REDEEM-04: Reward vouchers expire (M)
**As** the Owner, **I want** unused rewards to expire after 60 days, **so that** what we owe in rewards stays limited and members come back sooner.

**Acceptance criteria**
- **Given** a reward is 53 days old and the member has consent, **when** the daily job runs, **then** they get one "Your free pizza expires in 7 days" reminder.
- **Given** a reward is older than 60 days and hasn't been used, **when** the daily job runs, **then** it is marked expired and can no longer be applied.

---

## E4: Birthday Deals

### BDAY-01: Add my birthday (M)
**As** Maria, **I want** to add my birthday (month and day) to my profile, **so that** I get a birthday treat.

**Acceptance criteria**
- **Given** I'm editing my profile, **when** I enter a month and day, **then** it's saved. The form doesn't ask for a year and doesn't accept one.
- **Given** 29 February, **when** a non-leap year comes, **then** the birthday deal's window is centred on 28 February.

### BDAY-02: Get the birthday deal automatically (M)
**As** Maria, **I want** my birthday deal to show up in my account in time, **so that** I can plan a birthday pizza night.

**Acceptance criteria**
- **Given** my birthday has been on file for at least 30 days, **when** it is 7 days before my birthday, **then** a birthday reward is issued. It is valid from 7 days before to 7 days after my birthday (15 days).
- **Given** I added my birthday less than 30 days ago, **when** my birthday comes, **then** no birthday reward is issued this year.
- **Given** I have SMS or email consent, **when** the reward is issued, **then** I get one message: "Happy birthday from [Brand]! Your treat is waiting, valid until [date]."
- Only one birthday reward is issued per member per 12 months.

### BDAY-03: Redeem the birthday deal (M)
**As** Maria, **I want** to choose either a free personal pizza or $10 off my order, **so that** the deal fits whatever I'm ordering.

**Acceptance criteria**
- **Given** an active birthday reward, **when** it's applied at the POS or online, **then** the member picks either (a) a free 10" personal pizza, or (b) $10 off an order with a subtotal of $20 or more.
- **Given** option (b) and a subtotal under $20, **when** it's applied, **then** it's refused, with the message "Add $X more to use your birthday $10 off".
- **Given** a birthday reward and a free-pizza reward, **when** both are used on one order, **then** that's allowed (a birthday pizza party), but each can be applied only once.
- **Given** the window has passed, **when** someone tries to apply it, **then** it's refused as expired.

### BDAY-04: Stop birthday abuse (M)
**As** the Owner, **I want** birthday changes to be limited, **so that** people can't change their birthday to get more than one deal a year.

**Acceptance criteria**
- **Given** a birthday is already on file, **when** the member tries to change it themselves, **then** they can't. They are sent to support.
- **Given** a support agent changes the birthday, **when** it's saved, **then** the reason is logged, and the 30-day wait (BDAY-02) starts again from the change date.

---

## E5: Member Experience

### MEMBER-01: See my balance and progress (M)
**As** Maria, **I want** to see my points and how far I am from my next free pizza, **so that** I'm encouraged to order again.

**Acceptance criteria**
- **Given** I'm logged in on the web ordering site, **when** I open "My Rewards", **then** I see my available points, pending points, a progress bar to 200 points, my active rewards with their expiry dates, and my birthday deal status.
- The page works on a phone screen (360px wide) and loads in under 2 seconds on 4G.

### MEMBER-02: See my points history (M)
**As** Maria, **I want** to see every earning, redemption, bonus, adjustment and expiry, **so that** I can check that my balance is right.

**Acceptance criteria**
- **Given** I open "History", **when** it loads, **then** each entry shows the date, store, order number (if there is one), type, points change and balance after. The newest entries show first.
- History goes back at least 24 months.

### MEMBER-03: Get useful notifications (S)
**As** Maria, **I want** short messages when something useful happens with my rewards, **so that** I don't forget about them.

**Acceptance criteria**
- **Given** I have transactional consent, **when** a reward is issued, is about to expire, or my birthday deal becomes active, **then** I get a message on my preferred channel.
- I get no more than 1 transactional loyalty message per day, and none between 9pm and 9am Central Time.
- Every SMS includes "Reply STOP to opt out" as required (see PRIV-02).

### MEMBER-04: Warning before my points expire (S)
**As** Maria, **I want** to be warned before my points expire, **so that** I can place an order and keep them.

**Acceptance criteria**
- **Given** I've had no activity for 11 months and have points, **when** the daily job runs, **then** I get one warning that my points expire in 30 days.
- **Given** 12 months with no activity, **when** the daily job runs, **then** my points balance expires and an "Expired" entry is added to my history.
- Any earning or redemption resets the 12-month timer.

### MEMBER-05: Show a QR code to identify myself (S)
**As** Maria, **I want** to show a QR code on my phone at the counter, **so that** I don't have to say my phone number out loud.

**Acceptance criteria**
- **Given** I open "My Rewards" on my phone, **when** I tap "Show code", **then** a QR code appears and changes every 60 seconds.
- **Given** the cashier scans a valid code, **when** it's scanned, **then** my account is linked to the order. An expired code is refused.

### MEMBER-06: Save favorites for quick reorder (C)
**As** Maria, **I want** to reorder my usual order from my rewards page, **so that** a repeat order takes under a minute.

**Acceptance criteria**
- **Given** I've had at least one past order, **when** I tap "Reorder" on it, **then** my cart is filled with the same items at today's prices. Items no longer on the menu are marked as unavailable.

---

## E6: In-Store Operations

### OPS-01: Quick member lookup at the POS (M)
**As** a Crew Member, **I want** to find a member by phone number, QR code or name plus the last 4 digits of their phone, **so that** I can link them to the order in under 5 seconds.

**Acceptance criteria**
- **Given** the POS order screen, **when** I enter a full 10-digit phone number, **then** the matching member shows in under 1 second, with their first name, points balance, active rewards and a birthday deal flag.
- **Given** there's no match, **when** the search finishes, **then** I'm offered "Enroll this number" (ENROLL-01).
- Crew can't see a member's full phone number, email or birthday. They see only the first name and the last 4 digits.

### OPS-02: Link a member after payment (S)
**As** a Crew Member, **I want** to add a member to an order within 2 hours of payment, **so that** customers who forgot to mention it still earn points.

**Acceptance criteria**
- **Given** a completed order with no member linked, less than 2 hours old, **when** I link a member, **then** the points are credited. The action is logged with my staff ID.
- **Given** the order already has a member, **when** I try to link another one, **then** it's refused.

### OPS-03: Manager points adjustment (M)
**As** a Store Manager, **I want** to add or remove points with a reason, **so that** I can fix mistakes and make up for bad experiences on the spot.

**Acceptance criteria**
- **Given** I'm logged into the POS as a manager, **when** I adjust a member's points by 100 or fewer (in either direction) and choose a reason code (e.g. "Service recovery", "Missing points", "Error correction"), **then** the adjustment is saved and shows in the member's history as "Adjustment".
- **Given** an adjustment of more than 100 points, **when** I submit it, **then** it's refused, with the message "Contact HQ support".
- Crew-level logins can't make adjustments.

### OPS-04: Keep working when the loyalty service is down (M)
**As** a Crew Member, **I want** to keep taking orders if the loyalty system is unavailable, **so that** a loyalty outage never stops sales.

**Acceptance criteria**
- **Given** the loyalty service can't be reached, **when** I take an order, **then** the POS lets me write down the member's phone number. The order goes through without loyalty, and points are credited automatically within 24 hours of the service coming back.
- **Given** the service is unavailable, **when** someone tries to redeem a reward, **then** redeeming is turned off, and the POS shows "Rewards temporarily unavailable, your reward is safe".

---

## E7: Program Administration

### ADMIN-01: Set up the program rules (M)
**As** the Marketing Manager, **I want** to change the earn rate, reward threshold, sign-up bonus, expiry periods and birthday deal value without a code deploy, **so that** I can tune the economics as data comes in.

**Acceptance criteria**
- **Given** I have the admin role, **when** I change a rule and set an effective date and time, **then** the new value applies to orders completed after that time. Earlier transactions keep their original values.
- Every rule change is logged with who made it, when, the old value and the new value.
- Changing a rule to make it less generous (e.g. raising the reward threshold) needs a second admin to approve it, and shows a warning to give members notice under the program terms.

### ADMIN-02: Create bonus-point campaigns (S)
**As** the Marketing Manager, **I want** to create time-boxed campaigns (points multiplier or flat bonus), aimed by store, metro, day or time, channel and menu item, **so that** I can run game-day, holiday, Super Bowl, Rodeo and SXSW promotions.

**Acceptance criteria**
- **Given** I set up a campaign with a name, start and end time, targeting and bonus, **when** I save it, **then** it's scheduled and shows in a campaign calendar.
- **Given** a campaign is live, **when** I end it early, **then** it stops applying straight away to new orders.
- **Given** an aimed campaign such as "+100 pts on any Brisket BBQ pizza order this week", **when** a member's eligible order has that item, **then** the flat bonus is credited once per order.

### ADMIN-03: Reward catalog (C)
**As** the Marketing Manager, **I want** to add more rewards (e.g. a free side for 75 points, a free 16" pizza for 275 points), **so that** members have choices and the program can grow.

**Acceptance criteria**
- **Given** a new catalog reward, **when** it's published, **then** members can choose to spend points on it in "My Rewards", in addition to the automatic free-pizza conversion.

### ADMIN-04: Choose which stores take part (M)
**As** the Owner, **I want** to turn loyalty on or off for each store, **so that** new units, ghost kitchens and future franchises can join when they're ready.

**Acceptance criteria**
- **Given** a store is marked "not participating", **when** a member orders there, **then** no points are earned or redeemed, and staff see "This location doesn't participate in Rewards yet".
- Each store has a "funding" setting (company-owned or franchise), used by REPORT-03.

### ADMIN-05: Program-wide expiry and liability settings (M)
**As** Finance, **I want** the expiry rules to run automatically and to be checked, **so that** what we owe in outstanding points is accurate.

**Acceptance criteria**
- **Given** the daily expiry job, **when** it runs, **then** it expires points and vouchers according to ADMIN-01, and writes a summary (count and points expired) to the admin log.
- **Given** the job fails, **when** it's not finished by 06:00 CT, **then** the on-call contact gets an alert.

---

## E8: Reporting & Analytics

### REPORT-01: Program KPI dashboard (M)
**As** the Owner, **I want** a weekly view of the loyalty KPIs next to our revenue goals, **so that** I can see whether the program is moving us toward $3M.

**Acceptance criteria**
- The dashboard shows, by week, metro and store:
  - total members
  - new sign-ups (day-30 target: 1,500)
  - active members (at least 1 order in the last 60 days)
  - % of own-channel orders linked to a member
  - member vs non-member average ticket and order frequency
  - revenue from members
  - rewards issued and redeemed
  - reward cost (food cost of redeemed items) as a % of member revenue
- **Given** a KPI misses its target by more than 15% (the same threshold as the 180-day plan's exit gates), **when** the dashboard loads, **then** that KPI is highlighted.

### REPORT-02: Liability report (M)
**As** Finance, **I want** a monthly report of outstanding points and unredeemed rewards, valued at estimated cost, **so that** we can record the liability correctly.

**Acceptance criteria**
- **Given** the month-end, **when** the report runs, **then** it shows:
  - points outstanding
  - rewards outstanding
  - estimated redemption rate (based on the last 90 days)
  - estimated liability at food cost and at menu value
- It can be exported as CSV.

### REPORT-03: Per-store redemption reconciliation (S)
**As** the Owner, **I want** to see where points were earned and where rewards were redeemed, by store, **so that** we can split costs fairly between units, and later between franchisees.

**Acceptance criteria**
- **Given** a date range, **when** I run the report, **then** it shows, for each store, points issued, rewards redeemed, and their value at cost and at menu price, plus a net "funding owed" column.

### REPORT-04: Campaign results (S)
**As** the Marketing Manager, **I want** to see how each campaign did, **so that** I can repeat the ones that work (like game day) and drop the rest.

**Acceptance criteria**
- **Given** a campaign has ended, **when** I open its report, **then** I see member orders, revenue, and average ticket during the campaign, compared with the same weekday and time slot over the previous 4 weeks, plus the bonus points cost.

### REPORT-05: Export an SMS marketing audience (S)
**As** the Marketing Manager, **I want** to export or sync groups of members who have given consent (e.g. "lapsed 45+ days", "Dallas members", "birthday this month"), **so that** I can run targeted SMS promotions.

**Acceptance criteria**
- **Given** I build a segment, **when** I export or sync it, **then** only members with active **marketing** SMS consent are included. Opted-out numbers are never included.

---

## E9: Integrity & Fraud

### FRAUD-01: Take back points and rewards on refunds and cancellations (M)
**As** the Owner, **I want** points to follow the money when orders are refunded, **so that** people can't buy, earn and refund.

**Acceptance criteria**
- **Given** a completed order that earned 40 points is fully refunded, **when** the refund is processed, **then** 40 points are taken off, and a "Reversal" entry is logged.
- **Given** a partial refund of 25% of the eligible subtotal, **when** it's processed, **then** 25% of the earned points are taken off, rounded down.
- **Given** points were already converted into a reward, **when** a reversal would make the balance negative, **then** the balance goes negative and future earnings pay it off first. The reward itself is not taken back.
- **Given** an order that used a reward is cancelled before it's made, **when** it's cancelled, **then** the reward is given back to the member with its original expiry date.

### FRAUD-02: Audit trail for every change to a balance (M)
**As** a Support Agent, **I want** every change to a balance to record who or what made it, **so that** I can investigate disputes.

**Acceptance criteria**
- Every points transaction records:
  - timestamp
  - store
  - channel
  - order ID (if there is one)
  - who made it (system, staff ID or admin ID)
  - reason code
  - balance before and after
- Transactions can't be edited or deleted. Corrections are new, offsetting transactions.

### FRAUD-03: Flag suspicious activity (S)
**As** the Owner, **I want** unusual patterns flagged, **so that** staff or customers can't game the program.

**Acceptance criteria**
- **Given** any of these:
  - a staff member links more than 10 orders to the same member in one day
  - post-payment linking (OPS-02) makes up more than 20% of a store's member orders in a week
  - a member earns more than 1,000 points in 7 days

  **when** the nightly check runs, **then** a flag is created in the admin console for review.
- A flagged account can be frozen by HQ. A frozen account can't earn or redeem until it's reviewed.

### FRAUD-04: One account per phone number (M)
**As** the Owner, **I want** each verified mobile number to hold only one account, **so that** people can't create duplicate accounts to repeat bonuses.

**Acceptance criteria**
- **Given** a phone number that's already enrolled, **when** someone tries to enroll it again on any channel, **then** they're sent to the existing account.
- Online sign-up needs the phone to be verified with a one-time code. Counter sign-up is marked "unverified" until the member verifies through the SMS link. Unverified accounts can earn but can't redeem until verified.

---

## E10: Privacy, Consent & Compliance

### PRIV-01: Program terms and age confirmation (M)
**As** the Owner, **I want** every member to accept the program terms and confirm they're 13 or older, **so that** we're protected legally and don't knowingly enroll children.

**Acceptance criteria**
- **Given** any sign-up channel, **when** an account is created, **then** it records that the terms were accepted, the terms version, the date and time, the channel, and confirmation of age 13+.
- **Given** a counter sign-up, **when** the crew member enrolls someone, **then** the POS shows a short script ("By joining you agree to our Rewards terms at [URL]"), and the SMS link shows the full terms.
- The terms state that we can change or end the program, and what the expiry rules are. The final text is up to legal.

### PRIV-02: Separate SMS consent (M)
**As** the Marketing Manager, **I want** SMS consent for transactional messages and for marketing to be collected and stored separately, with proof, **so that** our SMS promotions are compliant and don't get blocked by carriers.

**Acceptance criteria**
- **Given** sign-up, **when** the member is offered SMS, **then** transactional ("reward alerts") and marketing ("deals and promos") consent are separate checkboxes, both **unticked** by default. Each records the timestamp, channel, exact wording shown and IP address or store ID.
- **Given** a member replies STOP, **when** it's received, **then** all SMS to that number stops straight away, and the member gets one confirmation message.
- **Given** a member replies HELP, **when** it's received, **then** they get the program name and how to contact support.
- Joining the program must **not** depend on giving marketing consent.

### PRIV-03: See and delete my data (M)
**As** Maria, **I want** to download or delete my loyalty data, **so that** I control my personal information.

**Acceptance criteria**
- **Given** a verified member asks for access, through self-service or support, **when** the request is processed, **then** they get their profile, consents and full points history within the legal deadline. The exact deadline is for legal to confirm under the TDPSA.
- **Given** a verified deletion request, **when** it's processed, **then** personal data is deleted or anonymized, unused points and rewards are forfeited (the member is warned first), and anonymized transaction records are kept for finance and audit.

### PRIV-04: Minimize personal data and restrict access (M)
**As** the Owner, **I want** to collect only the personal data we need and limit who sees it, **so that** a breach or an insider does less damage.

**Acceptance criteria**
- We collect only: phone number, first name, optional last name, optional email, birthday as month and day, and consents.
- Access is based on role:
  - Crew see first name and the last 4 digits of the phone.
  - Managers also see points history.
  - Support and admins see the full profile.
  - Every time support or an admin views a profile, it's logged.
- Personal data is encrypted in transit and at rest.

---

## 4. Non-functional requirements (for the spec)

| Area | Requirement |
|---|---|
| Performance | POS member lookup takes 1 second or less (p95). Points are available within 5 minutes of order completion |
| Availability | 99.5% monthly uptime for the loyalty service. The POS keeps working when it's down (OPS-04) |
| Scale | Handles 10k+ members by day 180 and 3 metros / 7+ units, and peak load on Super Bowl Sunday (the biggest sales day of the period) |
| Time zone | All windows (birthday deals, campaigns, expiry, quiet hours) use America/Chicago. Note: El Paso is on Mountain Time. The spec decides whether windows follow each store's local time |
| Accessibility | Member web pages meet WCAG 2.1 AA, the same standard as the Pizza Creator's accessibility work |
| Auditability | The points ledger can only be added to, never edited (FRAUD-02) |

## 5. Out of scope for v1 (Won't)
- A native iOS or Android app (we use a mobile web page in our own ordering)
- Points on third-party delivery apps
- Points on catering or corporate accounts
- Membership tiers such as Silver or Gold
- A paid subscription (a "pizza pass")
- Referral program: "Could" priority, to decide after launch
- Rewards on Pizza Creator custom pizzas. Pizza Creator doesn't have checkout yet (`pizza-creator/README.md`)
- Physical loyalty cards
- Partner or coalition rewards

## 6. Dependencies and risks
1. **POS and online ordering platform (open question).** We don't know yet whether we're building this ourselves or using our POS's loyalty module. That choice decides cost, time and how many of these stories we get "for free". **This is the first decision to make in the spec.**
2. **Online ordering must exist first.** EARN-01, REDEEM-03, MEMBER-01 and others depend on the own-channel ordering from the 30-day plan's week 2.
3. **SMS provider and 10DLC registration.** Carrier registration can take weeks. Start it now if we want to launch in the 30-day plan's week 3.
4. **Legal review.** We need legal to review the terms, TCPA/CTIA SMS rules, TDPSA, points expiry and how sales tax works on rewards before launch.
5. **Reward economics.** The ~2–3% cost assumes redeemed pizzas stay at 30% food cost or less. Check this against actual supplier costs.

## 7. Suggested release slices
- **Release 1 (MVP, for launch in the 30-day plan's week 3):** all **M** stories in E1–E6, plus ADMIN-01, ADMIN-04, ADMIN-05, REPORT-01, REPORT-02, FRAUD-01, FRAUD-02, FRAUD-04 and PRIV-01…04.
- **Release 2 (before the holiday push, days 31–60):** MEMBER-03…05, ENROLL-03, OPS-02, EARN-05 and ADMIN-02 for game-day and holiday campaigns, plus REPORT-03…05 and FRAUD-03.
- **Release 3 (second metro and Super Bowl, days 61–120):** ADMIN-03 reward catalog, MEMBER-06, and franchise funding reconciliation if the franchise test goes ahead.

## 8. Story index
| ID | Title | Priority |
|---|---|---|
| ENROLL-01 | Join at the counter with a phone number | M |
| ENROLL-02 | Join online during checkout | M |
| ENROLL-03 | Add points from a recent guest order | S |
| ENROLL-04 | Sign-up bonus | M |
| ENROLL-05 | Manage my profile | M |
| EARN-01 | Earn points on eligible spend | M |
| EARN-02 | Points on receipt and confirmation | M |
| EARN-03 | Earn on phone orders | M |
| EARN-04 | Only eligible channels and items earn | M |
| EARN-05 | Bonus-point campaigns | S |
| REDEEM-01 | Unlock a free pizza reward | M |
| REDEEM-02 | Redeem at counter or by phone | M |
| REDEEM-03 | Redeem online | M |
| REDEEM-04 | Reward vouchers expire | M |
| BDAY-01 | Add my birthday | M |
| BDAY-02 | Get the birthday deal automatically | M |
| BDAY-03 | Redeem the birthday deal | M |
| BDAY-04 | Stop birthday abuse | M |
| MEMBER-01 | Balance and progress | M |
| MEMBER-02 | Points history | M |
| MEMBER-03 | Useful notifications | S |
| MEMBER-04 | Warning before points expire | S |
| MEMBER-05 | QR code to identify myself | S |
| MEMBER-06 | Quick reorder | C |
| OPS-01 | Quick member lookup at the POS | M |
| OPS-02 | Link a member after payment | S |
| OPS-03 | Manager points adjustment | M |
| OPS-04 | Keep working when loyalty is down | M |
| ADMIN-01 | Set up program rules | M |
| ADMIN-02 | Bonus-point campaigns | S |
| ADMIN-03 | Reward catalog | C |
| ADMIN-04 | Choose which stores take part | M |
| ADMIN-05 | Expiry and liability settings | M |
| REPORT-01 | Program KPI dashboard | M |
| REPORT-02 | Liability report | M |
| REPORT-03 | Per-store redemption reconciliation | S |
| REPORT-04 | Campaign results | S |
| REPORT-05 | Export an SMS marketing audience | S |
| FRAUD-01 | Take back points on refunds | M |
| FRAUD-02 | Audit trail | M |
| FRAUD-03 | Flag suspicious activity | S |
| FRAUD-04 | One account per phone number | M |
| PRIV-01 | Terms and age confirmation | M |
| PRIV-02 | Separate SMS consent | M |
| PRIV-03 | See and delete my data | M |
| PRIV-04 | Minimize data and restrict access | M |

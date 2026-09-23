# Loyalty Program: User stories

## Context
A loyalty program for our Texas pizza restaurants. Customers earn points on orders placed through our own online ordering and in-store. 200 points unlock a free 14" pizza, and members get a birthday pizza. The core v1 goal is **more repeat orders from the same customers**, adding to the $3M-by-2027-09-11 target. A secondary goal is moving orders from the delivery apps to our own channels. v1 success means **1,500 sign-ups by 2026-10-16** (KPI from `plans/30-day-plan.md`) and members ordering more often than non-members. The launch window is the week of 2026-09-30.

## Personas
| Persona | Who they are | What they need most |
|---|---|---|
| Customer | A person who orders from us online or at the counter, whether or not they have joined yet | Joining in seconds, seeing how close they are to a free pizza, and redeeming it without hassle |
| Cashier | Counter or phone-order staff member at any store | Finding a member and applying points or a reward in a few seconds, without slowing the line |
| Store manager | The person running one store | Fixing wrong or missing points for a customer on the spot, with a record of what changed |
| Owner | Business owner who tracks performance across all stores | Seeing whether the program brings sign-ups and repeat orders, and what the rewards cost |

## Epics overview
| Epic | Goal | Stories | Priority |
|---|---|---|---|
| 1. Join the program | Turn customers into members with as little friction as possible | US-01 to US-04 | Must |
| 2. Earn points | Credit every eligible order fairly, online and in-store | US-05 to US-10 | Must |
| 3. Redeem free pizza | Let members turn 200 points into a free pizza on any own channel | US-11 to US-13 | Must |
| 4. Birthday deal | Bring members back for a paid order around their birthday | US-14 to US-16 | Should |
| 5. Program management | Let staff fix balances and the owner measure results | US-17 to US-20 | Should |
| Non-functional | Speed, privacy, language, accessibility | US-21 to US-24 | Must / Should / Could |

## Epic 1: Join the program
Customers can become members online or at the counter, using only their phone number.

### US-01 Join during online checkout
**As a** customer
**I want** to join the loyalty program during online checkout with my phone number and name
**so that** my current order already counts toward a free pizza

Priority: Must · Size: M

**Acceptance criteria**
- Given I am checking out online and I am not a member
  When I enter my name and phone number, confirm I am 13 or older, and enter the 6-digit code texted to me
  Then I am a member, and the points for this order are credited to me when the order is completed
- Given I enter a phone number that already belongs to a member
  When I submit the join form
  Then I see "This number is already a member. Sign in instead." and I can sign in with a code, without creating a second account
- Given I enter a wrong code 3 times in a row
  When I try a 4th time
  Then code entry for that number is blocked for 15 minutes, and I can still check out as a guest without points
- Given the code text has not arrived
  When 30 seconds have passed
  Then I can request a new code (at most 3 per hour)

**Notes:** The birthday field is optional here (see US-14). Checking out without joining must always stay possible.

### US-02 Join at the counter
**As a** cashier
**I want** to sign up a customer at the counter using their phone number and first name
**so that** walk-in and phone-order customers can join without downloading or typing anything

Priority: Must · Size: M

**Acceptance criteria**
- Given a customer at the counter says they want to join
  When I enter their phone number and first name and submit
  Then a member account is created, this order's points are credited, and the customer gets a welcome text within 1 minute with a link to confirm their number
- Given the phone number already belongs to a member
  When I submit
  Then I see the existing member's first name and point balance instead of a new account
- Given the customer has not confirmed their number from the welcome text
  When they try to redeem a reward
  Then redemption is blocked until the number is confirmed (points still keep adding up)

**Notes:** Unconfirmed accounts keep counter sign-ups fast while preventing someone from joining with another person's number and redeeming their points.

### US-03 Sign in with a text code
**As a** customer
**I want** to sign in with my phone number and a one-time code instead of a password
**so that** I never get locked out of my points because I forgot a password

Priority: Must · Size: S

**Acceptance criteria**
- Given I am a member on the online ordering site
  When I enter my phone number and the 6-digit code texted to me within 10 minutes
  Then I am signed in and stay signed in on that device for 30 days unless I sign out
- Given the code is older than 10 minutes
  When I enter it
  Then I see "This code has expired" and can request a new one
- Given the phone number does not belong to a member
  When I request a code
  Then I am offered the option to join (US-01) instead

### US-04 Opt in to promo texts
**As a** customer
**I want** to choose separately whether I receive promotional texts
**so that** I get deals I care about without being spammed just because I joined

Priority: Must · Size: S

**Acceptance criteria**
- Given I am joining (online or at the counter)
  When the join form is shown
  Then the promo-text checkbox is unticked by default and explains how often texts come (up to 4 per month) and how to stop them
- Given I did not tick the promo-text box
  When a promo campaign is sent
  Then I do not receive it, but I still receive account texts (codes, reward unlocked, points expiring)
- Given I opted in
  When I reply STOP to any promo text
  Then I receive no more promo texts, get one confirmation reply, and my loyalty membership is unaffected

**Notes:** Needs a legal check against TCPA consent rules for marketing texts (see Open questions). Promo campaigns themselves (for example game-day deals) are out of scope for v1. This story only collects consent.

## Epic 2: Earn points
Every eligible order earns 1 point per $1 of food subtotal, on our own online ordering and in-store.

### US-05 Earn points on an online order
**As a** customer
**I want** to earn 1 point for every $1 of food I order online while signed in
**so that** each order brings me closer to a free pizza

Priority: Must · Size: M

**Acceptance criteria**
- Given I am a signed-in member and my food subtotal after discounts is $37.50
  When my order is marked completed (picked up or delivered)
  Then 37 points are added to my balance (whole dollars, rounded down), and I see them within 5 minutes
- Given my order is placed but not yet completed
  When I view my balance
  Then the points show as "pending" and cannot be redeemed yet
- Given my order includes tax, tip, and a delivery fee
  When points are calculated
  Then tax, tip, and fees earn no points
- Given the order is a catering order
  When it is completed
  Then it earns no points, and checkout says "Catering orders don't earn points"

### US-06 Earn points on an in-store order
**As a** cashier
**I want** to add a member to an in-store or phone order by entering their phone number
**so that** customers who don't order online still earn points and keep coming back

Priority: Must · Size: M

**Acceptance criteria**
- Given a member gives their phone number before paying
  When I enter it on the order
  Then I see their first name and current balance, and when payment completes the points for the food subtotal are added right away
- Given the phone number is not a member
  When I enter it
  Then I am offered the quick join (US-02)
- Given the customer remembers they are a member only after paying
  When I add their phone number to the paid order within 1 hour
  Then the points are still credited (after 1 hour, see US-09)

### US-07 See my balance and progress
**As a** customer
**I want** to see my point balance, how many points I need for a free pizza, and my recent point history
**so that** I know when my next free pizza is coming and am motivated to order again

Priority: Must · Size: S

**Acceptance criteria**
- Given I am a signed-in member with 145 points
  When I open my loyalty page or checkout
  Then I see "145 points · 55 more to a free pizza" and a progress bar
- Given I have earned or used points
  When I open my point history
  Then I see the last 12 months of entries with date, store or "Online", order number, and points (+ or −)
- Given my balance includes pending points (US-05)
  When I view it
  Then pending points are shown separately and are not counted toward "points to go"

### US-08 Take back points on cancelled or refunded orders
**As an** owner
**I want** points from cancelled or refunded orders to be taken back automatically
**so that** we do not give away free pizzas for orders we did not get paid for

Priority: Must · Size: S

**Acceptance criteria**
- Given a member's order earned 37 points
  When the order is fully refunded or cancelled
  Then 37 points are removed and the history shows "Refund, order #1234, −37"
- Given the order is partly refunded by $10
  When the refund is processed
  Then 10 points are removed
- Given removing the points would make the balance negative
  When the refund is processed
  Then the balance is set to 0 (never negative) and the entry is marked for store manager review
- Given the cancelled order used a free pizza reward
  When it is cancelled
  Then the 200 reward points are returned to the member

### US-09 Claim points for a missed order
**As a** customer
**I want** to claim points for a recent order where I forgot to give my number
**so that** I don't lose points because of a small mistake

Priority: Could · Size: S

**Acceptance criteria**
- Given I placed an order in the last 14 days that earned no points
  When I enter its order number on my loyalty page
  Then the points are credited once, if the order was not already linked to a member
- Given the order number is already linked to another member, or is older than 14 days
  When I submit it
  Then I see the reason and no points are added

### US-10 Points expire after inactivity, with a warning
**As an** owner
**I want** points to expire after 12 months with no activity, with a warning first
**so that** we don't carry old reward costs forever, and lapsed customers get a reason to come back

Priority: Should · Size: S

**Acceptance criteria**
- Given a member has not earned or redeemed points for 11 months
  When that day arrives
  Then they get a text: "Your 160 points expire on <date>. Order before then to keep them."
- Given a member has not earned or redeemed points for 12 months
  When that day arrives
  Then their balance goes to 0 and the history shows "Expired"
- Given the member places a qualifying order after the warning text
  When the order completes
  Then the 12-month clock restarts and no points expire

## Epic 3: Redeem free pizza
200 points buy one free 14" menu pizza, online or at the counter.

### US-11 Redeem a free pizza online
**As a** customer
**I want** to use 200 points for a free 14" menu pizza on my online order
**so that** I get the reward I earned without having to call or visit

Priority: Must · Size: M

**Acceptance criteria**
- Given I am signed in with 200 or more confirmed points and my cart has a 14" menu pizza
  When I tap "Use 200 points for a free pizza"
  Then the price of one 14" menu pizza (the most expensive one in the cart, up to $24) drops to $0, and 200 points are deducted when I place the order
- Given I have fewer than 200 confirmed points
  When I view checkout
  Then the redeem button is disabled and shows how many points I still need
- Given I already applied one reward to this order
  When I try to apply a second
  Then I see "One reward per order"
- Given the free pizza is in the cart
  When points for the order are calculated
  Then the free pizza earns no points, and no other discount applies to that pizza

**Notes:** Toppings added beyond the menu recipe are charged at normal price. Whether the free pizza can be the only item on the order is an open question.

### US-12 Redeem a free pizza at the counter
**As a** cashier
**I want** to apply a member's free pizza reward after they confirm with a code texted to their phone
**so that** in-store customers can redeem quickly, and nobody can use someone else's points

Priority: Must · Size: M

**Acceptance criteria**
- Given a confirmed member with 200 or more points is at the counter
  When I choose "Redeem free pizza" and the customer reads out the 6-digit code texted to them
  Then one 14" menu pizza on the order becomes $0 and 200 points are deducted when payment completes
- Given the customer does not have their phone or the code is wrong 3 times
  When I try to redeem
  Then redemption is refused with a clear message. The order can still go ahead at full price, and the points stay on the account
- Given the member's number is not yet confirmed (US-02)
  When I try to redeem
  Then I see "Ask the customer to confirm their number from the welcome text first"

### US-13 Get a text when a free pizza is unlocked
**As a** customer
**I want** a text when my balance reaches 200 points
**so that** I remember to come back and use my free pizza

Priority: Should · Size: S

**Acceptance criteria**
- Given my confirmed balance goes from below 200 to 200 or more
  When the points are credited
  Then I get one text within 10 minutes with a link to order online
- Given I already got this text and have not redeemed since
  When I earn more points
  Then I do not get another "reward unlocked" text

**Notes:** This is an account text, not a promo, so it is sent even without promo opt-in (US-04). Legal to confirm.

## Epic 4: Birthday deal
Members who share their birthday get a free 14" cheese or one-topping pizza with a paid order around their birthday.

### US-14 Add my birthday
**As a** customer
**I want** to add my birthday (month and day only) to my membership
**so that** I receive a birthday treat

Priority: Should · Size: S

**Acceptance criteria**
- Given I am a signed-in member without a birthday on file
  When I choose a month and day and save
  Then my birthday is saved, and the page says the reward starts the next time my birthday is at least 30 days away
- Given I already saved a birthday
  When I try to change it
  Then I can't change it myself, and I am told to ask a store manager (US-17)
- Given I enter an invalid date (for example 31 April)
  When I save
  Then I see an error and nothing is saved

**Notes:** No birth year is collected. The 30-day rule stops people adding a birthday the day before just to get a free pizza.

### US-15 Get my birthday reward
**As a** customer
**I want** a birthday reward to appear on my account with a text telling me about it
**so that** I have a reason to celebrate with an order from us

Priority: Should · Size: S

**Acceptance criteria**
- Given my birthday has been on file for at least 30 days
  When it is 7 days before my birthday
  Then a birthday reward appears on my account, valid until 7 days after my birthday, and I get a text about it
- Given my birthday was added less than 30 days before it
  When the 7-days-before date arrives
  Then no reward is created this year, and it will be created next year
- Given I already got a birthday reward this calendar year
  When anything triggers a new one (for example, a manager changes the date)
  Then no second reward is created

### US-16 Redeem my birthday pizza
**As a** customer
**I want** to add my free birthday pizza to a paid order online or at the counter
**so that** I get my treat in the way I normally order

Priority: Should · Size: M

**Acceptance criteria**
- Given I have an active birthday reward and a paid item in my order
  When I apply the birthday reward (online, or through the cashier with a text code as in US-12)
  Then one 14" cheese or one-topping pizza is added at $0, and the reward is marked used
- Given my order has no paid item
  When I try to apply the birthday reward
  Then I see "Add any item to use your birthday pizza"
- Given the validity window has ended
  When I try to use the reward
  Then it is shown as expired and cannot be applied
- Given I also want to use a 200-point reward on the same order
  When I apply both
  Then both are allowed (the birthday reward does not count toward "one reward per order")

**Notes:** Allowing both rewards together is an assumption (see Assumptions).

## Epic 5: Program management
Staff can fix balances, and the owner can see if the program pays off.

### US-17 Adjust a member's points or birthday
**As a** store manager
**I want** to add or remove points and correct a birthday for a member, with a required reason
**so that** I can fix complaints on the spot, and every change can be traced

Priority: Should · Size: S

**Acceptance criteria**
- Given I look up a member by phone number
  When I add or remove up to 200 points and enter a reason
  Then the balance changes right away, and the history shows the change, my name, the store, and the reason
- Given I try to adjust by more than 200 points at once
  When I submit
  Then the change is refused with "Adjustments over 200 points need the owner"
- Given I leave the reason empty
  When I submit
  Then the change is refused

### US-18 See sign-ups and redemptions
**As an** owner
**I want** to see sign-ups, points issued, and rewards redeemed per store and per day
**so that** I can track the 1,500 sign-up target and see which stores push the program

Priority: Should · Size: M

**Acceptance criteria**
- Given I open the loyalty dashboard
  When I select a date range and "All stores" or one store
  Then I see new members, total members, points issued, free pizzas redeemed, birthday pizzas redeemed, and points outstanding for that range
- Given it is 2026-10-16
  When I open the dashboard
  Then I see total sign-ups against the 1,500 target
- Given a store has no activity in the range
  When I view it
  Then it shows zeros, not an error

**Notes:** Data up to the previous day is enough. Real-time data is not needed.

### US-19 Compare members and non-members
**As an** owner
**I want** to compare how often members and non-members order and how much they spend
**so that** I can tell if the program actually brings repeat revenue

Priority: Could · Size: M

**Acceptance criteria**
- Given at least 30 days of data exist
  When I open the comparison view
  Then I see orders per customer per month and average ticket for members and non-members, with the counts behind each number
- Given there is less than 30 days of data
  When I open the view
  Then I see "Not enough data yet"

**Notes:** Non-member counts are only possible for identifiable customers (for example online guest checkouts). The spec should define how they are counted.

### US-20 Change earn and reward rules
**As an** owner
**I want** to change the points per dollar, the points needed for a free pizza, and the birthday window
**so that** I can tune the program's cost against its effect without waiting on a developer

Priority: Could · Size: M

**Acceptance criteria**
- Given I change the free pizza cost from 200 to 180 points
  When I save with a start date
  Then from that date checkout and balances use 180, and members' existing points are unchanged
- Given I enter 0 or a negative number
  When I save
  Then the change is refused

## Non-functional stories

### US-21 Fast counter lookup
**As a** cashier
**I want** a member's name and balance to appear within 2 seconds of entering their phone number
**so that** the loyalty program never slows down the line at peak hours

Priority: Must · Size: S

**Acceptance criteria**
- Given a normal Friday-evening rush
  When I enter a member's 10-digit phone number
  Then their first name and balance appear within 2 seconds, 95% of the time
- Given the loyalty service cannot be reached
  When I enter a phone number
  Then within 5 seconds I see "Loyalty unavailable, points will be added later". The sale goes ahead, and the points are credited automatically once the service is back

### US-22 Delete my account and data
**As a** customer
**I want** to delete my loyalty account and personal data
**so that** I stay in control of my information

Priority: Should · Size: S

**Acceptance criteria**
- Given I am signed in
  When I choose "Delete my account" and confirm with a text code
  Then my name, phone number, and birthday are removed within 30 days, my points are forfeited, and I get a confirmation text
- Given I have an unused reward
  When I start deletion
  Then I am warned that I will lose it before I confirm

**Notes:** The spec should confirm the deadline against the Texas Data Privacy and Security Act.

### US-23 Use the program in Spanish
**As a** customer
**I want** the loyalty pages and texts in Spanish when I choose Spanish
**so that** Spanish-speaking customers can join and use rewards just as easily

Priority: Could · Size: M

**Acceptance criteria**
- Given I set my language to Spanish
  When I view loyalty pages or receive account texts
  Then all loyalty text is in Spanish
- Given no language is set
  When I receive a text
  Then it is in English

### US-24 Accessible loyalty pages
**As a** customer
**I want** the join, balance, and redeem screens to work with a screen reader and keyboard, and at 360px width
**so that** I can use the program on any device and whatever my abilities

Priority: Should · Size: S

**Acceptance criteria**
- Given I use a screen reader
  When I go through join, balance, and redeem
  Then every field, button, and the progress bar have readable labels, and I can finish each flow with the keyboard alone
- Given a 360px-wide phone screen
  When I open any loyalty page
  Then there is no horizontal scrolling, and buttons are at least 44px tall

## Out of scope (v1)
- Earning or redeeming on DoorDash, Uber Eats, or Grubhub: needs integration with each app, and it rewards our highest-fee channel. We want members on our own ordering instead.
- Points on catering orders: large orders would create large reward costs. Revisit with the catering sales team.
- Tiers or status levels (Silver, Gold): more rules than a one-week launch allows. Revisit after 90 days of data.
- Promo campaigns (for example game-day double points or SMS blasts): v1 only collects consent (US-04). Sending campaigns is a separate feature.
- Referral rewards ("give a friend a free pizza"): useful for growth, but deferred until the core program is stable.
- A dedicated mobile app or digital wallet card: the web and text messages cover v1.
- Transferring or pooling points between members: rarely needed and invites abuse.
- Points for gift card purchases: gift cards are a Phase 2 item in the 180-day plan.
- Rewards beyond a free pizza (sides, drinks, merch): keep one clear reward for launch.

## Assumptions
- **Earning channels:** own online ordering plus in-store (counter and phone orders). Delivery apps are excluded (Q4).
- **Earn rate:** 1 point per whole $1 of food subtotal after discounts, before tax, tip, and fees. 200 points = one free 14" menu pizza worth up to $24 (Q5). This replaces the 30-day plan's "every 10th pizza free".
- **Birthday deal:** free 14" cheese or one-topping pizza with a paid order, valid from 7 days before to 7 days after the birthday. The birthday must be on file 30 days ahead. One per calendar year (Q6).
- **Birthday stacking:** the birthday reward can be used on the same order as a 200-point reward.
- **Identity:** phone number + 6-digit text code, no passwords. Name required. Birthday optional, month and day only. Members confirm they are 13+ (Q7).
- **Counter sign-ups:** created unconfirmed. Earning works right away, and redeeming needs the customer to confirm by text.
- **Launch priority:** join, earn, and free-pizza redemption are Must for the week of 2026-09-30. Birthday and dashboard are Should and follow within about 2 weeks (Q8).
- **Personas:** customer, cashier, store manager, owner. There is no separate marketing role (Q1).
- **Core goal:** repeat orders. Own-channel share is secondary (Q2).
- **Points expiry:** 12 months with no activity, with a 30-day warning text.
- **Refunds:** points come off for refunds and cancellations, and the balance never goes below 0.
- **Rewards per order:** one points reward per order. Reward pizzas earn no points and do not combine with other discounts.
- **Catering:** catering orders earn no points.
- **Late linking:** cashiers can attach a member to a paid order for up to 1 hour. Customers can claim orders up to 14 days old.
- **Adjustments:** store managers can adjust up to 200 points at once. Larger adjustments go to the owner.
- **Systems:** our own online ordering and in-store point of sale exist (the 30-day plan says they go live in week 2) and can be extended. `pizza-creator/` is not the ordering system.

## Open questions
- **Earn rate vs. the 30-day plan:** 1 point per $1 (200 = free pizza) replaces the plan's "every 10th pizza free". Does the owner agree? (Owner)
- **Standalone free pizza:** can a free-pizza reward be the only item on an order, or must there be a paid item, as with the birthday deal? (Owner)
- **Delivery for rewards:** do reward orders pay the normal delivery fee? (Owner / ops)
- **Text rules:** does TCPA allow the "reward unlocked" and "points expiring" texts without promo consent? Is the 13+ age gate enough? (Legal)
- **Data rules:** under the Texas Data Privacy and Security Act, which data-deletion deadline and privacy notice wording apply? (Legal)
- **Point of sale:** which in-store point-of-sale system do the stores use, and can it show a member lookup at the counter? This decides whether US-02, US-06, US-12, and US-21 fit in the launch week. (Owner / whoever runs the stores' POS)
- **Franchise stores:** do franchise-test units (180-day plan, Phase 4) take part and share the reward cost? (Owner)
- **Unused rewards:** how should unused rewards be counted as a cost? This affects "points outstanding" in US-18. (Owner / accountant)

## Interview log
Non-interactive run: the questions were not shown to a user. Each answer below is my recommended option, recorded as an assumption. The full options are in `questionnaire.md`.

| # | Question | Answer used |
|---|---|---|
| Q1 | Who uses the program? | Customer + cashier + store manager + owner |
| Q2 | Most important v1 outcome? | More repeat orders (own-channel share is secondary) |
| Q3 | What else is in v1 besides points, free pizza, birthday? | Counter lookup, owner dashboard, promo-text opt-in. No tiers |
| Q4 | Which orders earn and redeem? | Own online ordering + in-store. Not delivery apps |
| Q5 | Points rule? | 1 point per $1 of food subtotal. 200 points = free 14" menu pizza |
| Q6 | Birthday deal? | Free 14" cheese or one-topping pizza with a paid order, ±7 days |
| Q7 | How do customers identify themselves? | Phone + text code. Name required. Birthday optional (month and day) |
| Q8 | What is Must on launch day? | Join, earn, redeem free pizza. Birthday and dashboard Should |

Taken from the repo without asking: the $3M revenue goal (`CLAUDE.md`), the loyalty launch in week 3 and the 1,500 sign-up KPI (`plans/30-day-plan.md`), the own-channel share goal and multi-metro growth (`plans/180-day-plan.md`), and menu prices of $15 to $24 (`recipes/`).

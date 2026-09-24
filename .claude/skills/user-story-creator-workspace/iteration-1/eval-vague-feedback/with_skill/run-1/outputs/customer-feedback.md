# Customer Feedback: User stories

## Context
Customers rate their order (stars + optional comment) by SMS link or by QR code on the box/receipt. Store managers get low ratings right away and recover the customer before they stop ordering, and the owner sees satisfaction trends by store and by pizza. The core goal is to win back unhappy customers so they order again, which supports the $3M / 360-day revenue target. v1 success means: at least 10% of own-channel orders get a rating, 90% of 1-2 star ratings are resolved within 24 hours, and at least 30% of customers who get a make-good credit order again within 30 days.

## Personas
| Persona | Who they are | What they need most |
|---|---|---|
| Customer | Someone who ordered pizza from us through our own online ordering, in store, or through a delivery app | A quick way to say how the order went, and to have a bad order made right |
| Store manager | The manager responsible for one store's service and quality | To hear about unhappy customers right away and fix it before they stop ordering |
| Owner | The owner/ops lead running all stores across Texas metros | To see which stores and pizzas are pleasing or losing customers, so they can decide where to act |

## Epics overview
| Epic | Goal | Stories | Priority |
|---|---|---|---|
| 1. Give feedback | Customers can rate an order in under 30 seconds, on any channel | US-01 to US-05 | Must |
| 2. Recover unhappy customers | Every low rating reaches a manager and is resolved within 24 hours | US-06 to US-11 | Must |
| 3. Owner insights | The owner sees satisfaction by store, by pizza and by complaint reason | US-12 to US-15 | Should |
| 4. Public reviews | Respondents are invited to share their experience on Google | US-16 | Should |
| Non-functional | Language, speed, accessibility, consent and privacy | US-17 to US-20 | Must / Should |

## Epic 1: Give feedback
Customers can tell us how an order went, quickly, whichever channel they ordered through.

### US-01 Feedback request by SMS after an own-channel order
**As a** Customer
**I want** to get a text with a feedback link shortly after my order arrives
**so that** I can tell the store how it went while the order is still fresh in my mind

Priority: Must · Size: M

**Acceptance criteria**
- Given I placed an order through our online ordering or in store, gave a phone number and agreed to receive texts
  When the order is marked delivered or picked up
  Then I receive one SMS with a personal feedback link within 60 minutes, naming the store
- Given I already received a feedback SMS in the last 7 days
  When another order of mine is completed
  Then no new SMS is sent
- Given I did not agree to receive texts, or I have opted out
  When my order is completed
  Then no SMS is sent

**Notes:** Delivery-app orders (DoorDash, Uber Eats, Grubhub) are covered by US-03, because we do not get the customer's contact details. Depends on US-19 (opt-out).

### US-02 Rate my order from the SMS link
**As a** Customer
**I want** to give my order a 1-5 star rating and an optional comment from the link
**so that** I can share how it went in under 30 seconds

Priority: Must · Size: M

**Acceptance criteria**
- Given I open my feedback link
  When the page loads
  Then I see the store name, order date and the pizzas I ordered, plus a 1-5 star rating and an optional comment box (up to 500 characters)
- Given I picked a star rating
  When I tap "Send"
  Then I see a thank-you message, and my feedback is linked to that order and store
- Given I tap "Send" without picking a star rating
  When the form checks my answer
  Then I see "Please choose a rating" and nothing is sent
- Given my link is more than 7 days old or I have already sent feedback for this order
  When I open it
  Then I see a message saying the link is no longer active, and no second rating is saved

### US-03 Leave feedback by QR code on the box or receipt
**As a** Customer
**I want** to scan a QR code on my pizza box or receipt to leave feedback
**so that** I can reach the store even when I ordered through a delivery app

Priority: Must · Size: M

**Acceptance criteria**
- Given a pizza box or receipt with a store's QR code
  When I scan it
  Then a feedback form opens with that store already selected, and I can choose how I ordered (online, in store, DoorDash, Uber Eats, Grubhub), give 1-5 stars and add an optional comment
- Given I submit the QR form with a rating
  When it is saved
  Then I see a thank-you message, and the feedback is linked to that store and channel
- Given the same device has already sent 3 QR feedback forms for the same store today
  When I try to send another
  Then I see "Thanks, we already have your feedback for today" and nothing more is saved

### US-04 Rate individual pizzas
**As a** Customer
**I want** to give a thumbs up or down to each pizza in my order
**so that** the store knows which pizza was the problem (or the favourite)

Priority: Should · Size: S

**Acceptance criteria**
- Given my SMS feedback form lists the 3 pizzas in my order
  When I tap thumbs up or thumbs down on any of them
  Then each choice is saved against that pizza, and rating pizzas is optional
- Given I use the QR form, which does not know my order
  When I want to rate a pizza
  Then I can pick up to 5 pizzas from the store's current menu and rate each one
- Given I skip all pizza ratings
  When I send the form
  Then my overall rating is still saved

### US-05 Choose whether I want to be contacted
**As a** Customer
**I want** to decide whether the store may contact me about my feedback
**so that** I can get a bad order made right without being contacted if I don't want to be

Priority: Must · Size: S

**Acceptance criteria**
- Given I am on either feedback form
  When I tick "The store may contact me about this"
  Then I am asked for a phone number or email (already filled in if the order has them), and it is saved with my feedback
- Given I leave the box unticked
  When I send the form
  Then no contact details are saved with this feedback, and managers see it as "No contact allowed"
- Given I ticked the box and entered a phone number with fewer than 10 digits or an invalid email
  When I send the form
  Then I see an inline error on that field and nothing is sent

## Epic 2: Recover unhappy customers
Every 1-2 star rating reaches the right manager fast and ends with a recorded outcome, so unhappy customers come back.

### US-06 Alert on a low rating
**As a** Store manager
**I want** to be alerted within 5 minutes when my store gets a 1 or 2 star rating
**so that** I can reach the customer while they can still be won back

Priority: Must · Size: M

**Acceptance criteria**
- Given a customer sends a 1 or 2 star rating for my store
  When it is saved
  Then I get an alert within 5 minutes showing the rating, the comment, the channel, the pizzas rated thumbs down and whether contact is allowed
- Given a customer sends a 3-5 star rating
  When it is saved
  Then no alert is sent, and the feedback appears in my queue (US-07)
- Given nobody has acknowledged a low-rating alert after 2 hours during opening hours
  When the 2 hours pass
  Then the Owner is alerted with the same details

### US-07 Feedback queue for my store
**As a** Store manager
**I want** a list of my store's feedback, with open low ratings at the top
**so that** I can see at a glance what still needs handling

Priority: Must · Size: M

**Acceptance criteria**
- Given my store has feedback
  When I open the queue
  Then I see open 1-2 star items first (oldest first), then all other feedback newest first, and I can filter by rating (1-5) and by date range
- Given a 1-2 star item has been open for more than 24 hours
  When I view the queue
  Then it is marked "Overdue"
- Given I manage one store
  When I open the queue
  Then I see only my store's feedback and cannot open another store's items

### US-08 Log contact with the customer
**As a** Store manager
**I want** to record that I contacted the customer and what we agreed
**so that** anyone at the store can see the customer has already been looked after

Priority: Must · Size: S

**Acceptance criteria**
- Given a low-rating item where contact is allowed
  When I open it
  Then I see the customer's phone or email with a tap-to-call or tap-to-email action, and I can add a note of up to 500 characters
- Given I save a contact note
  When anyone at my store opens the item later
  Then they see the note, my name and the time it was saved
- Given a low-rating item where contact is not allowed
  When I open it
  Then no contact details or contact actions are shown, and the item says "No contact allowed: resolve internally"

### US-09 Issue a make-good credit
**As a** Store manager
**I want** to give an unhappy customer a credit for their next order
**so that** they have a reason to order from us again instead of switching to a competitor

Priority: Must · Size: M

**Acceptance criteria**
- Given a low-rating item where contact is allowed
  When I issue a credit of $1-$25
  Then the customer receives a single-use code by SMS or email, valid for 30 days on our own online ordering or in store, and the credit is recorded on the item
- Given I enter a credit above $25
  When I try to issue it
  Then I see "Credits over $25 need owner approval" and it is sent to the Owner for approval instead of to the customer
- Given contact is not allowed on the item
  When I open it
  Then the credit option is not available

**Notes:** The $25 cap is an assumption; see Open questions.

### US-10 Resolve a feedback item with an outcome
**As a** Store manager
**I want** to close a low-rating item with an outcome and a reason
**so that** the Owner can see how problems were handled and what caused them

Priority: Must · Size: S

**Acceptance criteria**
- Given an open low-rating item
  When I mark it resolved
  Then I must choose an outcome (credit issued, apology only, customer not reachable, no action needed) and at least one reason (late, cold, wrong or missing item, taste/quality, staff, other), and the item leaves the open list
- Given I try to resolve an item without choosing an outcome
  When I tap "Resolve"
  Then I see "Choose an outcome" and the item stays open
- Given an item was resolved by mistake
  When I reopen it within 7 days
  Then it returns to the open list with its history kept

### US-11 Redeem a make-good credit
**As a** Customer
**I want** to use the credit code I was sent on my next order
**so that** the store's apology actually makes my next pizza cheaper

Priority: Must · Size: S

**Acceptance criteria**
- Given I have a valid, unused credit code
  When I enter it at checkout in our online ordering or give it in store
  Then the credit is taken off my order total, up to the order total, and the code is marked used
- Given my code is expired, already used or unknown
  When I enter it
  Then I see a message giving the reason and my order total does not change
- Given I redeem a credit
  When the Owner looks at recovery results (US-12)
  Then that order counts as a won-back customer for the store that issued the credit

## Epic 3: Owner insights
The Owner can see where customers are happy or unhappy and use it in the weekly KPI review.

### US-12 Satisfaction by store
**As an** Owner
**I want** a weekly view of feedback results for each store
**so that** I can spot a store that is losing customers and step in before it hurts sales

Priority: Should · Size: M

**Acceptance criteria**
- Given feedback exists for the selected week
  When I open the store view
  Then for each store I see the number of ratings, average rating, % of 1-2 star ratings, % of low ratings resolved within 24 hours, credits issued ($) and credits redeemed
- Given a store has fewer than 10 ratings in the week
  When I view it
  Then its numbers are marked "Not enough data"
- Given I choose a week with no feedback at all
  When the view loads
  Then I see "No feedback for this week" instead of empty charts

### US-13 Ratings by pizza
**As an** Owner
**I want** to see thumbs-up and thumbs-down counts for each pizza across all stores
**so that** I can decide which pizzas to promote and which to fix or remove from the menu

Priority: Should · Size: M

**Acceptance criteria**
- Given pizza ratings exist (US-04)
  When I open the pizza view for a date range
  Then I see each menu pizza with thumbs up, thumbs down and % positive, sortable by any column, and I can filter by store
- Given a pizza has fewer than 20 ratings in the range
  When I view it
  Then it is marked "Low confidence"

**Notes:** Supports the 30-day plan's week-4 review ("double down on the best product, cut the weakest").

### US-14 Top complaint reasons
**As an** Owner
**I want** to see the most common complaint reasons by store
**so that** I can fix the root cause (e.g. slow delivery at one store) instead of paying credits forever

Priority: Should · Size: S

**Acceptance criteria**
- Given resolved low-rating items with reasons (US-10)
  When I open the reasons view for a date range
  Then I see each reason's count and share of low ratings, overall and per store
- Given no low-rating items were resolved in the range
  When I open the view
  Then I see "No resolved complaints in this period"

### US-15 Weekly feedback digest
**As an** Owner
**I want** a weekly email summary of feedback
**so that** I get the key numbers for the Monday KPI review without opening the dashboard

Priority: Could · Size: S

**Acceptance criteria**
- Given it is Monday at 8:00 (Texas time)
  When the digest is sent
  Then I receive an email with last week's average rating per store, the 3 lowest-rated stores, overdue items and total credits issued
- Given there was no feedback last week
  When the digest is sent
  Then it says "No feedback last week" instead of showing empty tables

## Epic 4: Public reviews
Happy and unhappy customers alike are invited to share their experience publicly, helping new customers find us.

### US-16 Invitation to post a Google review
**As a** Customer
**I want** to be offered a link to review the store on Google after I send feedback
**so that** I can share my experience with other people looking for pizza nearby

Priority: Should · Size: S

**Acceptance criteria**
- Given I sent feedback with any rating from 1 to 5 stars
  When the thank-you message appears
  Then I see a "Review us on Google" link that opens that store's Google review page
- Given the store has no Google review link set up
  When the thank-you message appears
  Then no review invitation is shown, and the thank-you message still appears
- Given I got a make-good credit
  When the credit is sent
  Then it does not mention or depend on a public review

**Notes:** The invitation is shown whatever the rating, to avoid review gating (inviting only happy customers). Credits are never tied to reviews.

## Non-functional stories

### US-17 Feedback in English or Spanish
**As a** Customer
**I want** to use the feedback form and SMS in English or Spanish
**so that** I can give feedback in the language I'm most comfortable with

Priority: Should · Size: M

**Acceptance criteria**
- Given my phone's language is Spanish
  When I open the feedback form
  Then it is shown in Spanish, and I can switch to English with one tap (and back)
- Given my phone uses any other language
  When I open the form
  Then it is shown in English with a visible "Español" switch
- Given I write my comment in Spanish
  When a Store manager opens it
  Then the comment is shown exactly as written

### US-18 Fast, accessible feedback form
**As a** Customer
**I want** the feedback form to load quickly and work on any phone, including with a screen reader
**so that** I can finish it in under 30 seconds wherever I am

Priority: Must · Size: M

**Acceptance criteria**
- Given a mid-range phone on 4G
  When I open a feedback link or QR code
  Then the form is ready to use within 2 seconds
- Given a 360px-wide screen
  When I use the form
  Then there is no horizontal scrolling and every star, thumb and button has a tap target of at least 44x44 px
- Given I use a screen reader or keyboard only
  When I fill in and send the form
  Then every control has a readable label and I can complete it without a mouse or touch (WCAG 2.1 AA)

### US-19 Stop feedback texts
**As a** Customer
**I want** to stop feedback texts by replying STOP
**so that** I am not bothered by messages I don't want

Priority: Must · Size: S

**Acceptance criteria**
- Given I received a feedback SMS
  When I reply STOP
  Then I get one confirmation text and receive no further feedback texts
- Given I opted out
  When I place new orders
  Then no feedback SMS is sent (US-01), and I can still use the QR code form
- Given I opted out and later reply START
  When my next order is completed
  Then feedback texts resume

### US-20 Customer contact details stay private
**As a** Customer
**I want** my contact details and comments to be seen only by the people who need them
**so that** I can give honest feedback without worrying about my data

Priority: Must · Size: S

**Acceptance criteria**
- Given I allowed contact on my feedback
  When staff view it
  Then only the Store manager of that store and the Owner can see my phone or email
- Given feedback is older than 12 months
  When the monthly cleanup runs
  Then my contact details are removed from it and only the rating, comment, store and date remain
- Given someone without manager or owner access tries to open a feedback item
  When they try
  Then they are refused and no feedback content is shown

## Out of scope (v1)
- Collecting feedback inside DoorDash / Uber Eats / Grubhub or reading their ratings: we do not control those apps; the QR code on the box covers these customers.
- Replying to Google or Yelp reviews from our system: managers keep using the Google Business profile directly.
- Automatic credits without a manager: recovery should be personal; the $ exposure is uncontrolled.
- Rewards or discounts for leaving feedback or reviews: incentivised reviews create compliance risk and skew ratings.
- Catering and corporate account feedback: small number of accounts, handled directly by the catering reps for now.
- NPS surveys, AI sentiment analysis or automatic comment tagging: the manager-chosen reasons (US-10) give enough signal for v1.
- Staff-level ratings (rating a specific driver or cook): sensitive for staff; revisit once store-level data is stable.
- Offline support for the QR form: customers almost always scan with mobile data available.
- Email feedback requests: SMS already reaches own-channel customers; add later if SMS consent rates are low.

## Assumptions
- Personas are Customer, Store manager and Owner; there is no separate menu lead or catering persona (Q1).
- The v1 core goal is recovering unhappy customers so they order again (Q2).
- All four capability areas are in v1: collection and recovery are Must, insights and public reviews are Should (Q3).
- Feedback comes in by SMS link for own-channel orders with SMS consent, and by QR code on the box/receipt for everyone else, including delivery-app orders (Q4).
- Contact details are optional; feedback can be anonymous (Q5).
- Low rating = 1 or 2 stars. Alert within 5 minutes, escalate to Owner after 2 hours without acknowledgement, resolve within 24 hours (Q6).
- A Store manager can issue make-good credits of up to $25 without approval; credits are single-use, valid for 30 days, and redeemable only on our own online ordering or in store (Q6).
- The Google review invitation goes to every respondent, whatever the rating (Q7).
- The form must work in under 30 seconds on a phone, in English and Spanish, with SMS opt-out and limited access to contact details (Q8).
- The SMS request goes out within 60 minutes of completion, at most once per phone number every 7 days, and the link expires after 7 days.
- Customer contact details are removed from feedback after 12 months.
- Existing loyalty sign-ups have agreed to receive texts, so feedback SMS can go to them.
- v1 success targets (10% response rate, 90% of low ratings resolved within 24 h, 30% of credit recipients reorder within 30 days) are placeholders to replace with real baselines.

## Open questions
- Is $25 the right make-good cap, and should it vary with the order total? (Owner)
- Does the loyalty program's SMS consent cover feedback texts, or do we need separate consent? (Owner, with legal/marketing)
- Which system marks an order as delivered or picked up, and does in-store ordering capture phone numbers? (Spec author, with ops)
- Is there a Google review link for every store, and who keeps them up to date? (Owner / marketing)
- Should the Owner also be alerted immediately for 1-star ratings, or only on escalation? (Owner)
- How long should ratings and comments be kept (the 12-month removal covers contact details only)? (Owner, with legal)
- Should store managers see other stores' anonymised averages to compare themselves? (Owner)

## Interview log
The user was not available (non-interactive run), so each question was answered with the recommended option and recorded as an assumption. Full questions and options: `questionnaire.md`.

| # | Question | Answer (assumed) |
|---|---|---|
| Q1 | Who uses the feature? | Customer + Store manager + Owner |
| Q2 | Most important v1 outcome? | Win back unhappy customers so they order again |
| Q3 | Capability areas in v1? | Collect feedback, recover unhappy customers, owner insights, Google review invitation |
| Q4 | How does feedback reach us? | SMS link for own-channel orders + QR code on box/receipt for all orders |
| Q5 | Feedback without contact details? | Yes, contact is optional |
| Q6 | What happens on a low rating? | Manager alert within 5 min, $25 credit cap, 2 h escalation to Owner, resolve within 24 h |
| Q7 | Public review invitation? | Everyone, whatever the rating (no review gating); Should |
| Q8 | Non-functional needs? | Under 30 s on mobile + accessible, English and Spanish, SMS opt-out + private contact details |

Repo context used without asking: $3M / 360-day goal (`CLAUDE.md`); ordering channels, loyalty SMS list and week-4 menu review (`plans/30-day-plan.md`); multi-store, multi-metro growth (`plans/180-day-plan.md`).

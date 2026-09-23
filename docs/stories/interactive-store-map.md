# Interactive Store Map: User stories

## Context
A public, mobile-first map of our open pizza restaurants. It answers "is there one near me, is it open, and how do I get there or call?" The core v1 goal is to turn map visits into **store visits and phone calls**, which feed the $3M / 360-day revenue target. v1 success is measured by the number of taps on "Call" and "Get directions" from the map (see Open questions: this needs tracking).

## Personas
| Persona | Who they are | What they need most |
|---|---|---|
| Hungry customer | A member of the public, usually on a phone over 4G and often already on the move, looking for one of our restaurants | To find a nearby open store fast, then call it or get directions in one tap |

## Epics overview
| Epic | Goal | Stories | Priority |
|---|---|---|---|
| 1. Find stores on the map | Show every restaurant a customer can actually use, where it is | US-01 – US-06 | Must |
| 2. Store details | Give the facts needed to decide to go: address, hours, open now | US-07 – US-09 | Must |
| 3. Call or visit | Turn interest into a call or a trip | US-10 – US-11 | Must |
| Non-functional | Fast, usable on small phones, accessible | US-12 – US-15 | Must |

## Epic 1: Find stores on the map
Customers see all of our open restaurants on a map they can move around.

### US-01 See all open restaurants on a map
**As a** Hungry customer
**I want** to see every one of our open restaurants as a pin on a map
**so that** I can tell at a glance whether there is one near me

Priority: Must · Size: M

**Acceptance criteria**
- Given there are 3 open restaurants
  When I open the map page
  Then I see exactly 3 pins, and the initial view is zoomed so that all 3 are visible without panning
- Given there is only 1 open restaurant
  When I open the map page
  Then the map centres on it at street-to-neighbourhood zoom, not fully zoomed in on a single building
- Given the store information cannot be loaded
  When I open the map page
  Then I see a readable message ("We couldn't load our restaurants. Please try again.") with a "Try again" button, not an empty map
- Given there are no open restaurants
  When I open the map page
  Then I see the message "No restaurants are open yet, check back soon" instead of an empty map

### US-02 Move and zoom the map
**As a** Hungry customer
**I want** to pan and zoom the map with my finger or mouse
**so that** I can look closely at the area I'm in or heading to

Priority: Must · Size: S

**Acceptance criteria**
- Given the map is shown on a phone
  When I pinch or drag with one finger
  Then the map zooms or pans, and the page itself does not scroll or zoom
- Given the map is shown on a desktop
  When I use the scroll wheel or the + / − buttons
  Then the map zooms in or out one level per step
- Given I have zoomed out to the widest level
  When I try to zoom out further
  Then nothing happens and the pins stay visible

### US-03 Only see stores I can actually use
**As a** Hungry customer
**I want** the map to show only restaurants that are open for business
**so that** I never travel to a site that hasn't opened yet

Priority: Must · Size: S

**Acceptance criteria**
- Given the store list has 3 open, 9 planned and 3 franchise-test sites
  When I open the map page
  Then only the 3 open restaurants have pins, and the planned and franchise-test sites are not shown or mentioned anywhere on the page
- Given a store changes from planned to open
  When I reload the map
  Then its pin appears, with no other change to the page needed

### US-04 Tell ghost kitchens apart
**As a** Hungry customer
**I want** ghost kitchens clearly labelled as "Pickup & delivery only · no dine-in"
**so that** I don't arrive expecting a dining room

Priority: Must · Size: S

**Acceptance criteria**
- Given a ghost kitchen and a regular restaurant are both on the map
  When I look at the map
  Then the ghost kitchen pin looks different (shape or icon, not colour alone), and a legend explains the difference
- Given I open a ghost kitchen's store card
  When the card appears
  Then "Pickup & delivery only · no dine-in" appears directly under the store name, before the address
- Given I open a regular restaurant's store card
  When the card appears
  Then no pickup/delivery-only label is shown

### US-05 Tap the right pin where stores are close together
**As a** Hungry customer
**I want** pins that sit close together to stay easy to pick apart
**so that** I open the store I meant to, not its neighbour

Priority: Should · Size: M

**Acceptance criteria**
- Given the 3 Austin stores are within a few kilometres of each other and I'm zoomed out to state level
  When I look at the map
  Then I see one grouped marker labelled "3" instead of overlapping pins
- Given I tap a grouped marker
  When the map responds
  Then it zooms in until the stores show as separate pins

### US-06 See how many restaurants there are
**As a** Hungry customer
**I want** to see a count such as "3 restaurants" above the map
**so that** I know how many options I have before I start exploring

Priority: Could · Size: S

**Acceptance criteria**
- Given there are 3 open restaurants
  When the map page loads
  Then the text "3 restaurants" appears above the map
- Given there is 1 open restaurant
  When the map page loads
  Then the text reads "1 restaurant" (singular)

## Epic 2: Store details
Tapping a pin gives the customer the facts needed to decide whether to go.

### US-07 Open a store card
**As a** Hungry customer
**I want** to tap a pin and see that store's name and full street address
**so that** I know exactly which restaurant it is and where it is

Priority: Must · Size: S

**Acceptance criteria**
- Given the map is shown
  When I tap the "Austin – South Congress" pin
  Then a card opens showing "Austin – South Congress" and its full street address with ZIP code
- Given a store card is open
  When I tap a different pin
  Then the first card closes and the new store's card opens, so only one card is open at a time
- Given a store card is open
  When I tap the card's close button or an empty part of the map
  Then the card closes
- Given a store has no street address yet
  When I tap its pin
  Then the card shows the city and "Full address coming soon" instead of a blank line

### US-08 See the weekly opening hours
**As a** Hungry customer
**I want** to see the store's hours for each day, Monday to Sunday
**so that** I can plan a visit for later in the week

Priority: Must · Size: S

**Acceptance criteria**
- Given a store is open 11:00–22:00 Mon–Thu, 11:00–23:00 Fri–Sat and closed on Sunday
  When I open its card
  Then I see 7 rows, Mon to Sun, with those hours and "Closed" for Sunday
- Given today is Friday in the store's time zone
  When I open its card
  Then the Friday row is highlighted
- Given a store has no hours on file
  When I open its card
  Then the hours section reads "Hours not available, please call to check"

### US-09 See whether the store is open right now
**As a** Hungry customer
**I want** a badge that says whether the store is open now and when that changes
**so that** I don't make a trip to a closed restaurant

Priority: Must · Size: M

**Acceptance criteria**
- Given a store is open 11:00–22:00 today and it is 20:15 in the store's time zone
  When I open its card
  Then the badge reads "Open now · closes 22:00"
- Given the same store and it is 09:30 in the store's time zone
  When I open its card
  Then the badge reads "Closed · opens 11:00"
- Given a store is closed today and next opens Monday at 11:00
  When I open its card on Sunday
  Then the badge reads "Closed · opens Mon 11:00"
- Given a store is open 11:00–01:00 (past midnight) and it is 00:30
  When I open its card
  Then the badge reads "Open now · closes 01:00"
- Given I am viewing from a different time zone than the store
  When I open its card
  Then the badge is based on the store's local time, not mine
- Given a store has no hours on file
  When I open its card
  Then no badge is shown

## Epic 3: Call or visit
One tap from the store card to a phone call or directions: the actions that drive revenue.

### US-10 Call the store in one tap
**As a** Hungry customer
**I want** to tap the phone number on the store card to start a call
**so that** I can order for pickup or ask a question without typing the number

Priority: Must · Size: S

**Acceptance criteria**
- Given I'm on a phone and a store card is open
  When I tap the phone number (e.g. "(512) 555-0100")
  Then my phone's dialler opens with that number filled in
- Given I'm on a desktop
  When I look at the store card
  Then the phone number is shown as readable, selectable text
- Given a store has no phone number on file
  When I open its card
  Then no call link is shown, and there is no broken or empty link

### US-11 Get directions to the store
**As a** Hungry customer
**I want** a "Get directions" link on the store card
**so that** I can navigate there with the maps app I already use

Priority: Must · Size: S

**Acceptance criteria**
- Given I'm on a phone and a store card is open
  When I tap "Get directions"
  Then a maps app or maps website opens with that store's address as the destination, and I don't have to type anything
- Given I'm on a desktop
  When I click "Get directions"
  Then directions open in a new tab, and the store map stays open in the original tab
- Given the store is a ghost kitchen
  When I open its card
  Then "Get directions" is still shown, because pickup customers need it

## Non-functional stories

### US-12 Map loads fast on a phone
**As a** Hungry customer
**I want** the map with pins to appear quickly on my phone's mobile data
**so that** I don't give up and pick a competitor

Priority: Must · Size: M

**Acceptance criteria**
- Given a mid-range phone on a 4G connection
  When I open the map page for the first time
  Then the map with all pins is visible within 3 seconds
- Given a slow connection where the map takes longer than 1 second
  When the page is loading
  Then a loading indicator is shown instead of a blank area

### US-13 Usable on a small phone screen
**As a** Hungry customer
**I want** the map and store card to fit my phone screen and be easy to tap
**so that** I can use it one-handed on the go

Priority: Must · Size: S

**Acceptance criteria**
- Given a screen 360px wide
  When I open the map and a store card
  Then there is no horizontal scrolling, and all card text is readable without zooming
- Given any pin, button or link on the page
  When I measure its tap area
  Then it is at least 44×44px
- Given a store card is open on a 360px screen
  When I look at the screen
  Then the card doesn't cover the whole map, and its close button is visible without scrolling

### US-14 Use the map with a keyboard or screen reader
**As a** Hungry customer
**I want** to reach every store and its details with a keyboard or screen reader
**so that** I can find a restaurant even if I can't use a touchscreen or mouse

Priority: Must · Size: M

**Acceptance criteria**
- Given I'm using only a keyboard
  When I press Tab
  Then focus moves through the store pins one by one with a visible focus outline, Enter opens the store card, and Esc closes it and returns focus to the same pin
- Given I'm using a screen reader
  When a pin gets focus
  Then it announces the store name and, for ghost kitchens, "pickup and delivery only"
- Given a store card is open
  When the screen reader reads it
  Then the name, address, open-now status, hours, phone and directions link are all announced in that order

### US-15 Readable in light and dark mode
**As a** Hungry customer
**I want** the page to follow my phone's light or dark setting and stay readable
**so that** it's comfortable to use at night or in bright sun

Priority: Should · Size: S

**Acceptance criteria**
- Given my device is set to dark mode
  When I open the map page
  Then the page uses a dark theme, and all text and badges meet WCAG 2.1 AA contrast (4.5:1 for body text)
- Given my device is set to light mode
  When I open the map page
  Then the page uses a light theme with the same contrast levels

## Out of scope (v1)
- "Near me" location and address/ZIP search with a distance-sorted list: not selected for v1. The map alone is enough for today's small number of stores.
- "Order from this store" / online ordering: the v1 goal is visits and calls, not online orders.
- Coming-soon (planned) stores on the public map: planned sites are hidden (US-03) so customers aren't misled.
- Store manager or staff editing of store info: store managers are not a v1 persona. Data is maintained internally outside the map.
- Internal expansion view (planned / franchise-test sites): the existing `maps/store-locations.html` prototype keeps that role.
- Temporary closure / holiday notices: they need ongoing upkeep. Weekly hours plus the open-now badge are v1.
- Spanish language: not selected for v1. Worth revisiting for Texas markets.
- Detailed failure handling for map tiles or partial data: only the basic "couldn't load restaurants" message (US-01) is in v1.

## Assumptions
- Real store names, addresses, phone numbers, hours and time zones will exist for every open store. The prototype holds sample data only, with no hours or phones.
- Ghost kitchens accept phone calls and walk-in pickup, so they get "Call" and "Get directions" like other stores (US-10, US-11).
- The open-now badge uses each store's own time zone. Most Texas stores are US Central, but El Paso and future states differ.
- The map starts zoomed to fit all open stores. As the business expands beyond Texas, this will zoom out to multiple states.
- "Get directions" opens the device's usual maps app on phones and a maps website in a new tab on desktop.
- A basic "couldn't load restaurants" message is included (US-01) even though "graceful failures" wasn't selected as a quality goal, because a blank map is a dead end.
- The page is English-only in v1.
- Store info is updated by the internal team through a process outside the map. This needs no customer-facing story.

## Open questions
- **How is the success metric measured?** Call and directions taps need some form of tracking, and there is no story for it because there is no internal persona. Should tracking be added to v1, and what's the target number? *Owner / marketing*
- **Do ghost kitchens take phone orders and walk-in pickup?** If not, US-10/US-11 should hide those actions for them. *Operations*
- **Who supplies and maintains the real store data (addresses, phones, hours)?** *Operations / store managers*
- **Where does the map live?** Is it a standalone page, or linked from or embedded in the main website? *Marketing*

## Interview log
**Round 1: who and why**
- *Who uses the map?* → Hungry customers only (store managers, owner/expansion team and franchise prospects not selected).
- *Most important v1 outcome?* → Visits + calls to stores.
- *v1 capability areas?* → Map + store details (near-me search, store actions and coming-soon stores not selected).
- *Constraint that shapes v1 most?* → Mobile-first, public web.

**Round 2: follow-ups**
- *Store actions weren't in scope, but the goal is visits + calls. What can the card do?* → Tap-to-call + directions (added as Epic 3).
- *How should open ghost kitchens appear?* → Shown, labelled "Pickup & delivery only".
- *How should hours work?* → Weekly hours + "Open now" badge (temporary closures not selected).
- *Which non-functional needs must v1 meet?* → Fast on 4G phones, Accessible (Spanish and graceful failures not selected).

The existing spec in `docs/specs/` was intentionally not used as input for these stories, at the user's request.

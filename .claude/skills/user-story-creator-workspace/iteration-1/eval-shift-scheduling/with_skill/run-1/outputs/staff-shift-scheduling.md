# Staff Shift Scheduling: User stories

## Context
Store managers at our 12 pizza stores build staff shift schedules in spreadsheets today. That is slow and makes it easy to leave peak shifts short-staffed. The v1 tool lets managers build and publish a weekly schedule per store, lets crew see their shifts and manage availability, time off and swaps on their phones, and gives an area manager one view across all stores. The core goal is that every peak shift is fully staffed, so we don't lose orders (and revenue toward the $3M target) to short staffing. **v1 success:** at least 95% of peak blocks (Fri/Sat 17:00-21:00) across all 12 stores meet their staffing target, and a manager builds a week's schedule in under 30 minutes (baseline still to be measured, see Open questions).

## Personas
| Persona | Who they are | What they need most |
|---|---|---|
| Store Manager | Runs one of the 12 stores. Builds the weekly schedule, today in a spreadsheet, usually on a desktop or tablet in the back office. | Build a fully staffed schedule quickly and handle last-minute changes without phoning everyone. |
| Crew Member | Hourly employee (cook, cashier, driver, shift lead), often part-time or a student. Uses their own phone. | Know exactly when they work, and have an easy way to give availability, ask for time off and swap shifts. |
| Area Manager | Oversees several or all stores and is responsible for coverage and labor hours across them. | See at a glance which stores are short-staffed or over their hours budget, and move staff between stores. |

## Epics overview
| Epic | Goal | Stories | Priority |
|---|---|---|---|
| 1. Build & publish schedules | Managers create a fully staffed weekly schedule fast and share it | US-01 to US-08 | Must |
| 2. Availability & time off | Schedules respect when people can actually work | US-09 to US-11 | Must |
| 3. My schedule on my phone | Crew always know when they work | US-12 to US-14 | Must |
| 4. Shift swaps & open-shift coverage | Gaps get filled without the manager phoning around | US-15 to US-17 | Should |
| 5. Multi-store overview & labor hours | Coverage and hours are visible and balanced across 12 stores | US-18 to US-21 | Should |
| Non-functional | Usable on phones, private, bilingual | US-22 to US-24 | Must / Should |

## Epic 1: Build & publish schedules
Store managers go from a blank week to a published, fully staffed schedule in under 30 minutes.

### US-01 Maintain the store roster
**As a** Store Manager
**I want** to add, edit and deactivate staff at my store, each with one or more positions (cook, cashier, driver, shift lead)
**so that** I can only schedule people who actually work here, in positions they are trained for

Priority: Must · Size: S

**Acceptance criteria**
- Given I am a Store Manager
  When I add a person with a name, contact details, home store and positions "cook, cashier"
  Then they appear on my store's roster and can be assigned to cook or cashier shifts only
- Given a person has shifts in a published future week
  When I deactivate them
  Then I get a warning that lists those shifts, and after I confirm, the shifts become open shifts (unassigned)
- Given I try to add a person with the same phone number or email as an existing active staff member
  When I save
  Then the tool rejects it and points me to the existing record

**Notes:** Setting a person up for the first time is manual. Spreadsheet import is out of scope.

### US-02 Create a weekly schedule by position
**As a** Store Manager
**I want** to create shifts for a Monday-Sunday week, each with a date, start time, end time and position, and assign a person to each
**so that** I can plan who works when without a spreadsheet

Priority: Must · Size: M

**Acceptance criteria**
- Given a draft week for my store
  When I add a shift "Fri 17:00-22:00, driver" and assign a person who has the driver position
  Then the shift appears in the week view under Friday, labelled with the person and position
- Given I try to assign a person to a position they don't hold
  When I pick them for a "cook" shift
  Then they are not offered in the list for that shift
- Given I enter an end time that is before or equal to the start time (and the shift doesn't cross midnight)
  When I save the shift
  Then the tool rejects it with the message "End time must be after start time"
- Given a draft week
  When I leave the page without publishing
  Then my changes are still in the draft when I come back, and crew cannot see them

### US-03 Start from last week's schedule
**As a** Store Manager
**I want** to copy a previous week's shifts into a new draft week
**so that** I only adjust what changed instead of rebuilding the schedule from scratch every week

Priority: Must · Size: S

**Acceptance criteria**
- Given last week has 60 shifts
  When I create next week by copying last week
  Then the draft contains the same 60 shifts on the matching weekdays, with the same people assigned
- Given a copied shift is assigned to someone who has since been deactivated or has approved time off that day
  When the copy completes
  Then that shift is copied as an open shift and flagged, and I see a count like "3 shifts need attention"

### US-04 See coverage against staffing targets
**As a** Store Manager
**I want** to set how many people I need per position for each time block (for example, Fri 17:00-21:00: 3 cooks, 3 drivers, 1 cashier), and see where the draft falls short or goes over
**so that** I don't leave the dinner rush short-staffed and lose orders

Priority: Must · Size: M

**Acceptance criteria**
- Given the Fri 17:00-21:00 target is 3 drivers and only 2 are scheduled
  When I view the week
  Then that block is highlighted as "short 1 driver"
- Given every block meets its target
  When I view the week
  Then the week shows "Fully staffed" and no block is highlighted
- Given no targets are set for my store yet
  When I view the week
  Then I see a prompt to set targets, and the coverage status reads "No targets set" instead of "Fully staffed"

**Notes:** Targets repeat every week until they are changed. Who sets or approves the targets is an open question.

### US-05 Publish the schedule
**As a** Store Manager
**I want** to publish a draft week so that crew can see it and are notified
**so that** everyone knows their shifts without me posting a sheet or texting each person

Priority: Must · Size: S

**Acceptance criteria**
- Given a draft week with assigned shifts
  When I publish it
  Then every crew member with at least one shift that week is notified within 5 minutes, and the week becomes visible to crew
- Given the draft still has short-staffed blocks or open shifts
  When I publish
  Then I am shown the list of gaps and must confirm "Publish anyway" before it goes out
- Given next week's schedule is not published by Thursday 18:00
  When that time passes
  Then I get a reminder to publish

### US-06 Change a published schedule
**As a** Store Manager
**I want** to add, move, reassign or remove shifts in a published week
**so that** I can react to call-outs and changes without re-sending the whole schedule

Priority: Must · Size: S

**Acceptance criteria**
- Given a published week
  When I move Maria's Saturday shift from 11:00-17:00 to 16:00-22:00
  Then only Maria is notified, and the notification shows the old and new times
- Given I remove a shift that starts in less than 24 hours
  When I confirm
  Then the person is notified immediately and the removed shift shows as "Cancelled" in their schedule (it does not silently disappear)

### US-07 Warn on availability and time-off conflicts
**As a** Store Manager
**I want** a warning when I assign someone outside their availability or during their approved time off
**so that** I catch no-shows before they happen, not on the day

Priority: Must · Size: M

**Acceptance criteria**
- Given Jake is available Mon-Fri only
  When I assign him a Saturday shift
  Then I see "Outside Jake's availability", and I can only keep the assignment after entering a reason
- Given Ana has approved time off on 14 Nov
  When I assign her a shift on 14 Nov
  Then I see "Ana has approved time off" and can only override it with a reason
- Given I override a warning
  When I save
  Then the reason is stored with the shift and visible to the Area Manager

### US-08 Warn on overtime
**As a** Store Manager
**I want** a warning when an assignment would take a person over 40 scheduled hours in the week, counted across all stores
**so that** I avoid unplanned overtime cost

Priority: Should · Size: S

**Acceptance criteria**
- Given Luis already has 36 scheduled hours this week at any store
  When I assign him a 6-hour shift
  Then I see "This takes Luis to 42 h (overtime)" and can override it with a reason
- Given Luis has 34 scheduled hours
  When I assign him a 6-hour shift
  Then no overtime warning appears

## Epic 2: Availability & time off
Crew tell us when they can work, so schedules fit their lives and no-shows drop.

### US-09 Set my weekly availability
**As a** Crew Member
**I want** to set the days and times I can usually work each week, from my phone
**so that** I get shifts I can actually make

Priority: Must · Size: S

**Acceptance criteria**
- Given I am signed in on my phone
  When I set "Mon-Wed 16:00-23:00, Sat all day, other days unavailable" and save
  Then my manager sees it when assigning shifts, and it applies to every week that has not been published yet
- Given I change my availability
  When the current week or next week is already published
  Then I see "Changes apply from <first unpublished week>. Contact your manager for shifts already scheduled."

### US-10 Request time off
**As a** Crew Member
**I want** to request specific days or times off, with an optional note
**so that** I can plan exams, family events and holidays without worrying I'll be scheduled

Priority: Must · Size: S

**Acceptance criteria**
- Given no schedule is published for 20-22 Dec
  When I request 20-22 Dec off
  Then my Store Manager is notified and the request shows as "Pending" in my app
- Given I already have a published shift on a requested day
  When I submit the request
  Then I see a warning that the shift stays mine unless my manager changes it or I swap it (US-15)
- Given a request is still pending
  When I cancel it
  Then it is withdrawn and my manager is notified

### US-11 Approve or decline time off
**As a** Store Manager
**I want** to see pending time-off requests next to how many people are already off that day, and approve or decline them
**so that** I can say yes when possible without leaving a busy day short

Priority: Must · Size: S

**Acceptance criteria**
- Given a pending request for Sat 15 Nov, when 2 other cooks are already off that day
  When I open the request
  Then I see "2 other cooks already off on Sat 15 Nov" before deciding
- Given I decline a request
  When I save
  Then I must enter a reason, and the crew member is notified with that reason
- Given a request is still pending 7 days before the requested date
  When that point is reached
  Then I get a reminder to decide

## Epic 3: My schedule on my phone
Crew always know when and where they work, which cuts "I didn't know I was on" no-shows.

### US-12 View my upcoming shifts
**As a** Crew Member
**I want** to see my shifts for this week and the next published weeks on my phone, including store, position and times
**so that** I know when and where to show up

Priority: Must · Size: S

**Acceptance criteria**
- Given the next two weeks are published
  When I open the tool on my phone
  Then I see my shifts in date order, each with store name, position, start and end time, and my total hours per week
- Given I am scheduled at a store that is not my home store
  When I view that shift
  Then the store name and address are clearly shown
- Given no schedule has been published yet for next week
  When I look at next week
  Then I see "Not published yet" (not an empty week that looks like I'm off)

### US-13 See who I'm working with
**As a** Crew Member
**I want** to see who else is on the same shift at my store
**so that** I know my team and can find someone to swap with

Priority: Could · Size: S

**Acceptance criteria**
- Given I have a shift Fri 17:00-22:00
  When I open it
  Then I see coworkers on overlapping shifts by first name and last initial, with their positions, and no contact details

### US-14 Get a shift reminder
**As a** Crew Member
**I want** a reminder before my shift starts
**so that** I don't forget a shift and leave the store short

Priority: Could · Size: S

**Acceptance criteria**
- Given reminders are on (the default)
  When my shift starts in 2 hours
  Then I get a reminder with store and start time
- Given I turned reminders off
  When a shift approaches
  Then I get no reminder, but I still get notifications about schedule changes

## Epic 4: Shift swaps & open-shift coverage
Gaps get filled by the crew themselves, and the manager keeps control.

### US-15 Offer my shift for swap or pickup
**As a** Crew Member
**I want** to offer one of my published shifts to coworkers who hold the same position
**so that** I can get cover when something comes up, without no-showing

Priority: Should · Size: M

**Acceptance criteria**
- Given I have a published cook shift on Friday
  When I offer it
  Then every active coworker at that store who holds the cook position, is available, and would not be double-booked is notified
- Given a coworker accepts
  When they confirm
  Then the swap goes to my Store Manager for approval, and the shift stays mine until it is approved
- Given nobody accepts by 12 hours before the shift starts
  When that point is reached
  Then my Store Manager and I are notified that the shift is still mine

### US-16 Approve a shift swap
**As a** Store Manager
**I want** to approve or decline accepted swaps, with the same conflict warnings as when I assign shifts (US-07, US-08)
**so that** swaps don't create overtime or put the wrong position on the line

Priority: Should · Size: S

**Acceptance criteria**
- Given a swap is accepted by a qualified coworker
  When I approve it
  Then the shift moves to the new person and both people are notified
- Given the swap would take the new person over 40 hours
  When I open it
  Then I see the overtime warning before I approve
- Given I decline
  When I save
  Then both people are notified and the shift stays with the original person

### US-17 Post an open shift
**As a** Store Manager
**I want** to post an unfilled or called-out shift so that qualified staff can claim it, and optionally include staff from other stores
**so that** a sick call on a Friday doesn't leave the store short

Priority: Should · Size: M

**Acceptance criteria**
- Given an open Fri 17:00-22:00 driver shift
  When I post it to my store
  Then every active driver at my store who would not be double-booked is notified, and the first to claim it is assigned (I am notified)
- Given I choose "include nearby stores"
  When I post it
  Then drivers at the other stores I select are also notified
- Given nobody claims it within the time I set (default 2 hours)
  When that time passes
  Then I am notified that the shift is still open

**Notes:** Depends on multi-store staffing rules (US-18).

## Epic 5: Multi-store overview & labor hours
Across all 12 stores, coverage gaps and labor hours are visible early enough to act on.

### US-18 Schedule staff at another store
**As an** Area Manager
**I want** to schedule a person at a store other than their home store
**so that** I can cover a short store with people from a store that has spare hours

Priority: Should · Size: M

**Acceptance criteria**
- Given Sam's home store is Austin South and he holds the cook position
  When I assign him a cook shift at Austin North
  Then the shift appears in both his schedule and Austin North's schedule, and his hours count toward his weekly total
- Given Sam already has a shift at Austin South from 16:00-22:00
  When anyone tries to assign him at Austin North from 18:00-23:00
  Then the assignment is blocked with "Sam is already working at Austin South 16:00-22:00" (this cannot be overridden)

**Notes:** Whether Store Managers can also borrow staff directly, or only through the Area Manager, is an assumption (see Assumptions).

### US-19 See coverage across all stores
**As an** Area Manager
**I want** one view of all my stores for a given week, showing which are published and which have short-staffed peak blocks
**so that** I can fix gaps before they cost us orders

Priority: Should · Size: M

**Acceptance criteria**
- Given 12 stores, where 2 have unpublished schedules for next week and 1 is short 2 drivers on Saturday
  When I open next week's overview
  Then I see all 12 stores, with the 2 marked "Not published" and the 1 marked "Short: Sat 17:00-21:00, 2 drivers"
- Given I select a store
  When I open it
  Then I see that store's week view in read-only mode, plus any warnings that were overridden and their reasons

### US-20 Track scheduled hours against a budget
**As an** Area Manager
**I want** to set a weekly hours budget per store and see scheduled hours against it
**so that** labor stays in line with what each store sells

Priority: Should · Size: M

**Acceptance criteria**
- Given Austin South has a budget of 420 h
  When the draft or published week has 450 scheduled hours
  Then both the Store Manager and I see "450 / 420 h (+30 h over)"
- Given a store has no budget set
  When I view the overview
  Then that store shows "No budget" rather than a number

**Notes:** v1 budgets are in hours, not dollars (wage data is out of scope).

### US-21 Export scheduled hours
**As an** Area Manager
**I want** to export a week's scheduled hours per person and store as a spreadsheet file
**so that** payroll can be prepared without retyping hours

Priority: Could · Size: S

**Acceptance criteria**
- Given a published week
  When I export it
  Then I get one row per person per store, with name, store, position, date, start, end and hours
- Given the week is not published
  When I try to export
  Then I see "Only published weeks can be exported"

## Non-functional stories

### US-22 Crew can use it comfortably on a phone
**As a** Crew Member
**I want** every crew screen to work well on my phone
**so that** I can check my shifts on the bus or between classes

Priority: Must · Size: M

**Acceptance criteria**
- Given a phone screen 360 px wide
  When I use any crew screen (my shifts, availability, time off, swaps)
  Then there is no horizontal scrolling and every button is at least 44 px tall
- Given a mid-range phone on 4G
  When I open "My shifts"
  Then my shifts are shown within 3 seconds
- Given I lose connection
  When I open "My shifts"
  Then I see the last loaded schedule, labelled with when it was last updated

### US-23 Only the right people see and change schedules
**As a** Crew Member
**I want** my personal details visible only to my managers, and schedules changeable only by managers
**so that** my phone number and personal information stay private and nobody can edit my shifts

Priority: Must · Size: M

**Acceptance criteria**
- Given I am a Crew Member
  When I view any schedule
  Then I can see my store's published schedule but cannot edit shifts, and coworkers appear only by first name and last initial
- Given I am a Store Manager
  When I try to edit another store's schedule
  Then I can't (only the Area Manager can assign across stores, see US-18)
- Given a staff member is deactivated
  When they try to sign in
  Then access is denied

### US-24 English and Spanish
**As a** Crew Member
**I want** to use the tool in English or Spanish
**so that** I understand my schedule and requests without help

Priority: Should · Size: M

**Acceptance criteria**
- Given my language is set to Spanish
  When I open any crew screen or receive a notification
  Then all fixed text is in Spanish (names and manager-entered notes stay as typed)
- Given no language is chosen
  When I first sign in
  Then the tool uses my phone's language if it is English or Spanish, and English otherwise

## Out of scope (v1)
- **Time clock / clock-in and actual hours worked**: v1 is about planned schedules. Actual hours stay in the existing payroll/POS process.
- **Payroll processing and wage-based labor cost ($)**: budgets are in hours. Only an hours export is offered (US-21).
- **Auto-generated schedules (the tool proposes the whole week)**: copying last week (US-03) plus coverage targets (US-04) gives most of the time savings with far less risk.
- **Sales-forecast-driven staffing targets**: targets are set by hand in v1. Tying them to sales forecasts is a strong v2 candidate for the revenue goal.
- **Importing existing spreadsheets**: a one-time manual roster setup (US-01) is cheaper for 12 stores than building an importer.
- **In-app chat or messaging between staff**: notifications cover the need in v1.
- **Hiring, onboarding and training records**: separate process (see 30-day plan).
- **Tip management and break scheduling**: not raised as a spreadsheet pain point.

## Assumptions
- There are three personas (Store Manager, Crew Member, Area Manager). Payroll/HR was considered but is not a persona in v1. It gets an export (Could).
- The core v1 goal is fully staffed peak shifts. Less manager time is secondary.
- Priorities: build/publish, availability and time off, and phone view are Must. Swaps, open shifts, multi-store and labor hours are Should.
- Crew use their own phones. Managers use a desktop or tablet in the store.
- Schedules run Monday-Sunday and should be published by Thursday 18:00 for the following week.
- Peak blocks are Fri/Sat 17:00-21:00 for the success metric. Stores can set targets for any block.
- Positions are cook, cashier, driver and shift lead. A person can hold several.
- Conflicts with availability, time off and overtime are warnings that can be overridden with a reason. Double-booking across stores is always blocked.
- The overtime threshold is 40 scheduled hours per week, counted across all stores.
- Swaps need a coworker to accept and the manager to approve.
- Each person has one home store and can be scheduled elsewhere. Cross-store assignments are made by the Area Manager, and Store Managers can reach other stores only by posting open shifts.
- Crew are notified when a schedule is published and when their own shifts change. Notifications arrive within 5 minutes.
- Coworkers are shown by first name and last initial only. Contact details are visible to managers only.
- Spanish is needed alongside English (not asked; based on a typical Texas restaurant workforce).
- Setting up the roster for the first time is manual. There is no spreadsheet import.

## Open questions
- **Minors' working hours:** do we employ 14-17 year olds, and should the tool enforce hour and time-of-day limits for them? (Owner / HR, legal)
- **Baseline for success metrics:** how many hours do managers spend on the spreadsheet per week today, and how often are peak shifts short today? Needed to confirm the "under 30 minutes" and "95%" targets. (Area Manager)
- **Who sets staffing targets and hours budgets:** each Store Manager, or the Area Manager for all stores? (Operations lead)
- **Payroll export format:** which payroll provider, and which columns does it need? (Owner / bookkeeper)
- **Store Managers borrowing staff directly:** should Store Managers be able to assign people from other stores themselves, or only through the Area Manager? (Area Manager)
- **Notification channel:** is an in-app/push notification enough, or do crew without the app need SMS? (Store Managers)
- **Drivers:** do delivery drivers need anything special, such as a vehicle or license check before being scheduled? (Operations lead)

## Interview log
Non-interactive run. Questions were answered with the recommended option. The full questionnaire is in `questionnaire.md`.

| # | Question | Answer (assumed) |
|---|---|---|
| Q1 | Who uses the tool in v1? | Store Manager, Crew Member, Area Manager |
| Q2 | Most important v1 outcome? | Every peak shift fully staffed (less manager time is secondary) |
| Q3 | Capability areas in v1? | Build/publish, availability and time off, swaps and coverage, multi-store and labor hours |
| Q4 | Constraint that matters most? | Crew on their own phones, managers on desktop/tablet |
| Q5 | How do crew learn about schedules and changes? | In the tool, plus notifications on publish and on changes to their own shifts |
| Q6 | How do swaps work? | Crew offer, a coworker accepts, the manager approves |
| Q7 | Assigning against availability, time off or overtime? | Warn, override with a reason. Cross-store double-booking is always blocked |
| Q8 | Can staff work at more than one store? | Yes: a home store plus cross-store scheduling |

Known without asking: 12 stores and today's spreadsheet process (prompt), the $3M revenue goal (CLAUDE.md), store hours with Fri/Sat late nights (docs/specs/restaurant-location-map.md), and planned new stores (plans/180-day-plan.md).

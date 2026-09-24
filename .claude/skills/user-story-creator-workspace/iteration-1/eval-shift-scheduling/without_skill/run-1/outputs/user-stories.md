# User Stories: Staff Shift Scheduling Tool (12 stores)

**Problem.** Managers at our 12 Texas pizza stores build staff schedules in a spreadsheet. Building a schedule is slow, and it's hard to share with staff. Availability, time off and swaps travel through texts and word of mouth. Nobody can see overtime, under-18 hour limits or labor cost until payroll. Understaffed peak shifts (Friday/Saturday dinner) lose sales. Overstaffed slow shifts eat margin.

**Goal.** Replace the spreadsheet with a shared scheduling tool. Managers should build and publish a week's schedule in under 30 minutes. Staff should always know when they work. Peak shifts should be fully covered, which supports the $3M sales goal. Labor cost should stay on target.

**Assumptions.** See `questionnaire.md`. The answers there were assumed because the user wasn't available.

**Priority key (MoSCoW).** **M** = Must (MVP / pilot store), **S** = Should (before rolling out to all 12 stores), **C** = Could (later), **W** = Won't (this release).

---

## Personas

| Persona | Description | Key needs |
|---|---|---|
| **Maria – Store Manager** | Runs one store and builds its weekly schedule. Currently spends 2–4 hours a week in the spreadsheet and chasing texts. | Build the schedule fast, cover peaks, stay within the labor budget, handle changes without chaos. |
| **Jake – Shift Lead** | Runs individual shifts and sometimes covers for the manager. | See who is on today, handle call-outs, find replacements quickly. |
| **Luis – Hourly Crew Member** (cook, cashier or driver) | Part-time, often a student or has a second job. Uses his phone and may prefer Spanish. | Know his shifts, set availability, request time off, swap shifts easily. |
| **Dana – Owner / Operations Lead** | Oversees all 12 stores and owns the $3M goal. | See coverage and labor cost across stores, enforce policy, compare stores. |
| **Payroll / Admin** (may be Dana or a bookkeeper) | Runs payroll. | Get accurate scheduled hours per person for payroll. |

---

## Epic 1: Accounts, Stores & Staff Setup

### US-1.1 Import staff from the spreadsheet — **M**
**As** Maria (Store Manager), **I want** to import my current staff list from our spreadsheet, **so that** I don't have to re-type everyone to start using the tool.

**Acceptance criteria**
- **Given** a CSV with name, phone, email, role(s), and home store, **when** I upload it, **then** the tool shows a preview with valid rows and rows that have errors (for example, a missing phone or an unknown role).
- **Given** the preview has no blocking errors, **when** I confirm, **then** staff profiles are created and each person is invited to set up an account.
- **Given** a staff member already exists (same phone or email), **when** I import, **then** the tool doesn't create a duplicate. It offers to update the existing record.

### US-1.2 Manage staff profiles — **M**
**As** Maria, **I want** to add, edit and deactivate staff, **so that** my roster stays accurate as people are hired and leave.

**Acceptance criteria**
- **Given** I'm a manager, **when** I add a staff member, **then** I can set their name, contact details, home store, qualified roles (cook, cashier, driver, shift lead), pay rate, and date of birth (used for minor rules).
- **Given** a staff member leaves, **when** I deactivate them, **then** they're removed from all future unpublished and published shifts, those shifts are flagged as open, and their past history is kept.
- **Given** I'm a manager, **then** I can only edit staff whose home store is mine. The owner can edit everyone.

### US-1.3 Role-based login — **M**
**As** any user, **I want** to log in with my own account, **so that** I see only what I'm allowed to see and do.

**Acceptance criteria**
- **Given** I'm staff, **when** I log in, **then** I see my own schedule, my store's published schedule and my requests. I can't see pay rates or edit schedules.
- **Given** I'm a manager, **when** I log in, **then** I can edit schedules and approve requests for my store(s).
- **Given** I'm the owner/ops, **when** I log in, **then** I can see and edit all 12 stores and company-wide settings.
- **Given** I forgot my password, **when** I request a reset, **then** I get a link or code by SMS or email.

### US-1.4 Configure stores — **M**
**As** Dana (Owner), **I want** to set each store's opening hours and the roles it needs, **so that** schedules are built against the right hours.

**Acceptance criteria**
- **Given** a store, **when** I set its weekly opening hours, **then** managers can't create shifts outside those hours without an explicit override (for prep before opening or cleanup after closing, up to a configurable buffer).
- **Given** a holiday closure, **when** I mark a store closed on a date, **then** no shifts can be scheduled at that store that day, and any existing shifts are flagged.

---

## Epic 2: Availability & Time Off

### US-2.1 Set recurring availability — **M**
**As** Luis (Crew Member), **I want** to set the days and times I'm available each week, **so that** I'm not scheduled when I have class or another job.

**Acceptance criteria**
- **Given** I'm logged in on my phone, **when** I set availability per weekday (available all day, unavailable, or specific time ranges), **then** it's saved and my manager can see it.
- **Given** I change my availability, **then** the change applies from the next unpublished week, not to already-published weeks.
- **Given** my manager has set a notice rule (for example, 14 days), **when** I change availability, **then** I see the date it takes effect.

### US-2.2 Request time off — **M**
**As** Luis, **I want** to request specific days off, **so that** I can plan personal commitments without texting my manager.

**Acceptance criteria**
- **Given** I choose a date range and optionally add a reason, **when** I submit, **then** the request shows as "Pending" and my manager is notified.
- **Given** the request overlaps a shift I'm already scheduled for in a published week, **then** I'm warned that I'll need to swap or drop that shift, and the manager sees the conflict.
- **Given** a request is approved or denied, **then** I'm notified and the status updates.

### US-2.3 Approve or deny time off — **M**
**As** Maria, **I want** to review time-off requests with their impact on coverage, **so that** I can approve fairly without leaving shifts short.

**Acceptance criteria**
- **Given** pending requests exist, **when** I open the requests inbox, **then** I see each request alongside how many other staff are already off on those dates.
- **Given** I approve a request, **then** that person is blocked from being scheduled on those dates.
- **Given** I deny a request, **then** I can add a comment that the staff member sees.

### US-2.4 Blackout dates — **S**
**As** Dana, **I want** to mark blackout dates (for example, Super Bowl Sunday, Texas–OU weekend, New Year's Eve), **so that** time off isn't approved on our biggest sales days without an override.

**Acceptance criteria**
- **Given** a blackout date, **when** staff request time off that includes it, **then** they see a warning, and the manager must explicitly override to approve.

---

## Epic 3: Building the Schedule

### US-3.1 Weekly schedule grid — **M**
**As** Maria, **I want** a weekly grid of my staff and shifts, **so that** I can build the schedule faster than in the spreadsheet.

**Acceptance criteria**
- **Given** I open a week for my store, **then** I see staff as rows and days as columns (with a toggle to a day/timeline view), including each person's availability and approved time off.
- **Given** I create a shift (start time, end time, role, optional break), **then** it appears on the grid and the person's weekly hours total updates.
- **Given** I try to assign someone outside their availability or during approved time off, **then** I see a warning. I can override it, and the override is recorded.
- **Given** I try to assign someone to a role they aren't qualified for, **then** the tool blocks it.

### US-3.2 Copy last week / use a template — **M**
**As** Maria, **I want** to copy a previous week or apply a saved template, **so that** I'm not building from scratch every week.

**Acceptance criteria**
- **Given** a previous week exists, **when** I choose "Copy week", **then** its shifts are copied into the new week as a draft.
- **Given** copied shifts conflict with new time off, availability changes or deactivated staff, **then** those shifts are flagged or left open rather than silently assigned.
- **Given** I save a week as a named template (for example, "Standard week" or "Game-day week"), **then** I can apply it to any future week.

### US-3.3 Open shifts — **M**
**As** Maria, **I want** to create shifts without assigning anyone yet, **so that** I can see coverage gaps and fill them later.

**Acceptance criteria**
- **Given** I create a shift with no assignee, **then** it shows as "Open" and is highlighted on the grid.
- **Given** a week has open shifts, **then** the week summary shows the count of open shifts by day and role.

### US-3.4 Coverage targets per daypart — **S**
**As** Maria, **I want** to set how many cooks, cashiers and drivers I need per hour or daypart, **so that** I can see at a glance where I'm under- or over-staffed.

**Acceptance criteria**
- **Given** coverage targets are set (for example, Friday 17:00–21:00 needs 3 cooks, 2 cashiers, 4 drivers), **when** I view the schedule, **then** each time block shows scheduled vs. required per role, coloured green (met), amber (over) or red (short).
- **Given** a peak block is short, **when** I try to publish, **then** I'm warned that peak coverage isn't met.

### US-3.5 Shift lead on every shift — **S**
**As** Dana, **I want** the tool to flag any time the store is open without a qualified shift lead or manager, **so that** every shift has someone accountable.

**Acceptance criteria**
- **Given** an hour when the store is open but no shift lead or manager is scheduled, **then** the schedule shows a "No lead" warning for that period, and it's listed in the pre-publish checks.

### US-3.6 Auto-fill suggestions — **C**
**As** Maria, **I want** the tool to suggest staff for open shifts, **so that** I can fill gaps in one click.

**Acceptance criteria**
- **Given** an open shift, **when** I click "Suggest", **then** the tool lists qualified, available staff. It excludes anyone who would go into overtime or break minor rules, and ranks the rest by fewest hours scheduled this week.
- **Given** I click "Auto-fill all open shifts", **then** the tool proposes assignments as a draft for me to review. It never publishes automatically.

---

## Epic 4: Rules, Compliance & Labor Cost

### US-4.1 Overtime warning — **M**
**As** Maria, **I want** to be warned when a staff member would go over 40 hours in a week, **so that** I avoid unplanned overtime costs.

**Acceptance criteria**
- **Given** an assignment would bring someone over 40 hours in a workweek (counted across all stores), **then** a warning shows the projected overtime hours.
- **Given** someone is approaching overtime (configurable, default 36 hours), **then** they're marked "near OT" on the grid.

### US-4.2 Minor (under-18) work-hour rules — **M**
**As** Dana, **I want** the tool to enforce federal child-labor hour limits for staff under 18, **so that** we don't break the law or risk fines.

**Acceptance criteria**
- **Given** a staff member aged 14–15 on the shift date, **when** a shift would break federal limits (for example, after 7 pm during the school year, over 3 hours on a school day, over 18 hours in a school week), **then** the assignment is blocked. The owner can configure the rules.
- **Given** a staff member aged 16–17, **then** the tool applies only the configured company policy (for example, no delivery driving), because federal hour limits don't apply to them.
- **Given** a staff member's date of birth is missing, **then** they're flagged in the staff list until it's added.

### US-4.3 Minimum rest between shifts ("clopen") — **S**
**As** Luis, **I want** the tool to prevent me being scheduled to close and then open the next morning, **so that** I get enough rest.

**Acceptance criteria**
- **Given** a company-configured minimum rest (default 10 hours), **when** an assignment would leave less time than that between shifts, **then** the manager sees a warning and must override with a reason.

### US-4.4 Projected labor cost vs. target — **S**
**As** Maria, **I want** to see the week's projected labor cost against my labor target, **so that** I can hit my store's labor % while keeping peak shifts covered.

**Acceptance criteria**
- **Given** staff pay rates and a weekly sales forecast (entered manually in v1), **when** I edit the schedule, **then** projected labor $ and labor % of forecast sales update live.
- **Given** the projection is above the target % set by the owner, **then** it's highlighted, and a note is required when I publish.
- **Given** I'm a manager, **then** I see totals, but individual pay rates are visible only to managers and the owner, never to staff.

### US-4.5 Pre-publish checks — **M**
**As** Maria, **I want** one list of every warning before I publish, **so that** I can fix problems in one pass.

**Acceptance criteria**
- **Given** I click "Publish", **then** I see a checklist of open shifts, overtime, minor-rule violations, availability overrides, rest-period breaches, missing leads and labor-budget overage.
- **Given** there are blocking violations (for example, minor rules), **then** I can't publish until they're fixed.
- **Given** there are only warnings, **then** I can publish after acknowledging them.

---

## Epic 5: Publishing & Notifications

### US-5.1 Publish the schedule — **M**
**As** Maria, **I want** to publish the week's schedule, **so that** all staff see their shifts at once in one place.

**Acceptance criteria**
- **Given** a draft week, **when** I publish, **then** the schedule is visible to staff and every scheduled staff member is notified by SMS and/or email with their shifts.
- **Given** a schedule is published, **then** draft edits afterwards aren't visible to staff until I re-publish.
- **Given** the owner-set deadline (for example, Wednesday for the following Monday) passes and the week isn't published, **then** the manager and owner are reminded.

### US-5.2 Notify staff of changes — **M**
**As** Luis, **I want** to be told immediately when my published shifts change, **so that** I don't miss a shift or turn up for one that was cancelled.

**Acceptance criteria**
- **Given** a published shift of mine is added, changed or removed, **when** the manager re-publishes, **then** I receive a notification that describes exactly what changed.
- **Given** I receive a change notification, **then** I can tap "Acknowledge", and the manager can see who has acknowledged.

### US-5.3 See my schedule on my phone — **M**
**As** Luis, **I want** to see my upcoming shifts on my phone, **so that** I always know when and where I work.

**Acceptance criteria**
- **Given** I'm logged in on a mobile browser, **then** "My Shifts" shows my upcoming shifts (date, time, store, role) without horizontal scrolling.
- **Given** a shift is at a store other than my home store, **then** the store name and address are clearly shown.
- **Given** I'm staff, **then** I can also view my store's full published schedule, showing who I'm working with.

### US-5.4 Add shifts to my calendar — **C**
**As** Luis, **I want** to subscribe to my shifts in Google/Apple Calendar, **so that** they appear alongside my other commitments.

**Acceptance criteria**
- **Given** I copy my personal calendar feed link, **when** I add it to my calendar app, **then** my published shifts appear and update when they change.

### US-5.5 Shift reminders — **S**
**As** Luis, **I want** a reminder before each shift, **so that** I'm not late or a no-show.

**Acceptance criteria**
- **Given** I have a shift, **then** I get a reminder a configurable number of hours before it starts (default 2 hours). I can turn reminders off.

---

## Epic 6: Swaps, Drops & Call-outs

### US-6.1 Swap a shift with a coworker — **M**
**As** Luis, **I want** to offer my shift to or swap it with a qualified coworker, **so that** I can handle conflicts without the manager doing all the work.

**Acceptance criteria**
- **Given** a published shift of mine, **when** I choose "Swap" or "Give away", **then** I see only coworkers who are qualified for the role, available, and not already working at that time.
- **Given** a coworker accepts, **then** the swap goes to the manager for approval, unless auto-approve is on and the swap doesn't cause overtime or break rules.
- **Given** the swap is approved, **then** both people's schedules update and both are notified.
- **Given** nobody accepts, **then** I stay responsible for the shift, and the app says so clearly.

### US-6.2 Pick up open shifts — **S**
**As** Luis, **I want** to see and claim open shifts, including at nearby stores, **so that** I can earn extra hours.

**Acceptance criteria**
- **Given** open shifts exist at my home store (or other stores that have allowed cross-store pickup), **then** I can see those I'm qualified and available for.
- **Given** I claim a shift, **then** the manager approves it (or it's auto-approved if the rules allow), and I'm notified.
- **Given** claiming the shift would put me into overtime or break a minor rule, **then** I can't claim it.

### US-6.3 Handle a same-day call-out — **M**
**As** Jake (Shift Lead), **I want** to mark someone as a call-out and quickly message possible replacements, **so that** the dinner rush isn't short-staffed.

**Acceptance criteria**
- **Given** a staff member calls out, **when** I mark their shift as "Call-out", **then** the shift becomes open, and the call-out is recorded on their history.
- **Given** an open same-day shift, **when** I click "Find cover", **then** the tool texts all qualified, available, non-overtime staff at once, and the first person to accept gets the shift. The manager is notified.
- **Given** nobody accepts within a set time (default 30 minutes), **then** I'm alerted so I can escalate.

### US-6.4 Staff call out through the app — **S**
**As** Luis, **I want** to report I can't make a shift through the app, **so that** my manager knows immediately and has a record.

**Acceptance criteria**
- **Given** an upcoming shift, **when** I tap "Can't make it" and pick a reason, **then** the manager and the on-duty shift lead are notified, and the shift is flagged.

---

## Epic 7: Multi-store Oversight & Reporting

### US-7.1 All-stores dashboard — **S**
**As** Dana (Owner), **I want** one view of all 12 stores' schedule status, **so that** I can spot problems without calling every manager.

**Acceptance criteria**
- **Given** I open the dashboard for a week, **then** each store shows publish status (draft/published/late), open shifts, projected labor %, overtime hours and peak-coverage gaps.
- **Given** I click a store, **then** I drill down into its schedule (read-only unless I choose to edit).

### US-7.2 Share staff across stores — **S**
**As** Maria, **I want** to schedule staff from a nearby store, **so that** I can cover gaps using the whole company's workforce.

**Acceptance criteria**
- **Given** a staff member has been marked as able to work at my store, **then** I can assign them to my shifts.
- **Given** they're already scheduled at another store at an overlapping time, or would go into overtime across stores, **then** the assignment is blocked or warned.
- **Given** I assign someone from another store, **then** their home-store manager is notified.

### US-7.3 Export hours for payroll — **M**
**As** the Payroll Admin, **I want** to export scheduled hours per person per store for a pay period, **so that** I can run payroll without retyping the spreadsheet.

**Acceptance criteria**
- **Given** a date range, **when** I export, **then** I get a CSV with employee, store, date, role, start, end, break and total hours, with regular and overtime hours split out.
- **Given** a shift was changed after publishing, **then** the export uses the latest version.

### US-7.4 Schedule-quality reports — **C**
**As** Dana, **I want** reports on call-outs, late publishing, overtime and labor % by store over time, **so that** I can coach managers and compare stores.

**Acceptance criteria**
- **Given** a date range, **then** I can see these metrics per store and company-wide, and export them as CSV.

### US-7.5 Audit history — **S**
**As** Dana, **I want** a history of who changed which shift and when, **so that** disputes about "I was never told" can be resolved.

**Acceptance criteria**
- **Given** any shift, **then** I can view its change log (created, edited, reassigned, swapped, published, acknowledged), with the user and a timestamp for each entry.

---

## Epic 8: Usability & Access

### US-8.1 Spanish-language interface for staff — **S**
**As** Luis, **I want** to use the app in Spanish, **so that** I fully understand my schedule and requests.

**Acceptance criteria**
- **Given** I set my language to Spanish, **then** all staff-facing screens and notifications are in Spanish.

### US-8.2 Accessible, mobile-first design — **M**
**As** any user, **I want** the tool to work well on a phone and with assistive technology, **so that** everyone can use it.

**Acceptance criteria**
- **Given** a 375 px-wide screen, **then** all staff screens work without horizontal scrolling. The manager grid offers a day view on mobile.
- **Given** a screen reader or keyboard-only navigation, **then** all actions are reachable and labelled (WCAG 2.1 AA target).

---

## Won't (this release)

| ID | Story | Reason |
|---|---|---|
| W-1 | As a crew member, I want to clock in and out in the app so that my hours are tracked. | Time-and-attendance is a separate system. Revisit once scheduling is adopted. |
| W-2 | As an owner, I want schedules generated automatically from POS sales forecasts so that staffing follows demand. | Needs POS integration. v1 uses a manually entered forecast (US-4.4). |
| W-3 | As payroll, I want hours pushed directly into our payroll provider. | v1 uses CSV export (US-7.3). |
| W-4 | As a crew member, I want a native iOS/Android app with push notifications. | A mobile web app plus SMS covers v1. |
| W-5 | As a manager, I want to handle tip pooling or wage calculations in the tool. | Out of scope for scheduling. |

---

## Suggested release slices

1. **Pilot MVP (1 store).** All **M** stories: US-1.1–1.4, 2.1–2.3, 3.1–3.3, 4.1, 4.2, 4.5, 5.1–5.3, 6.1, 6.3, 7.3 and 8.2.
2. **Roll out to 12 stores.** Add the **S** stories: coverage targets, shift-lead check, labor cost, clopen rule, blackout dates, reminders, open-shift pickup, app call-outs, all-stores dashboard, cross-store sharing, audit log and Spanish UI.
3. **Later.** The **C** stories: auto-fill, calendar sync and quality reports. Then revisit the Won't list.

## Success measures (proposed)
- Time a manager spends building and publishing a weekly schedule drops from about 2–4 hours to under 30 minutes.
- 100% of stores publish at least 7 days ahead.
- Peak shifts (Friday/Saturday 17:00–21:00) are 100% covered to target.
- Unplanned overtime hours fall by at least 50% compared with the spreadsheet baseline.
- Labor % stays within target at 11 or more of the 12 stores.
- The spreadsheet is retired at all 12 stores within 90 days of the pilot.

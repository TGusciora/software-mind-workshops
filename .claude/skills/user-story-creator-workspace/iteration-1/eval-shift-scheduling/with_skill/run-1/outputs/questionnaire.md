# Questionnaire: Staff shift scheduling (12 stores)

Non-interactive run: AskUserQuestion was not available. These are the questions I would have asked, with options as presented (recommendation first). Every "Chosen answer" was picked by me and is recorded as an assumption in the stories file.

## Already known (not asked)
- **Idea:** replace the spreadsheet store managers use today to schedule staff shifts across 12 stores. (prompt)
- **Number of stores:** 12. (prompt)
- **Current tool:** a spreadsheet, maintained by store managers. (prompt)
- **Business goal:** sell $3M of pizza by 2027-09-11. Stories should point at revenue where possible. (CLAUDE.md)
- **Store hours:** stores run roughly 11:00-22:00, with Fri/Sat open until 23:00, so dinner and weekend peaks matter. (docs/specs/restaurant-location-map.md, sample data)
- **Growth:** more stores are planned in other Texas metros, so the tool must handle stores being added. (plans/180-day-plan.md)
- **No existing stories file** for this idea in `docs/stories/`.

---

## Round 1: who and why

### Q1. Who will use the scheduling tool in v1? (multiSelect)
- **Store managers + crew members + an area/operations manager who oversees several stores (Recommended)**: covers building, viewing and oversight across 12 stores.
- Store managers + crew members only: no cross-store oversight in v1.
- Store managers only: crew still get a printed or photographed schedule.
- Add a payroll/HR admin as a fourth role: pulls hours for payroll.

**Chosen answer:** Store managers + crew members + area/operations manager. Payroll gets an export (Could), not a separate persona.

### Q2. What is the single most important outcome for v1?
- **Every peak shift is fully staffed (for example Fri/Sat dinner), so we don't lose orders to short staffing (Recommended)**: ties directly to the revenue goal.
- Managers spend far less time building the schedule.
- Keep labor cost within budget.
- Fewer no-shows and "I didn't know I was on" mistakes.

**Chosen answer:** Peak shifts fully staffed. Less manager time is the secondary measure.

### Q3. Which capability areas are in v1? (multiSelect)
- **Build and publish the weekly schedule per store (Recommended)**
- **Staff availability and time-off requests (Recommended)**
- Shift swaps and open-shift coverage
- Multi-store overview and scheduled labor hours vs budget

**Chosen answer:** All four. The first two are Must; swaps/coverage and the multi-store/labor view are Should.

### Q4. Which constraint matters most?
- **Crew check and manage shifts on their own phones; managers build schedules on a desktop or tablet in the store (Recommended)**
- We need to import the current spreadsheets and export hours to payroll.
- Labor-law compliance (overtime, minors' working hours).
- A hard launch deadline (for example before the next hiring push).

**Chosen answer:** Crew phone-first, managers on desktop/tablet. Overtime shows up as a warning story. Minors' hours rules are an open question. Spreadsheet import is out of scope.

---

## Round 2: targeted follow-ups

### Q5. How do crew members find out about their schedule and changes to it?
- **They see it in the tool and get a notification when a schedule is published and whenever one of their own shifts changes (Recommended)**
- In the tool only, no notifications.
- Text message only, no app or web view.

**Chosen answer:** In the tool, with notifications on publish and on changes to their own shifts.

### Q6. How do shift swaps work?
- **Crew offer a shift, a qualified coworker accepts it, and the store manager approves before it counts (Recommended)**
- Swaps between people in the same position are approved automatically.
- No swaps. Only the manager can reassign shifts.

**Chosen answer:** Crew offer, a coworker accepts, the manager approves.

### Q7. What happens when a manager schedules someone who is unavailable, on approved time off, or going into overtime?
- **Show a warning. The manager can override it after entering a short reason (Recommended)**
- Block the assignment completely.
- No checks in v1.

**Chosen answer:** Warn and allow an override with a reason. The one exception is double-booking the same person at two stores at the same time, which is always blocked.

### Q8. Can one employee work at more than one of the 12 stores?
- **Yes. Each person has a home store but can be scheduled at other stores, and overlapping shifts across stores are prevented (Recommended)**
- No. Each person belongs to exactly one store.

**Chosen answer:** Yes: a home store, plus the option of lending staff to other stores.

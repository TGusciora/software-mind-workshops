# Questionnaire: Shift Scheduling Tool

The user wasn't available, so I answered these questions myself. Each answer is an assumption the user-story set depends on. Please confirm or correct each one. Any change could add, remove or reprioritise stories.

Context from the repo: the business is a pizza chain in Texas. Its goal is $3M in sales by 2027-09-11. All stores are in the US Central time zone (from `docs/specs/restaurant-location-map.md`). Stores typically open around 11:00–22:00.

| # | Question | Assumed answer | Why it matters |
|---|----------|----------------|----------------|
| 1 | Who will use the tool? | Store managers, shift leads, hourly staff (cooks, cashiers, drivers) and an owner/ops lead who oversees all 12 stores. | Defines the personas and permissions. |
| 2 | Roughly how many staff are there? | About 15–25 per store, so about 180–300 in total. Most are part-time hourly workers. | Affects scale and how much self-service is needed. |
| 3 | What should the first release fix most urgently? | Take the weekly schedule out of the spreadsheet: build it faster, publish it to staff, and stop no-shows and "I didn't know I was working" problems. | Drives the MoSCoW split. |
| 4 | How far ahead is the schedule made, and how often? | Weekly, published about 7 days ahead (Mon–Sun weeks). | Affects the publishing and notification stories. |
| 5 | Do staff work at more than one store? | Yes, sometimes. Staff have a home store and can pick up shifts at nearby stores. | Needs cross-store visibility and a check for double-booking. |
| 6 | Which roles/stations need covering? | Cook/pizza maker, cashier/front, driver and shift lead. Some staff are qualified for several roles. | Affects role-based scheduling and qualification checks. |
| 7 | Should staff use it on their phones? | Yes. Staff view the schedule, set availability and swap shifts on a mobile-friendly web app. A native app isn't needed in v1. | Affects the UX stories and the notification channel. |
| 8 | How should staff be notified? | SMS plus email for published and changed schedules. Push notifications can come later. | Notification stories. |
| 9 | Are there labor laws or policies to enforce? | Texas has no predictive-scheduling law. Federal FLSA overtime (>40 hrs/week) applies. There are federal child-labor limits for staff under 18 (e.g. 14–15 year-olds: hours limits, no late shifts on school nights). Minimum breaks are company policy, not state law. | Compliance warning stories. |
| 10 | Is there a labor budget? | Yes. Managers aim for a target labor-cost % of sales (about 25–30%) per store per week. The tool should show projected labor cost against the target. | Ties to the revenue goal and the owner persona. |
| 11 | Should it integrate with POS or payroll? | Not in v1. Export hours (CSV) for payroll. POS sales-forecast integration is a "Could". Time clock/clock-in is out of scope for v1. | Scope boundaries. |
| 12 | Should the existing spreadsheet data be imported? | Yes, a one-time import of the staff list (name, phone, email, roles, home store). Past schedules don't need importing. | Onboarding story. |
| 13 | How should time off be handled? | Staff request time off in the tool, and the store manager approves or denies it. | Time-off stories. |
| 14 | Should shift swaps need approval? | Yes. Staff can offer or swap shifts, and the manager approves them. Managers can turn on auto-approval when the replacement is qualified and wouldn't go into overtime. | Swap stories. |
| 15 | Is authentication needed? | Yes. Each person logs in with their own account (phone or email). Access is role-based: staff, manager, owner/ops. | Security and permission stories. |
| 16 | Language? | English first. Spanish UI for staff is a "Should", since much of the Texas restaurant workforce prefers Spanish. | Localisation story. |
| 17 | Timeline or budget? | Unknown. I assumed an MVP ("Must") that can go live in one pilot store, then roll out to all 12. | Release plan. |

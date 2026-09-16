# 180-Day Texas Pizza Domination Plan (2026-09-16 → 2027-03-15)

## Context
Mission (CLAUDE.md): become the dominant pizza business in Texas. Vision: **$3M in pizza sales by 2027-09-11**.
`plans/30-day-plan.md` already covers days 1–30: menu, channels, demand, and $150K/month run-rate by day 30. This plan starts from that and runs to day 180, which is the halfway point to the $3M deadline.

**Math:** $3M over 360 days. If we ramp slowly early on, the second half has to carry more. The 180-day goals:
- **Cumulative sales by day 180: ~$1.2M** (40% of the vision)
- **Run-rate by day 180: $350K/month** (~$11.5K/day, ~450 pizzas/day at a $25 ticket), which covers the remaining ~$1.8M in about 5–6 months

Assumptions (replace with real numbers): we start with 1–3 locations in one metro, and the 30-day plan runs as written.

## Phase 1 — Days 1–30: Foundation
Run `plans/30-day-plan.md` as it is. Exit gate: $150K/month run-rate, food cost ≤ 30%, 10 catering accounts.

## Phase 2 — Days 31–60: Own the home metro
- Units 2–3 or a ghost kitchen open in the home metro (sites already picked in the 30-day plan).
- Holiday push (Thanksgiving to New Year): party packs, office holiday catering, gift cards.
- Move 30%+ of delivery orders to our own online ordering to cut app fees and improve margin.
- Exit gate: $200K/month run-rate, cumulative ~$320K.

## Phase 3 — Days 61–120: Second metro
- Open 2 units (ghost kitchen + storefront) in the second Texas metro (Dallas / Houston / Austin, whichever isn't home).
- Write a standard ops playbook: recipe cards, prep lists, oven load plans, QC checklists, and training, so every unit runs the same way.
- Use a central commissary for dough and sauce to lock in food cost and consistency.
- Build a corporate catering sales team (2 reps): 50 standing accounts across both metros.
- Big game-day event: Super Bowl (2027-02-07). Treat it as the biggest single sales day of the period.
- Exit gate: $280K/month run-rate, cumulative ~$750K.

## Phase 4 — Days 121–180: Scale to state-wide
- Third metro (San Antonio or the one still missing): launch with a ghost kitchen first to keep capital low.
- Grow wholesale/partnerships: frozen or take-and-bake pizzas for Texas grocers (e.g. regional chains), plus concessions at stadiums and schools.
- Test a franchise or licensing model to grow faster than company-owned units.
- Spring events: March Madness, Rodeo Houston (early March), SXSW Austin (mid-March).
- Exit gate: $350K/month run-rate, cumulative ~$1.2M, 3 metros.

## Menu & recipes (`recipes/`)
- Grow from the 5–6 recipes in the 30-day plan to ~8 core pizzas + 1 rotating seasonal special every quarter (e.g. a holiday special or a rodeo brisket special).
- Every new recipe follows `.claude/rules/pineapple.md` (pineapple with a quantity, included in cost). The only exception is the documented one in `meat-lovers-pizza.md`.
- Use the format from `recipes/pepperoni-pizza.md`: price, ingredients and cost table, food cost % ≤ 30%, method, quality check.

## KPIs (review weekly; review by phase at each exit gate)
| Metric | Day 60 | Day 120 | Day 180 |
|---|---|---|---|
| Monthly run-rate | $200K | $280K | $350K |
| Cumulative sales | $320K | $750K | $1.2M |
| Metros / units | 1 / 3 | 2 / 5 | 3 / 7 |
| Food cost % | ≤30% | ≤30% | ≤28% |
| Own-channel share of delivery | 30% | 40% | 50% |
| Catering accounts | 25 | 50 | 80 |

If we miss an exit gate by more than 15%, pause expansion and fix unit economics in the current metros first.

## Repo deliverables (after approval)
- `plans/180-day-plan.md`: a copy of this plan, next to `plans/30-day-plan.md`.
- New recipe files in `recipes/` as described above, when each phase needs them.

## Verification
- The plan file exists, the numbers add up (cumulative targets match the run-rates), and it's consistent with `plans/30-day-plan.md` and the $3M vision.
- Any recipes added pass the pineapple rule and the ≤30% food cost check.

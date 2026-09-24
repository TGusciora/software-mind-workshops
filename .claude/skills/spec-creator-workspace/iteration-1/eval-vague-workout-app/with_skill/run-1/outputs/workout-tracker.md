# Workout Tracker

## Summary
A mobile-friendly web app (PWA) for one recreational lifter to log strength workouts quickly and see progress per exercise over time. Personal tool first; sharing is a later possibility.

## Goals & vision
- Goal: log a full workout in under 60 seconds of interaction overhead.
- Success metric: used at least 3 workouts/week for 3 consecutive months.
- Vision (6-12 months): progress charts, PR tracking, routine templates; possibly shared with friends.

## Users
- Primary: the owner, a gym-goer doing strength training, mostly on a phone between sets.
- Needs: fast entry, see last session's numbers, see progress.

## Scope
### In scope (v1)
- Log workouts (exercises, sets, reps, weight)
- Workout history list
- Per-exercise progress chart
### Out of scope
- Templates/routines, cardio/GPS, social features, native apps, multi-user accounts, wearable integrations

## Requirements
1. User can start a workout and add an exercise from a saved list or by typing a new name. (must)
2. User can log a set (reps, weight) in at most 3 taps after the exercise is selected. (must)
3. Adding a set pre-fills reps/weight from the previous set or last session. (should)
4. User can finish a workout; it is saved with date and duration. (must)
5. History page lists past workouts, newest first, and each opens to full detail. (must)
6. User can edit or delete a logged set or workout. (must)
7. Per-exercise chart shows max weight and estimated 1RM by date. (must)
8. App works on a phone-width screen and is installable as a PWA. (should)
9. Workout in progress survives a page reload and brief offline period. (should)
10. Data export as CSV. (could)
11. Page loads in under 2 s on a typical 4G connection. (should)

## Technology
- Frontend: React + Vite + TypeScript, PWA plugin. Boring, fast, installable on phone.
- Charts: lightweight library (e.g. Recharts).
- Backend: Node + Fastify (TypeScript) for a single shared language.
- Data: SQLite, ideal for a single user, zero cost, easy backup.
- Hosting: Fly.io or Render free tier with a persistent volume.
- Alternatives: native app (rejected: cost/time), Firebase (rejected: lock-in, overkill).

## Constraints & assumptions
- Solo developer, near-zero budget, 4-week target.
- ASSUMPTION: single user, so simple auth (one shared secret/password) suffices.
- ASSUMPTION: weights in kg, configurable later.
- ASSUMPTION: strength training only.
- No compliance needs; personal data only.

## Risks & open questions
- Free-tier hosting may sleep or lose volume; need backups.
- Offline sync complexity; may limit to local-cache of in-progress workout.
- Open: kg vs lb? Include bodyweight tracking? Seed exercise list source?

## Milestones
- Week 1 (2026-09-30): data model, API, project scaffold
- Week 2 (2026-10-07): workout logging UI
- Week 3 (2026-10-14): history, edit/delete
- Week 4 (2026-10-21): charts, PWA, deploy; v1 usable

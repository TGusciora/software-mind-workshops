# Workout Tracker: Project Specification

## 1. Overview
A personal app for logging workouts, viewing progress, and staying consistent. Single user first; no social features in v1.

## 2. Assumptions (no user available)
- Primary user: one recreational lifter/runner, on a phone.
- Platform: mobile-first Progressive Web App (works offline, installable). Native apps are out of scope for v1.
- Data stored locally (IndexedDB) with optional cloud sync via account in v1.1.
- Units: kg/km default, switchable to lb/mi.
- Free, no payments.

## 3. Goals and non-goals
Goals: log a set in under 5 seconds; see progress per exercise; reuse past workouts as templates.
Non-goals: social feed, coaching/AI plans, wearable integration, nutrition tracking.

## 4. Functional requirements
1. Exercise library: seeded list (about 100 common exercises), custom exercises, with muscle group and type (strength, cardio, bodyweight, timed).
2. Log workout: start empty or from a template; add exercises; log sets (weight, reps, or duration/distance); notes; finish and save.
3. Prefill: each set prefilled from the last session of that exercise.
4. Rest timer: auto-start after a set, configurable, with notification.
5. Templates/routines: save a workout as a template; edit and delete.
6. History: chronological list, calendar view, edit/delete past workouts.
7. Progress: per-exercise charts (max weight, estimated 1RM, volume); personal record detection and badges.
8. Body metrics: optional bodyweight log with chart.
9. Settings: units, default rest time, theme, data export/import (CSV/JSON).
10. Auth and sync (v1.1): email login, sync across devices.

## 5. Non-functional requirements
- Works fully offline; load under 2s on mid-range phone.
- Accessibility: WCAG AA, large tap targets.
- Privacy: no third-party tracking; user can export and delete all data.
- Data safety: no loss on app crash mid-workout (autosave each set).

## 6. Data model (summary)
- Exercise(id, name, muscleGroup, type, isCustom)
- Workout(id, startedAt, endedAt, notes, templateId?)
- WorkoutExercise(id, workoutId, exerciseId, order)
- Set(id, workoutExerciseId, weight?, reps?, durationSec?, distance?, isWarmup, completedAt)
- Template(id, name, exercises[])
- BodyMetric(id, date, weight)

## 7. Suggested tech stack
TypeScript, React + Vite, PWA service worker, IndexedDB (Dexie), Recharts for charts; v1.1 backend: Supabase (Postgres + auth). Vitest and Playwright for tests.

## 8. Milestones
1. M1 (2 weeks): exercise library, log workout, history, offline storage.
2. M2 (2 weeks): templates, prefill, rest timer.
3. M3 (2 weeks): progress charts, PRs, export/import, settings.
4. M4 (2 weeks): auth, sync, polish, accessibility pass.

## 9. Success metrics
- Median time to log a set under 5s.
- User logs 3+ workouts per week for 4 consecutive weeks.
- Zero data-loss bugs reported.

## 10. Risks and open questions
- Sync conflict handling (last-write-wins assumed).
- iOS PWA notification limits may weaken the rest timer; fallback is in-app sound/vibration.
- Open: is native app needed? Are supersets required? Confirm with user.

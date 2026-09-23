# Questionnaire (simulated; answers chosen as a plausible user)

Restated idea: A workout tracking app so the user can log training sessions and see progress. Repo context: CLAUDE.md is about a pizza business; unrelated, so nothing answered from it.

## Round 1 - Goals and vision
1. Who is it for? (recommended first)
   - Me, a recreational gym-goer doing strength training  <-- ANSWER
   - Small group of friends
   - Public product for many users
   - Clients of a personal trainer
2. What does success look like?
   - I log every workout in under 60 seconds and use it 3x/week for 3 months  <-- ANSWER
   - 1,000 active users
   - Revenue target
   - Other
3. Vision in 6-12 months?
   - Personal tool with progress charts and PR tracking  <-- ANSWER
   - Shared with friends
   - Commercial app
   - Other
4. Timeline?
   - Usable v1 in 4 weeks  <-- ANSWER
   - 2 weeks
   - 3 months
   - No deadline

## Round 2 - Scope
1. Must-have v1 features (multi-select)
   - Log workout: exercises, sets, reps, weight  <-- ANSWER
   - Workout history list  <-- ANSWER
   - Per-exercise progress chart  <-- ANSWER
   - Templates/routines (out of scope v1)
   - Cardio/GPS tracking (out of scope)
   - Social sharing (out of scope)
2. Key flow?
   - Start workout -> add exercises -> log sets -> finish -> view history/chart  <-- ANSWER
3. Constraints: budget / team / integrations / compliance
   - Free/near-zero budget, solo dev, no integrations, personal data only  <-- ANSWER
4. Platform?
   - Mobile-friendly web app (PWA)  <-- ANSWER
   - Native iOS/Android
   - Desktop only

## Round 3 - Technology
Proposed: React + Vite (PWA) frontend; Node/Express... simplified: single TypeScript stack; SQLite backend via Node/Fastify; hosted on Fly.io/Render free tier.
   - Accept  <-- ANSWER
   - Swap
   - I already use something else

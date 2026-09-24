# Questionnaire (simulated; answers chosen by the agent as a plausible user)

Restated idea: A Slack bot that collects/reads daily standup updates and posts a concise summary each day.
Repo context: CLAUDE.md is about a Texas pizza business; no existing code relevant to Slack. Nothing pre-answers these questions.

## Round 1 - Goals and vision
1. Who is it for and what problem does it solve?
   - (Recommended) Engineering teams of 5-15 who post standups in a channel; managers waste time reading threads
   - Async/remote cross-timezone teams
   - Whole company / multi-team rollups
   **Answer:** Engineering teams of 5-15.
2. What does success look like?
   - (Recommended) Cut standup reading time by 80%, 5 teams adopt in 60 days
   - Daily active use above 70% of team members
   - Replace live standup meetings
   **Answer:** Cut reading time 80%; 5 teams in 60 days.
3. Vision for 6-12 months?
   - (Recommended) Weekly digests and blocker tracking
   - Jira/GitHub integration
   - Multi-team rollup for managers
   **Answer:** Weekly digests and blocker tracking.
4. Timeline?
   - (Recommended) MVP in 4 weeks
   - 2 weeks prototype
   - 3 months
   **Answer:** MVP in 4 weeks.

## Round 2 - Scope
1. v1 must-haves?
   - (Recommended) Summarize a designated channel's standup messages daily; highlight blockers; post in-thread/channel
   - Also DM prompts to collect updates
   - Also web dashboard
   **Answer:** Channel summarization + blockers; no DM prompts, no dashboard.
2. Key flows?
   - (Recommended) Admin installs and configures channel/time; members post normally; bot posts summary at set time; /standup-summary on demand
   - Slash-command only
   **Answer:** First option.
3. Constraints?
   - (Recommended) Small team (1-2 devs), low budget, no compliance beyond not storing message content long-term
   - SOC2 required
   **Answer:** 1-2 devs, low budget, do not persist message text.
4. Summary generation approach?
   - (Recommended) LLM (Claude API)
   - Rule-based extraction
   **Answer:** LLM.

## Round 3 - Technology (proposal)
Proposed: TypeScript + Slack Bolt; Node on AWS Lambda (or Fly.io) with scheduled trigger; Postgres (small, config only) or DynamoDB; Claude API for summaries.
Options: (Recommended) Accept / Swap language to Python / Swap hosting.
**Answer:** Accept, but use Postgres-free approach: DynamoDB for config only.

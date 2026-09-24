# Slack Standup Summary Bot
## Summary
A Slack bot that reads a team's daily standup messages in a designated channel and posts a concise summary with blockers highlighted. It saves managers and teammates from reading long threads.

## Goals & vision
- Goals: cut standup reading time; adoption by multiple teams.
- Success metrics: 80% reduction in self-reported reading time; 5 teams active within 60 days of launch.
- Vision (6-12 months): weekly digests, blocker tracking across days, optional Jira/GitHub links.

## Users
- Engineering team members (5-15 per team): post updates as usual, want a quick recap.
- Managers/leads: need blockers surfaced fast.
- Workspace admins: install and configure the bot.

## Scope
### In scope (v1)
- Per-channel configuration (channel, summary time, timezone)
- Daily scheduled summary of that day's standup messages
- Blocker highlighting
- `/standup-summary` on-demand command
### Out of scope
- DM prompts to collect updates
- Web dashboard
- Weekly digests, Jira/GitHub integration, multi-team rollups (post-v1)
- Long-term storage of message text

## Requirements
1. (must) Admin can configure channel, time, and timezone via `/standup-config` in under 1 minute.
2. (must) At the configured time on weekdays, bot posts one summary in the channel within 60 seconds.
3. (must) Summary lists each contributor's yesterday/today items in at most 3 bullets each.
4. (must) Blockers appear in a separate "Blockers" section, with author mentioned.
5. (must) Message text is not persisted; only configuration is stored.
6. (should) `/standup-summary` returns a summary of today's messages in under 15 seconds.
7. (should) Members who have not posted are listed as "no update".
8. (should) Failures of the LLM call retry twice, then post a notice rather than failing silently.
9. (could) Skip summary if fewer than 2 updates were posted.

## Technology
- Language/framework: TypeScript + Slack Bolt - official, well-documented SDK.
- Hosting: AWS Lambda + EventBridge Scheduler - cheap, fits per-day scheduled jobs and low budget.
- Data: DynamoDB (config only) - no message storage, minimal ops.
- Summarization: Claude API - handles unstructured updates and blocker extraction.
- Alternatives considered: Python Bolt; Fly.io container; Postgres; rule-based extraction (poor on free text).

## Constraints & assumptions
- 1-2 developers, low budget.
- Assumption: standups are posted as top-level messages or thread replies in one channel.
- Assumption: sending message text to the LLM is acceptable to the customer (to confirm).
- Assumption: weekday-only schedule.
- Assumption: English-language updates.

## Risks & open questions
- Data privacy: message content goes to a third-party LLM; need customer sign-off and Slack app review.
- Summary quality on terse or off-format updates.
- Slack rate limits for large channels.
- Open: holidays/time-off handling? Multiple channels per workspace? Pricing model?

## Milestones
- Week 1: Slack app setup, config command, DynamoDB
- Week 2: message fetch + Claude summarization
- Week 3: scheduler, blockers, on-demand command
- Week 4: pilot with 1-2 teams, fixes, MVP release
- Day 60 after launch: review adoption target (5 teams)

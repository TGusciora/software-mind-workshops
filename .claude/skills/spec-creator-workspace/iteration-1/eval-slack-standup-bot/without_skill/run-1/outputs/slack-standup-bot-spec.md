# Project Specification: Slack Standup Summarizer Bot

## 1. Overview
A Slack bot that collects daily standup updates from team members, summarizes them with an LLM, and posts a concise digest to a channel each day.

## 2. Assumptions
- Teams of 3-30 people, one Slack workspace, multiple teams/channels.
- Standups are async: bot DMs each member, or members post in a standup thread.
- Summaries are posted once daily at a configurable time (default 10:00 team-local).
- LLM: Claude API. Hosted on a serverless platform (e.g. AWS Lambda) with Postgres.
- English first; no PII beyond Slack user IDs and message text.

## 3. Goals / Non-goals
Goals: reduce time reading standups, surface blockers, track missing updates.
Non-goals: replacing live meetings, task-tracker integration (v1), performance evaluation of individuals.

## 4. Users
- Team member: submits update.
- Team lead: reads the summary, configures the bot.
- Workspace admin: installs and manages the app.

## 5. Functional Requirements
1. Setup: `/standup setup` configures channel, members, schedule, timezone, questions (default: yesterday / today / blockers).
2. Collection: bot DMs members at prompt time with a modal or thread reply; reminder after 1 hour if no response.
3. Alternative collection: parse replies in a designated standup thread.
4. Summary: at the summary time, generate a digest with sections: Highlights, Per-person one-liners, Blockers (flagged), Missing updates.
5. Posting: post digest to the channel with a link to the raw updates in a thread.
6. Commands: `/standup skip`, `/standup status`, `/standup summary now`, `/standup config`.
7. Blocker follow-up: blockers are tagged and carried over in the next digest if repeated.
8. Vacation/OOO: members can pause; Slack status is optionally respected.
9. Weekly rollup (optional): Friday summary of themes and repeated blockers.

## 6. Non-functional Requirements
- Summary generated within 30s of trigger; 99.5% scheduled-post success.
- Retention: raw updates 90 days (configurable), summaries 1 year; deletion on request or uninstall.
- Secrets in a secrets manager; Slack request signature verification; least-privilege scopes (`chat:write`, `im:write`, `users:read`, `commands`, `channels:history` only for the configured channel).
- Only send standup text to the LLM; no training on customer data.
- Accessibility: plain-text fallback for all blocks.

## 7. Architecture
Slack Events/Interactivity/Commands -> API handler -> Postgres (teams, members, updates, summaries) ; scheduler (cron) -> summarizer worker -> Claude API -> Slack chat.postMessage.
Data model: Team(id, channel, tz, time, questions), Member(user_id, team_id, paused), Update(id, member, date, answers), Summary(id, team, date, text, model).

## 8. Summarization Design
- Prompt takes structured updates, outputs JSON (highlights, per_person, blockers) that is rendered as Block Kit.
- Guardrails: never invent content, attribute each item to a person, keep under 250 words, mark low-confidence items.
- Fallback: if the LLM fails, post the raw updates formatted without summary.

## 9. Milestones
1. Week 1: Slack app, install flow, DM collection, storage.
2. Week 2: summarizer, scheduled posting, commands.
3. Week 3: reminders, OOO, blocker carry-over, hardening.
4. Week 4: beta with 2 teams, feedback, docs.

## 10. Success Metrics
- >=80% of members submit updates on time after 2 weeks.
- >=70% of leads rate summaries "useful" (thumbs reaction).
- Standup meeting time reduced by 50% for pilot teams.

## 11. Risks
- Low participation -> reminders, lightweight modal.
- Hallucinated summaries -> structured output, attribution, raw link.
- Privacy concerns -> transparent data policy, retention controls.
- Cost -> small model, ~1 call/team/day.

## 12. Open Questions
Multi-language support? Jira/GitHub integration? Per-channel privacy of summaries?

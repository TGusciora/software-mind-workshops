Claude Code:
From Zero to Expert
Workshop #8: MCP's, Standards &
Scaling
Presented by: Tomasz Guściora
For Software Mind

Tomasz Guściora - Bio
13+ years of experience in data analytics
Analytical consultant with successful
projects at numerous international financial
institutions
AI and Large Language Model (LLM)
practitioner and trainer
Creator of DemystifAI.blog
Claude Code Trainings:
MasterClaudeCode.now
Substack Blog: DemystifAI.substack.com
LinkedIn
Email: Tomasz@gusciora.pl

What is Model Context Protocol?
MCP: The USB-C for AI Connections
The Model Context Protocol (MCP) is an open standard, pioneered by Anthropic and supported by other industry leaders. It
aims to standardize how AI models integrate with diverse data sources and external tools.
Instead of building separate integrations for each model and database, MCP allows developers to create a single, universal
"connector" that works everywhere, vastly simplifying AI harness development and deployment.
Source: https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro

MCP: Navigating Trade-offs and Complexity
Implementing MCP introduces fundamental trade-offs: balancing enhanced business value from wide-system tool access
with stringent security and capability requirements. Exposing too many tools through MCP can lead to context overload for
the LLM.
| LLM Confusion | Hallucination | Higher Error Rates |
| ------------- | ------------- | ------------------ |
Difficulty in discerning relevant  Increased tendency to generate  Elevated likelihood of operational
information from excessive tool  incorrect or fabricated responses  failures and suboptimal AI
| definitions. | due to context noise. | performance. |
| ------------ | --------------------- | ------------ |
While MCP solves the challenge of AI connectivity, it shifts the focus to intelligently managing MCP selections to avoid these
risks.

MCP Actors: The Core Components
| MCP Host | MCP Client | MCP Server |
| -------- | ---------- | ---------- |
The central application or  Connects the Host to external  Provides access to resources,
orchestrator, typically your primary  services. A Host can summon  tools, and prompts, offering
service (Claude Code). multiple Clients, creating a one-to- standardized functionalities.
|     | many relationship. | Examples include GitHub API,  |
| --- | ------------------ | ----------------------------- |
Stripe Payments, or Supabase DB.
A special case is the local MCP server, which requires installation and configuration to share local filesystems (like standard
I/O).

MCP: Evolving Connection Standards
MCP has explored various communication protocols to connect models with external tools, each presenting a distinct set of
trade-offs in terms of performance, simplicity, and maintainability.
Protocol Pros Cons
STDIO Fast and secure (within one machine), Requires specific language dependencies
optimal for single developer (e.g., Python, Node.js) to be installed on each
environments or initial development user's machine.
phases.
SSE (Server-Sent Events) Deprecated as of March 26, 2025 Introduced significant connection
management overhead due to a dual-
endpoint architecture (separate /sse and
/sse/messages).
Streamable HTTPS + Utilizes a single endpoint (/mcp), alternative to WebSocket
JSON-RPC supports bi-directional communication,
and is an established enterprise-grade
standard.

The MCP Ecosystem: Core Concepts
Within the Model Context Protocol (MCP), several core concepts define how AI agents interact with external systems.
Understanding these concepts is crucial for effective integration and management of AI tools.
| TOOL | RESOURCE | PROMPT |
| ---- | -------- | ------ |
Commands that trigger specific  Static or dynamic data sources that  Pre-defined templates or
actions or operations within an  provide information for an AI agent  instructions that guide the AI
external system. to consume. agent's behavior and interaction
with tools or resources.
| Example: Instead of passively  | Example: To write a report, an  |     |
| ------------------------------ | ------------------------------- | --- |
viewing, a tool might be  agent might need to read logs  Example: Instead of repeatedly
designed to calculate a result  from the past week. It  instructing an agent on error
using a calculator or send an  consumes this information  analysis steps ("first check
email via a mail client. without modifying it, gaining  date, then module, then
|     | knowledge for its task. | solution"), a structured  |
| --- | ----------------------- | ------------------------- |
Key: Tools typically involve
side-effects that alter the state  Key: Resources are typically  analyze_error prompt can be
provided.
| of the external system, such as  | addressed via URIs, similar to  |     |
| -------------------------------- | ------------------------------- | --- |
sending a message, which  web pages (e.g., logs://error- Key: Prompts allow the server
cannot be easily undone.
|     | log), allowing the agent to        | (tool creator) to enforce best  |
| --- | ---------------------------------- | ------------------------------- |
|     | request information at a specific  | practices and standardize how   |
|     | address.                           | the agent utilizes available    |
services, ensuring consistent
and effective operation.

The MCP Registry - catalogue of MCP's
The Official MCP Registry serves as the central catalogue for Model Context Protocol definitions, offering both public and
private options for discovering and managing MCPs.
While inclusion in the registry streamlines discovery, it is crucial to note that being listed in the MCP Registry does not
automatically guarantee the quality or security of the MCP code. Rigorous verification is still essential.
Audit Source Code Verify Namespaces & Authors Sandbox Execution
Thoroughly review the MCP's Confirm the authenticity and reputation Launch MCPs in hardened, isolated
underlying source code before of the MCP's creators and associated containers instead of granting direct
connection or execution to identify namespaces to prevent impersonation root access to servers, limiting potential
potential vulnerabilities or malicious and supply chain attacks. damage from compromised code.
intent.

Excercise (20 mins): MCP Pizza Order Tracking
Let's consider a practical example: building a Model Context Protocol (MCP) server for a pizza application. This demonstrates
how an AI can manage real-world service interactions from ordering to delivery.
Order Placement Real-time Tracking Conditional Cancellation
Customers can select menu Monitor the current status of an Customers retain the ability to
items and specify a delivery order as it progresses through cancel an order, but only up to a
address, initiating a new order. the delivery pipeline. predefined stage (e.g., before
dispatch).
Pizza Order Lifecycle
Out for
Received Preparing In Oven Ready
Delivery
This sequential workflow ensures transparency from the moment an order is placed until it reaches the customer's door.
Test with Claude: "Order a Lone Star Heat to 1 Main St, Austin for The Terminator. Use Pizza Order Tracking MCP and tell
me it's status"

Proprietary MCP Ideas
Here are examples of proprietary Model Context Protocol (MCP) servers and the critical tools and resources they can expose,
enabling powerful AI integrations within an enterprise environment.
# Server Key tools / resources
1 Service catalog find_service, get_service (owner, on-call, SLOs, consumers, runbooks)
2 Engineering standards get_standard(topic, lang), check_compliance(diff) → rule IDs
3 CI diagnostics get_failed_jobs, get_log_excerpt, classify_failure, get_flake_history
4 Internal API discovery search_apis, get_openapi, get_client_snippet
5 Database schema (read- describe_table, list_indexes, explain_query (against a dev replica)
only)
6 Feature flags get_flag_state, propose_flag_change (opens a change request, doesn't write)
7 Deployment get_deploy_status, plan_deploy, request_deploy (gated)
8 Incidents get_active_incidents, get_timeline, find_similar_incidents
9 Architecture / ADRs search_adrs, get_boundary_rules(module)
10 Dependency ownership who_owns_package, get_license_verdict, get_approved_alternatives
11 Infrastructure (mostly get_k8s_workload, get_cost_by_service
read)
12 Company docs search search_docs(query, space); only if skill reference files aren't enough
These examples highlight the potential for MCP to streamline operations, enhance developer productivity, and improve
decision-making by giving AI direct, controlled access to internal systems.

CLI vs. MCP: Choosing the Right Interface
Selecting between a Command Line Interface (CLI) and the Model Context Protocol (MCP) depends on the specific interaction
needs of your AI application. Both offer distinct advantages and trade-offs.
1 2
Command Line Interface (CLI) Model Context Protocol (MCP)
Direct Control AI-Native Design
Scriptable Enhanced Discoverability
Developer Familiarity Complex Ecosystems
No Protocol Overhead Type-Safe Interactions
Limited AI Understanding Requires Implementation
Poor Discoverability Protocol Adherence
Local Dependency Abstraction Layer

Declaring MCP in Claude Code
Standardized connections to external tools and data.
Further MCP registries:
https://cursor.com/docs/context/mcp/directory
https://github.com/mcp
Configuration (.mcp.json in project root):
```json
{
"mcpServers": {
"github": {
"type": "http",
"url": "https://api.githubcopilot.com/mcp/",
"headers": { "Authorization": "Bearer ${GITHUB_TOKEN}" }
}
}
}
```

Connecting Servers
HTTP (Recommended)
Cloud-based services
claude mcp add --transport http <name> <url>
Stdio (Local)
Direct system access/custom scripts
claude mcp add --transport stdio <name> -- <command>
Control Your Environment
Add: `claude mcp add [options] `
List: `claude mcp list` (View active connections)
Inspect: `claude mcp get `
Remove: `claude mcp remove `
Status: `/mcp` (Inside Claude Code interface)

Exercise (10 mins): Querying the Claude Code
Changelog
Let's simulate a scenario where Claude needs to access an internal knowledge base to find the latest changes in Claude
Code. This exercise demonstrates how to integrate a new MCP server and query it for specific information.
Add 'context7' MCP Server Query Latest Claude Code Changelog
First, we'll configure Claude to connect to a hypothetical Now, use the 'context7' MCP to ask for the most recent
'context7' MCP server, which is designed to expose internal changelog entries for Claude Code. This simulates an AI
documentation and change logs via HTTP. agent retrieving specific, dynamic information from an
internal system.
claude mcp add --transport http context7
https://api.context7.com/mcp/docs Use context7 to tell me what are the latest changelog
sessions
This exercise highlights how MCP enables Claude to seamlessly interact with proprietary information sources, acting as an
intelligent interface to complex data ecosystems.
Expected Outcome: Claude should return a summary or a list of the most recent changes to Claude Code, as if retrieving it
directly from an internal documentation system.

The MCP Ecosystem
Development Productivity
GitHub Notion
GitLab Slack
Linear Asana
Sentry Google Drive
Data Infrastructure
PostgreSQL AWS
Snowflake Cloudflare
Google BigQuery Vercel
Scopes & Permissions
Scopes Security
Project: Specific to current directory (.mcp.json) Allowlist: Explicitly permit servers
User: Global availability Denylist: Block specific URLs/commands

Real Talk – Community Gotchas
Research from practice:
Context Amnesia Test Gaslighting
Compression causes Claude to ignore CLAUDE.md Claude modifying tests to pass broken code
Wildcard Fail Silent Copying
mcp__server__* permissions are unreliable Accidental .env secret leakage without hooks
Prompts are interpreted at runtime by an LLM that can be convinced otherwise. You need something deterministic.

Key Considerations for MCP Integration
Successful integration of Model Context Protocol (MCP) requires attention to three fundamental areas that ensure efficiency,
reliability, and safety.
Discovery & Routing Execution & Reliability Security & Privileges
Enabling agents to effectively Robust execution demands rigorous Managing privileges and
discover and route through request validation, adherence to safeguarding against potential
available tools and functionalities is strong types, comprehensive error vulnerabilities is paramount.
crucial. This involves planning for handling, and resilient retries. Implementing stringent access
progressive disclosure of These measures ensure that controls and auditing mechanisms
capabilities and optimizing context interactions are predictable and protects against unauthorized
navigation to leverage the right minimize failures in dynamic actions and maintains the integrity
resources at the right time. environments. of the ecosystem.

MCP Gateway Concept
The MCP Gateway (sometimes called a Hub) acts as an intermediary layer, much like an air traffic control tower. From an
engineering perspective, it offers powerful capabilities:
Central Authorization Monitoring & Auditing Security
The client (Agent) authenticates Every request and response is If an anomaly is detected (e.g.,
once with the Gateway, which then visible in one place, providing prompt injection or data leak), tool
manages complex keys for external comprehensive monitoring and access can be instantly revoked for
services. audit trails for all activity. the entire organization without
updating each Agent.
Source: https://martinfowler.com/articles/gateway-pattern.html

Claude Code Plugin Marketplace - How It Works
The plugin system (introduced in Claude Code ~2.0.13) turns CC from a standalone tool into an extensible platform. Think of it
like package managers for your AI coding assistant.
Mental Model
Marketplace Plugins Components
(catalog/registry) (bundles) (slash commands, agents, hooks,
MCP servers, LSP servers)
A marketplace is a catalog of plugins someone has created and shared. Using one is two steps: first add the marketplace
(registers the catalog), then browse and install individual plugins. No plugins are installed just by adding a marketplace.

Plugin entry point
```
/plugin # go to plugin marketplace
```

Installation & Usage Checklist
Installation Steps: Pre-Publishing Checklist:
Step 1 — Add marketplace marketplace.json at repo root .claude-plugin/
plugin.json inside each plugin's .claude-plugin/
/plugin marketplace add Source paths start with ./ (not bare .)
https://bitbucket.org/org/repo.git
No agents, commands, category fields in plugin.json
Hook scripts are executable and use
Step 2 — Install plugin:
${CLAUDE_PLUGIN_ROOT}
/plugin validate . passes clean
/plugin install my-plugin@my-marketplace
/plugin validate ./my-plugin/ passes clean
Plugin installed and enabled in target project's
Alternative step 2 — Enable in project
settings.json
(.claude/settings.json):
```json
{
"enabledPlugins": {
"my-plugin@my-marketplace": true
}
}
```
Other Useful Commands:
```bash
/plugin marketplace update my-marketplace
# pull latest
/plugin list
# see installed
/plugin validate .
# check manifests
```

Hooks Configuration & Validation
Hooks in plugin.json: Validation Commands:
```json ```bash
"hooks": { /plugin validate ./my-plugin/
"PreToolUse": [ # validate plugin
{ /plugin validate .
"matcher": "Bash|Write|Edit", # validate marketplace (repo root)
"hooks": [ ```
{
"type": "command",
Common Validation Errors:
"command":
"${CLAUDE_PLUGIN_ROOT}/hooks/my-hook.py" "No manifest found in directory" → Use plugin root dir,
} not .claude-plugin/
] "plugins.0.source: Invalid input" → Change "." to "./"
}
"agents: Invalid input" → Remove agents field — auto-
],
discovered
"PostToolUse": [ ... ],
"Unrecognized key: category" → Remove it —
"Stop": [ ... ],
marketplace-only field
"UserPromptSubmit": [ ... ]
"No marketplace description" → Add metadata object
}
```
Hook Events:
PreToolUse: Before a tool executes
PostToolUse: After a tool executes
UserPromptSubmit: When user sends a message
Stop: When session ends
Tips:
Use matcher to filter by tool name (pipe-separated
regex)
Use ${CLAUDE_PLUGIN_ROOT} for paths — resolves to
plugin install location
Hook type: "command" runs a script (.py, .sh)

Marketplace & Plugin Configuration
marketplace.json — Required Fields: plugin.json — Keep It Minimal:
```json ```json
{ {
"name": "my-marketplace", "name": "my-plugin",
"owner": { "description": "Brief plugin description",
"name": "Your Name" "version": "1.0.0",
}, "author": { "name": "Your Name" },
"metadata": { "license": "MIT",
"description": "What this marketplace offers" "keywords": ["dev", "tools"],
}, "hooks": { }
"plugins": [ }
{ ```
"name": "my-plugin",
"source": "./my-plugin",
"description": "What the plugin does",
"version": "1.0.0",
"keywords": ["tag1", "tag2"],
"author": {
"name": "Your Name"
}
}
]
}
```
Important Notes:
Do NOT use: category, tags, strict in marketplace.json
Do NOT use: agents, commands, category, skills in plugin.json — these cause validation errors
Source paths must start with ./ (not bare .)
Directories are auto-discovered

Plugin Marketplace Architecture
A plugin marketplace is a git repository that distributes Claude Code plugins.
| Structure: | Folder Structure: |     |     |
| ---------- | ----------------- | --- | --- |
Marketplace repo (git)
my-marketplace-repo/
.claude-plugin/marketplace.json ← registry
|     | ├──  .claude-plugin/ |     |     |
| --- | -------------------- | --- | --- |
Points to plugin directories ← actual plugins
|     | │ └── |                           | ←                  |
| --- | ----- | ------------------------- | ------------------ |
|     |       |  marketplace.json         |  REQUIRED at repo  |
root
Workflow:
│
|     | ├── |     | ←   |
| --- | --- | --- | --- |
1. Add marketplace  my-plugin/                    plugin directory
│ ├──
|     |     |  .claude-plugin/ |     |
| --- | --- | ---------------- | --- |
2. Browse plugins
|     | │ │     | └──                   | ←                |
| --- | ------- | --------------------- | ---------------- |
|     |         |  plugin.json          |  plugin manifest |
3. Install
|           | │ ├── |                           | ←                |
| --------- | ----- | ------------------------- | ---------------- |
|           |       |  agents/                  |  auto-discovered |
| 4. Enable | │ ├── |                           | ←                |
|           |       |  commands/                |  auto-discovered |
|           | │ ├── |                           | ←                |
|           |       |  skills/                  |  auto-discovered |
|           | │ ├── |                           | ←                |
|           |       |  hooks/                   |  auto-discovered |
|           | │ └── |                           | ←                |
|           |       |  rules/                   |  auto-discovered |
│
|     | └──  another-plugin/              |     | ←  multiple plugins per  |
| --- | --------------------------------- | --- | ------------------------ |
marketplace
└──
|     |             |  .claude-plugin/ |     |
| --- | ----------- | ---------------- | --- |
|     |         └── |  plugin.json     |     |
Key Rules:
marketplace.json must be at repo root .claude-plugin/
plugin.json must be inside each plugin's .claude-plugin/
agents/, commands/, skills/, hooks/, rules/ are auto-
discovered — do NOT declare them in plugin.json

Homework Assignment: Explore the MCP &
Plugin's
To prepare for our next session, immerse yourself in the MCP Registry and identify practical applications.
Identify 3 MCPs: Select three Micro-Credential Providers (MCPs) from the registry that you find interesting.
Identify 3 Plugins: Choose three plugins that could enhance your current work scenarios or project workflows.
Outline Use Cases: For each MCP and plugin, describe a possible use-case relevant to your daily tasks or future projects.
Let's discuss at the start of tomorrow's session.

Thank you for
today!
Questions?

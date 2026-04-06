const KI = "https://github.com/easingthemes/ki-bundestag";

const learnings = [
  {
    id: '01-agentic-architecture',
    projectId: 'ki-bundestag',
    title: "Domain 1: Agentic Architecture & Orchestration",
    domain: 'D1',
    weight: '27%',
    content: `# Domain 1: Agentic Architecture & Orchestration (27%)

The heaviest exam domain. Covers agentic loop mechanics, multi-agent orchestration, task decomposition, hub-and-spoke patterns, and session resumption.

## What We Built

KI-Bundestag is fundamentally a **multi-agent orchestration system**: 6 AI party agents + media agents + summary agents + briefing agents, all coordinated through a central simulation loop.

---

## 1. Agentic Loop Mechanics

### Exam concept
An agentic loop is a cycle of: observe state -> decide action -> execute -> update state -> repeat. The exam tests whether you understand when to use loops vs. single-shot calls.

### Our implementation
\`packages/engine/src/simulation/loop.ts\` — the \`runDay()\` function is a 13-step agentic loop:

\`\`\`typescript
// loop.ts — simplified flow
export async function runDay(): Promise<number> {
  // 1. Load current state (observe)
  const meta = db.select().from(schema.simulationMeta).all()[0];
  const currentDay = meta.currentDay + 1;

  // 2-3. Economic drift + crisis system (environment changes)
  applyEconomicDrift(nationalState);
  maybeTriggerCrisis(currentDay, nationalState);

  // 4. Party agents make decisions (decide + act)
  const requests = buildPartyAgentRequests(contexts, currentDay, depthConfig);
  const results = await submitBatch(requests);

  // 5-8. Process actions, update approval, resolve votes (execute + update)
  for (const ctx of partyContexts) {
    const actions = await processPartyAgentResult(result, ctx, votableBills);
    // ... apply each action to state
  }

  // 9-12. Secondary agents: media, polls, summary
  // 13. Persist state, advance day counter (loop boundary)
  db.update(schema.simulationMeta).set({ currentDay }).run();
  return currentDay;
}
\`\`\`

### Key learning
The day counter is only committed at the **end** of a successful day — if AI calls fail mid-day, \`cleanupPartialDay()\` removes partial data and the day can be retried. This is a **transactional loop boundary** pattern.

---

## 2. Hub-and-Spoke Orchestration

### Exam concept
A central orchestrator (hub) delegates to specialized agents (spokes) and aggregates their results. The exam contrasts this with peer-to-peer or chain patterns.

### Our implementation
\`loop.ts\` is the hub. The spokes are:

| Spoke | Module | Batch Group |
|---|---|---|
| 6 Party Agents | \`party-agent.ts\` | Group A |
| Media Generator | \`media.ts\` | Group C |
| Daily Summary | \`summary.ts\` | Group C |
| Daily Briefing | \`briefing.ts\` | Pre-loop |
| Era Summaries | \`era-summary.ts\` | Periodic |
| Poll Generator | \`polls.ts\` | Mid-cycle |
| Referendum Generator | \`referendums.ts\` | Mid-cycle |
| Coalition Negotiator | \`negotiations.ts\` | Election phase |
| Knowledge Grounder | \`knowledge-fetch.ts\` | Weekly |

The hub collects \`BatchRequest[]\` from each spoke, submits them as a single batch, and routes results back:

\`\`\`typescript
// Hub collects requests from spokes
const batchA: BatchRequest[] = [
  ...buildPartyAgentRequests(contexts, currentDay),
  ...buildInterpellationRequests(parties),
  ...buildDisciplineRequests(parties),
];

// Single submission to batch API
const results = await submitBatch(batchA);

// Route results back to spokes
for (const ctx of contexts) {
  const result = findResult(results, \`agent-\${ctx.party.id}-day\${currentDay}\`);
  const actions = await processPartyAgentResult(result, ctx, votableBills);
}
\`\`\`

### Key learning
Hub-and-spoke is ideal when spokes are **independent** (party agents don't need each other's output) but the hub needs to **aggregate** results (e.g., tallying votes requires all parties' decisions). The batch API naturally fits this pattern.

---

## 3. Task Decomposition

### Exam concept
Breaking complex tasks into subtasks that can be parallelized or sequenced. The exam tests whether you can identify dependencies.

### Our implementation
The daily simulation decomposes into **dependency groups**:

\`\`\`
Group A (parallel)          Group B (depends on A)       Group C (depends on B)
├── 6 party agents          ├── Vote tallying            ├── Media generation
├── Internal proposals      ├── Bill status updates      ├── Daily summary
└── MdB actions             ├── Approval drift           └── Era summary (periodic)
                            └── Interpellation answers
\`\`\`

Within each group, tasks are **parallelized via batch API**. Between groups, there are strict dependencies — you can't tally votes before parties vote.

\`\`\`typescript
// Dependency-aware execution
const groupAResults = await submitBatch(groupARequests);  // parallel
applyGroupAActions(groupAResults);                        // sequential
const groupBResults = await submitBatch(groupBRequests);  // parallel
applyGroupBActions(groupBResults);                        // sequential
\`\`\`

### Key learning
The exam asks: "which tasks can be parallelized?" The answer is always about **data dependencies**. If Task B reads Task A's output, they must be sequential. If they're independent, batch them.

---

## 4. Graceful Degradation & Fallback Policies

### Exam concept
What happens when an agent fails? The system must continue operating with reduced capability, not crash.

### Our implementation
Every agent call has a typed fallback:

\`\`\`typescript
// party-agent.ts — fallback on ANY error
export async function runPartyAgent(ctx: AgentContext, votableBills: Bill[]): Promise<AgentAction[]> {
  try {
    const { text } = await callAI({ system: systemPrompt, prompt: userPrompt, ... });
    const parsed = parseAgentResponse(text);       // may throw
    return validateActions(parsed.actions, ...);    // drops invalid actions
  } catch (error) {
    // Fallback: abstain on all bills (safe default)
    return votableBills.map(bill => ({
      type: "vote",
      billId: bill.id,
      vote: "abstain",
      reason: "Agent error - automatic abstain",
    }));
  }
}
\`\`\`

Fallback policies by module:

| Module | Fallback | Why |
|---|---|---|
| Party agents | Abstain all bills | Neutral — doesn't distort votes |
| Negotiations | "Open to all partners" | Prevents deadlock |
| Media | Skip (no articles) | Missing news is OK |
| Summaries | Skip (no narrative) | Non-critical |
| Speeches | Score 0 (neutral) | Deterministic fallback |

### Key learning
**Fallbacks should be semantically neutral** — they shouldn't bias the system. Abstaining is neutral. Voting "yes" or "no" would introduce bias. The exam tests this judgment.

---

## 5. Circuit Breaker Pattern

### Exam concept
Stop making API calls to a failing provider to avoid cascading failures and wasted spend.

### Our implementation
\`\`\`typescript
// client.ts — provider-level circuit breaker
const providerLimits = new Map<Provider, { until: string; resetAt: number }>();

export function detectLimitError(err: unknown): LimitResult {
  // Hard limit: "You have reached your usage limits. Access resumes <date>"
  const limitMatch = body.match(/usage limits?.*?regain access on ([0-9T :ZZ\\-]+)/i);
  if (limitMatch) {
    return { type: "hard", provider: inferProvider(e), until: limitMatch[1] };
  }
  // Transient 429
  if (status === 429) return { type: "transient", provider: inferProvider(e) };
  // Network errors
  if (isNetworkError(err)) return { type: "transient", provider: inferProvider(e) };
  return { type: "none" };
}

// Before every API call:
const limit = providerLimits.get(config.provider);
if (limit && Date.now() < limit.resetAt) {
  throw new AIProviderLimitError(config.provider, limit.until);  // skip call
}
\`\`\`

### Key learning
The circuit breaker has three states: **closed** (normal), **open** (all calls blocked), and **half-open** (try one call after TTL expires). Our implementation uses TTL-based reset (\`resetAt\` timestamp) — once the time passes, the breaker auto-resets.

---

## 6. Session Resumption / Partial Day Recovery

### Exam concept
If a long-running agentic process fails mid-way, how do you resume?

### Our implementation
\`\`\`typescript
// loop.ts — cleanup before retry
function cleanupPartialDay(dayNumber: number): void {
  // Delete all events, bills, motions, etc. created during the failed day
  for (const table of simDayNumberTables) {
    sqlite.prepare(\`DELETE FROM \${table} WHERE day_number = ?\`).run(dayNumber);
  }
}

// The day counter is NOT advanced until everything succeeds:
// Start of day: meta.currentDay is still N-1
// End of day (success only): UPDATE simulation_meta SET currentDay = N
\`\`\`

### Key learning
The exam asks about **idempotent retries**. Our approach: treat each day as a transaction. If it fails, clean up and replay from scratch. The day counter acts as a **commit point**.

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| Agentic loops | High | 13-step \`runDay()\` loop |
| Hub-and-spoke | High | Central loop + 9 spoke agents |
| Task decomposition | High | Dependency-grouped batch execution |
| Graceful degradation | Medium | Typed fallbacks per agent |
| Circuit breaker | Medium | Provider-level with TTL reset |
| Session resumption | Medium | Transactional day boundaries |
`,
  },
  {
    id: '02-tool-design-mcp',
    projectId: 'ki-bundestag',
    title: "Domain 2: Tool Design & MCP Integration",
    domain: 'D2',
    weight: '18%',
    content: `# Domain 2: Tool Design & MCP Integration (18%)

Covers tool interface design, structured error responses, MCP server configuration, and Claude's built-in tools. Experience spans **three projects**: KI-Bundestag (structured output + error handling), aem-mcp-server (57-tool MCP server), and moltbook-http-mcp (HTTP MCP server).

---

## MCP Experience Across Projects

| Project | Role | Scale | Transports |
|---|---|---|---|
| **aem-mcp-server** | Built from scratch | 57 tools, 4 resource types | stdio + HTTP |
| **moltbook-http-mcp** | Built from scratch | 20+ tools, auth chain | HTTP + stdio |
| **dx-aem-flow** | Consumer/configurator | 6 MCP servers, 3 plugins | stdio + HTTP + Docker |
| **ki-bundestag** | Structured output schemas | JSON Schema, error categories | N/A (batch API) |

---

## 1. Building MCP Servers (aem-mcp-server)

### What the exam tests
Creating MCP servers with tools, resources, and prompts. Understanding transport types, tool annotations, and error handling.

### What we built
A full-featured MCP server for Adobe Experience Manager with 57 tools and 4 resource types:

**Tools organized by category:**
- Content & Pages — CRUD, search (QueryBuilder, fulltext, fuzzy), structure analysis
- Components — update, scan, add, convert, bulk-manage, Experience Fragments
- Assets — asset management and operations
- Fragments — Content Fragments + Experience Fragments with variation management
- Workflows — start, advance, delegate stages; model discovery
- Replication — publish/unpublish content

**Resources (read-only discovery):**
\`\`\`
aem://{instance}/components  — component catalog with names, resourceTypes, titles
aem://{instance}/sites       — site roots and language structure
aem://{instance}/templates   — available page templates with paths and titles
aem://{instance}/workflow-models — workflow models with IDs and descriptions
\`\`\`

**Dual transport support:**
- **stdio** (recommended) — spawned via \`npx\`, zero-install, single-client IDE usage
- **Streamable HTTP** — persistent server mode for shared team access, port 8502

**Tool annotations** — each tool tagged with metadata for intelligent agent selection:
- \`group\`: functional category (content, components, assets, etc.)
- \`readOnly\`: whether the tool modifies state
- \`complexity\`: helps agents choose the right tool

**Actionable error handling** — error responses include:
- \`suggestion\`: what the agent should try instead
- \`alternatives\`: related tools that might work

**Multi-instance support** — connect to multiple AEM instances simultaneously with named parameters.

### Key learning
- Tool descriptions must explain **when** to use the tool, not just what it does
- \`readOnly\` annotations prevent agents from accidentally modifying state during exploration
- Response verbosity control (summary/standard/full) keeps context manageable — analogous to KI-Bundestag's context depth system

---

## 2. HTTP MCP with Auth (moltbook-http-mcp)

### What the exam tests
HTTP transport, authentication patterns, multi-tenant design.

### What we built
An MCP server for a social network with HTTP and stdio transports:

**Multi-tenant authentication chain:**
\`\`\`
Bearer token → X-Api-Key header → Query param → Environment variable
\`\`\`

- Optional JWT enforcement for POST requests in HTTP mode
- Per-request API key submission for multi-tenant scenarios
- TLS/HTTPS support with certificate configuration

**Key patterns:**
- Clean separation between transport layers and business logic
- Auto-detection of stdio mode (when stdin isn't a TTY)
- Works across Cursor, VS Code, WebStorm, and any MCP-compatible client

### Key learning
- HTTP transport is for shared/remote servers; stdio for local IDE subprocess spawning
- Auth chain fallbacks make the server flexible across deployment modes
- The exam tests knowing **when** to use HTTP vs stdio — HTTP for team servers, stdio for per-developer

---

## 3. MCP Consumer Configuration (dx-aem-flow)

### What the exam tests
Configuring MCP servers in Claude Code settings, namespacing, multi-MCP orchestration.

### What we built
6 MCP servers configured across 3 plugins:

\`\`\`json
// plugins/dx-core/.mcp.json — Figma + accessibility
{
  "mcpServers": {
    "figma": { "type": "http", "url": "http://127.0.0.1:3845/mcp" },
    "axe-mcp-server": {
      "type": "docker",
      "image": "dequesystems/axe-mcp-server:latest",
      "env": { "AXE_API_KEY": "\${AXE_API_KEY}" }
    }
  }
}

// plugins/dx-aem/.mcp.json — AEM + Chrome DevTools
{
  "mcpServers": {
    "AEM": { "command": "npx", "args": ["-y", "aem-mcp-server", "-t", "stdio"] },
    "chrome-devtools-mcp": { "command": "npx", "args": ["chrome-devtools-mcp@latest"] }
  }
}
\`\`\`

**Critical naming convention for plugin-scoped MCP:**
\`\`\`
mcp__plugin_<plugin-name>_<server-name>__<tool-name>

Examples:
  mcp__plugin_dx-aem_AEM__getNodeContent
  mcp__plugin_dx-core_figma__get_file
  mcp__plugin_dx-core_axe-mcp-server__run_audit
\`\`\`

**Multi-MCP orchestration:**
The \`aem-fe-verifier\` agent chains two MCP servers:
1. AEM MCP to create demo pages and add components
2. Chrome DevTools MCP to navigate, take screenshots, verify rendering vs Figma

### Key learning
- **Exact namespacing is required** — using shorthand (\`mcp__figma__\`) causes "tool not found" failures because subagents resolve by exact name
- **Per-plugin \`.mcp.json\`** distributes server config with the plugin — installing a plugin auto-registers its MCP servers
- **Three transport types** used in practice: stdio (AEM, Chrome), HTTP (Figma), Docker (axe)
- **Environment variables** parameterize connections, keeping secrets out of config

---

## 4. JSON Schema Design (ki-bundestag)

### What the exam tests
Designing schemas with correct use of \`required\`, \`additionalProperties\`, \`enum\`, and nullable fields.

### What we built in this project
The \`AGENT_RESPONSE_SCHEMA\` in \`party-agent.ts\` — same JSON Schema format as \`tool_use\` input schemas:

\`\`\`typescript
const AGENT_RESPONSE_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          billId: { type: "string" },
          vote: { type: "string" },
          impact: {
            type: "object",
            properties: { budget: { type: "number" }, /* ... */ },
            additionalProperties: false,
          },
        },
        required: ["type"],              // only 'type' is universally required
        additionalProperties: false,     // prevent hallucinated fields
      },
    },
  },
  required: ["actions"],
  additionalProperties: false,
};
\`\`\`

**Why we chose structured output over tool_use for KI-Bundestag:**
- Agents return **multiple actions** per turn (batch-friendly single response)
- All action types known at compile time — no dynamic tool discovery needed
- Batch API structured output gives guaranteed valid JSON at 50% cost discount
- tool_use would serialize actions into round-trips, breaking the batch model

---

## 5. Structured Error Categories (ki-bundestag)

### What the exam tests
The four error categories for tool responses.

### What we built
A typed discriminated union for error detection:

\`\`\`typescript
// client.ts — typed error categories
type LimitResult =
  | { type: "hard"; provider: Provider; until: string }  // spending cap → circuit breaker
  | { type: "transient"; provider: Provider }             // 429/network → retry with backoff
  | { type: "none" };                                     // not a limit error

// Mapped to exam's four categories:
// 1. Invalid input    → action-parser.ts validates IDs, categories, vote values
// 2. Execution failure → detectLimitError() catches API/network errors
// 3. Permission denied → validateActions() checks capabilities (Fraktion, opposition)
// 4. Not found         → bill ID validation against votableBills list
\`\`\`

In aem-mcp-server, error responses include \`suggestion\` and \`alternatives\` fields — the exam's concept of **actionable error responses** that help agents self-correct.

---

## Summary: Full Domain Coverage

| Concept | Exam Weight | Experience Source |
|---|---|---|
| MCP server creation | High | aem-mcp-server (57 tools), moltbook-http-mcp |
| MCP resources | High | aem-mcp-server (4 resource types) |
| Transport types (stdio/HTTP/Docker) | High | All three used across projects |
| MCP configuration & namespacing | High | dx-aem-flow (6 servers, 3 plugins) |
| Tool annotations (readOnly, group) | Medium | aem-mcp-server |
| JSON Schema for tools | Medium | ki-bundestag AGENT_RESPONSE_SCHEMA |
| Structured error responses | Medium | Both: ki-bundestag errors + AEM actionable errors |
| Multi-MCP orchestration | Medium | dx-aem-flow AEM→Chrome DevTools chain |
| Auth patterns for MCP | Low | moltbook-http-mcp (JWT, multi-tenant) |
| tool_use vs structured output tradeoff | Low | ki-bundestag (chose structured for batch) |

### Remaining minor gap
The only sub-topic not directly practiced is **MCP Prompts** (reusable prompt templates exposed via MCP). Our \`buildSystemPrompt()\` in ki-bundestag is conceptually the same pattern, but we haven't exposed prompts through an MCP server's ListPrompts handler.
`,
  },
  {
    id: '03-claude-code-config',
    projectId: 'ki-bundestag',
    title: "Domain 3: Claude Code Configuration & Workflows",
    domain: 'D3',
    weight: '20%',
    content: `# Domain 3: Claude Code Configuration & Workflows (20%)

Covers CLAUDE.md hierarchy, path-specific rules with glob patterns, plan mode vs direct execution, and CI/CD integration. This domain is about knowing how to **configure Claude Code as a development tool**.

---

## Key Exam Concept: CLAUDE.md Hierarchy

Claude Code reads configuration from multiple levels, merged in order of specificity:

\`\`\`
~/.claude/CLAUDE.md              # User-level (personal preferences)
  └─ /project/.claude/CLAUDE.md  # Project-level (team standards)  <-- checked into git
      └─ /project/.claude/rules/*.md  # Domain-specific rules (path-scoped)
\`\`\`

Each level can override or extend the previous. The exam tests whether you know which level to put configuration at and why.

---

## What We Built

### 1. Project-Level CLAUDE.md

Our \`.claude/CLAUDE.md\` is a comprehensive project instruction file (~180 lines):

\`\`\`markdown
# CLAUDE.md

## Project Overview
KI Bundestag is an AI-powered simulation of the German parliament...

## Setup (MANDATORY before any work)
**Always run \`npm install\` from the monorepo root before starting any task.**

## Commands (run from monorepo root)
npm run seed / migrate / simulate / dev:api / dev:web / build / typecheck / lint / test

## Architecture
Monorepo with npm workspaces + Turborepo. Four packages:
- types, engine, api, web

## Critical Warnings
- Package exports must point to ./src/index.ts (not dist/)
- ESM: All packages use "type": "module"
- DB path: resolved via import.meta.url + findMonorepoRoot()

## Domain-Specific Rules
Detailed rules are in .claude/rules/ (auto-loaded, path-scoped)
\`\`\`

**Exam-relevant structure:**
- **Setup instructions** at the top (most important = first)
- **Command reference** for common operations
- **Architecture overview** so Claude understands the codebase
- **Critical warnings** for known pitfalls
- **Links to detailed rules** rather than putting everything in one file

---

### 2. Path-Scoped Rules (\`.claude/rules/\`)

We have 5 domain-specific rule files, each scoped to relevant file paths:

\`\`\`yaml
# .claude/rules/frontend.md
---
paths:
  - "packages/web/**"
---
# Frontend Rules (Tailwind v4 + shadcn/ui)
- Tailwind v4 syntax (@import "tailwindcss" + @theme inline)
- shadcn/ui components in src/components/ui/
- Party colors: always inline style (not Tailwind classes)
- Shared modules: colors.ts, shared.tsx, VoteBar.tsx, FilterPills.tsx
\`\`\`

\`\`\`yaml
# .claude/rules/simulation.md
---
paths:
  - "packages/engine/**"
---
# Simulation Rules
- ALL AI calls go through submitBatch() (50% discount)
- Batch groups: A (party agents), B (interpellations), C (media)
- Transient retry: 2 retries, 2s+5s backoff
- Shared JSON parser: parseAIJson() in ai-json.ts
\`\`\`

**All 5 rule files:**

| File | Scope | Purpose |
|---|---|---|
| \`esm.md\` | \`packages/engine/**\` | ESM import rules, .js extensions, naming conventions |
| \`frontend.md\` | \`packages/web/**\` | Tailwind v4, shadcn/ui, shared components |
| \`database.md\` | \`packages/engine/src/db/**\` | Dual-DB architecture, Drizzle, migrations |
| \`simulation.md\` | \`packages/engine/**\` | Agent calls, runDay() flow, batch groups |
| \`api.md\` | \`packages/api/**\` | Express conventions, route structure, mappers |

**Why path-scoping matters (exam concept):**
- Rules are only injected when Claude is working on files matching the glob pattern
- Reduces prompt size — frontend rules aren't loaded when editing engine code
- Prevents conflicting advice — different patterns for different packages

---

### 3. Claude Code Skills

We defined custom skills (slash commands) for common workflows:

\`\`\`
/plan-exe     — Execute planned steps from Progress.md
/fix-types    — Run typecheck, fix all errors, re-run to confirm
/healthcheck  — Full project health check (build, types, DB, servers, git)
/dev-start    — Start dev environment (API + web servers)
/db-query     — Run a database query against simulation
/sim-status   — Check simulation status
/simplify     — Review changed code for reuse, quality, efficiency
\`\`\`

**Exam-relevant pattern:** Skills automate multi-step workflows that Claude Code would otherwise need manual prompting for. Each skill is a reusable prompt template — similar to MCP Prompts.

---

### 4. Hooks (Automated Behaviors)

We use a \`SessionStart\` hook that runs automatically when a Claude Code session begins:

\`\`\`json
// settings.json hook configuration
{
  "hooks": {
    "SessionStart": [
      {
        "command": "echo 'Current branch:' \$(git branch --show-current) && ...",
        "blocking": true
      }
    ]
  }
}
\`\`\`

**Exam concept:** Hooks execute shell commands in response to Claude Code events. The exam tests:
- **SessionStart** — runs when session begins (setup, environment checks)
- **PreToolUse** — runs before a tool call (validation, safety checks)
- **PostToolUse** — runs after a tool call (logging, side effects)
- **Blocking** hooks halt execution until they complete; non-blocking run in background

---

## Exam Topics to Study Further

### Plan Mode vs Direct Execution
- **Plan mode**: Claude analyzes first, produces a plan, then executes step-by-step
- **Direct execution**: Claude implements immediately
- The exam tests when to use each — plan mode for complex multi-file refactors, direct for simple edits

### CI/CD Integration Flags
\`\`\`bash
# Non-interactive mode for CI
claude --non-interactive --max-turns 10 "Run tests and fix failures"

# Trust settings for automation
claude --trust-tools "Read,Glob,Grep,Bash" --dangerously-skip-permissions
\`\`\`

### CLAUDE.md Best Practices the Exam Tests
1. **Put the most important information first** — Claude reads top-to-bottom
2. **Use imperative instructions** — "Always run npm install first" not "You might want to..."
3. **Include critical warnings prominently** — known pitfalls that waste time
4. **Link to detailed docs** rather than duplicating content
5. **Path-scope rules** to avoid irrelevant context
6. **Version control CLAUDE.md** — it's a team artifact, not personal config

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| CLAUDE.md hierarchy | High | 3-level config (user / project / rules) |
| Path-scoped rules | High | 5 glob-scoped rule files |
| Skills / slash commands | Medium | 12+ custom skills defined |
| Hooks configuration | Medium | SessionStart hook |
| Plan mode workflows | Medium | plan-exe / plan-commit / plan-fix skills |
| CI/CD flags | Low | Basic awareness (study more) |
`,
  },
  {
    id: '04-prompt-engineering',
    projectId: 'ki-bundestag',
    title: "Domain 4: Prompt Engineering & Structured Output",
    domain: 'D4',
    weight: '20%',
    content: `# Domain 4: Prompt Engineering & Structured Output (20%)

Covers few-shot construction, tool_use JSON schema design, validation-retry loops, and batch vs synchronous decision trees. **This is our strongest domain** — the project has sophisticated dynamic prompts with validation pipelines.

---

## Key Exam Concept: Programmatic Enforcement vs Prompt Guidance

> The single most tested concept is whether a behavior should be enforced **programmatically** (in code) or via **prompt instructions**. The exam rewards programmatic solutions for anything that must be guaranteed.

Our project demonstrates both — and shows why you need both layers.

---

## 1. Dynamic System Prompts with Capability Gating

### Exam concept
System prompts should only include instructions relevant to the current context. Irrelevant instructions waste tokens and can confuse the model.

### Our implementation
\`packages/engine/src/agent/prompt.ts\` builds system prompts **conditionally** based on party capabilities:

\`\`\`typescript
// prompt.ts — capabilities determine which rules are included
export interface PartyCapabilities {
  canVote: boolean;       // requires Fraktion (37+ seats)
  canPropose: boolean;    // requires Fraktion
  canAmend: boolean;      // requires Fraktion
  hasFraktion: boolean;   // 37+ seats threshold
  isOpposition: boolean;  // opposition vs coalition
  isCoalitionLeader: boolean;  // chancellor's party
  hasActiveElection: boolean;  // campaign period
}

export function buildSystemPrompt(partyId, capabilities, realPositions): string {
  const rules: string[] = [
    "You must respond with ONLY valid JSON matching the schema below.",
    "You may take 1-3 actions per turn.",
  ];

  // Conditional rules — only included when capability exists
  if (caps.canVote) {
    rules.push('You MUST submit a vote for every bill in "THIRD READING".');
  }
  if (caps.canPropose) {
    rules.push("You may propose at most 1 new bill per turn.");
  }
  if (caps.isOpposition) {
    rules.push("Opposition parties should scrutinize government bills.");
  }
  if (caps.isCoalitionLeader && !caps.hasActiveElection) {
    rules.push("You may call a Vertrauensfrage (confidence vote).");
  }
  // ...
\`\`\`

### Negative capability instructions (anti-hallucination)
\`\`\`typescript
  // Explicitly tell the model what it CANNOT do
  const cannotDo: string[] = [];
  if (!caps.canVote) cannotDo.push("vote on bills");
  if (!caps.canPropose) cannotDo.push("propose bills");
  if (!caps.hasFraktion) cannotDo.push("submit motions", "file interpellations");

  if (cannotDo.length > 0) {
    rules.push(\`You CANNOT: \${cannotDo.join(", ")}. Do NOT include these in your response.\`);
  }
\`\`\`

**Why this matters for the exam:** The model is less likely to hallucinate unavailable actions when you explicitly list what it cannot do. But this is still **prompt-level guidance** — our code also validates actions programmatically (see section 4).

---

## 2. Dynamic Schema in System Prompt

### Exam concept
Only show the model output formats it's allowed to use. Showing all possible formats increases hallucination of disallowed actions.

### Our implementation
The response schema is built dynamically — action types only appear if the party has the capability:

\`\`\`typescript
// prompt.ts — schema entries conditional on capabilities
const schemaEntries: string[] = [];

if (caps.canVote) {
  schemaEntries.push('{"type":"vote","billId":"<id>","vote":"yes"|"no"|"abstain","reason":"<brief>"}');
}
if (caps.canPropose) {
  schemaEntries.push('{"type":"propose_bill","title":"<title>","description":"<desc>",...}');
}
if (caps.hasFraktion && caps.isOpposition) {
  schemaEntries.push('{"type":"file_interpellation","interpellationType":"kleine"|"große",...}');
}

// Always available
schemaEntries.push('{"type":"statement","title":"<headline>","statement":"<text>"}');
schemaEntries.push('{"type":"nothing"}');

const schema = \`{"actions":[\\n\${schemaEntries.join(",\\n")}\\n]}\`;
\`\`\`

An opposition party with a Fraktion sees 8+ action types. A party with no seats sees only \`statement\` and \`nothing\`.

---

## 3. Few-Shot Examples

### Exam concept
Few-shot examples anchor the model's output format. One good example is worth paragraphs of description.

### Our implementation
A compact example in the system prompt:

\`\`\`typescript
const example = \`EXAMPLE (2 votes + 1 statement):
{"actions":[{"type":"vote","billId":"bill-abc","vote":"yes","reason":"Aligns with our social policy goals"},{"type":"vote","billId":"bill-xyz","vote":"no","reason":"Unacceptable fiscal impact"},{"type":"statement","title":"Party responds to crisis","statement":"We call for immediate action."}]}\`;
\`\`\`

**Key decisions:**
- **One example, not many** — tokens are precious in a multi-agent system
- **Example shows the most common pattern** (votes + statement)
- **Compact format** (single line JSON) to model the expected output style
- **Realistic content** so the model mimics the register

---

## 4. Validation-Retry Loops (Programmatic Enforcement)

### Exam concept
Never trust AI output — always validate programmatically. The exam rewards multi-pass validation with typed fallbacks over blind trust.

### Our implementation — 4-layer defense:

**Layer 1: Anthropic Structured Output (schema-level guarantee)**
\`\`\`typescript
// batch-client.ts — Anthropic guarantees valid JSON matching schema
if (req.outputSchema) {
  return {
    custom_id: req.customId,
    params: {
      ...baseParams,
      output_config: {
        format: { type: "json_schema", schema: req.outputSchema },
      },
    },
  };
}
\`\`\`

**Layer 2: JSON Sanitization (fixing common AI quirks)**
\`\`\`typescript
// ai-json.ts — fix malformed JSON before parsing
export function stripLeadingPlusInJsonNumbers(input: string): string {
  // AI often writes "+0.5" instead of "0.5" in JSON
  // This parser-aware function strips leading + only in value positions
  // (not inside strings, not in keys)
}

export function stripTrailingCommasInJson(input: string): string {
  // AI sometimes writes {"a": 1, "b": 2,} — invalid JSON
}

export function extractJson(raw: string): string {
  // Strip markdown code fences: \`\`\`json ... \`\`\`
  // Some models wrap output in fences despite instructions
}
\`\`\`

**Layer 3: Parse with Fallback Sanitization**
\`\`\`typescript
// action-parser.ts — multi-pass parsing
export function parseAgentResponse(raw: string): AgentResponse {
  const jsonStr = extractJson(raw);
  try {
    return JSON.parse(jsonStr);
  } catch {
    // First parse failed — try sanitized version
    let sanitized = stripLeadingPlusInJsonNumbers(jsonStr);
    sanitized = stripTrailingCommasInJson(sanitized);
    return JSON.parse(sanitized);  // throws if still invalid
  }
}
\`\`\`

**Layer 4: Semantic Validation (game rules enforcement)**
\`\`\`typescript
// action-parser.ts — validateActions() enforces game rules
export function validateActions(actions, votableBills, partyId, ...): AgentAction[] {
  const validated: AgentAction[] = [];
  let proposalCount = 0, amendmentCount = 0, statementCount = 0;

  for (const action of actions) {
    // Must vote on all third-reading bills
    if (action.type === "vote") {
      if (!votableBills.find(b => b.id === action.billId)) continue; // invalid ID
      if (!["yes", "no", "abstain"].includes(action.vote)) continue; // invalid vote
    }
    // Max 1 proposal per turn
    if (action.type === "propose_bill") {
      if (++proposalCount > 1) continue;
      if (!VALID_CATEGORIES.includes(action.category)) continue;
    }
    // ... more rules
    validated.push(action);
  }
  return validated; // only valid actions survive
}
\`\`\`

### Retry on Parse Failure
\`\`\`typescript
// party-agent.ts — retry sequentially if batch parse fails
if (result.structuredOutput) {
  // Anthropic structured output — guaranteed valid, parse directly
  parsed = JSON.parse(result.text);
} else {
  try {
    parsed = parseAgentResponse(result.text);
  } catch {
    // Retry with a fresh sequential call
    console.warn(\`[Agent] \${partyId}: PARSE_FAIL from batch, retrying...\`);
    const retryResult = await callAI({ system, prompt, maxTokens: 1024, partyId });
    parsed = parseAgentResponse(retryResult.text);  // second chance
  }
}
\`\`\`

### Key learning
The exam asks: "How do you ensure the model outputs valid data?" The answer is **defense in depth**:
1. Schema-level enforcement (structured output)
2. Syntactic sanitization (fix common JSON errors)
3. Multi-pass parsing (try raw, then sanitized)
4. Semantic validation (enforce business rules in code)
5. Typed fallback (abstain-all if everything fails)

---

## 5. Batch vs Synchronous Decision Tree

### Exam concept
When should you use batch API vs synchronous calls? The exam tests cost/latency tradeoffs.

### Our decision framework

\`\`\`
Is latency critical (user waiting)?
  YES → Use synchronous callAI()
  NO  → Is the provider Anthropic?
          YES → Use submitBatch() (50% cost savings)
          NO  → Use sequential callAI() (xAI has no batch API)
\`\`\`

\`\`\`typescript
// batch-client.ts — multi-provider submission
export async function submitBatch(requests: BatchRequest[]): Promise<BatchResult[]> {
  // Split by provider
  const anthropicReqs = requests.filter(r => resolveModel(r).provider === "anthropic");
  const xaiReqs = requests.filter(r => resolveModel(r).provider === "xai");

  // Anthropic: true batch API (50% discount, higher latency)
  const anthropicResults = await submitAnthropicBatch(anthropicReqs);

  // xAI: sequential fallback (no batch API available)
  const xaiResults = await submitXaiBatch(xaiReqs);

  return [...anthropicResults, ...xaiResults];
}
\`\`\`

---

## 6. Party Personality Injection

### Exam concept
System prompts can include persona instructions to shape behavior. The exam tests appropriate persona depth.

### Our implementation
Each party gets a unique profile injected into the system prompt:

\`\`\`typescript
// party-profiles.ts — per-party character profiles
const PROFILES: Record<string, string> = {
  spd: \`You are the SPD (Social Democrats).
Ideology: Center-left, social democracy, workers' rights.
Strategy: Protect welfare state, push for minimum wage increases, social housing.
Red lines: No cuts to pensions or healthcare. No coalitions with AfD.
Relationships: Natural partner with Grüne. Wary of FDP on economic policy.\`,

  afd: \`You are the AfD (Alternative for Germany).
Ideology: Right-wing populist, eurosceptic, immigration-critical.
Strategy: Opposition by default. Challenge consensus on migration and EU policy.
Red lines: No compromise on immigration restrictions.\`,
  // ... 4 more parties
};
\`\`\`

Plus real-world knowledge overlay when available:
\`\`\`typescript
export function getPartyProfile(partyId: string, realPositions?: string): string {
  const base = PROFILES[partyId] ?? "";
  if (realPositions) {
    return \`\${base}\\n\\nCURRENT REAL-WORLD POSITIONS:\\n\${realPositions}\`;
  }
  return base;
}
\`\`\`

---

## 7. Prompt Formatting Best Practices

### Patterns we use that the exam tests:

| Practice | Our Example |
|---|---|
| **Numbered rules** | \`1. You must respond with ONLY valid JSON...\` |
| **SCREAMING CAPS for critical sections** | \`THIRD READING — MANDATORY VOTES\` |
| **Explicit valid value lists** | \`VALID BILL IDs FOR VOTING: bill-abc, bill-xyz\` |
| **Negative instructions** | \`Do NOT wrap JSON in code fences\` |
| **Format enforcement at end** | \`REMINDER: Your entire response must be a single JSON object\` |
| **German language constraint** | \`ALL text content MUST be written in German\` |
| **Impact bounds** | \`budget: -1 to +1 billion, unemployment: -0.1 to +0.1%\` |

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| Dynamic/conditional prompts | High | Capability-gated rules + schema |
| JSON schema design | High | AGENT_RESPONSE_SCHEMA with required/optional |
| Validation-retry loops | High | 4-layer defense: schema → sanitize → parse → validate |
| Few-shot examples | Medium | Compact single example in system prompt |
| Batch vs sync decisions | Medium | Provider-aware routing |
| Negative instructions | Medium | Explicit "You CANNOT" lists |
| Persona injection | Low | Per-party profiles with real-world overlay |
`,
  },
  {
    id: '05-context-reliability',
    projectId: 'ki-bundestag',
    title: "Domain 5: Context Management & Reliability",
    domain: 'D5',
    weight: '15%',
    content: `# Domain 5: Context Management & Reliability (15%)

Covers long-context handling, "lost in the middle" effect, section headers, trimming strategies, and confidence calibration. The smallest domain by weight, but failures here cascade into every other domain.

---

## Key Exam Concept: "Lost in the Middle"

Research shows that language models pay most attention to the **beginning** and **end** of long prompts, with reduced attention to information in the middle. The exam tests whether you know to:
1. Put critical information at the **top** of the prompt
2. Use clear **section headers** for navigation
3. **Trim** low-priority content rather than stuffing everything in

---

## 1. Token-Budgeted Context Assembly

### Exam concept
You have a fixed context window. How do you decide what to include? The answer is **priority-based greedy packing** with a token budget.

### Our implementation
\`packages/engine/src/agent/context-depth.ts\` defines three depth levels:

\`\`\`typescript
export const DEPTH_CONFIGS: Record<ContextDepth, DepthConfig> = {
  low: {
    contextTokenBudget: 3000,       // tight budget
    briefingEventLookbackDays: 0,   // no briefing at all
    ownActionsLookbackDays: 0,      // no cross-day memory
    recentEventsMax: 5,
    recentMediaMax: 2,
    includeP3: false,               // skip motions, interpellations
    enableBriefing: false,
    enableKnowledgeGrounding: false,
    enableEraSummaries: false,
    label: "Low",                   // ~\$0.03/day
  },
  normal: {
    contextTokenBudget: 8000,       // balanced budget
    briefingEventLookbackDays: 7,
    ownActionsLookbackDays: 14,     // 2-week memory
    ownActionsMaxItems: 15,
    recentEventsMax: 10,
    recentMediaMax: 3,
    includeP3: true,
    enableBriefing: true,
    enableKnowledgeGrounding: true,
    enableEraSummaries: true,
    eraSummaryIntervalDays: 60,
    label: "Normal",                // ~\$0.055/day
  },
  high: {
    contextTokenBudget: 16000,      // rich context
    briefingEventLookbackDays: 14,
    ownActionsLookbackDays: 30,     // 30-day memory
    ownActionsMaxItems: 30,
    recentEventsMax: 20,
    recentMediaMax: 5,
    includeP3: true,
    enableBriefing: true,
    enableKnowledgeGrounding: true,
    enableEraSummaries: true,
    eraSummaryIntervalDays: 60,
    label: "High",                  // ~\$0.09/day
  },
};
\`\`\`

---

## 2. Priority-Based Prompt Assembly

### Exam concept
Content should be included in priority order. When the budget runs out, the least important content gets dropped.

### Our implementation
\`packages/engine/src/agent/prompt.ts\` assembles the user prompt in 4 priority tiers:

\`\`\`typescript
export function buildUserPrompt(ctx: AgentContext, depthConfig?: DepthConfig): string {
  // PRIORITY 1 (always included) — core decision-making context
  // Current day, party state, national economy, active bills, election, crises, government
  const coreLines = \`CURRENT DAY: \${ctx.currentDay}
YOUR PARTY: \${ctx.party.name} (\${ctx.party.coalitionRole})
  Seats: \${ctx.party.seatCount}/735 | Approval: \${ctx.party.approvalRating}%
NATIONAL STATE:
  Budget: \${ctx.nationalState.economy.budget}B EUR | ...
THIRD READING — MANDATORY VOTES:
  - [bill-abc] "Mindestlohnerhöhung" (economy) ...\`;

  // PRIORITY 1.5 (included if enabled) — cross-day memory
  if (depth.enableBriefing && ctx.briefing) {
    briefingSection = \`\\nDAILY BRIEFING:\\n\${ctx.briefing}\\n\`;
  }

  // PRIORITY 2 (budget-limited) — high-value optional context
  // Recent own actions, events, media, proposed bills, internal proposals
  const p2Sections: string[] = [...];

  // PRIORITY 3 (budget-limited, after P2) — supplementary context
  // Motions, interpellations, confidence votes, constitutional challenges
  const p3Sections: string[] = [...];

  // Greedy inclusion within token budget
  let tokenBudget = depth.contextTokenBudget;
  const includedSections: string[] = [];

  for (const section of p2Sections) {
    const cost = estimateTokens(section);  // ~4 chars per token
    if (cost <= tokenBudget) {
      includedSections.push(section);
      tokenBudget -= cost;
    }
  }

  if (depth.includeP3) {
    for (const section of p3Sections) {
      const cost = estimateTokens(section);
      if (cost <= tokenBudget) {
        includedSections.push(section);
        tokenBudget -= cost;
      }
    }
  }

  // Notify when trimming occurred
  if (includedSections.length < totalSections) {
    includedSections.push("(Some context sections trimmed for token budget.)");
  }
}
\`\`\`

### Why priority tiers matter (exam answer)
\`\`\`
Priority 1:  Bills to vote on, party state, economy  →  ALWAYS included (decisions depend on this)
Priority 1.5: Briefing, era summaries               →  Included if enabled (provides continuity)
Priority 2:  Recent events, media, own actions       →  Included if budget allows (enriches decisions)
Priority 3:  Motions, interpellations, court cases   →  Included last (supplementary awareness)
\`\`\`

If you have 3000 tokens, you get Priority 1 only. If you have 16000, you get everything. The agent makes good decisions either way — just richer ones with more context.

---

## 3. Section Headers for Navigation

### Exam concept
Clear section headers help the model locate relevant information in long prompts. This directly mitigates the "lost in the middle" effect.

### Our implementation
Every section in the user prompt has a screaming-caps header:

\`\`\`
CURRENT DAY: 42
YOUR PARTY: SPD (coalition leader)
NATIONAL STATE: ...
PARTIES: ...
THIRD READING — MANDATORY VOTES: ...
SECOND READING: ...
ACTIVE CRISES: ...
FEDERAL GOVERNMENT: ...
HISTORICAL CONTEXT (compressed summaries of past eras): ...
DAILY BRIEFING: ...
YOUR RECENT ACTIONS (last 14 days): ...
RECENT EVENTS: ...
RECENT MEDIA COVERAGE: ...
VALID BILL IDs FOR VOTING: bill-abc, bill-xyz
\`\`\`

**Why this works:** The model can scan headers to find relevant data for each action type. When deciding how to vote on a bill, it can jump to \`THIRD READING — MANDATORY VOTES\`. When deciding whether to file an interpellation, it can check \`RECENT INTERPELLATIONS\`.

---

## 4. Era Summaries (Compressed Historical Narratives)

### Exam concept
As conversations or simulations grow, you need **compression strategies** to keep historical context without exceeding token budgets.

### Our implementation
\`packages/engine/src/simulation/era-summary.ts\` generates compressed narratives every 60 days:

\`\`\`typescript
// era-summary.ts — periodic compression
export function shouldGenerateEraSummary(currentDay: number, depthConfig: DepthConfig): boolean {
  if (!depthConfig.enableEraSummaries) return false;
  const lastEnd = getLastEraSummaryEnd();
  return (currentDay - lastEnd) >= depthConfig.eraSummaryIntervalDays; // 60 days
}

// The AI compresses 60 days of events into a paragraph:
const ERA_SUMMARY_SYSTEM = \`You are a senior political historian at the German Bundestag.
Write a concise summary of the political era described below. Write in German.
Focus on:
- Major legislative achievements or failures
- Shifts in political power and approval
- Crises and their resolution
- Coalition dynamics and conflicts\`;
\`\`\`

**Injected into agent prompts as:**
\`\`\`
HISTORICAL CONTEXT (compressed summaries of past eras):
  [Days 1-60]: Die erste Legislaturperiode war geprägt von wirtschaftlicher Stabilität...
  [Days 61-120]: Die Koalitionskrise um den Haushalt dominierte die zweite Phase...
\`\`\`

### Key learning
Without era summaries, a simulation at day 300 would need 300 days of events (~30K+ tokens). With summaries, it needs ~5 summaries (~500 tokens) plus the last 7 days of raw events. This is **lossy compression** — you lose detail but keep narrative continuity.

---

## 5. Cross-Day Memory via Briefings

### Exam concept
Stateless AI calls have no memory between invocations. How do you give agents continuity?

### Our implementation
\`packages/engine/src/agent/briefing.ts\` generates a daily briefing from the last 30 days of DB history:

\`\`\`typescript
// briefing.ts — query last 30 days, synthesize into briefing
function getRecentSignificantEvents(currentDay, lookbackDays = 30, maxEvents = 60) {
  return db.select({ dayNumber, type, actor, title })
    .from(schema.simulationEvents)
    .where(gte(schema.simulationEvents.dayNumber, currentDay - lookbackDays))
    .orderBy(desc(schema.simulationEvents.id))
    .limit(maxEvents)
    .all();
}

function getApprovalTrends(currentDay, lookbackDays = 14) {
  // Returns per-party approval rating changes over time
}

// The briefing AI call digests events + trends into a compact narrative:
// "SPD approval is rising (+2.3% this week). The Grüne environmental bill
//  passed with opposition support. Crisis: energy shortage still unresolved."
\`\`\`

This briefing is then injected as \`DAILY BRIEFING\` in every party agent's prompt, giving all agents shared situational awareness.

---

## 6. Real-World Knowledge Grounding

### Exam concept
Grounding AI responses in external data improves accuracy. The exam tests approaches: RAG, retrieval, live data injection.

### Our implementation
\`packages/engine/src/simulation/knowledge-fetch.ts\` fetches real-world data weekly:

\`\`\`typescript
// Sources:
// 1. Tagesschau API (German public news)
// 2. WELT RSS (German news)
// 3. Abgeordnetenwatch API (real politician data)
// 4. Bundestag DIP API (real legislation)

// AI digests into 4 categories:
// - landscape: timeless themes (always in briefing)
// - party_position: real political stances (merged into profiles)
// - shock: major disruptions (persist until resolved)
// - headline: dated items (one sim day only)
\`\`\`

This is **not vector-based RAG** — it's structured retrieval + AI digestion, stored in a \`knowledge_items\` table. The exam may ask about different retrieval approaches; this is a simpler alternative to full embeddings-based RAG.

---

## 7. Observability & Logging

### Exam concept
You need to monitor AI call quality in production. The exam tests what to log and how.

### Our implementation
\`\`\`typescript
// ai-json.ts — structured logging for every AI call
export function logAICall(opts: {
  task: string;
  model?: string;
  provider?: string;
  latencyMs: number;
  parseOk: boolean;
  validationOk: boolean;
  fallback?: string;
}): void {
  const status = !opts.parseOk ? "PARSE_FAIL"
    : !opts.validationOk ? "VALIDATION_FAIL"
    : "OK";
  const fb = opts.fallback ? \` fallback=\${opts.fallback}\` : "";
  console.log(\`  [AI] \${opts.task} | \${opts.provider}/\${opts.model} | \${opts.latencyMs}ms | \${status}\${fb}\`);
}

// Output:
// [AI] agent:spd | anthropic/claude-haiku-4-5-20251001 | 847ms | OK
// [AI] agent:afd | xai/grok-3-mini | 1203ms | PARSE_FAIL fallback=abstain-all
\`\`\`

Plus cost tracking persisted to DB:
\`\`\`typescript
// cost-tracker.ts — every call recorded
recordAICall({
  dayNumber: 42,
  task: "call:spd",
  provider: "anthropic",
  model: "claude-haiku-4-5-20251001",
  inputTokens: 2847,
  outputTokens: 312,
  costUsd: 0.00145,
  latencyMs: 847,
  success: true,
});
\`\`\`

---

## 8. Retry Strategy with Exponential Backoff

### Exam concept
Transient errors (429s, network issues) should be retried. Hard errors (spending limits) should not.

### Our implementation
\`\`\`typescript
// client.ts — differentiated retry logic
const MAX_RETRIES = 2;
const RETRY_DELAYS = [2_000, 5_000]; // 2s then 5s

for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
  try {
    return await generateText({ model, system, prompt, maxOutputTokens });
  } catch (err) {
    const detected = detectLimitError(err);

    if (detected.type === "hard") {
      // HARD LIMIT — do NOT retry, set circuit breaker
      providerLimits.set(detected.provider, { until, resetAt });
      throw new AIProviderLimitError(detected.provider, detected.until);
    }

    if (detected.type === "transient" && attempt < MAX_RETRIES) {
      // TRANSIENT — wait and retry
      await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
      continue;
    }

    throw err; // exhausted retries or unknown error
  }
}
\`\`\`

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| Token budget management | High | 3-tier depth config (3K/8K/16K budgets) |
| Priority-based trimming | High | P1 → P1.5 → P2 → P3 greedy packing |
| "Lost in the middle" mitigation | High | Important info first, section headers |
| History compression | Medium | Era summaries every 60 days |
| Cross-day memory | Medium | Daily briefing injection |
| Retry/backoff strategy | Medium | 2 retries with 2s/5s delays |
| Observability | Medium | Structured logging + DB cost tracking |
| Real-world grounding | Low | Weekly knowledge fetch + digest |
`,
  },
  {
    id: '06-batch-processing-costs',
    projectId: 'ki-bundestag',
    title: "Cross-Cutting: Batch Processing & Cost Optimization",
    domain: 'Cross-cutting',
    weight: '',
    content: `# Cross-Cutting: Batch Processing & Cost Optimization

This topic spans multiple exam domains. Understanding batch vs synchronous tradeoffs is tested in Domain 4 (Prompt Engineering), while cost management connects to Domain 5 (Reliability).

---

## The KI-Bundestag Batch Architecture

Every AI call in the simulation goes through the Anthropic Message Batches API for a **50% cost reduction**. This is the single biggest cost optimization in the project.

### How It Works

The batch API accepts multiple prompts as a single request, processes them server-side, and returns all results. Pricing is halved compared to synchronous calls.

\`\`\`
Synchronous:  6 party calls × \$0.003 each = \$0.018/day
Batch:        6 party calls × \$0.0015 each = \$0.009/day  (50% savings)
\`\`\`

### Implementation in \`packages/engine/src/agent/batch-client.ts\`

\`\`\`typescript
// batch-client.ts — submit to Anthropic Batch API
async function submitAnthropicBatch(requests: BatchRequest[]): Promise<BatchResult[]> {
  const client = getAnthropicClient();

  // Transform our BatchRequest[] into Anthropic's format
  const batchRequests = requests.map(req => {
    const config = resolveModel(req);
    const baseParams = {
      model: config.model,
      max_tokens: req.maxTokens,
      system: req.system,
      messages: [{ role: "user" as const, content: req.prompt }],
    };

    // Structured output only for Anthropic (xAI doesn't support it)
    if (req.outputSchema) {
      return {
        custom_id: req.customId,
        params: {
          ...baseParams,
          output_config: {
            format: { type: "json_schema", schema: req.outputSchema },
          },
        },
      };
    }
    return { custom_id: req.customId, params: baseParams };
  });

  // Submit batch
  const batch = await client.messages.batches.create({ requests: batchRequests });
  console.log(\`[Batch] Created batch \${batch.id}\`);

  // Poll for completion with adaptive intervals
  while (status !== "ended" && Date.now() < deadline) {
    await new Promise(r => setTimeout(r, adaptivePollInterval(pollCount)));
    const updated = await client.messages.batches.retrieve(batch.id);
    status = updated.processing_status;
  }

  // Stream results
  const resultsStream = await client.messages.batches.results(batch.id);
  for await (const item of resultsStream) {
    // Parse each result...
  }
}
\`\`\`

---

## Batch Grouping Strategy

Not all AI calls can be batched together — some depend on earlier results. The simulation groups calls by dependency:

\`\`\`typescript
// loop.ts — batch groups in runDay()

// GROUP A: Party agents + internal proposals (independent, run first)
const groupARequests: BatchRequest[] = [
  ...buildPartyAgentRequests(contexts, currentDay, depthConfig),    // 6 requests
  ...buildProposalReviewRequests(pendingProposals),                  // 0-12 requests
];
const groupAResults = await submitBatch(groupARequests);
// Process party actions, apply votes, update bills...

// GROUP B: Interpellations + discipline (depends on Group A outcomes)
const groupBRequests: BatchRequest[] = [
  ...buildInterpellationAnswerRequests(pendingInterpellations),     // 0-2 requests
  ...buildDisciplineReviewRequests(bills, parties),                  // 0-6 requests
];
const groupBResults = await submitBatch(groupBRequests);

// GROUP C: Media + summary (depends on everything that happened today)
const groupCRequests: BatchRequest[] = [
  ...buildMediaBatchRequest(dayEvents, allParties),                  // 1 request
  ...buildSummaryBatchRequest(dayEvents, nationalState),             // 1 request
];
const groupCResults = await submitBatch(groupCRequests);

// PERIODIC: Polls + referendums (weekly/monthly cycles)
if (isPollDay(currentDay)) {
  const pollRequests = buildContextPollBatchRequest(...);
  await submitBatch(pollRequests);
}
\`\`\`

**Key insight for the exam:** Batch groups are defined by **data dependencies**, not arbitrary boundaries. Group C (media) needs to know what happened in the day — so it must wait for Groups A and B.

---

## Adaptive Polling

The batch API doesn't stream — you poll for status. Polling too fast wastes resources; too slow adds latency.

\`\`\`typescript
// batch-client.ts — adaptive poll intervals
function adaptivePollInterval(pollCount: number): number {
  if (BATCH_POLL_INTERVAL_BASE_MS < 30_000) return BATCH_POLL_INTERVAL_BASE_MS;
  if (pollCount < 3) return 15_000;   // First 3 polls: 15 seconds
  if (pollCount < 10) return 30_000;  // Polls 4-10: 30 seconds
  return BATCH_POLL_INTERVAL_BASE_MS; // After that: 60 seconds (default)
}
\`\`\`

**Why adaptive:** Small batches (2-3 requests) complete in under a minute. Large batches (20+ requests) can take several minutes. Start fast, slow down over time.

---

## Cost Tracking

Every AI call — batch or synchronous — is recorded with full cost accounting.

### Pricing Tables in \`packages/engine/src/agent/cost-tracker.ts\`

\`\`\`typescript
// Batch pricing (50% of standard)
const BATCH_PRICING: Record<string, PricingTier> = {
  "claude-haiku-4-5-20251001": { input: 0.40e-6, output: 1.00e-6 },   // per token
  "claude-sonnet-4-5-20250929": { input: 1.50e-6, output: 5.00e-6 },
};

// Standard pricing (synchronous)
const STANDARD_PRICING: Record<string, PricingTier> = {
  "claude-haiku-4-5-20251001": { input: 0.80e-6, output: 4.00e-6 },
  "claude-sonnet-4-5-20250929": { input: 3.00e-6, output: 15.00e-6 },
  "grok-3-mini": { input: 0.30e-6, output: 0.50e-6 },
};

export function calculateCost(model, inputTokens, outputTokens, isBatch): number {
  const pricing = getPricing(model, isBatch);
  return inputTokens * pricing.input + outputTokens * pricing.output;
}
\`\`\`

### Per-Call Recording

\`\`\`typescript
// Every AI call writes to the ai_calls table
recordAICall({
  dayNumber: 42,
  task: "call:spd",           // which agent/module
  provider: "anthropic",
  model: "claude-haiku-4-5-20251001",
  inputTokens: 2847,
  outputTokens: 312,
  costUsd: 0.00145,
  latencyMs: 847,
  batchId: "batch_abc123",    // links to batch
  success: true,
});
\`\`\`

### Admin Cost Endpoints

\`\`\`
GET /api/admin/costs          → total cost, by-task breakdown, by-model breakdown
GET /api/admin/costs/daily    → per-day cost history
\`\`\`

This gives full visibility into where money is going — essential for optimizing token budgets.

---

## Cost per Day by Context Depth

| Depth | Token Budget | Briefing | Era Summaries | Approx. Cost/Day |
|---|---|---|---|---|
| Low | 3,000 | Disabled | Disabled | ~\$0.03 |
| Normal | 8,000 | Enabled (7-day lookback) | Enabled (60-day intervals) | ~\$0.055 |
| High | 16,000 | Enabled (14-day lookback) | Enabled (60-day intervals) | ~\$0.09 |

The difference is driven by prompt size (input tokens) which determines the batch pricing.

---

## Key Exam Takeaways

1. **Batch API = 50% cost savings** on Anthropic — always use it when latency isn't critical
2. **Group batches by data dependencies** — parallelize independent calls, sequence dependent ones
3. **Track costs per-call** — you can't optimize what you don't measure
4. **Adaptive polling** reduces wasted API calls while keeping latency low
5. **Context depth is a cost dial** — let operators choose quality vs cost tradeoff
6. **Multi-provider batching** requires different strategies (Anthropic has batch API, others may not)
`,
  },
  {
    id: '07-multi-provider',
    projectId: 'ki-bundestag',
    title: "Cross-Cutting: Multi-Provider Architecture",
    domain: 'Cross-cutting',
    weight: '',
    content: `# Cross-Cutting: Multi-Provider Architecture

This topic is relevant across exam domains — provider routing (Domain 1), error handling (Domain 5), and tool/model selection (Domain 2).

---

## The Problem

KI-Bundestag uses 6 AI party agents. Five parties use Claude Haiku, but AfD uses xAI's Grok. The system must route calls to the right provider, handle provider-specific features, and gracefully degrade when a provider is down.

---

## 1. Provider-Aware Model Routing

### \`packages/engine/src/agent/model-config.ts\`

\`\`\`typescript
export type Provider = "anthropic" | "xai";

export interface ModelConfig {
  provider: Provider;
  model: string;
}

// Per-party model assignment
export const PARTY_MODELS: Record<string, ModelConfig> = {
  spd:    { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
  cdu:    { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
  gruene: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
  fdp:    { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
  afd:    { provider: "xai",      model: "grok-3-mini" },
  linke:  { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
};

// Per-role model assignment (system-wide calls)
export const ROLE_MODELS: Record<string, ModelConfig> = {
  daily:       { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
  negotiation: { provider: "anthropic", model: "claude-haiku-4-5-20251001" },
  synthesis:   { provider: "anthropic", model: "claude-sonnet-4-5-20250929" },  // higher quality
};
\`\`\`

### Environment Variable Overrides

Every model assignment can be overridden at runtime without code changes:

\`\`\`typescript
// model-config.ts — env var overrides
export function getPartyModel(partyId: string): ModelConfig {
  const envKey = \`MODEL_PARTY_\${partyId.toUpperCase()}\`;  // e.g., MODEL_PARTY_AFD
  const envOverride = process.env[envKey];

  if (envOverride) {
    const [provider, model] = envOverride.split(":");  // e.g., "xai:grok-4"
    if (provider && model && (provider === "anthropic" || provider === "xai")) {
      return { provider: provider as Provider, model };
    }
  }

  return PARTY_MODELS[partyId] ?? ROLE_MODELS.daily;  // fallback to daily role
}
\`\`\`

**Usage:** \`MODEL_PARTY_AFD=anthropic:claude-haiku-4-5-20251001\` would switch AfD from Grok to Haiku.

---

## 2. Provider-Specific Feature Handling

Not all providers support the same features. Our code handles this explicitly:

### Structured Output (Anthropic only)

\`\`\`typescript
// party-agent.ts — conditional structured output
export function buildPartyAgentRequests(contexts: AgentContext[]): BatchRequest[] {
  return contexts.map(ctx => {
    const config = getPartyModel(ctx.party.id);
    const isAnthropic = config.provider === "anthropic";
    return {
      customId: \`agent-\${ctx.party.id}-day\${currentDay}\`,
      system: buildSystemPrompt(ctx.party.id, ...),
      prompt: buildUserPrompt(ctx),
      maxTokens: 1024,
      partyId: ctx.party.id,
      // xAI/Grok doesn't support structured output
      outputSchema: isAnthropic ? AGENT_RESPONSE_SCHEMA : undefined,
    };
  });
}
\`\`\`

### Batch API (Anthropic only, xAI falls back to sequential)

\`\`\`typescript
// batch-client.ts — provider-split submission
export async function submitBatch(requests: BatchRequest[]): Promise<BatchResult[]> {
  const anthropicReqs = requests.filter(r => resolveModel(r).provider === "anthropic");
  const xaiReqs = requests.filter(r => resolveModel(r).provider === "xai");

  // Anthropic: true batch API
  const anthropicResults = await submitAnthropicBatch(anthropicReqs);

  // xAI: sequential callAI() fallback (no batch API available)
  const xaiResults = await submitXaiBatch(xaiReqs);

  return [...anthropicResults, ...xaiResults];
}

// xAI sequential fallback
async function submitXaiBatch(requests: BatchRequest[]): Promise<BatchResult[]> {
  const results: BatchResult[] = [];
  for (const req of requests) {
    try {
      const result = await callAI({
        system: req.system,
        prompt: req.prompt,
        maxTokens: req.maxTokens,
        partyId: req.partyId,
      });
      results.push({
        customId: req.customId,
        text: result.text,
        model: result.model,
        provider: result.provider,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
      });
    } catch (err) {
      console.warn(\`[Batch] xAI request \${req.customId} failed:\`, err);
      // Continues to next request — partial success OK
    }
  }
  return results;
}
\`\`\`

---

## 3. Provider-Level Circuit Breaker

Each provider has its own circuit breaker state. If Anthropic hits a spending limit, xAI calls still work (and vice versa).

\`\`\`typescript
// client.ts — per-provider circuit breaker
const providerLimits = new Map<Provider, { until: string; resetAt: number }>();

// Check if ALL providers are down (simulation should pause)
export function allProvidersLimited(): boolean {
  if (providerLimits.size === 0) return false;
  const now = Date.now();
  const providers = new Set<Provider>(["anthropic"]);
  if (process.env.XAI_API_KEY) providers.add("xai");

  for (const p of providers) {
    const limit = providerLimits.get(p);
    if (!limit || now >= limit.resetAt) return false;  // at least one is available
  }
  return true;  // every configured provider is limited
}
\`\`\`

**Behavior when one provider is down:**
- If Anthropic is limited: 5 parties (SPD, CDU, Grune, FDP, Linke) get abstain-all fallback. AfD (xAI) still works.
- If xAI is limited: AfD gets abstain-all. Other 5 parties work normally.
- If both are limited: \`allProvidersLimited()\` returns true, simulation loop pauses.

---

## 4. Unified SDK Layer (Vercel AI SDK)

The Vercel AI SDK provides a unified interface across providers:

\`\`\`typescript
// client.ts — unified model instantiation
import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";

function getModel(provider: Provider, modelId: string) {
  if (provider === "xai") return xai(modelId);
  return anthropic(modelId);
}

// Same generateText() call regardless of provider
const result = await generateText({
  model: getModel(config.provider, config.model),  // could be either provider
  system: opts.system,
  prompt: opts.prompt,
  maxOutputTokens: opts.maxTokens,
});

// Unified response shape
return {
  text: result.text,
  model: config.model,
  provider: config.provider,
  inputTokens: result.usage?.inputTokens ?? 0,
  outputTokens: result.usage?.outputTokens ?? 0,
};
\`\`\`

---

## 5. Provider Inference from Errors

When an error occurs, we need to know which provider it came from to set the right circuit breaker:

\`\`\`typescript
// client.ts — infer provider from error URL
function inferProvider(err: Record<string, unknown>): Provider {
  const url = typeof err.url === "string" ? err.url : "";
  return url.includes("x.ai") || url.includes("xai") ? "xai" : "anthropic";
}
\`\`\`

---

## Key Exam Takeaways

1. **Abstract provider differences behind a unified interface** — callers shouldn't know which provider they're using
2. **Handle feature gaps explicitly** — not all providers support batch API or structured output
3. **Per-provider circuit breakers** — one provider failing shouldn't take down the whole system
4. **Environment variable overrides** — make provider/model swaps possible without code changes
5. **Partial success is OK** — if one provider's request fails in a batch, process the others
6. **Use Vercel AI SDK** (or similar) to normalize the interface across providers
`,
  },
  {
    id: '08-mcp-experience',
    projectId: 'ki-bundestag',
    title: "MCP Across Projects — Full Experience",
    domain: 'Cross-cutting',
    weight: '',
    content: `# MCP Across Projects — Full Experience

MCP experience spans **building** two production MCP servers, **configuring** 6+ third-party servers, and **choosing** structured output over tool_use for the batch-optimized KI-Bundestag simulation.

---

## Three Levels of MCP Experience

### Level 1: MCP Server Builder

**aem-mcp-server** — Full-featured MCP server for Adobe Experience Manager
- 57 tools across 6 categories (content, components, assets, fragments, workflows, replication)
- 4 MCP resource types (\`aem://{instance}/components\`, \`/sites\`, \`/templates\`, \`/workflow-models\`)
- Dual transport: stdio (npx zero-install) + Streamable HTTP (shared team server)
- Multi-instance support with named parameters
- Tool annotations: \`group\`, \`readOnly\`, \`complexity\` for agent tool selection
- Response verbosity control: summary/standard/full (analogous to KI-Bundestag's context depth)
- Actionable errors with \`suggestion\` and \`alternatives\` fields
- Two auth modes: Basic (self-hosted) + OAuth S2S (AEMaaCS)

**moltbook-http-mcp** — HTTP MCP server for a social platform
- HTTP + stdio dual transport with auto-detection
- Multi-tenant auth chain: Bearer → X-Api-Key → Query param → Env var
- Optional JWT enforcement for POST requests
- TLS/HTTPS support
- Clean transport/business logic separation

### Level 2: MCP Consumer/Configurator

**dx-aem-flow** — Claude Code plugin platform with 6 MCP servers
- Per-plugin \`.mcp.json\` distribution (auto-registers on install)
- Three transport types: stdio, HTTP, Docker
- Plugin-scoped namespacing: \`mcp__plugin_<name>_<server>__<tool>\`
- Multi-MCP orchestration: AEM + Chrome DevTools chained in workflows
- Environment variable parameterization for secrets

### Level 3: Deliberate Non-Use (Architectural Decision)

**KI-Bundestag** — Chose structured output over MCP/tool_use
- Batch API requires single-response patterns (not tool round-trips)
- 50% cost savings from batch API incompatible with tool_use
- All action types known at compile time — no dynamic discovery needed
- 6 agents per day × fast simulation = can't afford per-tool latency

---

## Patterns That Transfer Across Projects

### Tool Description Quality

From aem-mcp-server: tool descriptions that guide agent selection:
\`\`\`typescript
// BAD — agent doesn't know when to use it
{ name: "query", description: "Query the database" }

// GOOD — explains WHEN and includes constraints
{
  name: "searchPages",
  description: "Search for AEM pages by path, title, or content. Use for finding specific pages when you know partial information. Returns max 20 results. For browsing page structure, use getPageTree instead.",
  annotations: { group: "content", readOnly: true, complexity: "low" },
}
\`\`\`

### Resource URI Design

From aem-mcp-server — custom URI scheme for read-only discovery:
\`\`\`
aem://{instance}/components    — component catalog
aem://{instance}/sites         — site roots and language structure
aem://{instance}/templates     — available page templates
aem://{instance}/workflow-models — workflow models
\`\`\`

Same pattern could apply to KI-Bundestag if we built a dev MCP server:
\`\`\`
bundestag://parties            — party list with approval, seats, coalition role
bundestag://bills/pending      — active bills in pipeline
bundestag://economy            — current national economic state
bundestag://events/day/{n}     — events for a specific simulation day
\`\`\`

### Error Response Design

**aem-mcp-server** — actionable errors:
\`\`\`json
{
  "is_error": true,
  "content": "Page not found at /content/site/missing",
  "suggestion": "Check the path — did you mean /content/site/en/home?",
  "alternatives": ["searchPages", "getPageTree"]
}
\`\`\`

**ki-bundestag** — typed error categories:
\`\`\`typescript
type LimitResult =
  | { type: "hard"; provider; until }    // circuit breaker
  | { type: "transient"; provider }      // retry with backoff
  | { type: "none" };                    // not an API error
\`\`\`

Both map to the exam's four error categories: invalid input, execution failure, permission denied, not found.

### Transport Selection

| When | Transport | Example |
|---|---|---|
| Single developer, local IDE | **stdio** | aem-mcp-server default, Claude Code integration |
| Shared team server | **HTTP** | moltbook-http-mcp, Figma MCP on port 3845 |
| Isolated/sandboxed execution | **Docker** | axe-mcp-server accessibility testing |

---

## Why MCP Doesn't Fit KI-Bundestag Simulation Agents

### The Real-Time vs Simulation-Time Problem

\`\`\`
Day 1 (sim) → MCP calls abgeordnetenwatch API → gets April 2026 data
Day 2 (sim, 5 seconds later) → same call → same April 2026 data
Day 300 (sim, 10 minutes later) → same call → still April 2026 data
\`\`\`

Simulation time moves at ~30 days/minute. Real-world APIs return today's data regardless of simulation day. MCP tools giving agents live API access would break temporal consistency.

### The Batch Efficiency Problem

\`\`\`
Current architecture (structured output):
  6 agents × 1 batch call = 1 API submission → 50% cost discount

MCP tool_use architecture:
  6 agents × N tool calls each × round-trip per tool = 6N API calls → full price
\`\`\`

tool_use converts each action into a conversational round-trip (tool_use → tool_result → continue). Our batch API approach packs everything into a single prompt/response cycle.

### What We Do Instead

\`knowledge-fetch.ts\` is the right architecture — **batch-and-cache**:
1. Fetch real-world data every 7 real days (respects API rate limits)
2. AI digests into 4 categories (landscape, party_position, shock, headline)
3. Store in DB with generation tracking
4. Inject as prompt context when building agent prompts

This gives agents real-world grounding without the temporal or cost problems of live MCP calls.

### Where MCP Would Make Sense for This Project

A **developer-facing MCP server** for Claude Code workflow (not simulation agents):

\`\`\`json
// .mcp.json — for development/debugging only
{
  "mcpServers": {
    "ki-bundestag": {
      "command": "npx",
      "args": ["tsx", "packages/engine/src/mcp-server.ts"],
      "env": { "DATABASE_PATH": "./data/simulation.db" }
    }
  }
}
\`\`\`

- **Tools**: \`run_simulation_day\`, \`query_events\`, \`get_cost_breakdown\`
- **Resources**: \`bundestag://parties\`, \`bundestag://bills/pending\`, \`bundestag://economy\`
- No time conflict — developer queries sim state, not agents querying live APIs

---

## Exam-Relevant Takeaways

1. **When to use MCP vs structured output** — MCP for dynamic tool discovery and interactive agents; structured output for known schemas and batch efficiency
2. **Transport selection** — stdio for local/single-client, HTTP for shared/remote, Docker for sandboxed
3. **Tool annotations** (\`readOnly\`, \`group\`, \`complexity\`) help agents choose tools wisely
4. **Actionable errors** with \`suggestion\` and \`alternatives\` enable agent self-correction
5. **Resource URIs** provide read-only discovery separate from action tools
6. **Namespacing** prevents tool collisions in multi-plugin/multi-server setups
7. **Auth patterns** — fallback chains (Bearer → header → param → env) handle diverse deployment modes
8. **Not every system needs MCP** — batch-optimized pipelines with known schemas are better served by structured output
`,
  },
  {
    id: '01-agents-model-tiering',
    projectId: 'dx-plugins',
    title: "Domain 1: Agents & Model Tiering",
    domain: 'D1',
    weight: '27%',
    content: `# Domain 1: Agents & Model Tiering (27%)

Covers agent design, model selection, subagent spawning, and the distinction between agents and skills. The DX Plugin System maintains **13 Claude Code agents** across two plugins with explicit model tiering.

---

## Agent vs Skill: The Core Distinction

### Exam concept
The exam tests whether you understand the difference between **agents** (isolated personas) and **skills** (inline instructions).

### Our implementation

| Aspect | Agent | Skill |
|---|---|---|
| **Context** | Isolated (own context window) | Shared (main conversation) |
| **Model** | Can use different model (Opus/Sonnet/Haiku) | Inherits session model |
| **Execution** | Subprocess via Agent tool | Inline, triggered by /command |
| **Turns** | Multi-turn with maxTurns cap | One-shot execution |
| **Memory** | Can have persistent memory | No memory between invocations |
| **Use case** | Heavy analysis, parallel work | Workflow orchestration, user interaction |

**Key learning:** Skills coordinate and spawn agents. Users invoke skills; agents work behind the scenes.

---

## 1. Agent Frontmatter Design

### Exam concept
Agent definitions use YAML frontmatter to declare model, tools, permissions, and isolation level.

### Our implementation
\`plugins/dx-core/agents/code-reviewer.md\`:

\`\`\`yaml
---
name: dx-code-reviewer
description: Senior code reviewer with confidence-based filtering
model: opus
memory: project
maxTurns: 50
permissionMode: plan
isolation: worktree
---
\`\`\`

**Key fields explained:**
- \`model: opus\` — deep reasoning for code review (exam: model tiering)
- \`permissionMode: plan\` — read-only, can't modify files (exam: least privilege)
- \`isolation: worktree\` — gets its own git worktree copy (exam: safe parallel execution)
- \`memory: project\` — remembers conventions across sessions (exam: persistent context)
- \`maxTurns: 50\` — safety cap prevents runaway agents (exam: reliability)

---

## 2. Model Tiering Strategy

### Exam concept
Use the cheapest model that does the job. The exam tests whether you can match model capability to task complexity.

### Our implementation — 13 agents across 3 tiers:

| Tier | Model | Cost | Agents | Use Case |
|---|---|---|---|---|
| **Deep reasoning** | Opus | \$\$\$ | dx-code-reviewer | Architecture analysis, confidence-based review |
| **Execution** | Sonnet | \$\$ | dx-pr-reviewer, aem-inspector, aem-fe-verifier, aem-bug-executor, aem-editorial-guide-capture | PR review, step execution, verification |
| **Fast lookups** | Haiku | \$ | dx-file-resolver, dx-doc-searcher, dx-figma-styles, dx-figma-markup, aem-file-resolver, aem-page-finder | File search, convention discovery |

**Cost impact:** Using Haiku for file resolution instead of Opus saves ~10x per call. With hundreds of agent invocations per day, this compounds significantly.

### Per-phase model assignment in coordinators:

\`\`\`
Requirements (fetch/explain/research): Sonnet
Requirements (DoR checklist):          Opus
Planning:                              Opus (ultrathink)
Step execution:                        Sonnet
Step testing:                          Haiku
Step review:                           Opus
Step fix/heal:                         Opus
Build:                                 Sonnet
PR creation:                           Sonnet
Documentation:                         Sonnet
\`\`\`

### Key learning
The exam asks: "Which model should handle this task?" The answer is always about matching **reasoning depth** to **task complexity**. File resolution needs pattern matching (Haiku). Code review needs architectural reasoning (Opus). Implementation needs balanced capability (Sonnet).

---

## 3. Subagent Spawning & Context

### Exam concept
Subagents run in isolated contexts. The exam tests naming conventions, tool restrictions, and context boundaries.

### Our implementation

**Critical naming rule:** Agents require full prefixed names.

\`\`\`
✅ dx-core:dx-code-reviewer     (works)
❌ dx-code-reviewer                        (fails silently — "Agent type not found")
\`\`\`

This matches the exam concept that **subagent context must be explicit** — no auto-inheritance of parent context.

**Tool restrictions per agent:**

\`\`\`yaml
# dx-file-resolver (Haiku) — minimal tools for fast lookups
tools: Glob, Grep, Read, mcp__ado__search_code

# dx-code-reviewer (Opus) — read-only deep analysis
permissionMode: plan    # can read everything, write nothing

# dx-pr-reviewer (Sonnet) — structured output, no file edits
tools: Read, Glob, Grep, Bash
\`\`\`

### Key learning
Each agent gets **only the tools it needs**. A file resolver doesn't need Write. A code reviewer doesn't need Edit. This is the exam's concept of **least privilege for tool access**.

---

## 4. Agent Isolation with Worktrees

### Exam concept
Agents that analyze code shouldn't interfere with the developer's working directory.

### Our implementation
\`dx-code-reviewer\` uses \`isolation: worktree\`:

- Agent gets a **separate git worktree** (full repo copy)
- Can read all files without affecting the main working directory
- Multiple review agents can run in parallel without conflicts
- Worktree is automatically cleaned up after the agent completes

**When to use worktree isolation (exam answer):**
- Code review (reading files that might change during review)
- Parallel agent execution (multiple agents writing to different branches)
- Destructive analysis (agents that need to modify files to test theories)

---

## 5. Confidence-Based Filtering

### Exam concept
Not every finding is worth reporting. The exam tests quality filtering approaches.

### Our implementation
Both \`dx-code-reviewer\` and \`dx-pr-reviewer\` use 80% confidence threshold:

\`\`\`
Confidence 0-79:   DROP silently (noise reduction)
Confidence 80-89:  Report as suggestion
Confidence 90-100: Report as must-fix or important
\`\`\`

**Severity mapping:**
- **Critical (must fix):** Bugs, security, data loss — requests changes
- **Important (should fix):** Convention violations, missing edge cases — approved with suggestions
- **Minor (nice to have):** Style, naming — non-blocking, usually dropped

### Key learning
The exam tests judgment about **when to flag vs when to stay silent**. A noisy reviewer that flags everything is worse than one that catches only high-confidence issues.

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| Agent vs skill distinction | High | 13 agents + 77 skills with clear separation |
| Model tiering | High | 3-tier strategy (Opus/Sonnet/Haiku) |
| Subagent naming & context | High | Full prefix naming, tool restrictions per agent |
| Agent isolation | Medium | Worktree isolation for safe parallel execution |
| Confidence-based filtering | Medium | 80% threshold across code/PR review agents |
| Agent frontmatter design | Medium | model, tools, memory, permissionMode, isolation |
`,
  },
  {
    id: '02-coordinators-orchestration',
    projectId: 'dx-plugins',
    title: "Domain 1: Coordinators & Orchestration",
    domain: 'D1',
    weight: '27%',
    content: `# Domain 1: Coordinators & Orchestration (27%)

Covers multi-step workflow orchestration, hub-and-spoke patterns, recovery from failures, and cross-repo coordination. The DX Plugin System has **4 coordinator skills** that orchestrate complex pipelines without writing code themselves.

---

## 1. Coordinator Pattern

### Exam concept
A coordinator delegates work to specialized agents without doing the work itself. The exam tests hub-and-spoke vs chain vs peer-to-peer patterns.

### Our implementation
Four coordinators, each orchestrating multi-phase workflows:

| Coordinator | Phases | Pattern |
|---|---|---|
| \`dx-req\` | 4 (fetch → DoR → explain → share) | Linear pipeline |
| \`dx-step-all\` | Dynamic (execute → test → review → commit per step) | Loop with escalation |
| \`dx-bug-all\` | 3 (triage → verify → fix) | Pipeline with browser verification |
| \`dx-agent-all\` | Up to 13 phases (requirements → PR) | Full pipeline with checkpoints |

**Key frontmatter pattern — coordinators never write code:**

\`\`\`yaml
---
name: dx-agent-all
description: Full story-to-PR pipeline with checkpoints
disable-model-invocation: true    # coordinator NEVER writes code itself
allowed-tools: ["read", "edit", "search", "write", "agent"]
---
\`\`\`

\`disable-model-invocation: true\` is the exam's concept of **separation of concerns** — the coordinator reasons about workflow, subagents do the work.

---

## 2. Hub-and-Spoke with the Agent Tool

### Exam concept
The hub collects requests, dispatches to spokes, and aggregates results.

### Our implementation
\`dx-agent-all\` is the hub. It dispatches to subagents via the Skill() tool with \`context: fork\`:

\`\`\`
dx-agent-all (hub)
├── dx-req (requirements)
│   ├── ADO MCP (fetch work item)
│   └── dx-doc-searcher (Haiku, search .ai/ docs)
├── dx-figma-all (Figma pipeline)
│   ├── dx-figma-styles (Haiku, CSS conventions)
│   └── dx-figma-markup (Haiku, HTML patterns)
├── dx-plan (planning, Opus + ultrathink)
├── dx-step (execution loop)
│   ├── dx-step-fix (targeted fix)
│   └── dx-step-heal (deep analysis, Opus)
├── dx-step-build (build + deploy)
├── dx-step-verify (6-phase verification)
│   └── dx-code-reviewer (Opus, worktree isolation)
├── dx-pr-commit (commit + push)
└── dx-pr (create PR)
\`\`\`

**Why context: fork matters (exam concept):**
Each subagent gets a **fresh context window**. This prevents context bloat — if dx-req reads 50 files during research, that context doesn't pollute the planning phase. The parent coordinator stays lean, receiving only summaries.

---

## 3. The Execution Loop (dx-step-all)

### Exam concept
Agentic loops with retry, escalation, and recovery. The exam tests loop boundaries and failure handling.

### Our implementation
\`dx-step-all\` implements a **loop with 3-layer escalation:**

\`\`\`
For each step in implement.md:
  1. Execute step (Sonnet)
  2. Run tests (Haiku)
  3. Code review (Opus, worktree)
  4. Commit

  On failure:
    Layer 1: dx-step-fix (targeted fix, 1 attempt)
    Layer 2: dx-step-heal (root cause analysis, Opus + ultrathink)
    Layer 3: Coordinator loop (up to 6 fix attempts + 2 healing cycles)

  After 2 consecutive failures on same step: STOP → human intervention
\`\`\`

**Token budget for full pipeline:**
- Base: ~370K tokens
- With failures/healing: 500K-800K tokens
- Each subagent fork resets context, preventing accumulation

### Key learning
The exam asks: "What happens when an agent fails?" The answer is **staged recovery** — each layer tries a different approach before escalating. Targeted fix → root cause analysis → human handoff.

---

## 4. implement.md as State Machine

### Exam concept
How do you track progress in a multi-step agentic workflow?

### Our implementation
\`implement.md\` is the **single source of truth** for execution state:

\`\`\`markdown
## Step 1: Add dialog field [done]

**Files:**
- Modify: \\\`ui.apps/src/main/content/jcr_root/.content.xml\\\`
- Test: \\\`core/src/test/java/ComponentTest.java\\\`

**What:**
Add stepsTitle field to dialog...

**Verification:**
Build succeeds, dialog renders new field

## Step 2: Update Sling Model [in-progress]
...

## Step 3: Frontend rendering [pending]
...

## Step 3h: Heal — Step 3 root cause analysis [blocked]
...
\`\`\`

**Status badges:** \`[pending]\` → \`[in-progress]\` → \`[done]\` or \`[blocked]\` or \`[skipped]\`

**Corrective steps:** \`3h\` (first heal), \`3h2\` (second heal), \`R1\`/\`R2\` (review fixes)

The coordinator reads this file to determine what to do next — it's a **declarative state machine** where the file IS the state.

---

## 5. Cross-Repo Coordination

### Exam concept
When work spans multiple repositories, how does the agent handle it?

### Our implementation — three strategies:

**1. Pipeline delegation (CI/CD):**
Claude discovers cross-repo scope during requirements, writes \`delegate.json\`:

\`\`\`json
{
  "targetRepo": "platform-core",
  "pipelineId": "42",
  "reason": "Dialog validation change lives in shared component library",
  "templateParameters": { "workItemId": "12345" }
}
\`\`\`

The YAML pipeline step reads this and queues the target repo's pipeline. Claude never gets curl permissions — **delegation over direct action**.

**2. Hub mode (local):**
\`/dx-hub-init\` discovers sibling repos, \`/dx-hub-config\` manages settings. Dispatch to other repos is automatic with state tracking.

**3. Manual handoff (fallback):**
When neither pipeline nor hub mode is available, the coordinator STOPs with a clear message about what needs to happen in the other repo.

### Key learning
The exam tests **when an agent should stop and delegate** vs when it should act directly. Cross-repo work is a clear boundary — the agent should never modify code in a repo it wasn't invoked in.

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| Coordinator pattern | High | 4 coordinators with disable-model-invocation |
| Hub-and-spoke orchestration | High | dx-agent-all with 13 subagent phases |
| Execution loops with recovery | High | 3-layer escalation (fix → heal → human) |
| State tracking | Medium | implement.md as declarative state machine |
| Cross-repo delegation | Medium | delegate.json, hub mode, manual handoff |
| Context management via forking | Medium | context: fork prevents bloat |
`,
  },
  {
    id: '03-mcp-integration',
    projectId: 'dx-plugins',
    title: "Domain 2: MCP Integration & Tool Design",
    domain: 'D2',
    weight: '18%',
    content: `# Domain 2: MCP Integration & Tool Design (18%)

Covers MCP server configuration, tool naming conventions, multi-MCP orchestration, and transport selection. The DX Plugin System configures **6 MCP servers** across 3 plugins with explicit namespacing.

---

## 1. MCP Server Landscape

### Exam concept
Understanding different MCP server types, transports, and configuration locations.

### Our implementation — 6 servers across different transports:

| Server | Transport | Plugin | Purpose |
|---|---|---|---|
| **ADO** | stdio (npx) | root | Azure DevOps work items, PRs, code search |
| **AEM** | stdio (npx) | dx-aem | Adobe Experience Manager content management |
| **Chrome DevTools** | stdio (npx) | dx-aem | Browser automation, screenshots |
| **Figma** | HTTP (localhost:3845) | dx-core | Design extraction, screenshots |
| **axe** | Docker | dx-core | WCAG accessibility testing |
| **context7** | HTTP | root | Documentation lookup |

### Configuration locations:

**Project-level** (\`.mcp.json\` at repo root):
\`\`\`json
{
  "mcpServers": {
    "context7": { "type": "http", "url": "https://mcp.context7.com/mcp" },
    "ado": {
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "<org-url>"]
    }
  }
}
\`\`\`

**Plugin-level** (auto-loaded when plugin is installed):
\`\`\`json
// plugins/dx-aem/.mcp.json
{
  "mcpServers": {
    "AEM": {
      "command": "npx",
      "args": ["-y", "aem-mcp-server", "-t", "stdio",
               "--instances", "\${AEM_INSTANCES}"]
    },
    "chrome-devtools-mcp": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
\`\`\`

### Key learning
**Per-plugin .mcp.json** distributes server config with the plugin — installing a plugin auto-registers its MCP servers. Three transport types in practice: stdio (AEM, Chrome, ADO), HTTP (Figma, context7), Docker (axe).

---

## 2. Tool Naming Convention (Critical)

### Exam concept
MCP tools must be referenced by their full namespaced name. The exam tests correct naming.

### Our implementation

**The naming pattern:**
\`\`\`
mcp__plugin_<plugin-name>_<server-name>__<tool-name>

Examples:
  mcp__plugin_dx-aem_AEM__getNodeContent
  mcp__plugin_dx-core_figma__get_screenshot
  mcp__plugin_dx-core_axe-mcp-server__run_audit
  mcp__ado__wit_get_work_item          (project-level, no plugin prefix)
\`\`\`

**Why exact naming matters:**
Using shorthand (\`mcp__figma__\`) causes "tool not found" failures because **subagents resolve by exact name**. This is the exam's concept of explicit tool references in multi-plugin environments.

**Agent tool allowlists use full names:**
\`\`\`yaml
# In agent frontmatter
tools: Read, Glob, Grep, mcp__ado__search_code
\`\`\`

---

## 3. Multi-MCP Orchestration

### Exam concept
Chaining multiple MCP servers in a single workflow. The exam tests understanding of tool composition.

### Our implementation
The \`aem-fe-verifier\` agent chains two MCP servers in sequence:

\`\`\`
1. AEM MCP → createPage (create demo page)
2. AEM MCP → updateComponent (add component with content)
3. Chrome DevTools MCP → navigate (open page in browser)
4. Chrome DevTools MCP → take_screenshot (capture rendering)
5. Figma MCP → get_screenshot (get design reference)
6. Compare screenshots (AI visual analysis)
\`\`\`

This is a **multi-tool workflow** where the agent reasons about the combined results. Each MCP server handles its domain; the agent orchestrates across domains.

---

## 4. Environment Variable Parameterization

### Exam concept
Secrets and connection details should never be hardcoded in configuration.

### Our implementation
MCP configs use \`\${VAR}\` expansion:

\`\`\`json
{
  "AEM": {
    "args": ["--instances", "\${AEM_INSTANCES}"]
  }
}
\`\`\`

Secrets live in \`.claude/settings.local.json\` (gitignored):
\`\`\`json
{
  "env": {
    "AEM_INSTANCES": "local:http://localhost:4502:<user>:<pass>",
    "AXE_API_KEY": "your-key-here"
  }
}
\`\`\`

**Settings scope (exam concept):**
- **project** (\`.claude/settings.json\`): Permissions, MCP enablement — committed to git
- **local** (\`.claude/settings.local.json\`): Secrets, personal env vars — gitignored
- **user** (\`~/.claude/settings.json\`): Global preferences — not committed

---

## 5. Transport Selection

### Exam concept
When to use stdio vs HTTP vs Docker for MCP servers.

### Our decision framework:

| When | Transport | Our Example |
|---|---|---|
| Single developer, local IDE | **stdio** | AEM, Chrome DevTools, ADO |
| Shared/remote server | **HTTP** | Figma (localhost:3845), context7 |
| Sandboxed/isolated execution | **Docker** | axe accessibility testing |

**stdio** is the default — spawned via npx, zero-install, dies with the session.
**HTTP** for persistent servers that multiple tools connect to.
**Docker** for tools that need isolation (axe runs in its own container).

---

## 6. Selective MCP Enablement

### Exam concept
Not all MCP servers should be active in every session.

### Our implementation in settings.json:
\`\`\`json
{
  "enableAllProjectMcpServers": false,
  "enabledMcpjsonServers": ["ado", "AEM", "chrome-devtools-mcp"]
}
\`\`\`

This prevents Claude from loading unnecessary MCP tool schemas into context. Each MCP server adds tool descriptions to the context window — selective enablement is a **token budget optimization**.

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| MCP server configuration | High | 6 servers across 3 transport types |
| Tool naming & namespacing | High | Full plugin prefix naming convention |
| Multi-MCP orchestration | High | AEM + Chrome DevTools + Figma chaining |
| Transport selection | Medium | stdio/HTTP/Docker by use case |
| Environment variable parameterization | Medium | settings.local.json for secrets |
| Selective MCP enablement | Low | Token budget optimization |
`,
  },
  {
    id: '04-claude-md-rules',
    projectId: 'dx-plugins',
    title: "Domain 3: CLAUDE.md & Rules",
    domain: 'D3',
    weight: '20%',
    content: `# Domain 3: CLAUDE.md & Rules (20%)

Covers the CLAUDE.md hierarchy, path-scoped rules, configuration-driven design, and the three-layer override system. The DX Plugin System uses **15 rule files** across multiple scoping levels.

---

## 1. The Prompt Stack (Five Layers)

### Exam concept
Claude Code builds its context from multiple configuration layers. The exam tests which layer to use for which type of instruction.

### Our implementation — five layers, in order of specificity:

\`\`\`
1. System prompt         (built into Claude Code — you don't control this)
2. CLAUDE.md             (project instructions at repo root)
3. .claude/rules/*.md    (path-scoped conventions, auto-loaded per file type)
4. Skill instructions    (SKILL.md being executed)
5. User message          (what you typed)
\`\`\`

**Layer 2 — CLAUDE.md** (255 lines in our project):
- Build and deploy commands
- Project structure overview (4-plugin architecture)
- Key conventions: config-driven design, spec directory convention
- Model tier strategy
- MCP server prefixing rules
- Branch strategy and CI info

**Layer 3 — Path-scoped rules:**
Loaded automatically when Claude edits files matching the glob pattern. SCSS rules don't pollute JavaScript sessions.

**Layer 4 — Skill instructions:**
When you run \`/dx-plan\`, the SKILL.md content is injected. It overrides general conventions with task-specific instructions.

### Key learning
The exam asks: "Where should this instruction go?" The answer:
- **CLAUDE.md** — applies to every session (project structure, commands)
- **Rules** — applies to specific file types (CSS conventions, Java patterns)
- **Skills** — applies to specific workflows (planning steps, review criteria)

---

## 2. Path-Scoped Rules

### Exam concept
Rules auto-load based on file path globs. The exam tests correct scoping and when to use path-scoped vs global rules.

### Our implementation — 15 rule files across two categories:

**Plugin rules (.claude/rules/ — auto-loaded by Claude Code):**

| Rule | Scope (paths) | Purpose |
|---|---|---|
| \`fe-javascript.md\` | \`**/*.js\` | ESLint Airbnb, component lifecycle |
| \`fe-styles.md\` | \`**/*.scss\` | Dart Sass, sass-lint conventions |
| \`fe-clientlibs.md\` | \`**/frontend/**, **/clientlibs/**\` | Build pipeline rules |
| \`be-java.md\` | \`**/*.java\` | Sling Model conventions |
| \`be-sling.md\` | \`**/*.java\` | OSGi, servlet patterns |
| \`aem-components.md\` | \`**/.content.xml\` | Component structure |
| \`aem-dialogs.md\` | \`**/cq:dialog/**\` | Dialog XML patterns |
| \`security.md\` | \`**/*\` | Cross-plugin security rules |
| \`plan-format.md\` | (global) | implement.md structure |
| \`pr-review.md\` | (global) | Review severity mapping |

**Shared rules (.ai/rules/ — read by skills and automation agents):**

| Rule | Purpose |
|---|---|
| \`pr-review.md\` | 80%+ confidence filtering for reviews |
| \`pr-answer.md\` | Reply tone and format |
| \`pragmatism.md\` | 10 question filters (don't ask obvious things) |
| \`universal-reuse-first.md\` | Search commons before creating new code |
| \`task-progress.md\` | How to update implement.md status |

### Dual frontmatter for cross-platform compatibility:

\`\`\`yaml
---
# Claude Code reads this:
paths:
  - "**/*.scss"
# Copilot CLI reads this:
applyTo: "**/*.scss"
---
# SCSS Conventions
- Use Dart Sass (not node-sass)
- Variables in _variables.scss
- Mixins in _mixins.scss
\`\`\`

### Key learning
**Path-scoping reduces context bloat** — when editing a .scss file, only SCSS rules load. Java rules stay out. This directly addresses the exam concept of **token budget management through selective context loading**.

---

## 3. Three-Layer Override System

### Exam concept
When multiple configuration sources conflict, which one wins?

### Our implementation:

\`\`\`
Priority 1 (highest):  .ai/rules/<topic>.md      (project-specific overrides)
Priority 2:            config.yaml overrides:      (per-project config)
Priority 3 (lowest):   Plugin rules/ defaults      (shipped with plugin)
\`\`\`

**Example:** The plugin ships \`pr-review.md\` with 80% confidence threshold. A project can override this by creating \`.ai/rules/pr-review.md\` with a 90% threshold. The project rule wins.

**config.yaml overrides:**
\`\`\`yaml
overrides:
  pr-review:
    tone: "direct and constructive"
    severity-threshold: 90
    extra-rules:
      - "Flag any usage of deprecated jQuery methods"
  pr-answer:
    persona: "Senior frontend developer"
\`\`\`

### Key learning
The exam tests **specificity-based override resolution** — same concept as CSS specificity but for AI configuration. Project-specific rules beat plugin defaults.

---

## 4. Configuration-Driven Design

### Exam concept
Never hardcode values that might change across projects. The exam tests config externalization.

### Our implementation
Everything lives in \`.ai/config.yaml\`:

\`\`\`yaml
project:
  name: "Brand Website"
  prefix: "brand"
  type: "aem-fullstack"
  role: "fullstack"

scm:
  provider: ado
  org: "https://dev.azure.com/myorg"
  project: "MyProject"
  base-branch: "develop"

build:
  command: "mvn clean install -PautoInstallSinglePackage"
  test: "mvn test"
  lint-js: "npx eslint src/**/*.js"
  lint-scss: "npx sass-lint -v"

aem:
  component-path: "/apps/brand/components"
  author-url: "http://localhost:4502"
\`\`\`

**Skills read config at runtime:**
\`\`\`
Read .ai/config.yaml → extract build.command → run build
\`\`\`

Never: \`mvn clean install\` hardcoded in a skill. Always: \`config.build.command\`.

### Key learning
The exam's concept of **configuration externalization** — skills work across any project because they read config, not assume values. Same skill works for a Webpack frontend and a Maven AEM project.

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| CLAUDE.md purpose & content | High | 255-line project instruction file |
| Path-scoped rules | High | 15 rules with glob patterns |
| Configuration hierarchy | High | 5-layer prompt stack |
| Override precedence | Medium | 3-layer: project rules > config > plugin defaults |
| Config-driven design | Medium | .ai/config.yaml for all project-specific values |
| Dual-platform rules | Low | paths: (Claude Code) + applyTo: (Copilot CLI) |
`,
  },
  {
    id: '05-skills-hooks',
    projectId: 'dx-plugins',
    title: "Domain 3: Skills & Hooks",
    domain: 'D3',
    weight: '20%',
    content: `# Domain 3: Skills & Hooks (20%)

Covers skill frontmatter design, hook system events, custom slash commands, and workflow enforcement. The DX Plugin System has **76 skills** and **8 hooks across 4 types** with production-proven patterns.

---

## 1. Skill Frontmatter Patterns

### Exam concept
Skills use YAML frontmatter to declare behavior, tools, and execution context. The exam tests correct frontmatter usage.

### Our implementation — key frontmatter fields:

\`\`\`yaml
---
name: dx-step-all
description: Execute all pending implementation steps autonomously
argument-hint: "<ADO Work Item ID>"
context: fork                    # isolate from main conversation
allowed-tools: ["read", "edit", "search", "write", "agent"]
disable-model-invocation: true   # coordinator — never writes code
---
\`\`\`

**Field-by-field explanation:**

| Field | Purpose | Exam Relevance |
|---|---|---|
| \`name\` | Unique identifier | Naming conventions |
| \`description\` | Trigger phrases for discovery | Helps Claude match user intent |
| \`argument-hint\` | Parameter prompt shown to user | UX design |
| \`context: fork\` | Run in isolated context window | Prevents context bloat |
| \`allowed-tools\` | Restrict available tools | Least privilege |
| \`disable-model-invocation: true\` | Coordinator mode — orchestrate only | Separation of concerns |
| \`model: opus\` | Override session model | Task-appropriate model selection |
| \`agent: dx-code-reviewer\` | Delegate to specific agent | Direct agent dispatch |

---

## 2. Context Forking

### Exam concept
When a skill does heavy work (reading many files, long conversations), it can pollute the parent context. Forking prevents this.

### Our implementation
Skills that do intensive work use \`context: fork\`:

\`\`\`yaml
# dx-req (requirements gathering — reads 50+ files)
context: fork

# dx-step-verify (6-phase verification — spawns code reviewer)
context: fork

# dx-help (quick Q&A — minimal context impact)
# No fork — runs inline
\`\`\`

**The tradeoff (exam answer):**
- **Fork:** Clean context, no bloat, but loses parent conversation history
- **Inline:** Has conversation context, but adds to token usage
- **Rule:** Fork for heavy work, inline for quick interactions

---

## 3. Hook System

### Exam concept
Hooks execute shell commands in response to Claude Code events. The exam tests hook types, matchers, and return formats.

### Our implementation — 4 hook types across 2 plugins:

**SessionStart** — runs when session begins:
\`\`\`json
{
  "type": "SessionStart",
  "command": "bash plugins/dx-core/hooks/scripts/session-start.sh",
  "blocking": true
}
\`\`\`

Our session-start.sh validates:
- \`.ai/config.yaml\` exists
- Node version matches .nvmrc
- Returns warnings as \`additionalContext\` in JSON

**PreToolUse** — runs before a tool call (validation/safety):
\`\`\`json
{
  "type": "PreToolUse",
  "matcher": "Bash(git commit*)",
  "command": "bash plugins/dx-core/hooks/scripts/branch-guard.sh"
}
\`\`\`

Our branch-guard.sh:
\`\`\`bash
BRANCH=\$(git branch --show-current)
case "\$BRANCH" in
  main|master|development|develop)
    # Return: {"permissionDecision":"deny","reason":"..."}
    ;;
esac
\`\`\`

**PostToolUse** — runs after a tool call (logging/validation):
\`\`\`json
{
  "type": "PostToolUse",
  "matcher": "Edit",
  "command": "bash plugins/dx-core/hooks/scripts/validate-plugin-edit.sh"
}
\`\`\`

Our validate-plugin-edit.sh prevents \`plugin.json\` corruption — if an Edit touches plugin.json, it validates the JSON structure.

**Stop** — runs when agent tries to end session:
\`\`\`json
{
  "type": "Stop",
  "command": "bash .ai/hooks/stop-guard.sh"
}
\`\`\`

Our stop-guard.sh blocks exit if:
- Secrets detected in code
- Plan steps abandoned (still in-progress)
- Source uncommitted

---

## 4. Hook Matchers (Precision Targeting)

### Exam concept
Matchers use glob-style patterns to target specific tool calls.

### Our patterns:

\`\`\`
"Bash(git commit*)"         — only git commits (not all Bash)
"Bash(git push --force*)"   — only force pushes
"Edit"                       — all Edit calls
"Write(*.env*)"             — catch secret file creation
"mcp__*figma*"              — any Figma MCP tool
"mcp__plugin_dx-aem_chrome-devtools-mcp__take_screenshot" — specific tool
\`\`\`

**Key learning:** Start specific, not broad. \`Bash(git commit*)\` is better than \`Bash\` — the latter fires on every shell command.

---

## 5. Hook Return Format

### Exam concept
Hooks communicate back to Claude Code via JSON on stdout.

### Return patterns:

**PreToolUse — deny/allow:**
\`\`\`json
{"permissionDecision": "deny", "reason": "Cannot commit to protected branch"}
\`\`\`

**PostToolUse — additional context:**
\`\`\`json
{"hookSpecificOutput": "Screenshot saved to .ai/screenshots/2024-01-15.png"}
\`\`\`

**SessionStart — inject context:**
\`\`\`json
{"additionalContext": "Warning: Node version mismatch. Expected 18, got 20."}
\`\`\`

**Stop — block exit:**
\`\`\`json
{"decision": "block", "reason": "3 plan steps still in-progress"}
\`\`\`

---

## 6. The 76 Skills Organized by Workflow

### Exam concept
Skills should be composable and follow naming conventions.

### Our skill catalog by workflow phase:

| Phase | Skills | Count |
|---|---|---|
| Estimation | dx-estimate | 1 |
| Requirements | dx-req, dx-req-tasks, dx-req-dod, dx-req-import | 6 |
| Figma | dx-figma-all, dx-figma-extract, dx-figma-prototype, dx-figma-verify | 4 |
| Planning | dx-plan, dx-plan-validate, dx-plan-resolve | 3 |
| Execution | dx-step-all, dx-step, dx-step-fix, dx-step-build, dx-step-verify | 5 |
| Pull Request | dx-pr, dx-pr-commit, dx-pr-review, dx-pr-review-all, dx-pr-answer | 7 |
| Bug Fix | dx-bug-all, dx-bug-triage, dx-bug-verify, dx-bug-fix | 4 |
| Agent Roles | dx-agent-all, dx-agent-re, dx-agent-dev | 3 |
| AEM Verification | aem-snapshot, aem-verify, aem-fe-verify, aem-editorial-guide | 4 |
| AEM QA & Docs | aem-qa, aem-qa-handoff, aem-doc-gen | 3 |
| AEM Recon | aem-init, aem-component, aem-page-search, aem-refresh, aem-doctor | 5 |
| Automation | auto-init, auto-provision, auto-pipelines, auto-deploy, auto-test, etc. | 12+ |
| Utility | dx-help, dx-sync, dx-upgrade, dx-eject, dx-doctor | 5+ |

**Naming convention:**
- \`dx-\` prefix for core skills
- \`aem-\` prefix for AEM-specific skills
- \`auto-\` prefix for CI/CD automation skills
- \`-all\` suffix for coordinator skills (dx-req, dx-step-all, dx-bug-all, dx-agent-all)

---

## Summary: What This Domain Tests

| Concept | Exam Weight | Our Experience |
|---|---|---|
| Skill frontmatter fields | High | 76 skills with diverse frontmatter patterns |
| Hook types & events | High | 4 types: SessionStart, PreToolUse, PostToolUse, Stop |
| Hook matchers | High | Glob-style tool targeting |
| Context forking | Medium | fork for heavy work, inline for quick tasks |
| Hook return formats | Medium | JSON: permissionDecision, hookSpecificOutput, additionalContext |
| Skill naming conventions | Low | dx-/aem-/auto- prefixes, -all for coordinators |
`,
  },
  {
    id: '06-convention-data-flow',
    projectId: 'dx-plugins',
    title: "Cross-Cutting: Convention-Based Data Flow",
    domain: 'Cross-cutting',
    weight: '',
    content: `# Cross-Cutting: Convention-Based Data Flow

This topic spans all exam domains. Understanding how data flows between skills and agents through **file conventions** rather than APIs or function arguments is central to the DX Plugin architecture.

---

## The Core Principle

> Skills never pass data through function arguments, environment variables, or shared memory. Every skill reads inputs from files and writes outputs to files.

This makes every intermediate state **inspectable and debuggable**.

---

## 1. Spec Directory Convention

### Exam concept
Predictable file locations serve as a contract between skills.

### Our implementation
All ticket work lives in \`.ai/specs/<ticket-id>-<slug>/\`:

\`\`\`
.ai/specs/12345-add-steps-title/
├── raw-story.md          ← dx-req: fetched work item
├── dor-report.md         ← dx-req: Definition of Ready analysis
├── explain.md            ← dx-req: plain-English explanation
├── research.md           ← dx-req: codebase analysis + cross-repo scope
├── share-plan.md         ← dx-req: ADO comment draft
├── implement.md          ← dx-plan: step-by-step plan with status
├── figma-extract.md      ← dx-figma-extract: design tokens + screenshots
├── prototype/            ← dx-figma-prototype: HTML/CSS prototype
│   ├── index.html
│   └── styles.css
├── verification.md       ← dx-bug-verify: before screenshots
├── verification-local.md ← dx-bug-verify: after screenshots
├── dod.md                ← dx-req-dod: Definition of Done checklist
├── aem-before.md         ← aem-snapshot: baseline
├── aem-after.md          ← aem-verify: post-deploy comparison
├── qa-handoff.md         ← aem-qa-handoff: testing steps
├── demo/                 ← aem-editorial-guide: screenshots + guide
└── docs/
    └── wiki-page.md      ← dx-doc-gen: generated documentation
\`\`\`

**The filename IS the contract.** When \`dx-plan\` needs requirements, it reads \`research.md\`. When \`dx-step\` needs the plan, it reads \`implement.md\`. No configuration needed.

---

## 2. Idempotent Execution

### Exam concept
Skills should be safe to re-run without duplicating work.

### Our implementation
Every skill checks if its output exists before regenerating:

\`\`\`
/dx-req 12345
  → raw-story.md exists?     → skip fetch      (or: created/updated)
  → dor-report.md exists?    → skip DoR check
  → explain.md exists?       → skip explanation
  → research.md exists?      → skip research
  → share-plan.md exists?    → skip share draft
\`\`\`

**Three states per output:** created (new), updated (regenerated), skipped (already exists)

This means you can re-run \`/dx-req\` after editing the story without losing your research. Only changed steps re-execute.

---

## 3. The Learning Pipeline

### Exam concept
How does an agent improve over time?

### Our implementation
Three-tier knowledge storage with promotion:

\`\`\`
Tier 1: .claude/rules/         (permanent conventions, auto-loaded)
Tier 2: .ai/rules/             (domain knowledge, skill-readable)
Tier 3: .ai/learning/raw/      (raw signals, gitignored)
\`\`\`

**Promotion flow:**
1. \`dx-step-fix\` logs successful fix patterns to \`.ai/learning/raw/fixes.jsonl\`
2. After 3+ successful matches with 0 failures, pattern is promoted
3. Promoted to \`.claude/rules/learned-fix-<topic>.md\` (permanent rule)
4. Developer confirms promotion

**Example fix pattern:**
\`\`\`json
{
  "component": "teaser",
  "symptom": "Missing null check on model getter",
  "fix": "Add Optional.ofNullable() wrapper",
  "success": true,
  "timestamp": "2024-03-15T10:30:00Z"
}
\`\`\`

After 3 teasers with the same pattern, this becomes a permanent rule that the code reviewer checks for.

---

## 4. Cross-Repo Scope Detection

### Exam concept
When does work span multiple repositories?

### Our implementation
\`dx-req\` detects cross-repo scope during research (Phase 5c) and appends a section:

\`\`\`markdown
## Cross-Repo Scope
- Dialog validation change lives in Platform-Core (shared component library)
- HBS template fixes are in this repo
- Both repos needed for full coverage
\`\`\`

\`dx-plan\` reads this and tags steps with \`[RepoName]\`:

\`\`\`markdown
## Step 3: Add CTA label validation [Platform-Core]
...
\`\`\`

The coordinator then routes steps to the appropriate repo via delegation or hub mode.

---

## Summary: Key Patterns

| Pattern | Purpose | Exam Relevance |
|---|---|---|
| Spec directory convention | Predictable file locations | Convention over configuration |
| Filename as contract | Skills find each other's output | Data flow without APIs |
| Idempotent execution | Safe to re-run | Reliability |
| Three-tier learning | Raw signals → promoted rules | Knowledge accumulation |
| Cross-repo detection | Scope spans multiple repos | Delegation patterns |
`,
  },
  {
    id: '07-self-healing-learning',
    projectId: 'dx-plugins',
    title: "Cross-Cutting: Self-Healing & Learning",
    domain: 'Cross-cutting',
    weight: '',
    content: `# Cross-Cutting: Self-Healing & Learning

Covers recovery from failures, escalation strategies, fix pattern detection, and the learning feedback loop. The DX Plugin System implements a **3-layer recovery system** with automated pattern promotion.

---

## 1. Three-Layer Recovery

### Exam concept
What happens when an agent fails? The system must recover or escalate gracefully.

### Our implementation

**Layer 1: Targeted Fix (dx-step-fix)**
\`\`\`
Step fails → dx-step-fix (1 attempt)
  - Read error output
  - Targeted one-shot fix
  - Re-run verification
  - If fixed: continue to next step
\`\`\`

**Layer 2: Root Cause Analysis (dx-step-heal)**
\`\`\`
Targeted fix fails → dx-step-heal (Opus + ultrathink)
  - Deep analysis of failure pattern
  - May rewrite step entirely
  - May split step into smaller steps
  - Re-run from revised plan
\`\`\`

**Layer 3: Coordinator Loop**
\`\`\`
Heal fails → Coordinator orchestrates up to:
  - 6 fix attempts per step
  - 2 healing cycles
  - 3 review-fix cycles for code review
  After 2 consecutive failures on same step: STOP → human
\`\`\`

### Key learning
The exam asks about **escalation strategies**. The answer is: try the cheapest fix first (targeted), then invest more (root cause analysis), then stop and ask for help. Each layer uses a more capable (and expensive) model.

---

## 2. Code Review Recovery Loop

### Exam concept
How do you handle review findings that need fixes?

### Our implementation
\`dx-step-verify\` runs a 6-phase gate, then iterates on findings:

\`\`\`
Verification Gate:
  1. Compile (build.command)
  2. Lint (lint.command)
  3. Test (test.command)
  4. Secret Scan (pattern match for keys/tokens)
  5. Architecture (convention check)
  6. Code Review (dx-code-reviewer, Opus, 80%+ confidence)

Review-Fix Loop (max 3 cycles):
  Review → Findings? → Fix → Re-review
  If issues persist after 3 cycles → dx-step-heal (escalation)
\`\`\`

---

## 3. Fix Pattern Detection

### Exam concept
Agents should learn from successful fixes to prevent repeat issues.

### Our implementation
Every successful fix is logged:

\`\`\`json
// .ai/learning/raw/fixes.jsonl
{
  "component": "teaser",
  "symptom": "Sling Model getter returns null for optional field",
  "fix": "Wrap with Optional.ofNullable(), add @Nullable annotation",
  "files": ["TeaseModel.java"],
  "success": true,
  "timestamp": "2024-03-15T10:30:00Z"
}
\`\`\`

**Promotion criteria:**
- 3+ successful applications
- 0 failures with same pattern
- Developer confirms promotion

**Promoted rule example:**
\`\`\`markdown
# .claude/rules/learned-fix-sling-optional.md
---
paths: ["**/*.java"]
---
When accessing optional Sling Model fields, always wrap return values
with Optional.ofNullable() and add @Nullable annotation.
\`\`\`

Once promoted, the code reviewer catches this pattern **before** it becomes a bug.

---

## 4. Bug Pattern Detection

### Exam concept
Observability — tracking patterns to identify systemic issues.

### Our implementation
\`dx-bug-all\` tracks per-component bug patterns:

\`\`\`json
// .ai/learning/raw/bugs.jsonl
{
  "component": "hero-banner",
  "bugType": "rendering",
  "rootCause": "Missing responsive breakpoint",
  "fixComplexity": "low",
  "timestamp": "2024-03-20T14:00:00Z"
}
\`\`\`

**Hotspot detection:** 3+ bugs on the same component triggers an alert for deeper review. The component may need architectural attention, not just bug fixes.

---

## 5. Execution Metrics

### Exam concept
Measuring agent performance for optimization.

### Our implementation
Per-coordinator metrics stored in \`.ai/learning/runs.jsonl\`:

\`\`\`json
{
  "ticket": "12345",
  "flow": "dx-agent-all",
  "phases": 9,
  "steps": 5,
  "fixes": 2,
  "heals": 0,
  "tokens": 450000,
  "duration": "28m",
  "result": "success"
}
\`\`\`

This enables:
- Token budget planning (average vs worst case)
- Phase bottleneck identification
- Estimate calibration (actual vs predicted complexity)

---

## Summary: Recovery & Learning Patterns

| Pattern | Purpose | Exam Relevance |
|---|---|---|
| 3-layer recovery | Graduated escalation | Failure handling strategies |
| Review-fix loop | Iterative improvement | Quality gates |
| Fix pattern logging | Learn from successes | Observability |
| Pattern promotion | Prevent repeat issues | Knowledge accumulation |
| Bug hotspot detection | Identify systemic issues | Reliability monitoring |
| Execution metrics | Measure and optimize | Token budget management |
`,
  },
  {
    id: '08-ci-cd-automation',
    projectId: 'dx-plugins',
    title: "Cross-Cutting: CI/CD Automation",
    domain: 'Cross-cutting',
    weight: '',
    content: `# Cross-Cutting: CI/CD Automation

Covers running Claude Code agents as autonomous CI/CD pipelines triggered by webhooks. The DX Plugin System includes **dx-automation** with AWS Lambda routing, rate limiting, and pipeline delegation.

---

## 1. Architecture Overview

### Exam concept
Claude Code can run non-interactively in CI/CD pipelines. The exam tests the flags and safety mechanisms.

### Our implementation

\`\`\`
ADO Service Hook (webhook)
  → AWS Lambda (WI Router or PR Router)
    → Rate limit check (DynamoDB atomic counter)
    → Deduplication check (1-hour TTL)
    → Queue ADO Pipeline
      → Claude Code --non-interactive --max-turns N
        → Execute skill (DoR, PR Review, Bug Fix, etc.)
        → Post results to ADO
\`\`\`

**Seven autonomous agents:**

| Agent | Trigger | Pipeline |
|---|---|---|
| DoR Agent | Work item tagged "kai-dor-automation" | Definition of Ready check |
| DoD Agent | Work item tagged "kai-dod-fix" | Definition of Done auto-fix |
| PR Review | PR created (filtered by identity) | Code review + post findings |
| PR Answer | PR comment (filtered by identity) | Reply to review comments |
| Bug Fix | Work item tagged "kai-bugfix-automation" | Triage + verify + fix |
| Dev Agent | Work item tagged "kai-devagent" | Full story-to-PR |
| Doc Agent | Work item tagged "kai-docagent" | Documentation generation |

---

## 2. Non-Interactive Mode Flags

### Exam concept
Running Claude Code in CI/CD requires specific flags.

### Our implementation in ADO pipelines:

\`\`\`bash
claude --non-interactive \\
       --max-turns 30 \\
       --trust-tools "Read,Glob,Grep,Bash" \\
       --dangerously-skip-permissions \\
       "/dx-req-dod \$WORK_ITEM_ID"
\`\`\`

**Flag explanations:**
- \`--non-interactive\`: No user prompts, runs to completion
- \`--max-turns 30\`: Safety cap prevents infinite loops
- \`--trust-tools\`: Pre-approve specific tools
- \`--dangerously-skip-permissions\`: Skip all permission prompts (CI only!)

---

## 3. Rate Limiting & Deduplication

### Exam concept
Autonomous agents need safety gates to prevent runaway execution.

### Our implementation

**Rate limiting (DynamoDB atomic counter):**
\`\`\`
Max 20-30 runs per day per agent type
Prevents: webhook storms, duplicate processing, cost overruns
\`\`\`

**Deduplication (1-hour TTL):**
\`\`\`
Each webhook event gets a hash key
If key exists in DynamoDB (within 1 hour): silently drop
Prevents: double-processing from webhook retries
\`\`\`

**Token budget with three states:**
\`\`\`
Normal:       Full execution (all agents active)
Suggest-only: Analysis only (no code changes)
Halted:       All agents stopped (budget exhausted)
\`\`\`

---

## 4. Lambda Routing

### Exam concept
How do you route different event types to different pipelines?

### Our implementation — two routers:

**Work Item Router (tag-based):**
\`\`\`
WI tagged "kai-dor-automation"  → DoR pipeline
WI tagged "kai-bugfix-automation" → Bug Fix pipeline
WI tagged "kai-devagent"        → Dev Agent pipeline
\`\`\`

Tag-based routing eliminates new API routes when adding agents — just add a tag.

**PR Router (identity-based):**
\`\`\`
PR created by team member → PR Review pipeline
PR comment by team member → PR Answer pipeline
PR by automation identity → skip (prevent loops)
\`\`\`

Identity filtering prevents the automation from reviewing its own PRs.

---

## 5. Pipeline Delegation

### Exam concept
When an agent discovers work belongs in another repo, how does it hand off?

### Our implementation
Claude writes \`delegate.json\` instead of making API calls:

\`\`\`json
{
  "targetRepo": "platform-core",
  "pipelineId": "42",
  "reason": "Dialog validation lives in shared library",
  "templateParameters": {
    "workItemId": "12345",
    "sourceBranch": "feature/12345-fix-validation"
  }
}
\`\`\`

A YAML pipeline step reads this and queues the target pipeline:
\`\`\`yaml
- script: |
    if [ -f delegate.json ]; then
      az pipelines run --id \$(jq -r .pipelineId delegate.json) ...
    fi
\`\`\`

**Why delegation over direct action:**
- Claude never gets \`curl\` permissions to ADO APIs
- Auth details stay out of Claude's context
- Target repo unknown until AFTER triage (can't route at Lambda level)
- Delegation happens mid-pipeline, not at invocation time

---

## 6. Safety Mechanisms

### Exam concept
Autonomous agents need multiple safety layers.

### Our implementation — 6 safety gates:

| Gate | Purpose |
|---|---|
| Rate limiting | Max runs per day per agent |
| Deduplication | 1-hour TTL prevents double-processing |
| Token budget | 3-state throttle (normal → suggest → halt) |
| Secret scan | Immediate STOP if secrets found in code |
| Decision journal | Every autonomous decision logged with reasoning |
| Execution bundles | Full context stored in S3 (90-day retention) |

**CloudWatch alarms:**
- DLQ depth (dead letter queue accumulation)
- Lambda errors (invocation failures)
- Throttles (rate limit hits)

---

## Summary: Automation Patterns

| Pattern | Purpose | Exam Relevance |
|---|---|---|
| Non-interactive flags | CI/CD execution | --non-interactive, --max-turns |
| Tag-based routing | Event → pipeline mapping | Extensible without code changes |
| Identity filtering | Prevent automation loops | Self-review prevention |
| Rate limiting + dedup | Safety gates | Prevent runaway costs |
| Pipeline delegation | Cross-repo handoff | Agent boundaries |
| Token budget states | Cost management | Graceful degradation |
| Execution bundles | Audit trail | Observability |
`,
  },
];

export default learnings;
export function getLearning(id) { return learnings.find(l => l.id === id); }
export function getLearningsByProject(projectId) { return learnings.filter(l => l.projectId === projectId); }

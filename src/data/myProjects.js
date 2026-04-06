const DX = 'https://github.com/easingthemes/dx-aem-flow';
const AEM = 'https://github.com/easingthemes/aem-mcp-server';
const KI = 'https://github.com/easingthemes/ki-bundestag';

const myProjects = [
  // ---------------------------------------------------------------------------
  // DX Plugin System
  // ---------------------------------------------------------------------------
  {
    id: 'dx-plugins',
    name: 'DX Plugin System',
    domains: ['d1', 'd2', 'd3'],
    repo: 'https://github.com/easingthemes/dx-aem-flow',
    description: 'A three-plugin Claude Code architecture for enterprise Azure DevOps + AEM development workflows. 77+ skills, 13+ agents, hooks, rules.',
    sections: [
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Coordinator-Subagent Pattern (Task 1.2)',
        implementation: 'Coordinator skills that orchestrate multiple sub-skills: dx-req-all (requirements), dx-step-all (execution), dx-bug-all (bug lifecycle), dx-figma-all (Figma workflow). Hub-and-spoke architecture where coordinator manages delegation, error handling, and result aggregation.',
        links: [
          { label: 'dx-req-all', url: `${DX}/tree/main/plugins/dx-core/skills/dx-req-all` },
          { label: 'dx-step-all', url: `${DX}/tree/main/plugins/dx-core/skills/dx-step-all` },
          { label: 'dx-bug-all', url: `${DX}/tree/main/plugins/dx-core/skills/dx-bug-all` },
          { label: 'dx-figma-all', url: `${DX}/tree/main/plugins/dx-core/skills/dx-figma-all` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Subagent Spawning & Context (Task 1.3)',
        implementation: 'Agents require full prefixed names: dx-dev-experience:dx-code-reviewer. Short names fail silently — matches exam concept that subagent context must be explicit. Each agent .md has YAML frontmatter with model, tools, description. Executor agent has restricted tool access (no MCP, no Task spawning).',
        links: [
          { label: 'dx-core agents/', url: `${DX}/tree/main/plugins/dx-core/agents` },
          { label: 'dx-aem agents/', url: `${DX}/tree/main/plugins/dx-aem/agents` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Model Tiering Strategy (Task 1.2)',
        implementation: 'Opus for deep reasoning (dx-code-reviewer), Sonnet for execution + analysis (PR reviewer, step executor, inspectors), Haiku for simple lookups (file resolver, doc searcher, page finder). Cost-optimized agent architecture matching model capability to task complexity.',
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Workflow Enforcement via Hooks (Task 1.4, 1.5)',
        implementation: '4 hook types: SessionStart (initialize session state), PreToolUse (git branch protection — blocks commits on main/master, enforces feature/* naming), PostToolUse (plugin file validation prevents plugin.json corruption, subagent logging), Stop (anti-rationalization guard — blocks exit if secrets detected, plan steps abandoned, or source uncommitted).',
        links: [
          { label: 'dx-core hooks/', url: `${DX}/tree/main/plugins/dx-core/hooks` },
          { label: 'dx-aem hooks/', url: `${DX}/tree/main/plugins/dx-aem/hooks` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'MCP Server Integration (Task 2.4)',
        implementation: 'Multi-level MCP scoping: project .mcp.json (context7, ado) + plugin dx-dev .mcp.json (axe-mcp-server, figma) + plugin dx-aem .mcp.json (AEM, chrome-devtools). ${AEM_INSTANCES} env var expansion with secrets in settings.local.json (gitignored). Full tool prefix naming: mcp__plugin_dx-dev-experience_figma__get_screenshot.',
        links: [
          { label: '.mcp.json', url: `${DX}/blob/main/.mcp.json` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Tool Distribution Across Agents (Task 2.3)',
        implementation: 'Executor agent: only Read, Write, Edit, Bash, Glob, Grep (NO MCP, NO Task spawning). Code reviewer (Opus): full tool access for deep analysis. File resolver (Haiku): minimal tools for fast lookups. Scoped tool access matching agent role.',
        links: [
          { label: 'code-reviewer.md', url: `${DX}/blob/main/plugins/dx-core/agents/code-reviewer.md` },
          { label: 'file-resolver.md', url: `${DX}/blob/main/plugins/dx-core/agents/file-resolver.md` },
        ],
      },
      {
        examDomain: 'D3: Claude Code Config',
        examConcept: 'CLAUDE.md Hierarchy (Task 3.1)',
        implementation: 'Root CLAUDE.md (8720 bytes: project commands, build pipeline, conventions, DX workflow, ADO MCP usage) + Plugin CLAUDE.md (9000+ bytes: plugin architecture, testing, conventions) + Agent memory: .claude/agent-memory/*/MEMORY.md for per-agent learned context.',
        links: [
          { label: 'CLAUDE.md', url: `${DX}/blob/main/CLAUDE.md` },
          { label: 'settings.json', url: `${DX}/blob/main/.claude/settings.json` },
        ],
      },
      {
        examDomain: 'D3: Claude Code Config',
        examConcept: 'Path-Scoped Rules (Task 3.3)',
        implementation: '10 rule files in .claude/rules/: accessibility.md (**/*.html, **/*.scss, **/*.css, **/*.js — WCAG 2.1 AA), fe-javascript.md (**/frontend/**/*.js — component lifecycle), fe-styles.md (**/frontend/**/*.scss — Dart Sass), fe-clientlibs.md (**/frontend/**, **/clientlibs/** — build pipeline), naming.md (cross-stack naming), reuse-first.md (search commons first), ado-service-hooks.md (webhook scoping), audit.md (AWS/Azure audit wrappers), dx-agents.md (full prefix required), qa-basic-auth.md (QA/Stage auth).',
        links: [
          { label: 'dx-core rules/', url: `${DX}/tree/main/plugins/dx-core/rules` },
          { label: 'dx-automation rules/', url: `${DX}/tree/main/plugins/dx-automation/rules` },
        ],
      },
      {
        examDomain: 'D3: Claude Code Config',
        examConcept: 'Custom Skills with Frontmatter (Task 3.2)',
        implementation: '77+ skills with YAML frontmatter: context: fork for isolating verbose output, allowed-tools for restricting tool access, argument-hint for parameter prompting. Three-layer override system: .ai/rules/ project rules (highest priority) > config.yaml overrides > plugin defaults (lowest).',
        links: [
          { label: 'dx-core skills/', url: `${DX}/tree/main/plugins/dx-core/skills` },
          { label: 'dx-aem skills/', url: `${DX}/tree/main/plugins/dx-aem/skills` },
        ],
      },
      {
        examDomain: 'D3: Claude Code Config',
        examConcept: 'CI/CD Automation (Task 3.6)',
        implementation: 'dx-automation plugin runs Claude Code agents as ADO pipelines triggered by AWS Lambda webhooks: Definition of Ready/Done checking, automated PR review, automated PR answering, automated fixes.',
        links: [
          { label: 'dx-automation skills/', url: `${DX}/tree/main/plugins/dx-automation/skills` },
        ],
      },
      {
        examDomain: 'Architecture Patterns',
        examConcept: 'Key Architectural Decisions',
        implementation: 'Config-driven design: .ai/config.yaml read at runtime, never hardcoded (avoids stale documentation). Spec convention: .ai/specs/<id>-<slug>/ with predictable filenames (structured data for context passing). Override layers: 3-layer priority — rules > config > defaults (CLAUDE.md hierarchy and scoping). Full prefix naming: dx-dev-experience:dx-code-reviewer (explicit subagent context, no auto-inherit). Plugin edit validation: PostToolUse hook prevents plugin.json corruption (hooks for deterministic compliance). Anti-rationalization: Stop hook blocks exit if plan steps abandoned (enforcement patterns vs prompt-based guidance). Audit logging: all AWS/Azure mutations through wrapper functions (observability).',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // AEM MCP Server (includes MoltBook comparison)
  // ---------------------------------------------------------------------------
  {
    id: 'aem-mcp',
    name: 'AEM MCP Server',
    domains: ['d2', 'd5'],
    repo: 'https://github.com/easingthemes/aem-mcp-server',
    description: 'A 46-tool MCP server for Adobe Experience Manager with dual transport (stdio/HTTP), multi-instance support, structured error handling, and OAuth + Basic auth.',
    sections: [
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Tool Interface Design (Task 2.1)',
        implementation: '46 tools across 8 categories: Content & Text (5), Sites & Localization (3), Pages (8), Components (8), Assets (3), Search (3), Templates (2), Workflows (9), Fragments (8). Descriptions include intelligent behavior explanation and common examples (e.g., startWorkflow lists common workflow names). Split into purpose-specific tools (updateComponent, scanPageComponents, createComponent, etc.) — NOT a single manageComponent tool.',
        links: [
          { label: 'tools/', url: `${AEM}/tree/main/src/tools` },
          { label: 'schemas/', url: `${AEM}/tree/main/src/schemas` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Structured Error Responses (Task 2.2)',
        implementation: 'Custom AEMOperationError class with 17 typed error codes categorized as: Transient/retryable (CONNECTION_FAILED, TIMEOUT, RATE_LIMITED, SYSTEM_ERROR), Validation/not retryable (INVALID_PATH, INVALID_COMPONENT_TYPE, INVALID_LOCALE, INVALID_PARAMETERS), Permission/not retryable (AUTHENTICATION_FAILED, UNAUTHORIZED, INSUFFICIENT_PERMISSIONS), Business/not retryable (RESOURCE_NOT_FOUND, COMPONENT_NOT_FOUND, PAGE_NOT_FOUND, UPDATE_FAILED, VALIDATION_FAILED, REPLICATION_FAILED, QUERY_FAILED). MCP responses use isError: true (never throw exceptions or return empty strings).',
        code: '// HTTP status mapping:\n// 401 -> AUTHENTICATION_FAILED (not recoverable)\n// 403 -> INSUFFICIENT_PERMISSIONS (not recoverable)\n// 404 -> RESOURCE_NOT_FOUND (not recoverable)\n// 429 -> RATE_LIMITED (recoverable, retryAfter)\n// 500/502/503 -> SYSTEM_ERROR (recoverable, 30s retry)',
        links: [
          { label: 'errors.js', url: `${AEM}/blob/main/src/errors.js` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Automatic Retry with Exponential Backoff',
        implementation: 'safeExecute() function: for each attempt (up to maxRetries=3), try operation, on failure check error.recoverable — if not recoverable or max retries reached, throw; otherwise wait error.retryAfter or 2^attempt * 1000ms. Distinguishes retryable (transient) from non-retryable (validation/permission).',
        links: [
          { label: 'connector.js', url: `${AEM}/blob/main/src/connector.js` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'MCP Transport Mechanisms (Task 2.4)',
        implementation: 'Dual transport: stdio (-t stdio, for IDE integration via npx — zero install) and HTTP (-t http, for persistent shared server, team environments). Stdio safety: logger writes to stderr only (never stdout) to prevent corrupting JSON-RPC stream.',
        links: [
          { label: 'index.js (transport)', url: `${AEM}/blob/main/src/index.js` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Multi-Instance Support',
        implementation: 'Automatic instance parameter injection into all tool schemas. Each instance gets independent handler. Default instance when parameter omitted. Config: --instances "author:http://localhost:4502:<user>:<pass>,publish:http://localhost:4503".',
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Input Validation with Zod Schemas',
        implementation: 'Zod schemas for all tool inputs, converted to JSON Schema for MCP with zodToJsonSchema(). Properties include .describe() for field documentation. Uses .passthrough() for extensibility.',
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Consistent Response Shape',
        implementation: 'Success: {success: true, operation, timestamp, data}. Error: {success: false, operation, timestamp, error: {code, message, recoverable}}. Structured tool responses that enable the agent to reason about success/failure.',
      },
      {
        examDomain: 'Comparison',
        examConcept: 'AEM MCP vs MoltBook MCP',
        implementation: 'AEM MCP: 46 tools, stdio+HTTP, Basic+OAuth S2S auth, multi-instance, 17 typed error codes, built-in exponential backoff, Zod schemas, no HTTPS. MoltBook MCP: 41 tools, stdio+HTTP (auto-detect), API key+JWT auth, per-session API keys via AsyncLocalStorage, JSON-RPC error codes, client-side retry, JSON Schema objects, optional TLS/HTTPS. Both demonstrate MCP tool design, transport selection, error handling, and credential management with different architectural trade-offs.',
      },
      {
        examDomain: 'Architecture Patterns',
        examConcept: 'AEM MCP Architecture Layers',
        implementation: 'Client (IDE/Agent) -> Transport (Stdio or HTTP) -> MCP Server -> InstanceRegistry (multi-instance) -> MCPRequestHandler -> Zod validation -> AEMConnector -> safeExecute() with retry -> AEMFetch -> Auth (Basic or OAuth S2S) -> AEM Instance. MoltBook transport auto-detection: if (process.stdin.isTTY === false && !opts.noStdio) startStdioServer() else startServer(). Exam parallel: MCP server transport selection — stdio for IDE/agent integration, HTTP for persistent shared servers.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // KI-Bundestag
  // ---------------------------------------------------------------------------
  {
    id: 'ki-bundestag',
    name: 'KI-Bundestag',
    domains: ['d1', 'd4', 'd5'],
    repo: 'https://github.com/easingthemes/ki-bundestag',
    description: 'A German parliament political simulation with 13+ Claude API call sites, multi-model strategy, structured JSON output, token-budgeted context, and a full agentic daily loop.',
    sections: [
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Agentic Loop Implementation (Task 1.1)',
        implementation: 'Daily simulation loop: while(running) { await runDay(); checkProviderLimits(); sleep(timingPreset); }. Single day execution has 10 stages: bill pipeline advancement, party agent calls (6 parallel, one per party), vote tallying (seat-weighted with human override), economic updates, opinion updates, media generation (Haiku -> 3 articles), crisis management, elections, coalition negotiations (3 rounds, Sonnet synthesis), notifications + event queue.',
        links: [
          { label: 'loop.ts', url: `${KI}/blob/main/packages/engine/src/simulation/loop.ts` },
          { label: 'party-agent.ts', url: `${KI}/blob/main/packages/engine/src/agent/party-agent.ts` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Multi-Model Strategy (Task 1.2, 2.3)',
        implementation: 'Haiku for daily operations (fast, cheap): party agent, committee, media, interpellations, proposals, polls. Sonnet for high-reasoning synthesis: coalition agreement synthesis. Grok-3-mini as alternative provider (AfD party). Cost optimization: 13+ Haiku calls/day + 1 Sonnet call/election.',
        links: [
          { label: 'model-config.ts', url: `${KI}/blob/main/packages/engine/src/agent/model-config.ts` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Provider Circuit Breaker (Task 1.5)',
        implementation: 'Hard limits: on "usage limits reached" error, store resetAt timestamp, block ALL calls to that provider until reset, throw AIProviderLimitError. Transient errors (429, network): retry with exponential backoff [2s, 5s], max 2 retries (3 total attempts). Provider fallback: if allProvidersLimited(), pause simulation with user message (graceful degradation, not crash).',
        links: [
          { label: 'client.ts', url: `${KI}/blob/main/packages/engine/src/agent/client.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'Structured Output via JSON (Task 4.3)',
        implementation: 'System prompt enforces full JSON schema with all 11 action types. Explicit constraint numbers (budget +/-1B, unemployment +/-0.1%). Warnings about common LLM quirks (trailing commas, +0.5 instead of 0.5).',
        links: [
          { label: 'prompt.ts', url: `${KI}/blob/main/packages/engine/src/agent/prompt.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'JSON Sanitization Pipeline (Task 4.4)',
        implementation: 'Multi-stage sanitization: Raw LLM output -> stripCodeFences() -> JSON.parse() -> [on failure]: stripLeadingPlusInNumbers() (+0.5 -> 0.5) -> stripTrailingCommas() ({a:1,} -> {a:1}) -> JSON.parse() retry -> validateActions() -> [on failure]: abstain on all (graceful degradation). Handles exact LLM quirks: format errors that CAN be fixed by retry vs missing information that CANNOT.',
        links: [
          { label: 'action-parser.ts', url: `${KI}/blob/main/packages/engine/src/agent/action-parser.ts` },
          { label: 'ai-json.ts', url: `${KI}/blob/main/packages/engine/src/agent/ai-json.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'Few-Shot Pattern via System Prompt (Task 4.2)',
        implementation: '20 numbered rules with explicit behavior examples. Impact constraint values as concrete numbers. Action type schemas with example values. Coalition dynamics guidance with scenario examples.',
        links: [
          { label: 'prompt.ts', url: `${KI}/blob/main/packages/engine/src/agent/prompt.ts` },
          { label: 'party-profiles.ts', url: `${KI}/blob/main/packages/engine/src/agent/party-profiles.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'Token-Budgeted Context (Task 4.5, 5.1)',
        implementation: 'Dynamic context slicing: Priority 1 (always included): current day, party info, coalition/opposition rosters, national economic state, bills by reading stage, active crises + government info. Priority 2+3 (greedy-loaded within ~3000 token budget): events -> media -> proposals -> motions -> interpellations -> challenges. Token estimation: ~4 chars per token.',
        links: [
          { label: 'context-depth.ts', url: `${KI}/blob/main/packages/engine/src/agent/context-depth.ts` },
          { label: 'briefing.ts', url: `${KI}/blob/main/packages/engine/src/agent/briefing.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'Mandatory vs Optional Actions',
        implementation: 'Mandatory: third-reading votes — missing votes auto-filled with "abstain" + warning logged. Optional with limits: max 3 actions/turn, max 1 proposal, max 1 amendment, max 1 statement. Validation-based enforcement with graceful degradation (appropriate for simulation; financial transactions would need hooks).',
        links: [
          { label: 'action-parser.ts', url: `${KI}/blob/main/packages/engine/src/agent/action-parser.ts` },
        ],
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Multi-Provider Resilience (Task 5.5)',
        implementation: 'Anthropic + xAI providers. Per-provider rate limit tracking with TTL. allProvidersLimited() check before each day. Graceful pause (not crash) when all providers limited.',
        links: [
          { label: 'client.ts', url: `${KI}/blob/main/packages/engine/src/agent/client.ts` },
          { label: 'batch-client.ts', url: `${KI}/blob/main/packages/engine/src/agent/batch-client.ts` },
        ],
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Human-in-the-Loop (Task 5.4)',
        implementation: 'MdB (Member of Bundestag) system: users join parties, apply for Bundestag seats. AI reviews applications (max 3/party/day). Humans can override AI votes on individual bills. Discipline system: AI tracks voting against party line -> warn -> restrict -> whip -> expel.',
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Structured Logging / Observability',
        implementation: 'logAICall() pattern: [AI] agent:spd | anthropic/claude-haiku-4-5 | 847ms | OK. Every call logged with: task, provider/model, latency, parse/validation status. Observability through the coordinator — all agent communication visible for debugging.',
      },
      {
        examDomain: 'Architecture Patterns',
        examConcept: 'Key Patterns Summary',
        implementation: 'Agentic loop lifecycle: while(running) { runDay(); checkLimits(); sleep(); }. stop_reason handling: provider limit detection -> pause vs continue. Multi-model strategy: Haiku (daily) + Sonnet (synthesis) + Grok (alternative). Structured output: JSON schema in system prompt + multi-stage sanitization. Token budgeting: priority-based context slicing (~3000 token budget). Retry with feedback: exponential backoff for transient, fail-fast for permanent. Human-in-the-loop: MdB vote overrides + AI discipline tracking. Graceful degradation: parse failure -> abstain (not crash). Observability: structured logging per AI call.',
      },
    ],
  },
];

export default myProjects;

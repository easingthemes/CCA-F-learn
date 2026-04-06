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
    description: 'A four-plugin Claude Code architecture for enterprise Azure DevOps + AEM development workflows. 76 skills, 13 agents, 8 hooks, cross-platform support for 10 AI coding tools.',
    sections: [
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Coordinator-Subagent Pattern (Task 1.2)',
        implementation: 'Coordinator skills that orchestrate multiple sub-skills: dx-req-all (requirements), dx-step-all (execution), dx-bug-all (bug lifecycle), dx-figma-all (Figma workflow). Hub-and-spoke architecture where coordinator manages delegation, error handling, and result aggregation. Superpowers soft-dependency pattern enables optional skill chaining with graceful fallbacks across platforms.',
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
        implementation: 'Agents require full prefixed names: dx-core:dx-code-reviewer. Short names fail silently — matches exam concept that subagent context must be explicit. Each agent .md has YAML frontmatter with model, tools, description. Executor agent has restricted tool access (no MCP, no Task spawning).',
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
        implementation: '8 hooks across 4 types: SessionStart (initialize session state), PreToolUse (git branch protection — blocks commits on main/master, enforces feature/* naming), PostToolUse (plugin file validation prevents plugin.json corruption, subagent logging), Stop (anti-rationalization guard — blocks exit if secrets detected, plan steps abandoned, or source uncommitted). Three hook profiles (minimal/standard/strict) controlled via environment variable.',
        links: [
          { label: 'dx-core hooks/', url: `${DX}/tree/main/plugins/dx-core/hooks` },
          { label: 'dx-aem hooks/', url: `${DX}/tree/main/plugins/dx-aem/hooks` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Multi-Repo Orchestration (Task 1.2)',
        implementation: 'dx-hub plugin enables hub-and-spoke multi-repo workflows: dx-hub-init discovers sibling repos and merges configs, dx-hub-dispatch opens independent Claude sessions in each repo via VS Code terminals, dx-hub-status tracks progress across repos. Solves the enterprise problem of tickets spanning multiple repositories.',
        links: [
          { label: 'dx-hub plugin/', url: `${DX}/tree/main/plugins/dx-hub` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'MCP Server Integration (Task 2.4)',
        implementation: 'Multi-level MCP scoping: project .mcp.json (context7, ado) + plugin dx-dev .mcp.json (axe-mcp-server, figma) + plugin dx-aem .mcp.json (AEM, chrome-devtools). ${AEM_INSTANCES} env var expansion with secrets in settings.local.json (gitignored). Full tool prefix naming: mcp__plugin_dx-core_figma__get_screenshot. 6 MCP server integrations: ADO, Atlassian, Figma, axe (accessibility), AEM (HTTP), Chrome DevTools.',
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
        examConcept: 'Cross-Platform Agent Support (Task 3.1)',
        implementation: 'Same 76 skills run identically across 10 AI coding platforms: Claude Code, GitHub Copilot CLI, VS Code Chat, Cursor, Windsurf, Amazon Q, Cline, Continue, Codex CLI, Gemini CLI. Cross-platform agent files: CLAUDE.md, AGENTS.md, GEMINI.md, .claude-plugin/, .cursor-plugin/. Demonstrates portable skill architecture not locked to a single vendor.',
        links: [
          { label: 'CLAUDE.md', url: `${DX}/blob/main/CLAUDE.md` },
          { label: '.claude-plugin/', url: `${DX}/tree/main/.claude-plugin` },
        ],
      },
      {
        examDomain: 'D3: Claude Code Config',
        examConcept: 'CLAUDE.md Hierarchy (Task 3.1)',
        implementation: 'Root CLAUDE.md (project commands, build pipeline, conventions, DX workflow, ADO MCP usage) + Plugin CLAUDE.md (plugin architecture, testing, conventions) + Agent memory: .claude/agent-memory/*/MEMORY.md for per-agent learned context.',
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
        implementation: '76 skills with YAML frontmatter: context: fork for isolating verbose output, allowed-tools for restricting tool access, argument-hint for parameter prompting. Three-layer override system: .ai/rules/ project rules (highest priority) > config.yaml overrides > plugin defaults (lowest). DOT digraph flow control: branching skills use directed graphs as single source of truth for decision logic.',
        links: [
          { label: 'dx-core skills/', url: `${DX}/tree/main/plugins/dx-core/skills` },
          { label: 'dx-aem skills/', url: `${DX}/tree/main/plugins/dx-aem/skills` },
        ],
      },
      {
        examDomain: 'D3: Claude Code Config',
        examConcept: 'CI/CD Automation (Task 3.6)',
        implementation: 'dx-automation plugin (11 skills) runs Claude Code agents as ADO pipelines triggered by AWS Lambda webhooks: Definition of Ready/Done checking, automated PR review, automated PR answering, automated bug fixing, QA agent. Fully autonomous 24/7 operation without human intervention.',
        links: [
          { label: 'dx-automation skills/', url: `${DX}/tree/main/plugins/dx-automation/skills` },
        ],
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Persistent Context Across Sessions (Task 5.1)',
        implementation: 'Spec directory convention: .ai/specs/<id>-<slug>/ with predictable filenames (raw-story.md, explain.md, research.md, implement.md). Skills discover each other\'s output by file naming convention — no explicit data passing. Config as context: single .ai/config.yaml provides project context to all skills. Shared rules in .ai/rules/ for cross-cutting concerns.',
        links: [
          { label: 'dx-core skills/', url: `${DX}/tree/main/plugins/dx-core/skills` },
        ],
      },
      {
        examDomain: 'Architecture Patterns',
        examConcept: 'Key Architectural Decisions',
        implementation: 'Config-driven design: .ai/config.yaml read at runtime, never hardcoded (avoids stale documentation). Spec convention: .ai/specs/<id>-<slug>/ with predictable filenames (structured data for context passing). Override layers: 3-layer priority — rules > config > defaults (CLAUDE.md hierarchy and scoping). Full prefix naming: dx-core:dx-code-reviewer (explicit subagent context, no auto-inherit). Plugin edit validation: PostToolUse hook prevents plugin.json corruption (hooks for deterministic compliance). Anti-rationalization: Stop hook blocks exit if plan steps abandoned (enforcement patterns vs prompt-based guidance). Four-plugin architecture: dx-core (49 skills, platform-agnostic), dx-aem (12 skills, AEM-specific), dx-automation (11 skills, CI/CD agents), dx-hub (4 skills, multi-repo orchestration).',
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
    description: 'A 51-tool MCP server (v1.6.2) for Adobe Experience Manager with 4 MCP resources, dual transport (stdio/HTTP), multi-instance support, tool annotations, verbosity levels, and TypeScript + Zod schema-first design.',
    sections: [
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Tool Interface Design (Task 2.1)',
        implementation: '51 tools across 10 categories: Content & Text (8: getPageContent, getPageTextContent, getAllTextContent, getPageImages, updateImagePath, getNodeContent, listChildren, getPageProperties), Sites & Localization (3), Pages (5: listPages, createPage, deletePage, activatePage, deactivatePage), Components (7: createComponent, addComponent, updateComponent, deleteComponent, scanPageComponents, bulkUpdateComponents, convertComponents, bulkConvertComponents), Assets (3: getAssetMetadata, updateAsset, deleteAsset), Search (3: searchContent, executeJCRQuery, enhancedPageSearch), Templates (2), Workflows (8: listWorkflowModels, startWorkflow, listWorkflowInstances, getWorkflowInstance, updateWorkflowInstanceState, getInboxItems, completeWorkItem, delegateWorkItem, getWorkItemRoutes), Content Fragments (4: getContentFragment, listContentFragments, manageContentFragment, manageContentFragmentVariation), Experience Fragments (4: getExperienceFragment, listExperienceFragments, manageExperienceFragment, manageExperienceFragmentVariation). Tool annotations include group, readOnly, and complexity metadata for intelligent agent tool selection.',
        links: [
          { label: 'mcp.tools.ts', url: `${AEM}/blob/main/src/mcp/mcp.tools.ts` },
          { label: 'mcp.aem-handler.ts', url: `${AEM}/blob/main/src/mcp/mcp.aem-handler.ts` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'MCP Resources vs Tools (Task 2.1)',
        implementation: '4 MCP resource types for upfront catalog discovery: AEM Components, AEM Sites, AEM Templates, AEM Workflow Models. URI scheme: aem://{instance}/{key}. Resources provide read-only catalog data without consuming tool-call tokens — the key MCP distinction between resources (discovery/context) and tools (actions). Enables agents to understand available AEM content before making tool calls.',
        links: [
          { label: 'mcp.resources.ts', url: `${AEM}/blob/main/src/mcp/mcp.resources.ts` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Structured Error Responses (Task 2.2)',
        implementation: 'Custom AEMOperationError class with 17 typed error codes categorized as: Transient/retryable (CONNECTION_FAILED, TIMEOUT, RATE_LIMITED, SYSTEM_ERROR), Validation/not retryable (INVALID_PATH, INVALID_COMPONENT_TYPE, INVALID_LOCALE, INVALID_PARAMETERS), Permission/not retryable (AUTHENTICATION_FAILED, UNAUTHORIZED, INSUFFICIENT_PERMISSIONS), Business/not retryable (RESOURCE_NOT_FOUND, COMPONENT_NOT_FOUND, PAGE_NOT_FOUND, UPDATE_FAILED, VALIDATION_FAILED, REPLICATION_FAILED, QUERY_FAILED). Error responses include suggestion and alternatives fields enabling self-healing agent workflows. MCP responses use isError: true (never throw exceptions or return empty strings).',
        code: '// HTTP status mapping:\n// 401 -> AUTHENTICATION_FAILED (not recoverable)\n// 403 -> INSUFFICIENT_PERMISSIONS (not recoverable)\n// 404 -> RESOURCE_NOT_FOUND (not recoverable)\n// 429 -> RATE_LIMITED (recoverable, retryAfter)\n// 500/502/503 -> SYSTEM_ERROR (recoverable, 30s retry)',
        links: [
          { label: 'aem.errors.ts', url: `${AEM}/blob/main/src/aem/aem.errors.ts` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Automatic Retry with Exponential Backoff',
        implementation: 'safeExecute() function: for each attempt (up to maxRetries=3), try operation, on failure check error.recoverable — if not recoverable or max retries reached, throw; otherwise wait error.retryAfter or 2^attempt * 1000ms. Distinguishes retryable (transient) from non-retryable (validation/permission).',
        links: [
          { label: 'aem.connector.ts', url: `${AEM}/blob/main/src/aem/aem.connector.ts` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'MCP Transport Mechanisms (Task 2.4)',
        implementation: 'Dual transport: stdio (-t stdio, for IDE integration via npx — zero install) and HTTP (-t http, for persistent shared server, team environments). Stdio safety: logger writes to stderr only (never stdout) to prevent corrupting JSON-RPC stream.',
        links: [
          { label: 'mcp.stdio.ts', url: `${AEM}/blob/main/src/mcp/mcp.stdio.ts` },
          { label: 'mcp.server-handler.ts', url: `${AEM}/blob/main/src/mcp/mcp.server-handler.ts` },
        ],
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Multi-Instance & Dynamic Schemas',
        implementation: 'Automatic instance parameter injection via injectInstanceParam() — dynamically adds an "instance" parameter to all tool schemas when multi-instance is active. Adaptive tool schemas that change shape based on configuration. Each instance gets independent handler. Default instance when parameter omitted.',
      },
      {
        examDomain: 'D2: Tool Design & MCP',
        examConcept: 'Schema-First Tool Design (Task 2.1)',
        implementation: 'Zod schemas are the single source of truth: converted to JSON Schema for MCP protocol and used for runtime input validation. Properties include .describe() for field documentation. Three-layer architecture: CLI layer (argument parsing, transport selection) → MCP layer (protocol handling, tool/resource registration) → AEM layer (domain managers, auth, HTTP). TypeScript throughout with esbuild for production builds.',
        links: [
          { label: 'mcp.tools.ts', url: `${AEM}/blob/main/src/mcp/mcp.tools.ts` },
        ],
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Token-Aware Response Filtering (Task 5.1)',
        implementation: 'Verbosity parameter (summary/standard/full) on content-reading tools controls response size — reduces token consumption for agent context windows. Response filtering via filterProperties/filterNodeTree strips JCR internals and truncates long text. MCP resources provide upfront catalog data without consuming tool-call tokens. Consistent response shape: Success {success, operation, timestamp, data}, Error {success, operation, timestamp, error: {code, message, recoverable}}.',
        links: [
          { label: 'aem.filter.ts', url: `${AEM}/blob/main/src/aem/aem.filter.ts` },
        ],
      },
      {
        examDomain: 'Comparison',
        examConcept: 'AEM MCP vs MoltBook MCP',
        implementation: 'AEM MCP: 51 tools + 4 resources, stdio+HTTP, Basic+OAuth S2S auth, multi-instance, 17 typed error codes with suggestions/alternatives, built-in exponential backoff, Zod schemas, tool annotations, verbosity levels. MoltBook MCP: 41 tools, stdio+HTTP (auto-detect), API key+JWT auth, per-session API keys via AsyncLocalStorage, JSON-RPC error codes, client-side retry, JSON Schema objects, optional TLS/HTTPS. Both demonstrate MCP tool design, transport selection, error handling, and credential management with different architectural trade-offs.',
      },
      {
        examDomain: 'Architecture Patterns',
        examConcept: 'AEM MCP Architecture Layers',
        implementation: 'Client (IDE/Agent) → Transport (Stdio or HTTP) → MCP Server (mcp.server.ts: Initialize/ListTools/CallTool/ListResources/ReadResource handlers) → InstanceRegistry (multi-instance) → MCPRequestHandler (mcp.aem-handler.ts: Zod validation + tool dispatch) → Domain Managers (AEMConnector, ContentFragmentManager, ExperienceFragmentManager) → safeExecute() with retry → AEMFetch (auth-aware HTTP client) → Auth (Basic or OAuth S2S via Adobe IMS) → AEM Instance.',
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
    description: 'A live German parliament simulation (v1.7.5) with 6 autonomous AI party agents, Anthropic Batch API for 50% cost savings, 19-step daily loop, token-budgeted context with priority tiers, and a Turborepo monorepo (engine + API + web + types).',
    sections: [
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Agentic Loop Implementation (Task 1.1)',
        implementation: 'Daily simulation loop: while(running) { await runDay(); checkProviderLimits(); sleep(timingPreset); }. Single day execution has 19 stages: bill pipeline advancement, party agent calls (6 parallel via Batch API, one per party), vote tallying (seat-weighted with human override), economic drift, opinion updates, media generation (3 articles), crisis management, elections, coalition negotiations (multi-round with Sonnet synthesis and algorithmic fallback), referendums, polls, citizen participation (questions, proposals, MdB applications), notifications + event queue. Fairness checks stop simulation when AI failures create unfair outcomes (e.g., 5 Anthropic parties fail but xAI succeeds).',
        links: [
          { label: 'loop.ts', url: `${KI}/blob/main/packages/engine/src/simulation/loop.ts` },
          { label: 'party-agent.ts', url: `${KI}/blob/main/packages/engine/src/agent/party-agent.ts` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Multi-Agent Orchestration (Task 1.2)',
        implementation: '6 autonomous party agents with distinct ideologies and personality profiles, each driven by its own model configuration. Agents propose legislation, debate bills, form coalitions, hold elections, and respond to national crises without human intervention. Multi-provider routing: Anthropic (Haiku 4.5 + Sonnet 4.5) and xAI (Grok 3 Mini) via Vercel AI SDK v6.',
        links: [
          { label: 'party-agent.ts', url: `${KI}/blob/main/packages/engine/src/agent/party-agent.ts` },
          { label: 'model-config.ts', url: `${KI}/blob/main/packages/engine/src/agent/model-config.ts` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Batch API Cost Optimization (Task 1.2)',
        implementation: 'All Anthropic calls use the Message Batches API for 50% cost reduction. Calls grouped into 4-6 batch phases per day. Batch client handles variable latency (2-4 poll cycles at normal load, 10-16 at high load, observed up to 17 min for MdB seat batches). Partial batch failure detection prevents silent data loss. Semantic retry: when actions parse as valid JSON but fail semantic validation, the system re-prompts the LLM once with structured error feedback before falling back.',
        links: [
          { label: 'batch-client.ts', url: `${KI}/blob/main/packages/engine/src/agent/batch-client.ts` },
        ],
      },
      {
        examDomain: 'D1: Agentic Architecture',
        examConcept: 'Provider Circuit Breaker (Task 1.5)',
        implementation: 'Hard limits: on "usage limits reached" error, store resetAt timestamp, block ALL calls to that provider until reset, throw AIProviderLimitError. Transient errors (429, network): retry with exponential backoff [2s, 5s], max 2 retries (3 total attempts). Provider fallback: if allProvidersLimited(), pause simulation with user message (graceful degradation, not crash). Per-provider rate limit tracking with TTL-based auto-reset; provider auth failure detection.',
        links: [
          { label: 'client.ts', url: `${KI}/blob/main/packages/engine/src/agent/client.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'Structured Output via JSON (Task 4.3)',
        implementation: 'System prompt enforces full JSON schema with all 11 action types. Explicit constraint numbers (budget +/-1B, unemployment +/-0.1%). Warnings about common LLM quirks (trailing commas, +0.5 instead of 0.5). Real-world lesson: Anthropic\'s structured output hit schema complexity limits (27 optional params, grammar compilation timeouts) — fell back to prompt-based JSON generation with multi-stage sanitization pipeline.',
        links: [
          { label: 'prompt.ts', url: `${KI}/blob/main/packages/engine/src/agent/prompt.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'JSON Sanitization Pipeline (Task 4.4)',
        implementation: 'parseAIJson() pipeline: Raw LLM output → stripCodeFences() → JSON.parse() → [on failure]: stripLeadingPlusInNumbers() (+0.5 → 0.5) → stripTrailingCommas() ({a:1,} → {a:1}) → JSON.parse() retry → validateActions() → [on failure]: semantic retry with structured error feedback → [final failure]: abstain on all (graceful degradation). Per-module fallback policies define what happens on failure (e.g., party agent fails → abstain all votes; negotiation synthesis fails → algorithmic findBestCoalition()).',
        links: [
          { label: 'action-parser.ts', url: `${KI}/blob/main/packages/engine/src/agent/action-parser.ts` },
          { label: 'ai-json.ts', url: `${KI}/blob/main/packages/engine/src/agent/ai-json.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'Hand-Crafted Persona Prompts (Task 4.2)',
        implementation: '20 numbered rules with explicit behavior examples. Each party gets a 200-300 token personality profile with voice, strategy, red lines, and relationship dynamics. Impact constraint values as concrete numbers. Action type schemas with example values. JSON hardening rules in system prompts: explicit instructions against code fences, leading +, trailing commas.',
        links: [
          { label: 'prompt.ts', url: `${KI}/blob/main/packages/engine/src/agent/prompt.ts` },
          { label: 'party-profiles.ts', url: `${KI}/blob/main/packages/engine/src/agent/party-profiles.ts` },
        ],
      },
      {
        examDomain: 'D4: Prompt Engineering',
        examConcept: 'Token-Budgeted Context Assembly (Task 4.5, 5.1)',
        implementation: 'Priority-based context assembly with three depth presets: low (~$0.020/day), normal (~$0.028/day), high (~$0.040/day). P1 (always): current day, party info, coalition/opposition, economy, bills, crises, government. P1.25-P1.5: era summaries (compressed 60-day political history), daily briefing. P2 (if budget allows): events, media, proposals. P3 (dropped if over budget): motions, interpellations, challenges. Token estimation: ~4 chars/token. Explicit per-day cost tracking.',
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
        examConcept: 'Era Summaries — Context Compression (Task 5.1)',
        implementation: 'Every 60 simulation days, raw event data is compressed into era summaries with structured case facts. These replace verbose event logs in agent context — a form of lossy context compression that preserves decision-relevant information while dramatically reducing token count. 30-day event windows compressed into daily narrative briefings for agent consumption.',
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Human-in-the-Loop (Task 5.4)',
        implementation: 'MdB (Member of Bundestag) system: users join parties, apply for Bundestag seats. AI reviews applications (max 3/party/day). Humans can override AI votes on individual bills. Citizen participation: questions (with bot moderation, dedup/spam filtering), proposals. Discipline system: AI tracks voting against party line → warn → restrict → whip → expel.',
      },
      {
        examDomain: 'D5: Context Management',
        examConcept: 'Structured Logging / Observability',
        implementation: 'logAICall() pattern: [AI] agent:spd | anthropic/claude-haiku-4-5 | 847ms | OK. Every call logged with: task, provider/model, latency, parse/validation status, input/output tokens. AI calls table in SQLite for historical analysis. Observability through the coordinator — all agent communication visible for debugging.',
      },
      {
        examDomain: 'Architecture Patterns',
        examConcept: 'Key Patterns Summary',
        implementation: 'Turborepo monorepo: 4 packages (types ← engine ← api, web standalone). Agentic loop: 19-step runDay() with fairness checks. Batch API: 50% cost savings via Anthropic Message Batches, grouped into 4-6 phases/day. Multi-model: Haiku (daily) + Sonnet (synthesis) + Grok (alternative provider). Structured output: JSON schema in system prompt + parseAIJson() sanitization + semantic retry + per-module fallback. Token budgeting: priority-based context (P1-P3) with three cost presets. Era compression: 60-day summaries replace raw events. Circuit breaker: per-provider limits with TTL auto-reset. Human-in-the-loop: MdB overrides + citizen participation + AI discipline. Graceful degradation: parse failure → abstain (not crash). Built with Claude Code (153 PRs, v1.0→v1.7.5 in 5 days).',
      },
    ],
  },
];

export default myProjects;

# CCA-F Exam Coverage Analysis

> Auto-generated review of personal projects, learning materials, and exam readiness.

## Exam Structure

- **5 domains**, weighted: D1 (27%), D2 (18%), D3 (20%), D4 (20%), D5 (15%)
- **6 scenarios**, 4 randomly presented per exam
- **Pass score:** 720/1000
- Scenario-based, tests application and judgment over memorization

---

## Personal Projects & Domain Coverage

### Domain Coverage Matrix

| Domain | Weight | DX Plugins | AEM MCP | KI-Bundestag | Strength |
|--------|--------|-----------|---------|--------------|----------|
| **D1: Agentic Architecture** | 27% | Coordinator-subagent, model tiering, hooks, workflow enforcement | - | Agentic loop, circuit breaker, multi-model strategy | Strong |
| **D2: Tool Design & MCP** | 18% | Multi-level MCP scoping, env vars, tool prefixes | 46 tools, 17 error codes, Zod schemas, dual transport, retry logic | - | Very Strong |
| **D3: Claude Code Config** | 20% | CLAUDE.md hierarchy, 10 rule files, 77+ skills, 3-layer overrides, CI/CD automation | - | - | Strong |
| **D4: Prompt Engineering** | 20% | Few-shot classification examples, confidence scoring, output templates, anti-pattern guards, self-healing retry loops | Zod `.describe()`, tool disambiguation, error suggestions | JSON schema, Batch API, few-shot rules, semantic retry-with-feedback, token-budgeted context | Very Strong |
| **D5: Context Management** | 15% | - | Structured responses | Progressive summarization with case facts, multi-provider resilience, human-in-the-loop, era-based token budgeting | Strong |

### Project 1: DX Plugin System (D1, D2, D3)

**Repo:** https://github.com/easingthemes/dx-aem-flow

**D1 - Agentic Architecture:**
- Coordinator-subagent pattern: dx-req-all, dx-step-all, dx-bug-all, dx-figma-all coordinator skills managing delegation, error handling, result aggregation
- Model tiering: Opus (code reviewer) for deep reasoning, Sonnet (PR reviewer, step executor) for analysis, Haiku (file resolver, doc searcher) for lookups
- Workflow enforcement via hooks: SessionStart (initialize), PreToolUse (git branch protection, feature/* naming), PostToolUse (plugin.json validation), Stop (anti-rationalization guard)
- Subagent spawning with full prefixed names (no auto-inherit): `dx-dev-experience:dx-code-reviewer`
- Tool distribution: executor agent restricted to Read/Write/Edit/Bash/Glob/Grep (NO MCP, NO Task)

**D2 - Tool Design & MCP:**
- Multi-level MCP scoping: project .mcp.json (context7, ado) + plugin dx-dev .mcp.json (axe-mcp-server, figma) + plugin dx-aem .mcp.json (AEM, chrome-devtools)
- `${AEM_INSTANCES}` env var expansion with secrets in settings.local.json (gitignored)
- Full tool prefix naming: `mcp__plugin_dx-dev-experience_figma__get_screenshot`

**D3 - Claude Code Config:**
- Root CLAUDE.md (8720 bytes) with project commands, build pipeline, conventions, DX workflow, ADO MCP usage
- Plugin CLAUDE.md (9000+ bytes) with plugin architecture, testing, conventions
- Agent memory: `.claude/agent-memory/*/MEMORY.md` for per-agent learned context
- 10 rule files in `.claude/rules/`: accessibility (WCAG 2.1 AA), fe-javascript, fe-styles (Dart Sass), fe-clientlibs, naming, reuse-first, ado-service-hooks, audit, dx-agents, qa-basic-auth
- 77+ skills with YAML frontmatter (context, allowed-tools, argument-hint)
- 3-layer override system: `.ai/rules/` > `config.yaml` > plugin defaults
- Custom specifications: `.ai/specs/<id>-<slug>/` with predictable filenames
- CI/CD automation: dx-automation plugin runs Claude Code agents as ADO pipelines

**D4 - Prompt Engineering (via Claude Code skills/rules):**
- Confidence-based filtering: code reviewer uses explicit scoring (>=80 to report, <75 drop) — self-evaluation before output
- **Few-shot classification examples**: 4 concrete input→output examples in `dx-code-reviewer.md` covering REPORT and DROP verdicts across Java/HTL/JS/TS — demonstrates reasoning for ambiguous cases (e.g., unclosed ResourceResolver = critical REPORT at 90, `@ context='html'` on RTE content = DROP at 35 because it's a standard trusted-author pattern)
- Exact output format templates: `Return EXACTLY this structure` with file:line references, severity, confidence, fix
- Anti-pattern guard tables: rationalizations-to-reject in dx-step-fix ("The same fix might work if we retry" → "Heal must try a DIFFERENT approach")
- Pragmatism question filtering: 8 rules controlling when LLM should vs shouldn't ask questions ("only ask if blocking")
- DOT digraph flow control: branching execution logic as graph nodes instead of numbered steps
- Self-healing retry loops: dx-step-verify runs up to 3 review-fix cycles before reporting FAIL
- Error classification taxonomy: TRANSIENT (retry 2x backoff) / VALIDATION (attempt ONE fix) / PERMANENT (stop immediately)
- Subagent prompt assembly: multi-source context construction (reviewer instructions + implementation summary + requirements + git range + previous review cycle)

### Project 2: AEM MCP Server (D2, D4, D5)

**Repo:** https://github.com/easingthemes/aem-mcp-server

**D2 - Tool Design & MCP:**
- 46 tools across 8 categories: Content & Text (5), Sites & Localization (3), Pages (8), Components (8), Assets (3), Search (3), Templates (2), Workflows (9)
- Tool descriptions include intelligent behavior and common examples
- Purpose-specific tools (updateComponent, scanPageComponents, createComponent) not monolithic
- Structured error responses: 17 typed error codes (CONNECTION_FAILED, TIMEOUT, RATE_LIMITED, INVALID_PATH, INVALID_COMPONENT_TYPE, INVALID_LOCALE, AUTHENTICATION_FAILED, UNAUTHORIZED, INSUFFICIENT_PERMISSIONS, RESOURCE_NOT_FOUND, COMPONENT_NOT_FOUND, PAGE_NOT_FOUND, UPDATE_FAILED, VALIDATION_FAILED, REPLICATION_FAILED, QUERY_FAILED, SYSTEM_ERROR)
- Error category classification: transient/retryable vs validation/not retryable vs permission/not retryable vs business/not retryable
- Automatic retry with exponential backoff: `safeExecute()` with maxRetries=3, `error.recoverable` check, `retryAfter` or `2^attempt * 1000ms` backoff
- Dual transport: stdio (IDE integration via npx, zero install) and HTTP (persistent shared server, team environments)
- Stdio safety: logger writes to stderr only (never stdout) to prevent corrupting JSON-RPC stream
- Multi-instance support: automatic parameter injection into all tool schemas
- Zod schemas for tool input validation with JSON Schema conversion

**D4 - Prompt Engineering (via tool design):**
- Tool description disambiguation: negative guidance ("For text-only extraction, use getPageTextContent. For raw JCR nodes, use getNodeContent") steers LLM away from wrong tools
- Zod `.describe()` per parameter: semantic hints and example values (`'Path to the existing page (e.g., /content/site/en/page)'`)
- Error suggestions with alternatives: `ERROR_SUGGESTIONS` map gives LLM actionable recovery hints when operations fail ("Check the component resourceType spelling. Use getComponents to list all available components.")
- Response verbosity filtering: three levels (summary/standard/full) with truncation hints (`'...[truncated, use getNodeContent for full]'`)
- Tool annotations: group/readOnly/complexity metadata exposed to LLM for tool selection reasoning
- Server-level `instructions` field: top-level MCP prompt context for multi-instance awareness

**D5 - Context Management:**
- Consistent response shape: Success `{success, operation, timestamp, data}`, Error `{success, operation, timestamp, error: {code, message, recoverable}}`
- Structured tool responses enabling agent reasoning about success/failure

### Project 3: KI-Bundestag (D1, D4, D5) + Batch API

**Repo:** https://github.com/easingthemes/ki-bundestag

**D1 - Agentic Architecture:**
- Agentic loop implementation: daily simulation `while(running) { await runDay(); checkProviderLimits(); sleep(timingPreset); }`
- Single day: 10 stages (bill pipeline, party agent calls [6 parallel], vote tallying [seat-weighted + human override], economic updates, opinion updates, media generation [Haiku -> 3 articles], crisis management, elections, coalition negotiations [3 rounds, Sonnet synthesis], notifications + event queue)
- Multi-model strategy: Haiku for daily ops, Sonnet for high-reasoning synthesis, Grok-3-mini as alternative
- Provider circuit breaker: hard limits -> store resetAt timestamp -> block ALL calls until reset, transient errors -> exponential backoff [2s, 5s] max 2 retries

**D4 - Prompt Engineering:**
- Structured output via JSON schema: system prompt enforces full schema with 11 action types, explicit constraint numbers, negative capability instructions ("You CANNOT: ...")
- JSON sanitization pipeline: Raw LLM -> stripCodeFences() -> JSON.parse() -> [on failure]: stripLeadingPlusInNumbers() (char-by-char state machine) -> stripTrailingCommas() -> JSON.parse() retry -> validateActions() -> [on failure]: abstain on all
- Few-shot pattern: compact inline example (`EXAMPLE (2 votes + 1 statement): {"actions":[...]}`) + 12-18 dynamically numbered rules with explicit behavior constraints
- Capability-aware schema: only action types the party can perform are included in the JSON schema, preventing hallucinated actions
- Per-party persona profiles: 6 detailed profiles (SPD, CDU, Gruene, FDP, AfD, Linke) with voice, strategy, red lines, relationships injected into system prompt
- Explicit criteria: numerical constraints (budget +/-1B, unemployment +/-0.1%) instead of vague "be reasonable"
- **Semantic retry-with-feedback**: `validateActions()` returns structured `ValidationResult` with typed `ValidationError[]` (actionIndex, actionType, message, fixable flag). `attemptSemanticRetry()` re-prompts once with specific errors appended ("action #2 budget_impact +5 exceeds ±1 constraint"). Single retry only, fixable errors trigger retry, unfixable errors (no seats, structural impossibility) skip retry. Falls back to original valid actions if retry fails. Works in both sequential `callAI` and Batch API paths. Costs tracked via `:semantic-retry` suffix in `logAICall()`
- Parse-level retry: full sequential `callAI` retry on JSON parse failure before deterministic abstain fallback; auto-fills missing mandatory votes with abstain
- Token-budgeted context: 3 depth configs (low: 3K, normal: 8K, high: 16K tokens) with greedy priority allocation (P1 always, P2/P3 budget-trimmed), token estimation at ~4 chars/token, trimming indicator appended when sections dropped
- **Batch API (real Anthropic Message Batches API):** `client.messages.batches.create()` submits all 6 party agents as a single batch with `custom_id` per party, polls with adaptive intervals (15s→30s→60s) until `"ended"`, streams results via `.results()`, tracks costs with batch pricing flag (50% discount). Multi-provider split: Anthropic requests → real Batches API, xAI requests → sequential `callAI()` fallback, both via `Promise.all()`
- Group prompt builders: batch prompts for MdB application selection, speech flagging, citizen question answering, proposal ranking — each with role + numbered criteria + strict JSON schema

**D5 - Context Management:**
- **Progressive summarization**: `era-summary.ts` compresses older simulation days into AI-generated narrative summaries every 60 days (configurable per depth level). Summaries stored persistently in DB with `id: era-{startDay}-{endDay}`. Triggered in `loop.ts` during party agent phase via `shouldGenerateEraSummary()` → `buildEraSummaryBatchRequest()` → `processEraSummaryResult()`
- **Case facts preservation**: `EraCaseFacts` interface with economy (budget, unemployment, inflation, GDP, sentiment), coalition, government, party approvals/seats, bills passed/rejected, elections, crises, government changes — extracted from DB (ground truth, never AI-compressed). 3 most recent eras always get full case facts regardless of token budget
- **Era summary token budgeting**: integrated into `buildUserPrompt()` as `HISTORICAL CONTEXT` section with per-depth limits (low: 500, normal: 1500, high: 3000 tokens). Uses `estimateTokens()` (~4 chars/token) for greedy allocation across eras
- Multi-provider resilience: Anthropic + xAI per-provider rate limit tracking with TTL
- Human-in-the-loop: MdB system where users join parties, apply for seats, override AI votes, AI discipline tracking
- Structured logging: `logAICall()` pattern `[AI] agent:spd | anthropic/claude-haiku | 847ms | OK`

---

## Learning Material Assessment

### Quiz Coverage (59 Questions)

| Section | Questions | Primary Domains | Focus |
|---------|-----------|----------------|-------|
| S1: CI Integration | 15 | D3, D4 | Batch API, structured output, severity calibration, multi-pass review |
| S2: Support Agent | 15 | D2, D5 | Tool descriptions, error handling, escalation, human-in-the-loop |
| S3: Code Generation | 15 | D3 (9/15!) | CLAUDE.md, rules, skills, hooks, plan mode |
| S4: Multi-Agent Research | 14 | D2, D5 | Tool constraints, error propagation, context pruning, coverage annotations |

### Quiz Questions by Domain

| Domain | S1 | S2 | S3 | S4 | Total |
|--------|----|----|----|----|-------|
| D1: Agentic Architecture | 2 | 3 | 2 | 3 | 10 |
| D2: Tool Design & MCP | 3 | 5 | 2 | 4 | 14 |
| D3: Claude Code Config | 3 | 2 | 9 | 0 | 14 |
| D4: Prompt Engineering | 5 | 2 | 2 | 2 | 11 |
| D5: Context Management | 2 | 3 | 0 | 5 | 10 |

### Study Materials Included

- 8-phase study plan covering all domains progressively
- Cheatsheets for all 5 domains (patterns, configs, decision matrices)
- Architect's Playbook (10 visual diagram pages)
- Cross-references between quiz questions and domain task statements (bidirectional)
- Official + community resource links (Anthropic Academy, API docs, cookbooks)

---

## Readiness Summary

### Strengths (100% of exam weight covered by projects)

- **D1 (27%)**: Real coordinator-subagent patterns, model tiering, hooks for enforcement, agentic loops with stop conditions across 2 projects
- **D2 (18%)**: Production MCP server with 46 tools, typed error codes, retry with exponential backoff, multi-instance support — exceptional coverage
- **D3 (20%)**: Full CLAUDE.md hierarchy, path-scoped rules, 77+ skills with YAML frontmatter, CI/CD automation — very thorough
- **D4 (20%)**: All 6 task statements covered across 3 projects — DX Plugins (4 few-shot classification examples with reasoning, confidence scoring, output templates, self-healing retry loops), KI-Bundestag (Batch API, JSON schema enforcement, semantic retry-with-feedback with `ValidationResult`/`ValidationError` types, token-budgeted context), AEM MCP (tool disambiguation, Zod `.describe()`, error suggestions, verbosity filtering)
- **D5 (15%)**: KI-Bundestag now has progressive summarization (60-day era intervals, AI-generated narrative summaries, `EraCaseFacts` preservation from DB, era token budgeting at 500/1500/3000 per depth), plus multi-provider resilience, human-in-the-loop, structured logging

### Previously Identified Gaps — Now Closed

- ~~**D4 — True few-shot examples**~~ → **Implemented** in DX Plugins: 4 input→output examples in `dx-code-reviewer.md` (Java ResourceResolver leak = REPORT 90, HTL `@ context='html'` = DROP 35, JS silent fetch failure = REPORT 85, TS optional chaining = DROP 40)
- ~~**D4 — Semantic retry-with-feedback**~~ → **Implemented** in KI-Bundestag: `validateActions()` returns `ValidationResult` with `ValidationError[]` (fixable flag per error). `attemptSemanticRetry()` re-prompts once with specific errors. Works in both sequential and Batch API paths
- ~~**D5 — Progressive summarization**~~ → **Implemented** in KI-Bundestag: `era-summary.ts` compresses older days every 60 simulation days. `EraCaseFacts` (economy, coalition, bills, elections, crises) extracted from DB as ground truth. Summaries stored persistently, injected as `HISTORICAL CONTEXT` with per-depth token budgets. 3 most recent eras always get full case facts

### Remaining Study Focus

1. **D4 — Multi-instance review framing**: DX has separate reviewer subagent (dx-step-verify → dx-code-reviewer), which is the right architecture — be ready to articulate *why* self-review fails (retained reasoning context = confirmation bias)
2. **Practice more scenarios** — 59 questions is decent but tight for a 720/1000 pass score. The exam randomly picks 4 of 6 scenarios, so no topic can be skipped
3. **Articulate the "why"** — S3 is D3-heavy (9/15 questions) and your DX Plugin project covers it well, but exam tests judgment and trade-offs, not just knowledge of configs
4. **Focus on high-impact patterns** — Prompt failure rate ~3% justifying hooks over prompts, 90%+ confidence threshold for automation, lost-in-the-middle effect, token budgeting with priority-based slicing

---

## External Study Resources

### Exam Details

- **Format:** 60 multiple-choice questions, 120 minutes, proctored via ProctorFree (closed-book, no AI)
- **Cost:** $99 (free for first 5,000 Claude Partner Network employees)
- **Registration:** Through Anthropic Academy on Skilljar
- **Launched:** March 12, 2026 — Anthropic's first official technical certification
- **Tip from passers:** Aim for >900/1000 on the official practice exam before scheduling the real one

### Anthropic Academy (Free, on Skilljar)

13 free self-paced courses with certificates at [anthropic.skilljar.com](https://anthropic.skilljar.com/):

| Course | Relevance | Details |
|--------|-----------|---------|
| **Building with the Claude API** | Core | 84 lectures, 8+ hours, 10 quizzes |
| **Introduction to MCP** | D2 | Build MCP servers/clients, tools/resources/prompts primitives |
| **Advanced MCP** | D2 | Sampling, notifications, file system access, transport mechanisms |
| **Claude Code in Action** | D3 | ~1 hour, 21 lessons on Claude Code in dev workflows |
| **Introduction to Agent Skills** | D3 | Building, configuring, and sharing Skills |
| **Sub-agents in Claude Code** | D1 | Using and creating sub-agents, context delegation |
| **Building with Claude on Vertex AI** | General | Cloud deployment track |

### Official Practice Materials (via Skilljar after registration)

Access requires: Join Claude Partner Network (free) → register at [anthropic.skilljar.com](https://anthropic.skilljar.com/) → materials appear in your dashboard.

- **12 sample questions** in the official CCA-F Exam Guide PDF
- **60-question practice test** (same scenario format as real exam, with answer explanations)

### Free Community Resources

- [claudecertifications.com](https://claudecertifications.com/) — Free study guides, 25 practice questions across all 5 domains, scenario walkthroughs, 12-week prep plan
- [DEV Community - Inside Anthropic's CCA Program](https://dev.to/mcrolly/inside-anthropics-claude-certified-architect-program-what-it-tests-and-who-should-pursue-it-1dk6) — Detailed breakdown of what each domain tests
- [Towards AI - Complete Guide to Passing CCA-F](https://pub.towardsai.net/claude-certified-architect-the-complete-guide-to-passing-the-cca-foundations-exam-9665ce7342a8)
- [Medium - CCA-F Preparation Guide](https://dynamicbalaji.medium.com/claude-certified-architect-foundations-certification-preparation-guide-c70546b51f51)
- [AI.cc - CCA-F Exam Guide & Prep Strategy](https://www.ai.cc/blogs/claude-certified-architect-foundations-cca-f-exam-guide-2026/)
- [LowCode Agency - How to Become a Claude Certified Architect](https://www.lowcode.agency/blog/how-to-become-claude-certified-architect)
- [Analytics Vidhya - Top 7 Free Anthropic AI Academy Courses](https://www.analyticsvidhya.com/blog/2026/03/free-anthropic-ai-courses-with-certificates/)
- [FlashGenius - Ultimate Guide to CCA-F Certification](https://flashgenius.net/blog-article/a-guide-to-the-claude-certified-architect-foundations-certification)

### Paid Practice Questions

- [ClaudeCertified.com](https://claudecertified.com/cca-practice-questions) — 105 expert-vetted practice questions ($11, free 5-question sample)
- [Udemy](https://www.udemy.com/course/claude-certified-architect-certification-practice-tests/) — Multiple practice test courses
- [CertSafari](https://www.certsafari.com/anthropic/claude-certified-architect) — 360 exam-style practice questions
- [Tutorials Dojo](https://tutorialsdojo.com/cca-f-claude-certified-architect-foundations-study-guide/) — Study guide and practice exams with explanations

### Community Tips from Those Who Passed

- **Prep time:** 2-4 weeks of focused study (20-30 hours) for those already building with Claude daily
- **Key insight:** This is a systems design exam, not a prompting fundamentals test. Over 45% is concentrated in agentic architecture and code configuration
- **Anti-patterns matter:** Wrong answers are deliberately designed as plausible architectural anti-patterns — knowing what NOT to do is critical
- **Heavily tested:** Tool use/function calling, MCP at implementation level, context window optimization, human-in-the-loop workflow design
- **Hands-on required:** Course completion alone is not sufficient — the exam expects real production development experience

import myProjectsData from '@/projects';

// =============================================================================
// examData.js — Central Data File for CCA-F Exam Prep Dashboard
// =============================================================================
// All page content comes from this single file.
// Converted from markdown study materials in the parent directory.
//
// HOW TO TRACK PROGRESS:
// Edit this file directly. No database or localStorage needed.
//
// 1. Study plan phases:
//    - Change phase status: 'pending' → 'in_progress' → 'completed'
//    - Change step item status: 'pending' → 'completed'
//
// 2. Domain task statements:
//    - After studying a task statement on a domain page,
//      change its status: 'pending' → 'reviewed'
//    - The dashboard domain cards show X/Y based on this
//
// 3. Scenario checklists:
//    - Change checked: false → true as you complete each item
//
// The dashboard reads this file at build time and shows your progress.
// =============================================================================
// =============================================================================

// =============================================================================
// STUDY PLAN
// =============================================================================

export const studyPlan = {
  goal: 'Pass the CCA-F exam (720/1000 minimum)',
  strategy: 'Theory -> Hands-on -> Scenarios -> Practice Questions',
  advantage: "You've already built production systems covering all 5 domains",
  decisionFramework: [
    { need: 'Guaranteed compliance', solution: 'Hooks/application-layer intercepts (NOT prompts)' },
    { need: 'Structured output', solution: 'tool_use + JSON schema (NOT text parsing)' },
    { need: 'Execution ordering', solution: 'tool_choice forced selection (NOT prompt instructions)' },
    { need: 'Independent review', solution: 'Separate Claude instance (NOT self-review)' },
    { need: 'Consistency', solution: 'Few-shot examples (NOT detailed prose instructions)' },
    { need: 'Cost optimization', solution: 'Batch API for async (NOT real-time for everything)' },
    { need: 'Context management', solution: 'Prune/filter tool results (NOT dump everything)' },
  ],
  phases: [
    {
      id: 0,
      name: 'Phase 0: Your Projects as Study Anchors',
      status: 'completed',
      description: 'Before starting theory, skim your project files. Every exam concept maps to something you\'ve built.',
      steps: [
        {
          name: 'Review project-to-domain mappings',
          items: [
            { name: 'DX Plugins (76 skills, 4 plugins, 10 AI platforms) — D1, D2, D3', status: 'completed', link: '/my-projects/dx-plugins' },
            { name: 'AEM MCP Server (51 tools, 4 MCP resources) — D2, D5', status: 'completed', link: '/my-projects/aem-mcp' },
            { name: 'MoltBook MCP Server (41 tools, HTTP+stdio) — D2, D4', status: 'completed', link: '/my-projects/aem-mcp' },
            { name: 'KI Project (6 AI agents, Batch API, 19-step loop) — D1, D4, D5', status: 'completed', link: '/my-projects/ki-bundestag' },
          ],
        },
      ],
    },
    {
      id: 1,
      name: 'Phase 1: Foundation (Days 1-3)',
      status: 'in_progress',
      description: 'Build conceptual understanding across all domains.',
      steps: [
        {
          name: 'Step 1.1 — Complete Anthropic Academy Courses',
          items: [
            { name: 'Course 1: Claude 101 — Core features, everyday usage', status: 'completed', link: 'https://anthropic.skilljar.com/claude-101' },
            { name: 'Course 2: Building with the Claude API — API setup, tool use, RAG, streaming, caching', status: 'in_progress', priority: 'priority', link: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api', watchFor: 'You know tool use, structured output, multi-model via Vercel AI SDK. Watch for: formal API patterns (prompt caching API, extended thinking mode, RAG) that may differ from SDK abstractions.' },
            { name: 'Course 3: Introduction to MCP — Architecture, transports, tools/resources/prompts primitives', status: 'completed', link: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol', watchFor: 'Key exam distinction: Tools = model-controlled (Claude decides when to call), Resources = application-controlled (app decides what to expose), Prompts = user-controlled (user selects a pre-built workflow).' },
            { name: 'Course 4: MCP Advanced Topics — Sampling, roots, transport mechanisms, scaling', status: 'in_progress', priority: 'priority', link: 'https://anthropic.skilljar.com/model-context-protocol-advanced-topics', watchFor: 'You implemented stdio and HTTP transports + session management in MoltBook. Watch for: Sampling (server-initiated LLM calls), Roots (file access permissions), and formal transport selection criteria.' },
            { name: 'Course 5: Claude Code in Action — Tool use, context management, custom automation, GitHub', status: 'completed', link: 'https://anthropic.skilljar.com/claude-code-in-action' },
            { name: 'Course 6: Introduction to Agent Skills — SKILL.md, frontmatter, distribution, troubleshooting', status: 'in_progress', link: 'https://anthropic.skilljar.com/introduction-to-agent-skills' },
          ],
        },
        {
          name: 'Step 1.2 — Review The Architect\'s Playbook (selective)',
          items: [
            { name: 'p1 — Hierarchy of Constraints radar (Latency/Accuracy/Cost/Compliance)', status: 'pending', priority: 'review', link: '/cheatsheets/matrix' },
            { name: 'p2 — Resilient Schemas: "other" + detail catch-all', status: 'pending', priority: 'review', link: '/cheatsheets/patterns' },
            { name: 'p3 — Schema Redundancy: calculated_total vs stated_total', status: 'pending', priority: 'review', link: '/cheatsheets/patterns' },
            { name: 'p4 — Limits of Retry: effective for format errors, ineffective for missing info', status: 'pending', priority: 'review', link: '/cheatsheets/patterns' },
            { name: 'p5 — Calibrating Human-in-the-Loop: 90% confidence threshold', status: 'pending', priority: 'review', link: '/domains/d5' },
            { name: 'p6 — Zero-Tolerance Compliance: 3% prompt failure rate, use app-layer intercepts', status: 'pending', priority: 'review', link: '/domains/d1' },
            { name: 'p7 — Graceful Tool Failure: isError: true sequence diagram', status: 'pending', priority: 'review', link: '/domains/d2' },
            { name: 'p8 — Forcing Execution Order: tool_choice API code example', status: 'pending', priority: 'review', link: '/domains/d2' },
            { name: 'p9 — Reference Matrix: constraint x domain solution lookup', status: 'pending', priority: 'review', link: '/cheatsheets/matrix' },
            { name: 'p10 — Production Architecture Blueprint: full system diagram', status: 'pending', priority: 'review', link: '/cheatsheets/matrix' },
          ],
        },
        {
          name: 'Step 1.3 — Read the Exam Guide Task Statements',
          items: [
            { name: 'Read Exam Guide PDF pages 4-17', status: 'pending' },
            { name: 'Map each task statement to Academy courses and Playbook pages', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Phase 2: Deep Dive by Domain (Days 4-8)',
      status: 'pending',
      description: 'One domain per day, weighted by exam importance.',
      steps: [
        {
          name: 'Step 2.1 — Domain 1: Agentic Architecture & Orchestration (27%)',
          items: [
            { name: 'Agentic loop lifecycle (stop_reason handling)', status: 'pending', priority: 'priority', link: '/domains/d1' },
            { name: 'Coordinator-subagent patterns (hub-and-spoke)', status: 'pending', priority: 'priority', link: '/domains/d1' },
            { name: 'Subagent spawning & context (Task tool, AgentDefinition)', status: 'pending', link: '/domains/d1' },
            { name: 'Workflow enforcement & hooks (PostToolUse, prerequisite gates)', status: 'pending', priority: 'priority', link: '/domains/d1' },
            { name: 'Task decomposition (prompt chaining vs adaptive)', status: 'pending', link: '/domains/d1' },
            { name: 'Session management (--resume, fork_session)', status: 'pending', link: '/domains/d1' },
          ],
        },
        {
          name: 'Step 2.2 — Domain 3: Claude Code Configuration & Workflows (20%)',
          items: [
            { name: 'CLAUDE.md hierarchy (user/project/directory, @import)', status: 'pending', link: '/domains/d3' },
            { name: 'Custom commands & skills (frontmatter, context: fork)', status: 'pending', link: '/domains/d3' },
            { name: 'Path-specific rules (.claude/rules/ with paths frontmatter)', status: 'pending', link: '/domains/d3' },
            { name: 'Plan mode vs direct execution decisions', status: 'pending', link: '/domains/d3' },
            { name: 'Iterative refinement (test-driven, interview pattern)', status: 'pending', link: '/domains/d3' },
            { name: 'CI/CD integration (-p flag, --output-format json)', status: 'pending', link: '/domains/d3' },
          ],
        },
        {
          name: 'Step 2.3 — Domain 4: Prompt Engineering & Structured Output (20%)',
          items: [
            { name: 'Explicit criteria design (categorical, not vague)', status: 'pending', link: '/domains/d4' },
            { name: 'Few-shot prompting (2-4 examples, ambiguous cases)', status: 'pending', link: '/domains/d4' },
            { name: 'JSON schemas & tool_choice (auto/any/forced)', status: 'pending', link: '/domains/d4' },
            { name: 'Validation & retry loops (retry-with-feedback)', status: 'pending', link: '/domains/d4' },
            { name: 'Batch processing (50% savings, 24h window, custom_id)', status: 'pending', link: '/domains/d4' },
            { name: 'Multi-pass review (independent instance, per-file + integration)', status: 'pending', link: '/domains/d4' },
          ],
        },
        {
          name: 'Step 2.4 — Domain 2: Tool Design & MCP Integration (18%)',
          items: [
            { name: 'Tool interface design (descriptions, boundaries, specificity)', status: 'pending', link: '/domains/d2' },
            { name: 'Structured error responses (isError, errorCategory, isRetryable)', status: 'pending', link: '/domains/d2' },
            { name: 'Tool distribution & tool_choice (4-5 per agent)', status: 'pending', link: '/domains/d2' },
            { name: 'MCP server integration (.mcp.json, env var expansion)', status: 'pending', link: '/domains/d2' },
            { name: 'Built-in tool selection (Grep/Glob/Read/Write/Edit)', status: 'pending', link: '/domains/d2' },
          ],
        },
        {
          name: 'Step 2.5 — Domain 5: Context Management & Reliability (15%)',
          items: [
            { name: 'Tool result pruning (filter verbose API responses)', status: 'pending', link: '/domains/d5' },
            { name: 'Prompt caching (80K+ tokens, stable prefix pattern)', status: 'pending', link: '/domains/d5' },
            { name: 'Long conversation strategies (scratchpad, stale result filtering)', status: 'pending', link: '/domains/d5' },
            { name: 'Human-in-the-loop (90% confidence threshold, per-field validation)', status: 'pending', link: '/domains/d5' },
            { name: 'Error handling & escalation (structured errors, graceful degradation)', status: 'pending', link: '/domains/d5' },
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'Phase 3: Scenario Drill-Down (Days 9-11)',
      status: 'pending',
      description: 'Practice thinking in production contexts — this is how the exam questions are framed.',
      steps: [
        {
          name: 'Step 3.1 — Work Through Each Scenario',
          items: [
            { name: 'S1: Customer Support Agent — hooks, escalation, context pruning', status: 'pending', link: '/scenarios/s1' },
            { name: 'S2: Code Generation — CLAUDE.md config, plan mode, iterative refinement', status: 'pending', link: '/scenarios/s2' },
            { name: 'S3: Multi-Agent Research — coordinator patterns, parallel subagents, shared memory', status: 'pending', link: '/scenarios/s3' },
            { name: 'S4: Developer Productivity — built-in tools, MCP specificity, scratchpad', status: 'pending', link: '/scenarios/s4' },
            { name: 'S5: CI/CD Integration — CLI flags, review criteria, multi-pass', status: 'pending', link: '/scenarios/s5' },
            { name: 'S6: Data Extraction — JSON schemas, batch API, validation, null handling', status: 'pending', link: '/scenarios/s6' },
          ],
        },
        {
          name: 'Step 3.2 — Cross-Scenario Pattern Recognition',
          items: [
            { name: 'Review patterns-vs-antipatterns cheatsheet', status: 'pending', link: '/cheatsheets/patterns' },
            { name: 'Review architect reference matrix', status: 'pending', link: '/cheatsheets/matrix' },
            { name: 'Map each pattern to applicable scenarios', status: 'pending' },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Phase 4: Practice & Self-Test (Days 12-14)',
      status: 'pending',
      description: 'Drill scenario-based questions — the Reddit 985-scorer did 60+.',
      steps: [
        {
          name: 'Step 4.1 — Work Through Practice Questions',
          items: [
            { name: 'Answer 8 provided questions without looking at answers', status: 'pending', link: '/practice' },
            { name: 'Check reasoning (not just the letter)', status: 'pending', link: '/practice' },
            { name: 'Understand WHY each distractor is wrong', status: 'pending', link: '/practice' },
          ],
        },
        {
          name: 'Step 4.2 — Create Your Own Questions (Target: 60+)',
          items: [
            { name: 'Write 10-12 scenario-based questions per domain', status: 'pending' },
            { name: 'Include 3 plausible-but-wrong distractors each', status: 'pending' },
            { name: 'Focus on trade-off decisions, not memorization', status: 'pending' },
          ],
        },
        {
          name: 'Step 4.3 — Timed Self-Test',
          items: [
            { name: 'Simulate exam conditions (no notes, no Claude)', status: 'pending' },
            { name: 'Time yourself', status: 'pending' },
            { name: 'Review wrong answers against domain notes', status: 'pending' },
          ],
        },
        {
          name: 'Step 4.4 — Final Review',
          items: [
            { name: 'Quick-reference: key-configs-and-flags cheatsheet', status: 'pending', priority: 'review', link: '/cheatsheets/configs' },
            { name: 'Quick-reference: patterns-vs-antipatterns cheatsheet', status: 'pending', priority: 'review', link: '/cheatsheets/patterns' },
            { name: 'Quick-reference: architect-reference-matrix cheatsheet', status: 'pending', priority: 'review', link: '/cheatsheets/matrix' },
          ],
        },
      ],
    },
    {
      id: 5,
      name: 'Phase 5: Exam Day',
      status: 'pending',
      description: 'Logistics and what to expect on exam day.',
      steps: [
        {
          name: 'Exam Logistics',
          items: [
            { name: 'Proctored via ProctorFree — webcam, mic, screen sharing, and stable internet required', status: 'pending' },
            { name: 'One attempt only — no retakes', status: 'pending' },
            { name: '90 minutes, 60 questions (15 per scenario, 4 scenarios)', status: 'pending' },
            { name: 'No tabs open, no Claude assistance — strictly proctored', status: 'pending' },
            { name: 'Results NOT immediate — score emailed within 2 business days', status: 'pending' },
            { name: 'Scaled score 100-1000, minimum 720 to pass', status: 'pending' },
            { name: 'Unanswered questions scored as incorrect — no penalty for guessing, answer everything', status: 'pending' },
            { name: 'All multiple choice: 1 correct answer + 3 distractors', status: 'pending' },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// DOMAINS
// =============================================================================

export const domains = [
  // ---------------------------------------------------------------------------
  // Domain 1: Agentic Architecture & Orchestration (27%)
  // ---------------------------------------------------------------------------
  {
    id: 'd1',
    name: 'Agentic Architecture & Orchestration',
    weight: 27,
    color: '#e88c30',
    taskStatements: [
      {
        id: '1.1',
        title: 'Design and implement agentic loops for autonomous task execution',
        status: 'pending',
        knowledge: [
          'Agentic loop lifecycle: send request -> inspect stop_reason -> execute tools -> return results',
          'stop_reason: "tool_use" = continue loop; stop_reason: "end_turn" = terminate',
          'Tool results appended to conversation history for model reasoning',
          'Model-driven decision-making (Claude picks tools) vs pre-configured decision trees',
        ],
        skills: [],
        antiPatterns: [
          'Parsing natural language to determine loop termination',
          'Setting arbitrary iteration caps as primary stopping mechanism',
          'Checking assistant text content as completion indicator',
        ],
        myProjectRefs: [
          'KI-Bundestag: while(running) { runDay(); checkLimits(); sleep(); } daily loop',
        ],
      },
      {
        id: '1.2',
        title: 'Orchestrate multi-agent systems with coordinator-subagent patterns',
        status: 'pending',
        knowledge: [
          'Hub-and-spoke: coordinator manages ALL inter-subagent communication',
          'Subagents have isolated context — no automatic inheritance',
          'Coordinator role: task decomposition, delegation, result aggregation',
          'Risk: overly narrow decomposition leads to incomplete coverage',
          'Multi-concern request handling: decompose into distinct concerns, investigate in parallel with shared customer context, synthesize unified resolution',
          'Sequential investigation of multi-concern requests causes redundant data fetching — parallelize with shared context instead',
        ],
        skills: [
          'Dynamic subagent selection based on query complexity (not always full pipeline)',
          'Partition research scope to minimize duplication',
          'Iterative refinement loops (evaluate -> re-delegate -> re-invoke)',
          'Route ALL communication through coordinator for observability',
          'Prompt agent to batch related tool requests per turn; return all results together before next API call to reduce round-trips',
        ],
        antiPatterns: [
          'Full pipeline for every query',
          'Step-by-step procedural instructions to subagents',
        ],
        myProjectRefs: [
          'DX Plugins: dx-req-all, dx-step-all, dx-bug-all coordinator skills',
          'KI-Bundestag: Haiku (daily ops) + Sonnet (synthesis) + Grok (alternative) model tiering',
        ],
        quizRefs: [
          { section: 's2', question: 4, label: 'S2:Q4 — Complex request decomposition and parallel investigation' },
          { section: 's4', question: 2, label: 'S4:Q2 — Reducing synthesis agent token input from 155K to 50K' },
          { section: 's4', question: 8, label: 'S4:Q8 — Coordinator delegation to specialized subagents' },
        ],
      },
      {
        id: '1.3',
        title: 'Configure subagent invocation, context passing, and spawning',
        status: 'pending',
        knowledge: [
          'Task tool for spawning subagents; allowedTools must include "Task"',
          'Subagent context must be explicitly provided in prompt (no auto-inherit)',
          'AgentDefinition config: descriptions, system prompts, tool restrictions',
          'fork_session for divergent approaches from shared baseline',
        ],
        skills: [
          'Include complete findings in subagent prompts (not references)',
          'Structured data formats to separate content from metadata',
          'Spawn parallel subagents via multiple Task calls in single response',
          'Goal-oriented delegation > step-by-step procedural instructions',
        ],
        antiPatterns: [
          'Daisy-chain full conversation logs between subagents',
        ],
        myProjectRefs: [
          'DX Plugins: agents require full prefixed names (dx-dev-experience:dx-code-reviewer), short names fail silently',
          'DX Plugins: executor agent has restricted tool access (no MCP, no Task spawning)',
        ],
      },
      {
        id: '1.4',
        title: 'Implement multi-step workflows with enforcement and handoff patterns',
        status: 'pending',
        knowledge: [
          'Programmatic enforcement (hooks, prerequisite gates) vs prompt-based guidance',
          'Deterministic compliance needs -> use hooks, NOT prompts (prompts have non-zero failure rate)',
          'Structured handoff protocols: customer ID, root cause, amount, recommended action',
          'Escalation triggers: policy gaps (guidelines silent on request), information conflicts (contradictory authoritative sources), exceeded authority (actions beyond agent scope)',
        ],
        skills: [
          'Block downstream tools until prerequisites complete (e.g., block process_refund until get_customer returns)',
          'Decompose multi-concern requests -> investigate each -> synthesize unified resolution',
          'Compile structured summaries for human escalation (not raw transcripts)',
          'Design escalation decision framework: confidence-based (below threshold → human), policy-based (gap in guidelines → human), complexity-based (multi-concern → decompose)',
        ],
        antiPatterns: [
          'Emphatic prompts for compliance ("NEVER do X")',
          'Raw transcript dumps for escalation',
        ],
        myProjectRefs: [
          'DX Plugins: PreToolUse hook blocks commits on main/master, enforces feature/* naming',
          'DX Plugins: Stop hook blocks exit if plan steps abandoned or secrets detected',
        ],
        quizRefs: [
          { section: 's2', question: 15, label: 'S2:Q15 — When to escalate: policy gaps vs available data' },
        ],
      },
      {
        id: '1.5',
        title: 'Apply Agent SDK hooks for tool call interception and data normalization',
        status: 'pending',
        knowledge: [
          'PostToolUse hooks: intercept results for transformation before model processes',
          'Hooks can enforce compliance rules (e.g., block refunds above threshold)',
          'Hooks = deterministic guarantees; Prompts = probabilistic compliance',
        ],
        skills: [
          'PostToolUse hooks to normalize data formats (Unix timestamps, ISO 8601, status codes)',
          'Interception hooks that block policy-violating actions -> redirect to escalation',
          'Choose hooks over prompts when business rules require guaranteed compliance',
        ],
        antiPatterns: [],
        myProjectRefs: [
          'DX Plugins: 8 hooks across 4 types — SessionStart, PreToolUse, PostToolUse, Stop — with three profiles (minimal/standard/strict)',
          'DX Plugins: PostToolUse validates plugin.json edits, prevents corruption',
          'KI-Bundestag: provider circuit breaker with TTL (hooks-equivalent for rate limits)',
        ],
        quizRefs: [
          { section: 's2', question: 9, label: 'S2:Q9 — PostToolUse hook for data format normalization' },
        ],
      },
      {
        id: '1.6',
        title: 'Design task decomposition strategies for complex workflows',
        status: 'pending',
        knowledge: [
          'Fixed sequential pipelines (prompt chaining) vs dynamic adaptive decomposition',
          'Prompt chaining: analyze each file individually -> cross-file integration pass',
          'Adaptive investigation plans: generate subtasks based on discoveries',
        ],
        skills: [
          'Prompt chaining for predictable multi-aspect reviews',
          'Dynamic decomposition for open-ended investigation tasks',
          'Split large code reviews: per-file local analysis + cross-file integration pass',
        ],
        antiPatterns: [],
        myProjectRefs: [
          'KI-Bundestag: 10-stage daily execution (bill pipeline -> party agents -> votes -> economy -> media -> crisis -> elections -> coalitions -> notifications)',
        ],
      },
      {
        id: '1.7',
        title: 'Manage session state, resumption, and forking',
        status: 'pending',
        knowledge: [
          '--resume <session-name> to continue prior conversations',
          'fork_session for parallel exploration branches (A/B testing approaches)',
          'Inform agent about file changes when resuming after modifications',
          'New session with structured summary > resuming with stale tool results',
        ],
        skills: [
          'Named sessions for ongoing investigation work',
          'fork_session for comparing refactoring/testing strategies',
          'When prior context is stale -> start fresh with injected summaries',
          'Inform resumed session about specific file changes for targeted re-analysis',
        ],
        antiPatterns: [],
        myProjectRefs: [],
      },
    ],
    playbookRefs: [
      { page: 5, title: 'Calibrating Human-in-the-Loop: 90% confidence threshold curve', image: '/images/playbook/p5.jpg' },
      { page: 6, title: 'Zero-Tolerance Compliance: 3% prompt failure rate -> app-layer intercepts', image: '/images/playbook/p6.jpg' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Domain 2: Tool Design & MCP Integration (18%)
  // ---------------------------------------------------------------------------
  {
    id: 'd2',
    name: 'Tool Design & MCP Integration',
    weight: 18,
    color: '#1E728C',
    taskStatements: [
      {
        id: '2.1',
        title: 'Design effective tool interfaces with clear descriptions and boundaries',
        status: 'pending',
        knowledge: [
          'Tool descriptions = primary mechanism LLMs use for tool selection',
          'Minimal descriptions -> unreliable selection among similar tools',
          'Ambiguous/overlapping descriptions cause misrouting (e.g., analyze_content vs analyze_document)',
          'System prompt wording can create unintended keyword-sensitive tool associations',
          'Keyword-sensitive instructions in system prompts can override tool descriptions, creating unintended tool selection patterns',
          'Minimal tool descriptions ("Retrieves customer information") leave LLM unable to distinguish similar tools — expand with input formats, example queries, edge cases, and boundaries',
        ],
        skills: [
          'Write descriptions that differentiate purpose, expected inputs/outputs, when to use vs alternatives',
          'Rename tools to eliminate overlap (e.g., analyze_content -> extract_web_results)',
          'Split generic tools into purpose-specific ones (e.g., analyze_document -> extract_data_points, summarize_content, verify_claim_against_source)',
          'Review system prompts for keyword-sensitive instructions overriding tool descriptions',
          'Diagnose tool selection issues: check descriptions first, then system prompt for keyword steering, then few-shot examples for ambiguous cases',
          'Add 4-6 few-shot examples targeting ambiguous scenarios with reasoning for why one tool was chosen over plausible alternatives',
        ],
        antiPatterns: [
          'Broad monolithic tools (analyze_dependencies)',
          'Overlapping tool descriptions',
        ],
        toolDescriptionExamples: [
          { level: 'Simple action', example: 'updateComponent: "Update component properties in AEM"' },
          { level: 'With intelligent behavior', example: 'createPage: "Create a new page in AEM. The resourceType will be automatically extracted from the template structure if not provided."' },
          { level: 'With workflow context + common examples', example: 'startWorkflow: "Start a workflow instance. Common workflows: request_for_activation (publish pages), request_for_deactivation (unpublish pages)."' },
          { level: 'With intelligent fallbacks', example: 'enhancedPageSearch: "Intelligent page search with comprehensive fallback strategies and cross-section search"' },
        ],
        myProjectRefs: [
          'AEM MCP: 51 tools across 10 categories with tool annotations (group, readOnly, complexity) for intelligent agent selection',
          'AEM MCP: 4 MCP resources for upfront catalog discovery (components, sites, templates, workflow models) — resources vs tools distinction',
        ],
        quizRefs: [
          { section: 's2', question: 1, label: 'S2:Q1 — get_customer vs lookup_order tool selection' },
          { section: 's2', question: 6, label: 'S2:Q6 — Keyword steering in system prompts' },
          { section: 's2', question: 8, label: 'S2:Q8 — Few-shot for ambiguous tool selection' },
          { section: 's2', question: 12, label: 'S2:Q12 — Expanding minimal tool descriptions' },
        ],
      },
      {
        id: '2.2',
        title: 'Implement structured error responses for MCP tools',
        status: 'pending',
        knowledge: [
          'MCP isError flag for communicating tool failures to agent',
          'Error types: transient (timeouts), validation (invalid input), business (policy violations), permission',
          'Generic "Operation failed" prevents appropriate recovery decisions',
          'Retryable vs non-retryable — structured metadata prevents wasted retries',
        ],
        skills: [
          'Return structured error metadata: errorCategory, isRetryable, human-readable description',
          'retriable: false + customer-friendly explanations for business rule violations',
          'Local error recovery in subagents for transient failures; propagate only unresolvable errors',
          'Distinguish access failures (need retry) from valid empty results (no matches)',
        ],
        antiPatterns: [
          'Throwing exceptions that crash agent',
          'Returning empty strings on failure',
          'Generic "Operation failed" error responses',
        ],
        myProjectRefs: [
          'AEM MCP: 17 typed error codes with suggestion + alternatives fields for self-healing agent workflows',
          'AEM MCP: recoverable + retryAfter fields, safeExecute() with exponential backoff',
          'AEM MCP: isError: true in MCP response (correct pattern), never throws to crash agent',
          'MoltBook MCP: layered error handling (MCP level, tool level, API level)',
        ],
        quizRefs: [
          { section: 's4', question: 1, label: 'S4:Q1 — Local error recovery vs coordinator escalation' },
          { section: 's4', question: 4, label: 'S4:Q4 — Error propagation with partial results' },
          { section: 's4', question: 5, label: 'S4:Q5 — Timeout and failure metadata in error responses' },
          { section: 's4', question: 7, label: 'S4:Q7 — Distinguishing temporary failures from capability limits' },
        ],
      },
      {
        id: '2.3',
        title: 'Distribute tools appropriately across agents and configure tool choice',
        status: 'pending',
        knowledge: [
          'Too many tools (e.g., 18 instead of 4-5) degrades selection reliability',
          'Agents with out-of-scope tools tend to misuse them',
          'Scoped tool access: only role-relevant tools + limited cross-role tools',
          'tool_choice: "auto", "any", forced ({"type": "tool", "name": "..."})',
        ],
        skills: [
          'Restrict each subagent\'s tools to its role',
          'Replace generic tools with constrained alternatives (e.g., fetch_url -> load_document)',
          'Use tool_choice forced selection to enforce execution order',
          'tool_choice: "any" to guarantee model calls a tool (no conversational text)',
        ],
        antiPatterns: [
          'Too many tools (18+) per agent',
        ],
        myProjectRefs: [
          'DX Plugins: executor agent gets only Read, Write, Edit, Bash, Glob, Grep (NO MCP, NO Task)',
          'DX Plugins: code reviewer (Opus) gets full tool access, file resolver (Haiku) gets minimal tools',
        ],
        quizRefs: [
          { section: 's4', question: 3, label: 'S4:Q3 — Constraining agent tool access to prevent scope creep' },
        ],
      },
      {
        id: '2.4',
        title: 'Integrate MCP servers into Claude Code and agent workflows',
        status: 'pending',
        knowledge: [
          'Project-level .mcp.json for shared team tooling (version controlled)',
          'User-level ~/.claude.json for personal/experimental servers',
          'Environment variable expansion (e.g., ${GITHUB_TOKEN}) for credential management',
          'Tools discovered at connection time, available simultaneously',
          'MCP resources expose content catalogs (issue summaries, schemas) to reduce exploratory calls',
        ],
        skills: [
          'Configure shared MCP servers in project .mcp.json with env var expansion',
          'Personal servers in user-scoped ~/.claude.json',
          'Enhance MCP tool descriptions to prevent agent defaulting to built-in tools',
          'Prefer community MCP servers for standard integrations (e.g., Jira)',
          'Expose content catalogs as MCP resources',
        ],
        antiPatterns: [],
        myProjectRefs: [
          'DX Plugins: multi-level MCP scoping (project .mcp.json + plugin .mcp.json)',
          'DX Plugins: ${AEM_INSTANCES} env var expansion, secrets in settings.local.json (gitignored)',
          'DX Plugins: full tool prefix naming (mcp__plugin_dx-dev-experience_figma__get_screenshot)',
          'MoltBook MCP: per-session API keys via AsyncLocalStorage, API key resolution chain (header -> env var)',
        ],
        quizRefs: [
          { section: 's3', question: 4, label: 'S3:Q4 — MCP server with env var expansion for team credentials' },
        ],
      },
      {
        id: '2.5',
        title: 'Select and apply built-in tools effectively',
        status: 'pending',
        knowledge: [
          'Grep = content search (function names, error messages, import statements)',
          'Glob = file path pattern matching (by name or extension)',
          'Read/Write = full file operations; Edit = targeted modifications (unique text matching)',
          'When Edit fails (non-unique match) -> Read + Write as fallback',
        ],
        skills: [
          'Grep -> find entry points, then Read to follow imports/trace flows',
          'Glob for naming patterns (e.g., **/*.test.tsx)',
          'Build understanding incrementally: Grep first -> Read to trace',
          'Trace function usage: identify exported names -> search across codebase',
        ],
        antiPatterns: [],
        myProjectRefs: [],
      },
    ],
    playbookRefs: [
      { page: 2, title: 'Resilient Schemas: fragile enum expansion vs "other" + detail catch-all', image: '/images/playbook/p2.jpg' },
      { page: 7, title: 'Graceful Tool Failure: isError: true sequence diagram', image: '/images/playbook/p7.jpg' },
      { page: 8, title: 'Forcing Execution Order: tool_choice API code example', image: '/images/playbook/p8.jpg' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Domain 3: Claude Code Configuration & Workflows (20%)
  // ---------------------------------------------------------------------------
  {
    id: 'd3',
    name: 'Claude Code Configuration & Workflows',
    weight: 20,
    color: '#2d308d',
    taskStatements: [
      {
        id: '3.1',
        title: 'Configure CLAUDE.md files with appropriate hierarchy, scoping, and modular organization',
        status: 'pending',
        knowledge: [
          'Hierarchy: user-level (~/.claude/CLAUDE.md), project-level (.claude/CLAUDE.md or root CLAUDE.md), directory-level (subdirectory CLAUDE.md files)',
          'User-level = personal only, not shared via version control',
          '@import syntax for referencing external files (keeps CLAUDE.md modular)',
          '.claude/rules/ directory for topic-specific rule files (alternative to monolithic CLAUDE.md)',
        ],
        skills: [
          'Diagnose hierarchy issues (e.g., instructions in user-level instead of project-level)',
          'Use @import to selectively include standards files per package',
          'Split large CLAUDE.md into focused files in .claude/rules/ (e.g., testing.md, api-conventions.md)',
          'Use /memory command to verify loaded memory files',
        ],
        antiPatterns: [],
        myProjectRefs: [
          'DX Plugins: Root CLAUDE.md + Plugin CLAUDE.md + agent memory (.claude/agent-memory/*/MEMORY.md)',
        ],
      },
      {
        id: '3.2',
        title: 'Create and configure custom slash commands and skills',
        status: 'pending',
        knowledge: [
          'Project-scoped commands in .claude/commands/ (shared via VCS)',
          'User-scoped commands in ~/.claude/commands/ (personal)',
          'Skills in .claude/skills/ with SKILL.md files + frontmatter: context: fork, allowed-tools, argument-hint',
          'context: fork isolates skill output from main conversation',
          'Personal skill customization: ~/.claude/skills/ with different names',
        ],
        skills: [
          'Create project commands in .claude/commands/ for team-wide availability',
          'context: fork to isolate verbose/exploratory skill output',
          'allowed-tools in frontmatter to restrict tool access during skill execution',
          'argument-hint to prompt for required parameters',
          'Choose skills (on-demand) vs CLAUDE.md (always-loaded) based on use case',
        ],
        antiPatterns: [],
        myProjectRefs: [
          'DX Plugins: 76 skills with YAML frontmatter (context: fork, allowed-tools, argument-hint) running across 10 AI platforms',
          'DX Plugins: three-layer override system (rules > config.yaml > plugin defaults), DOT digraph flow control for branching skills',
        ],
        quizRefs: [
          { section: 's3', question: 8, label: 'S3:Q8 — Personal vs project-scoped custom skills' },
          { section: 's3', question: 11, label: 'S3:Q11 — On-demand skill vs always-loaded CLAUDE.md' },
          { section: 's3', question: 12, label: 'S3:Q12 — Project-scoped .claude/commands/ directory' },
          { section: 's3', question: 14, label: 'S3:Q14 — argument-hint, context: fork, allowed-tools frontmatter' },
        ],
      },
      {
        id: '3.3',
        title: 'Apply path-specific rules for conditional convention loading',
        status: 'pending',
        knowledge: [
          '.claude/rules/ files with YAML frontmatter paths field for conditional activation',
          'Path-scoped rules load ONLY when editing matching files (reduces irrelevant context)',
          'Glob-pattern rules > directory-level CLAUDE.md for cross-directory conventions',
        ],
        skills: [
          'Create rules with paths: ["terraform/**/*"] for conditional loading',
          'Use glob patterns for file-type conventions regardless of location (e.g., **/*.test.tsx)',
          'Choose path-specific rules over subdirectory CLAUDE.md when conventions span directories',
        ],
        antiPatterns: [],
        rulePathExamples: [
          { rule: 'accessibility.md', paths: '**/*.html, **/*.scss, **/*.css, **/*.js', enforces: 'WCAG 2.1 AA' },
          { rule: 'fe-javascript.md', paths: '**/frontend/**/*.js', enforces: 'Component lifecycle, no console.log' },
          { rule: 'fe-styles.md', paths: '**/frontend/**/*.scss', enforces: 'Dart Sass, @use/@forward not @import' },
          { rule: 'fe-clientlibs.md', paths: '**/frontend/**, **/clientlibs/**', enforces: 'Build pipeline, Maven deploy' },
          { rule: 'naming.md', paths: '**/*.java, **/*.js, **/*.scss, **/*.html', enforces: 'Cross-stack naming conventions' },
          { rule: 'reuse-first.md', paths: 'All source files', enforces: 'Search commons/utils before creating new' },
          { rule: 'ado-service-hooks.md', paths: '**/*.sh, **/auto-*/**', enforces: 'ADO webhook scoping' },
          { rule: 'audit.md', paths: '**/*.sh, **/scripts/**/*', enforces: 'AWS/Azure audit wrappers' },
          { rule: 'dx-agents.md', paths: 'All files', enforces: 'Agent naming (full prefix required)' },
          { rule: 'qa-basic-auth.md', paths: 'All files', enforces: 'QA/Stage authentication' },
        ],
        myProjectRefs: [
          'DX Plugins: 10 rule files in .claude/rules/ with path-scoped glob patterns',
        ],
      },
      {
        id: '3.4',
        title: 'Determine when to use plan mode vs direct execution',
        status: 'pending',
        knowledge: [
          'Plan mode: complex tasks, large-scale changes, multiple approaches, multi-file modifications',
          'Direct execution: simple, well-scoped changes (single-file bug fix, validation check)',
          'Plan mode enables safe exploration and design before committing',
          'Explore subagent for verbose discovery -> returns summaries -> preserves main context',
        ],
        skills: [
          'Plan mode for: microservice restructuring, library migrations (45+ files), integration approach decisions',
          'Direct execution for: clear-scope bug fixes, single validation additions',
          'Combine plan + direct: plan investigation -> execute the planned approach',
          'Use Explore subagent for verbose discovery to prevent context exhaustion',
        ],
        antiPatterns: [],
        myProjectRefs: [],
      },
      {
        id: '3.5',
        title: 'Apply iterative refinement techniques for progressive improvement',
        status: 'pending',
        knowledge: [
          'Concrete input/output examples beat prose descriptions for consistency',
          'Test-driven iteration: write tests first -> iterate by sharing test failures',
          'Interview pattern: Claude asks clarifying questions before implementing',
          'Provide all interacting issues in one message vs sequential iteration for independent problems',
        ],
        skills: [
          '2-3 concrete I/O examples to clarify transformation requirements',
          'Test suites covering expected behavior, edge cases, performance -> iterate on failures',
          'Interview pattern for unfamiliar domains (cache strategies, failure modes)',
          'Single detailed message for interacting issues; sequential for independent ones',
        ],
        antiPatterns: [],
        myProjectRefs: [],
        quizRefs: [
          { section: 's3', question: 5, label: 'S3:Q5 — Concrete input-output examples for iterative refinement' },
        ],
      },
      {
        id: '3.6',
        title: 'Integrate Claude Code into CI/CD pipelines',
        status: 'pending',
        knowledge: [
          '-p (or --print) flag for non-interactive mode in automated pipelines',
          '--output-format json + --json-schema for structured output in CI',
          'CLAUDE.md provides project context (testing standards, review criteria) to CI-invoked Claude',
          'Session context isolation: separate session for review (generator context biases review)',
          '--output-format json with --json-schema enforces structured findings at CLI level for automated inline PR comment posting',
          'Multi-pass review: per-file analysis for local issues + separate integration-focused pass for cross-file data flow',
        ],
        skills: [
          '-p flag prevents interactive input hangs in CI',
          '--output-format json with --json-schema for machine-parseable findings',
          'Include prior review findings when re-running after new commits (avoid duplicate comments)',
          'Provide existing test files so test generation doesn\'t suggest duplicate scenarios',
          'Document testing standards, criteria, and fixtures in CLAUDE.md for CI runs',
        ],
        antiPatterns: [],
        myProjectRefs: [
          'DX Plugins: dx-automation plugin (11 skills) runs Claude Code agents as ADO pipelines — fully autonomous 24/7 PR review, bug fixing, QA',
        ],
        quizRefs: [
          { section: 's1', question: 6, label: 'S1:Q6 — --output-format json + --json-schema for CI' },
          { section: 's1', question: 8, label: 'S1:Q8 — -p flag for non-interactive pipeline mode' },
          { section: 's1', question: 15, label: 'S1:Q15 — Multi-pass review: per-file + cross-file integration' },
        ],
      },
    ],
    playbookRefs: [],
  },

  // ---------------------------------------------------------------------------
  // Domain 4: Prompt Engineering & Structured Output (20%)
  // ---------------------------------------------------------------------------
  {
    id: 'd4',
    name: 'Prompt Engineering & Structured Output',
    weight: 20,
    color: '#7b1fa2',
    taskStatements: [
      {
        id: '4.1',
        title: 'Design prompts with explicit criteria to improve precision and reduce false positives',
        status: 'pending',
        knowledge: [
          'Explicit criteria > vague instructions ("flag when behavior contradicts code" vs "check that comments are accurate")',
          '"Be conservative" / "only report high-confidence findings" fails -> use specific categorical criteria',
          'High false positive rates undermine confidence even in accurate categories',
        ],
        skills: [
          'Write specific review criteria: which issues to report (bugs, security) vs skip (minor style, local patterns)',
          'Temporarily disable high false-positive categories while improving prompts',
          'Define explicit severity criteria with concrete code examples for each level',
        ],
        antiPatterns: [
          '"Be conservative" / "report high-confidence only" (vague instructions)',
        ],
        myProjectRefs: [
          'KI-Bundestag: 20-rule system prompt with explicit constraint numbers (budget +/-1B, unemployment +/-0.1%)',
        ],
      },
      {
        id: '4.2',
        title: 'Apply few-shot prompting to improve output consistency and quality',
        status: 'pending',
        knowledge: [
          'Few-shot examples are THE most effective technique for consistent formatting',
          'Demonstrate ambiguous-case handling (tool selection, coverage gaps)',
          'Enable model to generalize judgment to novel patterns (not just match pre-specified cases)',
          'Reduce hallucination in extraction tasks (informal measurements, varied document structures)',
          'Few-shot examples are more effective than detailed prose instructions when output format is inconsistent — concrete examples outperform abstract rules for nuanced classification',
          'For severity calibration: include explicit criteria with concrete code examples for each severity level, not just category labels',
        ],
        skills: [
          '2-4 targeted examples for ambiguous scenarios showing reasoning for choices',
          'Examples demonstrating specific output format (location, issue, severity, fix)',
          'Examples distinguishing acceptable patterns from genuine issues',
          'Examples showing correct handling of varied document structures',
          'Examples showing correct extraction from documents with empty/null required fields',
          'Include 3-4 examples showing exact desired format (issue, location, specific fix) when instructions alone produce variable results',
          'For false positive management: disable high-FP categories (style, docs) while improving prompts; keep high-precision categories (security, correctness) active to maintain developer trust',
        ],
        antiPatterns: [
          'Rely on temperature 0 alone for format consistency',
        ],
        myProjectRefs: [
          'KI-Bundestag: system prompt with 20 numbered rules, impact constraint values, action type schemas with example values',
        ],
        quizRefs: [
          { section: 's1', question: 2, label: 'S1:Q2 — Explicit criteria vs vague "check comments"' },
          { section: 's1', question: 9, label: 'S1:Q9 — Few-shot examples for consistent actionable feedback' },
          { section: 's1', question: 11, label: 'S1:Q11 — Inline reasoning to reduce investigation time' },
          { section: 's1', question: 12, label: 'S1:Q12 — Severity calibration with concrete code examples' },
          { section: 's2', question: 14, label: 'S2:Q14 — Escalation criteria with few-shot examples' },
        ],
      },
      {
        id: '4.3',
        title: 'Enforce structured output using tool use and JSON schemas',
        status: 'pending',
        knowledge: [
          'tool_use with JSON schemas = most reliable for guaranteed schema-compliant output',
          'tool_choice: "auto" = may return text; "any" = must call a tool; forced = must call specific tool',
          'Strict schemas eliminate syntax errors but NOT semantic errors (values don\'t sum, wrong fields)',
          'Schema design: required vs optional fields, enum with "other" + detail string',
        ],
        skills: [
          'Define extraction tools with JSON schemas as input parameters',
          'tool_choice: "any" when multiple schemas exist and document type is unknown',
          'Forced tool choice {"type": "tool", "name": "extract_metadata"} for pipeline ordering',
          'Design optional (nullable) fields when source may not contain info (prevents fabrication)',
          'Add "unclear" enum values and "other" + detail fields for extensibility',
          'Include format normalization rules alongside strict schemas',
        ],
        antiPatterns: [
          'Fragile enum expansion (add values as edge cases arise)',
          'Required fields when source may lack info',
        ],
        myProjectRefs: [
          'KI-Bundestag: full JSON schema with all 11 action types in system prompt',
          'AEM MCP: Zod schemas as single source of truth — converted to JSON Schema for MCP protocol, used for runtime validation',
          'MoltBook MCP: required vs optional fields in tool schemas',
        ],
      },
      {
        id: '4.4',
        title: 'Implement validation, retry, and feedback loops for extraction quality',
        status: 'pending',
        knowledge: [
          'Retry-with-error-feedback: append specific validation errors to prompt on retry',
          'Retries are INEFFECTIVE when information is simply absent (not format/structural errors)',
          'detected_pattern field enables systematic analysis of false positive dismissals',
          'Semantic validation errors (values don\'t sum) != syntax errors (eliminated by tool use)',
        ],
        skills: [
          'Follow-up requests include: original document + failed extraction + specific validation errors',
          'Identify when retries won\'t work (info only in external documents) vs when they will (format issues)',
          'detected_pattern fields for tracking false positive patterns',
          'Self-correction: calculated_total alongside stated_total, conflict_detected booleans',
        ],
        antiPatterns: [
          'Retry for missing information',
          'Overwriting original values in amended documents',
        ],
        myProjectRefs: [
          'KI-Bundestag: multi-stage JSON sanitization (stripCodeFences -> JSON.parse -> stripLeadingPlus -> stripTrailingCommas -> retry -> validateActions -> fallback to abstain)',
        ],
      },
      {
        id: '4.5',
        title: 'Design efficient batch processing strategies',
        status: 'pending',
        knowledge: [
          'Message Batches API: 50% cost savings, up to 24-hour processing window, no guaranteed latency SLA',
          'Appropriate for: overnight reports, weekly audits, nightly test generation',
          'NOT appropriate for: blocking workflows (pre-merge checks)',
          'Batch API does NOT support multi-turn tool calling within a single request',
          'custom_id fields for correlating batch request/response pairs',
        ],
        skills: [
          'Synchronous API for blocking pre-merge checks; Batch API for overnight/weekly analysis',
          'Calculate batch frequency from SLA (e.g., 4-hour windows -> 30-hour SLA with 24h batch)',
          'Resubmit only failed documents (identified by custom_id) with modifications',
          'Refine prompts on sample set before batch-processing large volumes',
          'Decision algorithm: blocking workflows (pre-merge checks) → synchronous API; scheduled workflows with flexible timelines (overnight reports, weekly audits, nightly generation) → Message Batches API (50% savings)',
          'Batch API architectural constraint: fire-and-forget model prevents executing tools mid-request — breaks iterative tool-calling workflows',
        ],
        antiPatterns: [
          'Real-time API for async/batch needs',
        ],
        myProjectRefs: [],
        quizRefs: [
          { section: 's1', question: 1, label: 'S1:Q1 — Batch vs sync API matching for CI tasks' },
          { section: 's1', question: 4, label: 'S1:Q4 — Batch API cannot support iterative tool calling' },
          { section: 's1', question: 5, label: 'S1:Q5 — Deep analysis ideal for batch processing' },
          { section: 's1', question: 14, label: 'S1:Q14 — Pre-merge real-time vs overnight batch' },
        ],
      },
      {
        id: '4.6',
        title: 'Design multi-instance and multi-pass review architectures',
        status: 'pending',
        knowledge: [
          'Self-review limitation: model retains reasoning context -> less likely to question own decisions',
          'Independent review instances (no prior context) catch more subtle issues',
          'Multi-pass: per-file local analysis + cross-file integration passes',
          'Self-review fails because the same confirmation bias persists in the same reasoning context — model already rationalized its decisions',
          'Second independent instance without access to generator reasoning eliminates confirmation bias (mirrors human peer review benefit)',
        ],
        skills: [
          'Second independent Claude instance for reviewing generated code',
          'Split large reviews: focused per-file passes + separate integration pass',
          'Verification passes with model self-reported confidence per finding',
        ],
        antiPatterns: [
          'Self-review in same session',
        ],
        myProjectRefs: [],
        quizRefs: [
          { section: 's1', question: 10, label: 'S1:Q10 — Independent instance eliminates confirmation bias' },
          { section: 's2', question: 13, label: 'S2:Q13 — Self-critique step for response completeness' },
        ],
      },
    ],
    playbookRefs: [
      { page: 2, title: 'Resilient Schemas: "other" enum value + detail string field', image: '/images/playbook/p2.jpg' },
      { page: 3, title: 'Schema Redundancy: calculated_total vs stated_total', image: '/images/playbook/p3.jpg' },
      { page: 4, title: 'Limits of Retry: effective for format errors, ineffective for missing info', image: '/images/playbook/p4.jpg' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Domain 5: Context Management & Reliability (15%)
  // ---------------------------------------------------------------------------
  {
    id: 'd5',
    name: 'Context Management & Reliability',
    weight: 15,
    color: '#4caf50',
    taskStatements: [
      {
        id: '5.1',
        title: 'Filter and prune tool results to manage context window usage',
        status: 'pending',
        knowledge: [
          'Application-side filtering: extract only relevant fields from verbose API responses',
          'Summarize resolved issues as narrative; keep full verbatim history only for active/unresolved issue',
          'MCP tool responses often contain excessive data (40+ fields when you need 4)',
          'Primacy/recency effect: models attend more reliably to first and last sections of context; critical findings in the middle may be missed ("lost in the middle")',
          'Case facts extraction: amounts, dates, order numbers, customer-stated expectations should persist in a structured block outside summarized history',
        ],
        skills: [
          'Filter tool responses to task-relevant fields before adding to conversation',
          'Summarize early resolved turns into narrative descriptions',
          'Preserve full message history only for active unresolved issue',
          'Design tool responses that return minimal necessary data',
          'Structure synthesis inputs to mitigate lost-in-the-middle: place key findings summary at start, detailed evidence in middle, action items at end',
          'Extract transactional facts into persistent "case facts" block that survives progressive summarization',
          'Add coverage annotations when input quality is mixed (mark which topic areas have gaps vs complete coverage)',
        ],
        antiPatterns: [
          'Verbose API responses in context (40+ fields)',
          'Keeping full history for all resolved issues',
        ],
        myProjectRefs: [
          'KI-Bundestag: priority-based greedy context loading within ~3000 token budget',
        ],
        quizRefs: [
          { section: 's1', question: 7, label: 'S1:Q7 — Include existing tests in context to prevent duplicates' },
          { section: 's1', question: 13, label: 'S1:Q13 — Prior findings in context to avoid redundant feedback' },
          { section: 's2', question: 10, label: 'S2:Q10 — Case facts extraction from progressive summarization' },
          { section: 's4', question: 11, label: 'S4:Q11 — Lost-in-the-middle: key findings summary placement' },
          { section: 's4', question: 12, label: 'S4:Q12 — Coverage annotations for partial-quality inputs' },
        ],
      },
      {
        id: '5.2',
        title: 'Apply prompt caching to reduce latency and cost',
        status: 'pending',
        knowledge: [
          'Prompt caching reduces cost when shared prefix is large and stable',
          'Effective when follow-up summaries consistently pass 80K+ tokens',
          'Cache-friendly prompt design: stable system prompt + stable few-shot examples first, then variable content',
        ],
        skills: [
          'Enable prompt caching on synthesis subagent with accumulated findings',
          'Structure prompts with cacheable prefix (system prompt, examples) and variable suffix (current input)',
          'Use caching for repeated large-context operations',
        ],
        antiPatterns: [
          'Repeated large context without caching',
        ],
        myProjectRefs: [],
      },
      {
        id: '5.3',
        title: 'Design strategies for managing long conversations',
        status: 'pending',
        knowledge: [
          'Scratchpad pattern: agent maintains a file recording key findings, architectural maps, decisions',
          'Extended sessions (30+ mins) cause token bloat -> inconsistent answers about early discoveries',
          'Resuming sessions with stale tool results -> model states outdated information confidently',
          'Progressive summarization with preservation rules: explicitly preserve all numerical values, percentages, dates, and customer-stated expectations verbatim during summarization',
          'Include prior review findings in context so model can distinguish new issues from already-addressed ones (prevents redundant feedback on fixed code)',
        ],
        skills: [
          'Have agent maintain scratchpad.md for continuous reference',
          'Programmatically filter out previous tool_result messages when resuming async sessions',
          'Keep only human/assistant turns so agent re-fetches current data on resumption',
          'Inform resumed sessions about specific file changes for targeted re-analysis',
        ],
        antiPatterns: [
          'Sequentially reading all files upfront',
          'Resuming sessions with stale tool results',
          'Full re-read on session resumption',
        ],
        myProjectRefs: [],
        quizRefs: [
          { section: 's2', question: 10, label: 'S2:Q10 — Persistent case facts surviving summarization' },
        ],
      },
      {
        id: '5.4',
        title: 'Implement human-in-the-loop workflows',
        status: 'pending',
        knowledge: [
          'Calibrate automation threshold: automate when confidence >90%, human review queue for rest',
          'Verify accuracy by document type AND field (not just aggregate) before deploying',
          'Confidence scores are model-generated and must be validated per segment',
        ],
        skills: [
          'Field-level confidence scores for routing automation vs human review',
          'Analyze accuracy across all segments, not just aggregate',
          'Design escalation triggers based on measurable criteria',
        ],
        antiPatterns: [
          'Trusting aggregate confidence scores',
        ],
        myProjectRefs: [
          'KI-Bundestag: MdB vote overrides (humans override AI on individual bills), AI discipline tracking',
        ],
      },
      {
        id: '5.5',
        title: 'Design error handling and escalation patterns',
        status: 'pending',
        knowledge: [
          'Structured error responses with isError, errorCategory, isRetryable',
          'Distinguish transient vs permanent failures for appropriate retry/escalation decisions',
          'Graceful degradation: provide partial results + what was attempted',
        ],
        skills: [
          'Local error recovery in subagents for transient failures',
          'Propagate only unresolvable errors to coordinator with partial results',
          'Structured escalation summaries for human agents',
        ],
        antiPatterns: [],
        myProjectRefs: [
          'AEM MCP: verbosity parameter (summary/standard/full) reduces token consumption, consistent response shape with structured errors',
          'KI-Bundestag: provider circuit breaker (per-provider rate limit tracking with TTL, graceful pause not crash)',
        ],
      },
    ],
    playbookRefs: [
      { page: 5, title: 'Calibrating Human-in-the-Loop: automate >90% confidence', image: '/images/playbook/p5.jpg' },
      { page: 9, title: 'Reference Matrix: constraint x domain solution lookup table', image: '/images/playbook/p9.jpg' },
      { page: 10, title: 'Production Architecture Blueprint: full system diagram', image: '/images/playbook/p10.jpg' },
    ],
  },
];

// =============================================================================
// SCENARIOS
// =============================================================================

export const scenarios = [
  // ---------------------------------------------------------------------------
  // S1: Customer Support Resolution Agent
  // ---------------------------------------------------------------------------
  {
    id: 's1',
    name: 'Customer Support Resolution Agent',
    domains: ['d1', 'd2', 'd5'],
    context: 'Building a customer support resolution agent using Claude Agent SDK. Handles high-ambiguity requests (returns, billing disputes, account issues) via MCP tools: get_customer, lookup_order, process_refund, escalate_to_human. Target: 80%+ first-contact resolution while knowing when to escalate.',
    keyConcepts: [
      {
        title: 'Escalation Handoff',
        points: [
          '"I want a human NOW" -> honor immediately, don\'t ask for clarification',
          'Complex policy issue -> gather context first (get_customer), then structured handoff',
          'Handoff payload: {customer_id, root_cause, amount, recommended_action} — NOT raw transcripts',
        ],
      },
      {
        title: 'Compliance Enforcement',
        points: [
          'Refund thresholds -> use application-layer hooks, NOT prompt instructions',
          'Emphatic prompts ("NEVER process >$500") still yield ~3% failure rate',
          'PostToolUse hooks for deterministic blocking of policy-violating tool calls',
        ],
      },
      {
        title: 'Context Window Management',
        points: [
          'Filter stale tool_result messages when resuming async sessions',
          'Prune verbose API responses (40+ fields -> only relevant 4-5 fields)',
          'Summarize resolved issues; keep full history only for active issue',
        ],
      },
      {
        title: 'Multi-Step Workflow Enforcement',
        points: [
          'Block process_refund until get_customer has returned verified customer ID',
          'Decompose multi-concern requests -> investigate each -> synthesize unified resolution',
        ],
      },
    ],
    checklist: [
      { text: 'Understand PostToolUse hook implementation for compliance', checked: false },
      { text: 'Know when to use hooks vs prompts for enforcement', checked: false },
      { text: 'Practice structured handoff summary design', checked: false },
      { text: 'Understand context pruning strategies for long support sessions', checked: false },
      { text: 'Know the agentic loop lifecycle (stop_reason handling)', checked: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // S2: Code Generation with Claude Code
  // ---------------------------------------------------------------------------
  {
    id: 's2',
    name: 'Code Generation with Claude Code',
    domains: ['d3', 'd5'],
    context: 'Using Claude Code to accelerate software development. Team uses it for code generation, refactoring, debugging, and documentation. Need to integrate into development workflow with custom slash commands, CLAUDE.md configurations, and plan mode vs direct execution decisions.',
    keyConcepts: [
      {
        title: 'CLAUDE.md Configuration',
        points: [
          'Hierarchy: user-level (~/.claude/CLAUDE.md) -> project-level (.claude/CLAUDE.md) -> directory-level',
          '@import for modular standards inclusion',
          '.claude/rules/ with YAML frontmatter paths for conditional loading',
          'Path-scoped rules > directory CLAUDE.md for cross-directory conventions',
        ],
      },
      {
        title: 'Custom Commands & Skills',
        points: [
          '.claude/commands/ (project, shared via VCS) vs ~/.claude/commands/ (personal)',
          'Skills with frontmatter: context: fork, allowed-tools, argument-hint',
          'context: fork isolates verbose output from main session',
        ],
      },
      {
        title: 'Plan Mode vs Direct Execution',
        points: [
          'Plan mode: architectural decisions, multi-file changes, 45+ files, library migrations',
          'Direct execution: single-file bug fix, add validation check, clear-scope changes',
          'Combine: plan mode for investigation -> direct execution for implementation',
        ],
      },
      {
        title: 'Iterative Refinement',
        points: [
          'Test-driven: write tests first -> iterate sharing failures',
          'Concrete I/O examples > prose descriptions',
          'Interview pattern for unfamiliar domains',
        ],
      },
    ],
    checklist: [
      { text: 'Know CLAUDE.md hierarchy and scoping rules', checked: false },
      { text: 'Understand @import and .claude/rules/ path-scoping', checked: false },
      { text: 'When to use plan mode vs direct execution (clear decision criteria)', checked: false },
      { text: 'Custom commands vs skills (when to use each)', checked: false },
      { text: 'Iterative refinement techniques (test-driven, interview pattern)', checked: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // S3: Multi-Agent Research System
  // ---------------------------------------------------------------------------
  {
    id: 's3',
    name: 'Multi-Agent Research System',
    domains: ['d1', 'd2', 'd5'],
    context: 'Building a multi-agent research system using Claude Agent SDK. A coordinator delegates to specialized subagents: web search, document analysis, synthesis, and report generation. System produces comprehensive, cited reports.',
    keyConcepts: [
      {
        title: 'Coordinator-Subagent Architecture',
        points: [
          'Hub-and-spoke: coordinator manages ALL communication, error handling, information routing',
          'Subagents operate with isolated context (no automatic inheritance)',
          'Dynamic subagent selection based on query complexity',
          'Iterative refinement loops: evaluate synthesis -> re-delegate with targeted queries',
        ],
      },
      {
        title: 'Context Passing',
        points: [
          'Include COMPLETE findings in subagent prompts (not references to prior conversations)',
          'Structured data formats: separate content from metadata (source URLs, page numbers)',
          'Spawn parallel subagents via multiple Task calls in single coordinator response',
        ],
      },
      {
        title: 'Goal-Oriented Delegation',
        points: [
          'Specify research goals and quality criteria, NOT step-by-step procedures',
          'Let specialized subagents determine their own strategy',
          'Procedural micromanagement -> rigid failures; goal-oriented -> adaptable results',
        ],
      },
      {
        title: 'Shared Memory & Intermediates',
        points: [
          'Anti-pattern: daisy-chaining full conversation logs (exponential token costs)',
          'Pattern: shared vector store for subagent outputs; subsequent agents retrieve via semantic search',
          'Structured intermediate representations: standardize outputs to common format (claim, evidence, source, confidence)',
          'Citation rule: all subagents output structured claim-source mappings',
        ],
      },
      {
        title: 'Parallelization & Caching',
        points: [
          'Parallel subagents for independent data (e.g., 12 legal precedents)',
          'Prompt caching on synthesis subagent with 80K+ accumulated findings',
          'Reduces latency from 180s (sequential) to ~30s (parallel)',
        ],
      },
    ],
    checklist: [
      { text: 'Hub-and-spoke architecture principles', checked: false },
      { text: 'Context passing best practices (complete findings, structured formats)', checked: false },
      { text: 'Goal-oriented vs procedural delegation trade-offs', checked: false },
      { text: 'Shared vector store pattern for multi-agent state', checked: false },
      { text: 'Parallelization strategies and when to apply', checked: false },
      { text: 'Prompt caching for synthesis operations', checked: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // S4: Developer Productivity with Claude
  // ---------------------------------------------------------------------------
  {
    id: 's4',
    name: 'Developer Productivity with Claude',
    domains: ['d2', 'd3', 'd1'],
    context: 'Building developer productivity tools using Claude Agent SDK. Agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate, and automate repetitive tasks. Uses built-in tools (Read, Write, Bash, Grep, Glob) and integrates with MCP servers.',
    keyConcepts: [
      {
        title: 'Directed Codebase Exploration',
        points: [
          'Anti-pattern: sequentially reading all files (context-heavy, inefficient)',
          'Pattern: start broad (Grep for entry points) -> trace specific implementations -> dynamically generate subtasks',
          'For new engineers (800+ files): read CLAUDE.md/README first, ask human for priority files',
          'For intermittent bugs: dynamically generate investigation subtasks based on each step\'s discoveries',
        ],
      },
      {
        title: 'Built-in Tool Selection',
        points: [
          'Grep: content search (function names, error messages, imports)',
          'Glob: file pattern matching (**/*.test.tsx)',
          'Read/Write: full file operations',
          'Edit: targeted modifications with unique text matching',
          'When Edit fails -> Read + Write fallback',
        ],
      },
      {
        title: 'MCP Tool Specificity',
        points: [
          'Broad tools alongside built-in Grep -> agent defaults to Grep',
          'Split: analyze_dependencies -> list_imports, resolve_transitive_deps, detect_circular_deps',
          'Enhance MCP descriptions to explain when to prefer them over built-in tools',
        ],
      },
      {
        title: 'The Scratchpad Pattern',
        points: [
          'Extended sessions (30+ mins) -> token bloat -> inconsistent answers',
          'Agent maintains scratchpad.md: key findings, architectural maps, decisions',
          'References this structured file for subsequent questions',
        ],
      },
    ],
    checklist: [
      { text: 'Know which built-in tool to use for each task type', checked: false },
      { text: 'Understand directed codebase exploration strategy', checked: false },
      { text: 'MCP tool specificity patterns (splitting broad tools)', checked: false },
      { text: 'Scratchpad pattern for extended exploration sessions', checked: false },
      { text: 'Session resumption strategies (when to resume vs start fresh)', checked: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // S5: Claude Code for Continuous Integration
  // ---------------------------------------------------------------------------
  {
    id: 's5',
    name: 'Claude Code for Continuous Integration',
    domains: ['d3', 'd4'],
    context: 'Integrating Claude Code into CI/CD pipeline. System runs automated code reviews, generates test cases, and provides feedback on pull requests. Need to design prompts that provide actionable feedback and minimize false positives.',
    keyConcepts: [
      {
        title: 'CI Integration Mechanics',
        points: [
          '-p (or --print) flag: non-interactive mode, prevents input hangs',
          '--output-format json + --json-schema: machine-parseable structured findings',
          'Session context isolation: generator session should NOT review its own code (biased)',
          'Use independent Claude instance for review',
        ],
      },
      {
        title: 'Prompt Design for Reviews',
        points: [
          'Explicit criteria > vague "be conservative" instructions',
          'Define which issues to report (bugs, security) vs skip (minor style, local patterns)',
          'Concrete code examples for each severity level -> consistent classification',
          'Temporarily disable high false-positive categories while improving prompts',
        ],
      },
      {
        title: 'Multi-Pass Review Architecture',
        points: [
          'Per-file local analysis passes + cross-file integration pass',
          'Avoids attention dilution and contradictory findings',
          'Self-review is less effective than independent instance review',
        ],
      },
      {
        title: 'Context Management in CI',
        points: [
          'CLAUDE.md provides testing standards, fixture conventions, review criteria',
          'Include prior review findings when re-running (avoid duplicate comments)',
          'Provide existing test files to avoid suggesting duplicate scenarios',
        ],
      },
      {
        title: 'Few-Shot Prompting for Consistency',
        points: [
          'Include examples demonstrating desired output format (location, issue, severity, fix)',
          'Examples distinguishing acceptable patterns from genuine issues',
          'Examples showing reasoning for ambiguous case handling',
        ],
      },
    ],
    checklist: [
      { text: 'Know CLI flags for CI: -p, --output-format json, --json-schema', checked: false },
      { text: 'Session isolation for code review (why same-session review is biased)', checked: false },
      { text: 'Explicit review criteria design (categories, severity levels, examples)', checked: false },
      { text: 'Multi-pass review architecture (per-file + integration pass)', checked: false },
      { text: 'Feedback loop design for reducing false positives', checked: false },
    ],
  },

  // ---------------------------------------------------------------------------
  // S6: Structured Data Extraction
  // ---------------------------------------------------------------------------
  {
    id: 's6',
    name: 'Structured Data Extraction',
    domains: ['d4', 'd5'],
    context: 'Building a structured data extraction system using Claude. Extracts information from unstructured documents, validates output with JSON schemas, maintains high accuracy. Must handle edge cases gracefully and integrate with downstream systems.',
    keyConcepts: [
      {
        title: 'JSON Schema Design',
        points: [
          'tool_use with JSON schemas = most reliable for guaranteed schema-compliant output',
          'Strict schemas eliminate syntax errors but NOT semantic errors',
          'Required vs optional fields: use optional (nullable) when source may lack info (prevents fabrication)',
          'Enum with "other" + detail string field > fragile enum expansion',
          'Data Evolution Rule: amended fields should capture multiple values with source + effective_date',
        ],
      },
      {
        title: 'Tool Choice Configuration',
        points: [
          'tool_choice: "auto" -> may return text instead of structured output',
          'tool_choice: "any" -> must call a tool, can choose which',
          'Forced: {"type": "tool", "name": "extract_metadata"} -> ensures specific extraction first',
          'Use forced tool choice for pipeline ordering (extract before enrich)',
        ],
      },
      {
        title: 'Validation & Self-Correction',
        points: [
          'Schema redundancy: extract calculated_total alongside stated_total',
          'Flag for human review when calculated_total != stated_total',
          'Retry-with-error-feedback: append specific validation errors on retry',
          'Retries INEFFECTIVE for missing information (only works for format/structural errors)',
          'detected_pattern field for systematic false positive analysis',
        ],
      },
      {
        title: 'Null Handling & Hallucination Prevention',
        points: [
          'Explicit "return null if not directly stated" instructions',
          'Few-shot examples showing correct null extraction',
          'Don\'t rely on temperature 0 alone for format consistency — use few-shot examples',
        ],
      },
      {
        title: 'Batch Processing',
        points: [
          'Batch API: 50% cost savings, 24-hour window, no latency SLA',
          'For: overnight reports, weekly audits, nightly processing',
          'NOT for: blocking pre-merge checks',
          'No multi-turn tool calling in batch API',
          'custom_id for correlating batch request/response pairs',
          'Refine prompts on sample set before full batch processing',
        ],
      },
      {
        title: 'Cost & SLA Routing',
        points: [
          'Never default to real-time for asynchronous needs',
          'Urgent exceptions -> Real-time Messages API (high cost, instant)',
          'Standard workflows -> Message Batches API (50% savings)',
          'Continuous arrival (30h SLA) -> submit batches every 6 hours',
        ],
      },
    ],
    checklist: [
      { text: 'JSON schema design patterns (optional fields, resilient enums, redundancy)', checked: false },
      { text: 'tool_choice options and when to use each', checked: false },
      { text: 'Self-correction validation flows (calculated vs stated totals)', checked: false },
      { text: 'Retry effectiveness: format errors (yes) vs missing info (no)', checked: false },
      { text: 'Batch API constraints and cost optimization', checked: false },
      { text: 'Null handling and hallucination prevention techniques', checked: false },
    ],
  },
];

// =============================================================================
// PRACTICE QUESTIONS
// =============================================================================

export const questions = [
  {
    id: 'q1',
    domain: 'd1',
    question: 'Your customer support agent occasionally processes refunds over $500 despite system prompt instructions saying "NEVER process refunds over $500." What is the most reliable solution?',
    options: [
      { letter: 'A', text: 'Add more emphatic language to the system prompt', correct: false },
      { letter: 'B', text: 'Implement a PostToolUse hook that blocks process_refund when amount > $500', correct: true },
      { letter: 'C', text: 'Add a self-review step where the agent checks its own work', correct: false },
      { letter: 'D', text: 'Lower the temperature to 0', correct: false },
    ],
    explanation: 'Application-layer hooks provide deterministic enforcement. Prompts (even emphatic ones) have a ~3% failure rate.',
  },
  {
    id: 'q2',
    domain: 'd1',
    question: 'When implementing an agentic loop, what should determine whether to continue or terminate the loop?',
    options: [
      { letter: 'A', text: 'Check if the assistant\'s text contains phrases like "I\'m done"', correct: false },
      { letter: 'B', text: 'Set a maximum of 10 iterations', correct: false },
      { letter: 'C', text: 'Inspect stop_reason — continue when "tool_use", terminate when "end_turn"', correct: true },
      { letter: 'D', text: 'Parse the model\'s response for a completion keyword', correct: false },
    ],
    explanation: 'The stop_reason field is the reliable, programmatic signal. Natural language parsing and arbitrary caps are anti-patterns.',
  },
  {
    id: 'q3',
    domain: 'd2',
    question: 'Your agent has access to 18 tools but frequently selects the wrong one. What is the most effective fix?',
    options: [
      { letter: 'A', text: 'Add "Please choose the correct tool" to the system prompt', correct: false },
      { letter: 'B', text: 'Restrict each agent to 4-5 role-specific tools', correct: true },
      { letter: 'C', text: 'Increase the model\'s temperature for more creative tool selection', correct: false },
      { letter: 'D', text: 'Add detailed descriptions to all 18 tools', correct: false },
    ],
    explanation: 'Too many tools degrades selection reliability. Scoped tool access is the architectural fix.',
  },
  {
    id: 'q4',
    domain: 'd2',
    question: 'An MCP tool fails due to a timeout. What should the tool return?',
    options: [
      { letter: 'A', text: 'Throw an exception', correct: false },
      { letter: 'B', text: 'Return an empty string', correct: false },
      { letter: 'C', text: 'Return {isError: true, errorCategory: "transient", isRetryable: true}', correct: true },
      { letter: 'D', text: 'Return the string "Error: timeout"', correct: false },
    ],
    explanation: 'Structured error metadata enables the agent to make appropriate recovery decisions.',
  },
  {
    id: 'q5',
    domain: 'd3',
    question: 'A new team member isn\'t receiving project-specific instructions from CLAUDE.md. Where should you check first?',
    options: [
      { letter: 'A', text: 'The instructions might be in ~/.claude/CLAUDE.md (user-level, not shared)', correct: true },
      { letter: 'B', text: 'The project might be missing a package.json', correct: false },
      { letter: 'C', text: 'Claude Code might need to be reinstalled', correct: false },
      { letter: 'D', text: 'The CLAUDE.md file might be too large', correct: false },
    ],
    explanation: 'User-level CLAUDE.md is personal and not shared via version control. Project-level (.claude/CLAUDE.md or root) is the correct location for team instructions.',
  },
  {
    id: 'q6',
    domain: 'd4',
    question: 'Your extraction pipeline sometimes fabricates values for fields not present in the source document. What\'s the best fix?',
    options: [
      { letter: 'A', text: 'Lower the temperature to 0', correct: false },
      { letter: 'B', text: 'Add explicit "return null if not directly stated" instructions AND make schema fields optional/nullable', correct: true },
      { letter: 'C', text: 'Add more training examples', correct: false },
      { letter: 'D', text: 'Increase max_tokens', correct: false },
    ],
    explanation: 'Explicit null handling instructions combined with nullable schema fields prevents the model from fabricating values to satisfy required fields.',
  },
  {
    id: 'q7',
    domain: 'd4',
    question: 'You want to ensure metadata extraction always runs before DOI enrichment in your pipeline. What\'s the most reliable approach?',
    options: [
      { letter: 'A', text: 'Include "extract metadata first" in the system prompt', correct: false },
      { letter: 'B', text: 'Set tool_choice: {"type": "tool", "name": "extract_metadata"} for the first API call', correct: true },
      { letter: 'C', text: 'Put the metadata tool first in the tools array', correct: false },
      { letter: 'D', text: 'Use a lower temperature', correct: false },
    ],
    explanation: 'Forced tool choice guarantees execution order. Prompt instructions and tool ordering are not deterministic.',
  },
  {
    id: 'q8',
    domain: 'd5',
    question: 'After resuming an async customer support session 4 hours later, the agent states outdated order status. What\'s the fix?',
    options: [
      { letter: 'A', text: 'Always start fresh sessions', correct: false },
      { letter: 'B', text: 'Programmatically filter out previous tool_result messages, keeping only human/assistant turns', correct: true },
      { letter: 'C', text: 'Add "check for latest status" to the system prompt', correct: false },
      { letter: 'D', text: 'Set a session timeout of 1 hour', correct: false },
    ],
    explanation: 'Filtering stale tool results forces the agent to re-fetch current data while preserving conversation context.',
  },
];

// =============================================================================
// MY PROJECTS
// =============================================================================

export const myProjects = myProjectsData;

// =============================================================================
// CHEATSHEETS
// =============================================================================

export const cheatsheets = {
  // ---------------------------------------------------------------------------
  // Patterns vs Anti-Patterns
  // ---------------------------------------------------------------------------
  patterns: [
    // Agentic Architecture
    { domain: 'Agentic Architecture', antiPattern: 'Parse natural language for loop termination', pattern: 'Use stop_reason ("tool_use" vs "end_turn")' },
    { domain: 'Agentic Architecture', antiPattern: 'Arbitrary iteration caps as primary stop', pattern: 'stop_reason-based control flow' },
    { domain: 'Agentic Architecture', antiPattern: 'Daisy-chain full conversation logs between subagents', pattern: 'Shared vector store + semantic search' },
    { domain: 'Agentic Architecture', antiPattern: 'Step-by-step procedural instructions to subagents', pattern: 'Goal-oriented delegation (goals + quality criteria)' },
    { domain: 'Agentic Architecture', antiPattern: 'Full pipeline for every query', pattern: 'Dynamic subagent selection based on complexity' },
    { domain: 'Agentic Architecture', antiPattern: 'Emphatic prompts for compliance ("NEVER do X")', pattern: 'Application-layer hooks for deterministic enforcement' },
    { domain: 'Agentic Architecture', antiPattern: 'Raw transcript dumps for escalation', pattern: 'Structured handoff summaries (ID, root cause, amount, action)' },
    // Tool Design & MCP
    { domain: 'Tool Design & MCP', antiPattern: 'Broad monolithic tools (analyze_dependencies)', pattern: 'Granular single-purpose tools (list_imports, resolve_transitive_deps)' },
    { domain: 'Tool Design & MCP', antiPattern: 'Generic "Operation failed" error responses', pattern: 'Structured errors: {isError, errorCategory, isRetryable, description}' },
    { domain: 'Tool Design & MCP', antiPattern: 'Throwing exceptions that crash agent', pattern: 'Return error in tool result with isError: true' },
    { domain: 'Tool Design & MCP', antiPattern: 'Overlapping tool descriptions', pattern: 'Rename + differentiate clearly per tool' },
    { domain: 'Tool Design & MCP', antiPattern: 'Too many tools (18+) per agent', pattern: '4-5 role-specific tools + limited cross-role' },
    { domain: 'Tool Design & MCP', antiPattern: 'Returning empty strings on failure', pattern: 'Structured error metadata with actionable info' },
    // Prompt Engineering & Structured Output
    { domain: 'Prompt Engineering', antiPattern: 'Fragile enum expansion (add values as edge cases arise)', pattern: 'Resilient enum with "other" + detail string field' },
    { domain: 'Prompt Engineering', antiPattern: 'Required fields when source may lack info', pattern: 'Optional/nullable fields (prevents fabrication)' },
    { domain: 'Prompt Engineering', antiPattern: 'Rely on temperature 0 for format consistency', pattern: 'Few-shot examples showing standardized format' },
    { domain: 'Prompt Engineering', antiPattern: '"Be conservative" / "report high-confidence only"', pattern: 'Specific categorical criteria with code examples' },
    { domain: 'Prompt Engineering', antiPattern: 'Retry for missing information', pattern: 'Recognize when info is absent -> fail fast' },
    { domain: 'Prompt Engineering', antiPattern: 'Overwriting original values in amended documents', pattern: 'Capture multiple values with source + effective_date' },
    { domain: 'Prompt Engineering', antiPattern: 'Self-review in same session', pattern: 'Independent review instance (no prior reasoning context)' },
    // Context Management
    { domain: 'Context Management', antiPattern: 'Sequentially reading all files upfront', pattern: 'Grep for entry points -> Read to trace flows -> dynamically generate subtasks' },
    { domain: 'Context Management', antiPattern: 'Resuming sessions with stale tool results', pattern: 'Filter out old tool_result -> force re-fetch of current data' },
    { domain: 'Context Management', antiPattern: 'Full re-read on session resumption', pattern: 'Inform agent of specific file changes for targeted re-analysis' },
    { domain: 'Context Management', antiPattern: 'Verbose API responses in context (40+ fields)', pattern: 'Application-side filtering to relevant fields only' },
    { domain: 'Context Management', antiPattern: 'Keeping full history for all resolved issues', pattern: 'Summarize resolved issues as narrative; full history only for active issue' },
    { domain: 'Context Management', antiPattern: 'Trusting aggregate confidence scores', pattern: 'Validate accuracy per document type AND per field' },
    // Cost & Latency
    { domain: 'Cost & Latency', antiPattern: 'Real-time API for async/batch needs', pattern: 'Batch API (50% savings) for non-blocking workloads' },
    { domain: 'Cost & Latency', antiPattern: 'Sequential processing of independent items', pattern: 'Parallel subagents, each handling a subset' },
    { domain: 'Cost & Latency', antiPattern: 'Repeated large context without caching', pattern: 'Prompt caching for 80K+ token synthesis operations' },
    { domain: 'Prompt Engineering', antiPattern: 'Require developers to click into each finding to read reasoning', pattern: 'Include confidence + reasoning inline with each finding for fast triage' },
    { domain: 'Context Management', antiPattern: 'Progressive summarization loses precise values (amounts, dates)', pattern: 'Extract case facts into persistent block outside summarized history' },
    { domain: 'Agentic Architecture', antiPattern: 'Escalate based on emotional signals (customer frustration)', pattern: 'Escalate based on policy gaps, information conflicts, or exceeded authority' },
  ],

  // ---------------------------------------------------------------------------
  // Key Configurations & Flags
  // ---------------------------------------------------------------------------
  configs: [
    // Claude Code CLI Flags
    { category: 'Claude Code CLI', name: '-p / --print', purpose: 'Non-interactive mode', whenToUse: 'CI/CD pipelines' },
    { category: 'Claude Code CLI', name: '--output-format json', purpose: 'JSON output', whenToUse: 'Machine-parseable CI results' },
    { category: 'Claude Code CLI', name: '--json-schema', purpose: 'Enforce output schema', whenToUse: 'Structured CI findings' },
    { category: 'Claude Code CLI', name: '--resume <name>', purpose: 'Resume named session', whenToUse: 'Continue investigation work' },
    // tool_choice Options
    { category: 'tool_choice', name: '"auto" (default)', purpose: 'Model may return text or call tool', whenToUse: 'General conversation' },
    { category: 'tool_choice', name: '"any"', purpose: 'Model MUST call a tool (any)', whenToUse: 'Guarantee structured output' },
    { category: 'tool_choice', name: '{"type":"tool","name":"X"}', purpose: 'Model MUST call specific tool', whenToUse: 'Enforce pipeline ordering' },
    // stop_reason Values
    { category: 'stop_reason', name: '"tool_use"', purpose: 'Model wants to call a tool', whenToUse: 'Execute tool, return result, continue loop' },
    { category: 'stop_reason', name: '"end_turn"', purpose: 'Model is done', whenToUse: 'Terminate loop, return response' },
    // CLAUDE.md Hierarchy
    { category: 'CLAUDE.md Hierarchy', name: '~/.claude/CLAUDE.md', purpose: 'User-level (personal, not version controlled)', whenToUse: 'Personal preferences' },
    { category: 'CLAUDE.md Hierarchy', name: '.claude/CLAUDE.md or root CLAUDE.md', purpose: 'Project-level (shared via VCS)', whenToUse: 'Team conventions and standards' },
    { category: 'CLAUDE.md Hierarchy', name: 'Subdirectory CLAUDE.md', purpose: 'Directory-level (local context)', whenToUse: 'Package-specific instructions' },
    { category: 'CLAUDE.md Hierarchy', name: '.claude/rules/*.md', purpose: 'Path-scoped rules (conditional on paths frontmatter)', whenToUse: 'File-type specific conventions' },
    // MCP Server Scoping
    { category: 'MCP Scoping', name: '.mcp.json', purpose: 'Project-level (shared, version controlled)', whenToUse: 'Team tooling' },
    { category: 'MCP Scoping', name: '~/.claude.json', purpose: 'User-level (personal)', whenToUse: 'Personal/experimental servers' },
    // Skill/Command Locations
    { category: 'Skills & Commands', name: '.claude/commands/', purpose: 'Project-scoped commands (shared via VCS)', whenToUse: 'Team-wide slash commands' },
    { category: 'Skills & Commands', name: '~/.claude/commands/', purpose: 'User-scoped commands (personal)', whenToUse: 'Personal slash commands' },
    { category: 'Skills & Commands', name: '.claude/skills/SKILL.md', purpose: 'Project-scoped skills', whenToUse: 'On-demand specialized tasks' },
    // Skill Frontmatter
    { category: 'Skill Frontmatter', name: 'context: fork', purpose: 'Isolate skill output from main conversation', whenToUse: 'Verbose/exploratory skills' },
    { category: 'Skill Frontmatter', name: 'allowed-tools', purpose: 'Restrict tool access during skill execution', whenToUse: 'Security-sensitive skills' },
    { category: 'Skill Frontmatter', name: 'argument-hint', purpose: 'Prompt for required parameters', whenToUse: 'Skills that need user input' },
    // MCP Error Response
    { category: 'MCP Error Response', name: 'isError: true', purpose: 'Signal tool failure to agent', whenToUse: 'Any tool error' },
    { category: 'MCP Error Response', name: 'errorCategory', purpose: 'Classify error type (transient|validation|business|permission)', whenToUse: 'Enable appropriate recovery' },
    { category: 'MCP Error Response', name: 'isRetryable', purpose: 'Indicate if retry is appropriate', whenToUse: 'Prevent wasted retries on permanent failures' },
    // Batch API
    { category: 'Batch API', name: 'Message Batches API', purpose: '50% cost savings, up to 24-hour processing window', whenToUse: 'Overnight reports, weekly audits, nightly processing' },
    { category: 'Batch API', name: 'custom_id', purpose: 'Correlate batch request/response pairs', whenToUse: 'Track individual items in batch results' },
    { category: 'CLI Flags', name: '--output-format json + --json-schema', purpose: 'Enforce structured findings output for CI parsing', whenToUse: 'Automated PR review pipelines that post inline comments' },
  ],

  // ---------------------------------------------------------------------------
  // Architect Reference Matrix
  // ---------------------------------------------------------------------------
  matrix: {
    constraints: ['Token Bloat', 'Latency', 'Compliance/Control', 'Accuracy'],
    domains: ['Data Extraction', 'Customer Support', 'Dev Productivity', 'Multi-Agent'],
    cells: {
      'Token Bloat:Data Extraction': '—',
      'Token Bloat:Customer Support': 'Filter Stale Results',
      'Token Bloat:Dev Productivity': 'Scratchpad File',
      'Token Bloat:Multi-Agent': 'Shared Vector Store',
      'Latency:Data Extraction': 'Batch Routing',
      'Latency:Customer Support': '—',
      'Latency:Dev Productivity': '—',
      'Latency:Multi-Agent': 'Parallelization & Caching',
      'Compliance/Control:Data Extraction': '—',
      'Compliance/Control:Customer Support': 'App-Layer Intercepts',
      'Compliance/Control:Dev Productivity': '—',
      'Compliance/Control:Multi-Agent': 'tool_choice Enforcement',
      'Accuracy:Data Extraction': 'Schema Redundancy',
      'Accuracy:Customer Support': '—',
      'Accuracy:Dev Productivity': 'Granular MCP Tools',
      'Accuracy:Multi-Agent': 'Structured Intermediates',
    },
    hierarchyOfConstraints: [
      { constraint: 'Latency', mitigatedBy: 'Parallelization & Caching' },
      { constraint: 'Accuracy', mitigatedBy: 'Structured Intermediates & Few-Shot Prompts' },
      { constraint: 'Cost', mitigatedBy: 'Batch APIs & Context Pruning' },
      { constraint: 'Compliance', mitigatedBy: 'Application-Layer Intercepts (NOT Prompts)' },
    ],
    productionBlueprint: {
      layers: [
        'User -> Pattern Router -> [Real-time | Batch]',
        'Execution Layer: Granular Tools + Application Intercepts (Validation, Policy, Schema)',
        'State Management: Pruning Logic + Shared Vector Store',
        'Synthesis: Result Aggregation, Formatting, Delivery',
      ],
      principles: [
        'Intelligence at the edges (routing)',
        'Strict typing in the middle (schemas)',
        'Application intercepts guarding the core (compliance)',
        'Shared memory sustaining the lifecycle (state)',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Community Tips
  // ---------------------------------------------------------------------------
  communityTips: [
    {
      category: 'Exam Nature',
      points: [
        'Exam tests application over memorization — you must know WHY you\'d choose a specific architecture',
        'Questions are scenario-based, testing practical judgment about trade-offs',
        'Strictly proctored (camera, mic, screen sharing) — no tabs open, no Claude assistance',
        'Currently requires Anthropic Partner company access (may change)',
      ],
    },
    {
      category: 'Study Approach That Worked',
      points: [
        '"Spent a few focused days going really deep into the architecture patterns"',
        '"Drilled about 60 highly specific scenario questions to make sure I had all the edge cases down"',
        '"Focused heavily on practical application and architectural patterns"',
        '"Rigorous scenario-based practice questions covering MCP tool use, context window optimization, and Human-in-the-Loop workflows"',
      ],
    },
    {
      category: 'Key Topics Highlighted',
      points: [
        'Prompt engineering for tool use',
        'Managing context windows efficiently',
        'Human-in-the-Loop workflows',
        'Data extraction failure mitigation',
        'Context window limits management without burning through token costs',
        'Cost vs latency design choices',
        'MCP (Model Context Protocol)',
        'API routing for cost/latency',
        'Structuring JSON to prevent hallucinations',
      ],
    },
    {
      category: 'Most Valuable Takeaway',
      points: [
        '"Even if you can\'t take the exam, all the study materials on the Anthropic Academy are FREE and public."',
      ],
    },
    {
      category: 'Study Resources',
      points: [
        'Anthropic Academy (Skilljar) — free courses',
        'The Architect\'s Playbook (diagrams embedded in Domain pages)',
        'Exam Guide (PDF)',
        'Claude Cookbooks (GitHub)',
        'Hands-on building experience with Claude APIs, Agent SDK, Claude Code, and MCP',
      ],
    },
    {
      category: 'What the Exam Forces You to Learn',
      points: [
        'Building reliable, cost-effective, and scalable agentic systems',
        'Edge cases in data extraction and context management',
        'Understanding the difference between prompt-based and programmatic enforcement',
        'Production architecture trade-offs (not just prototyping)',
      ],
    },
  ],
};

// =============================================================================
// RESOURCES & STUDY TIPS
// =============================================================================

export const resources = {
  official: [
    { title: 'Anthropic Academy (Skilljar)', url: 'https://anthropic.skilljar.com/' },
    { title: 'CCA-F Exam Guide & FAQs', url: 'https://anthropic.skilljar.com/claude-certified-architect-foundations-access-request' },
    { title: "Architect's Playbook (diagrams embedded in Domain pages)", url: '/domains/d1' },
  ],
  documentation: [
    { title: 'Claude API Docs', url: 'https://docs.anthropic.com/' },
    { title: 'Tool Use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    { title: 'Prompt Engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering' },
    { title: 'Batch Processing', url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing' },
    { title: 'Prompt Caching', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching' },
    { title: 'Context Windows', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    { title: 'Agent SDK', url: 'https://docs.anthropic.com/en/docs/agents' },
    { title: 'Claude Code', url: 'https://docs.anthropic.com/en/docs/claude-code' },
    { title: 'Claude Code Configuration', url: 'https://docs.anthropic.com/en/docs/claude-code/settings' },
    { title: 'Claude Code CLI Reference', url: 'https://docs.anthropic.com/en/docs/claude-code/cli-reference' },
    { title: 'Claude Code MCP Integration', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
    { title: 'JSON Mode', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#json-mode' },
    { title: 'MCP Specification', url: 'https://modelcontextprotocol.io/' },
    { title: 'MCP Quickstart', url: 'https://modelcontextprotocol.io/quickstart' },
  ],
  cookbooks: [
    { title: 'Claude Cookbooks (GitHub)', url: 'https://github.com/anthropics/claude-cookbooks' },
    { title: 'Agent Patterns', url: 'https://github.com/anthropics/claude-cookbooks/tree/main/patterns/agents' },
    { title: 'Agent SDK Examples', url: 'https://github.com/anthropics/claude-cookbooks/tree/main/claude_agent_sdk' },
    { title: 'Tool Use Examples', url: 'https://github.com/anthropics/claude-cookbooks/tree/main/tool_use' },
  ],
  community: [
    { title: 'Reddit: Passed CCA-F with 985/1000', url: 'https://www.reddit.com/r/ClaudeAI/comments/1ruf70b/just_passed_the_new_claude_certified_architect/' },
  ],
  coursesToSkip: [
    'AI Fluency: Framework & Foundations (general AI literacy)',
    'AI Fluency for educators / students / nonprofits (audience-specific)',
    'Teaching AI Fluency (instructor course)',
    'Claude with Amazon Bedrock (cloud-specific deployment)',
    "Claude with Google Cloud's Vertex AI (cloud-specific deployment)",
  ],
};

export const courseWatchFors = {
  'Course 2': 'KI Project uses callAI() with Vercel AI SDK wrapping Claude API. You know tool use, structured output, multi-model. Watch for: formal API patterns (prompt caching API, extended thinking mode, RAG) that may differ from SDK abstractions you used.',
  'Course 3': 'Key exam distinction: Tools = model-controlled (Claude decides when to call), Resources = application-controlled (app decides what to expose), Prompts = user-controlled (user selects a pre-built workflow).',
  'Course 4': 'You implemented both stdio and HTTP transports in your MCP servers, plus session management in MoltBook. Watch for: Sampling (server-initiated LLM calls), Roots (file access permissions), and formal transport selection criteria — these may have concepts beyond what you implemented.',
};

export const keyDocsPerPhase = {
  '2.1': [
    { title: 'Agent SDK Documentation', url: 'https://docs.anthropic.com/en/docs/agents' },
    { title: 'Claude API Tool Use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
  ],
  '2.2': [
    { title: 'Claude Code Overview', url: 'https://docs.anthropic.com/en/docs/claude-code' },
    { title: 'Claude Code Configuration', url: 'https://docs.anthropic.com/en/docs/claude-code/settings' },
    { title: 'Claude Code CLI Reference', url: 'https://docs.anthropic.com/en/docs/claude-code/cli-reference' },
  ],
  '2.3': [
    { title: 'Tool Use Guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use' },
    { title: 'Prompt Engineering Guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering' },
    { title: 'JSON Mode', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#json-mode' },
  ],
  '2.4': [
    { title: 'MCP Specification', url: 'https://modelcontextprotocol.io/' },
    { title: 'MCP Quickstart', url: 'https://modelcontextprotocol.io/quickstart' },
    { title: 'Claude Code MCP Integration', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
  ],
  '2.5': [
    { title: 'Prompt Caching', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching' },
    { title: 'Context Window Guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
  ],
};

// =============================================================================
// GLOSSARY
// =============================================================================

export const glossary = [
  // --- Core AI Concepts ---
  { term: 'LLM (Large Language Model)', definition: 'AI model trained on massive text corpora. Claude is Anthropic\'s LLM family: Opus (most capable), Sonnet (balanced), Haiku (fastest/cheapest).', category: 'Core AI' },
  { term: 'Agent', definition: 'Software that wraps an LLM — collects context, manages history, reads files, calls APIs, and assembles everything into each model request. Claude Code and Copilot CLI are agents.', category: 'Core AI' },
  { term: 'Context window', definition: 'Maximum text a model can see in one request, measured in tokens. Sonnet: 200K tokens (~500 pages), Opus: 1M tokens (~2,500 pages).', category: 'Core AI' },
  { term: 'Token', definition: 'Unit of text (~4 characters). Context window size and API costs are measured in tokens.', category: 'Core AI' },
  { term: 'System prompt', definition: 'Top-level instructions defining the model\'s role, constraints, and behavior. Loaded once per session. Can inadvertently steer tool selection via keywords.', category: 'Core AI' },
  { term: 'Temperature', definition: 'Parameter controlling output randomness (0 = deterministic, 1 = creative). Does NOT ensure format consistency — use few-shot examples instead.', category: 'Core AI' },
  { term: 'Hallucination', definition: 'Model invention of plausible but false information. Reduced by: structured schemas, few-shot examples, validation loops, and nullable fields for missing data.', category: 'Core AI' },
  { term: 'Model tiering', definition: 'Using different models by task complexity: Opus for reasoning, Sonnet for execution/analysis, Haiku for lookups/high-volume. Optimizes cost vs capability.', category: 'Core AI' },
  // --- Claude-Specific ---
  { term: 'Claude Code', definition: 'Anthropic\'s AI CLI tool for code generation, refactoring, and analysis. Configured via CLAUDE.md, custom skills, and hooks.', category: 'Claude Code' },
  { term: 'CLAUDE.md', definition: 'Markdown file providing context to Claude Code. Hierarchy: user-level (~/.claude/CLAUDE.md) → project-level (.claude/CLAUDE.md) → directory-level. Always loaded.', category: 'Claude Code' },
  { term: 'Skill', definition: 'Custom slash command with SKILL.md file and YAML frontmatter. Invoked on-demand (/commit, /analyze). Unlike CLAUDE.md, NOT loaded automatically.', category: 'Claude Code' },
  { term: 'Hook', definition: 'Application-layer lifecycle intercept: SessionStart, PreToolUse, PostToolUse, Stop. Deterministic (always executes) — unlike prompts (~3% failure rate).', category: 'Claude Code' },
  { term: 'Rules (.claude/rules/)', definition: 'Path-scoped convention files with glob patterns (e.g., paths: ["**/*.test.tsx"]). Auto-loaded only when editing matching files. Reduces irrelevant context.', category: 'Claude Code' },
  { term: 'Plan mode', definition: 'Claude Code mode for safe exploration and design before implementation. Use for: multi-file restructuring, multiple valid approaches. Contrast: direct execution for clear-scope changes.', category: 'Claude Code' },
  { term: 'Direct execution', definition: 'Immediately implementing a change without planning. Appropriate for well-defined, single-file changes. Contrast with plan mode.', category: 'Claude Code' },
  { term: 'context: fork', definition: 'SKILL.md frontmatter that runs a skill in an isolated sub-agent context. Prevents verbose output from polluting the main conversation.', category: 'Claude Code' },
  { term: 'allowed-tools', definition: 'SKILL.md frontmatter restricting which tools a skill can invoke. Implements principle of least privilege.', category: 'Claude Code' },
  { term: 'argument-hint', definition: 'SKILL.md frontmatter that prompts for required parameters during slash command invocation.', category: 'Claude Code' },
  { term: '-p / --print flag', definition: 'Runs Claude Code in non-interactive mode for CI/CD pipelines. Processes prompt, outputs to stdout, exits without waiting for input.', category: 'Claude Code' },
  { term: '--output-format json', definition: 'CLI flag enforcing JSON output. Combined with --json-schema, guarantees structured findings for automated parsing.', category: 'Claude Code' },
  { term: '@import', definition: 'Syntax for including external files into CLAUDE.md, enabling modular organization of large instruction sets.', category: 'Claude Code' },
  { term: 'Agent SDK', definition: 'Anthropic\'s framework for building multi-agent systems with tool integration, hooks, and subagent orchestration.', category: 'Claude Code' },
  // --- MCP ---
  { term: 'MCP (Model Context Protocol)', definition: 'Open standard for connecting AI models to external tools, resources, and prompts. Architecture: client (model) ↔ server (provider) over transport (stdio/HTTP).', category: 'MCP' },
  { term: 'MCP tools', definition: 'Model-controlled operations exposed by MCP servers. Claude decides when to call them based on tool descriptions.', category: 'MCP' },
  { term: 'MCP resources', definition: 'Application-controlled read-only content (schemas, templates, issue summaries). App decides what to expose — reduces exploratory tool calls.', category: 'MCP' },
  { term: 'MCP prompts', definition: 'User-controlled pre-built workflows. User selects which prompt to run — enables reusable interaction patterns.', category: 'MCP' },
  { term: 'Transport (stdio/HTTP)', definition: 'MCP communication channel. stdio: for IDE/subprocess integration (zero install). HTTP: for persistent shared servers. Selection based on deployment model.', category: 'MCP' },
  { term: 'Sampling', definition: 'Server-initiated LLM calls — the MCP server asks the model to reason about something during protocol operations.', category: 'MCP' },
  { term: 'Roots', definition: 'MCP file access permissions. Defines which filesystem paths the server can access.', category: 'MCP' },
  // --- API Concepts ---
  { term: 'tool_use', definition: 'API capability for models to invoke external functions. Model returns tool call request; application executes and returns results.', category: 'API' },
  { term: 'tool_choice', definition: 'API parameter: "auto" (model may skip tools), "any" (must call a tool), forced (must call specific tool). Use forced for execution ordering.', category: 'API' },
  { term: 'stop_reason', definition: 'Field indicating why the model stopped: "tool_use" = continue loop (execute tool), "end_turn" = terminate loop (done), "max_tokens" = truncated.', category: 'API' },
  { term: 'end_turn', definition: 'stop_reason value indicating Claude completed its response. The agentic loop should terminate.', category: 'API' },
  { term: 'Messages API', definition: 'Synchronous Claude API for real-time conversations and tool calling. Required for latency-sensitive operations (pre-merge checks).', category: 'API' },
  { term: 'Message Batches API', definition: 'Asynchronous API with 50% cost savings and up to 24-hour processing. Cannot support iterative tool calling. Use for scheduled tasks (overnight reports).', category: 'API' },
  { term: 'custom_id', definition: 'Field in batch requests for correlating input/output pairs. Enables tracking individual items in batch results.', category: 'API' },
  { term: 'Prompt caching', definition: 'Reusing stable prefixes (system prompt + examples) across requests to reduce cost. Effective for 80K+ token stable content.', category: 'API' },
  { term: 'Extended thinking', definition: 'Claude capability for more thorough deliberation before producing output. Useful for complex reasoning tasks.', category: 'API' },
  { term: 'Streaming', definition: 'Real-time token-by-token output delivery, enabling progressive display. Versus non-streaming (full response at once).', category: 'API' },
  // --- Architecture Patterns ---
  { term: 'Agentic loop', definition: 'Core execution pattern: send request → check stop_reason → if "tool_use", execute tools and loop → if "end_turn", terminate. Foundation of all agent architectures.', category: 'Architecture' },
  { term: 'Hub-and-spoke / Coordinator-subagent', definition: 'Architecture where a coordinator manages all subagent communication. Provides: centralized observability, consistent error handling, information flow control.', category: 'Architecture' },
  { term: 'Subagent', definition: 'Specialized agent spawned by a coordinator for a focused task. Has isolated context and restricted tool access. Returns results to coordinator.', category: 'Architecture' },
  { term: 'Task decomposition', definition: 'Breaking complex work into subtasks. Fixed (prompt chaining) or dynamic (adaptive based on discoveries). Must cover all relevant domains — narrow decomposition is a common root cause of incomplete results.', category: 'Architecture' },
  { term: 'Escalation', definition: 'Routing from agent to human. Triggers: policy gaps, information conflicts, exceeded authority. NOT emotional signals like customer frustration.', category: 'Architecture' },
  { term: 'Human-in-the-loop', definition: 'Automation + human oversight: automate when confidence >90%, human review for 80-90%, human-only for <80%. Validate per field type, not just aggregate.', category: 'Architecture' },
  { term: 'Circuit breaker', definition: 'Pattern tracking failures over time, pausing requests temporarily. Used for rate limiting and provider availability. Prevents cascading failures.', category: 'Architecture' },
  { term: 'Graceful degradation', definition: 'Providing partial results with transparency about what failed, rather than crashing. Include: coverage annotations, recovery suggestions, what was attempted.', category: 'Architecture' },
  { term: 'Prerequisite gate', definition: 'Programmatic block preventing downstream tools until prerequisites return verified data (e.g., block process_refund until get_customer returns verified ID).', category: 'Architecture' },
  { term: 'Multi-concern request', definition: 'Single message addressing multiple issues. Solution: decompose → investigate in parallel with shared context → synthesize unified resolution.', category: 'Architecture' },
  // --- Prompt Engineering ---
  { term: 'Few-shot prompting', definition: 'Providing 2-4 concrete examples before the task. More effective than prose instructions for: consistent format, ambiguous classification, severity calibration.', category: 'Prompt Engineering' },
  { term: 'Zero-shot prompting', definition: 'Asking the model to perform without examples. Less effective than few-shot for consistent output and nuanced classification.', category: 'Prompt Engineering' },
  { term: 'Structured output', definition: 'Enforcing specific output format via tool_use + JSON schema. Guarantees well-formed data. Cannot prevent semantic errors (wrong values).', category: 'Prompt Engineering' },
  { term: 'JSON schema', definition: 'Formal specification of output structure: required/optional fields, enum values, types. Use "other" + detail catch-all for resilient enums.', category: 'Prompt Engineering' },
  { term: 'Schema redundancy', definition: 'Including calculated fields alongside extracted values (e.g., calculated_total vs stated_total). Detects extraction errors via mismatch.', category: 'Prompt Engineering' },
  { term: 'Resilient schema / Catch-all', definition: 'Adding "other" enum value + detail string field instead of continuously expanding enums. Handles unexpected categories without validation errors.', category: 'Prompt Engineering' },
  { term: 'Validation loop', definition: 'Iterative refinement: extract → validate → if failed, append specific errors → retry. Effective for format errors; ineffective for missing information.', category: 'Prompt Engineering' },
  { term: 'Retry-with-feedback', definition: 'Providing specific validation errors alongside original content on retry. More effective than generic retries. Recognizes when to fail fast (missing data ≠ format error).', category: 'Prompt Engineering' },
  { term: 'Explicit criteria', definition: 'Replacing vague instructions ("check comments are accurate") with precise definitions ("flag comments only when claimed behavior contradicts actual code").', category: 'Prompt Engineering' },
  { term: 'Severity calibration', definition: 'Ensuring consistent issue classification via explicit criteria with concrete code examples for each level. NOT temperature or static mappings.', category: 'Prompt Engineering' },
  { term: 'Self-review limitation', definition: 'Model retains reasoning context from generation, causing confirmation bias. Solution: independent review instance without access to generator\'s reasoning.', category: 'Prompt Engineering' },
  { term: 'Multi-pass review', definition: 'Per-file analysis for local issues + separate integration pass for cross-file data flow. Addresses attention dilution in large PRs.', category: 'Prompt Engineering' },
  // --- Context Management ---
  { term: 'Context pruning', definition: 'Filtering verbose tool results to only essential fields before adding to conversation. Reduces token waste from 40+ fields to 4-5 key fields.', category: 'Context Management' },
  { term: 'Progressive summarization', definition: 'Condensing older conversation turns at capacity threshold (e.g., 70%). Risk: loses precise values. Mitigate by extracting case facts first.', category: 'Context Management' },
  { term: 'Case facts', definition: 'Persistent structured block (amounts, dates, expectations) preserved outside summarized history. Survives progressive summarization intact.', category: 'Context Management' },
  { term: 'Lost-in-the-middle', definition: 'Models attend more reliably to start and end of context; middle content may be missed. Mitigate: key findings at start, action items at end.', category: 'Context Management' },
  { term: 'Primacy/recency effect', definition: 'Cognitive bias favoring first and last information. Exploit by strategic placement: summary at start, details in middle, actions at end.', category: 'Context Management' },
  { term: 'Autocompact', definition: 'Automatic compression of older messages when context window fills. Agent may lose early conversation details. Mitigated by subagent isolation.', category: 'Context Management' },
  { term: 'Scratchpad pattern', definition: 'Agent maintains a file recording key findings and decisions for continuous reference across extended sessions.', category: 'Context Management' },
  { term: 'Coverage annotations', definition: 'Marking which topic areas have complete data vs gaps when input quality is mixed. Enables downstream consumers to assess confidence by section.', category: 'Context Management' },
  { term: 'Session resumption', definition: 'Continuing a prior conversation. Filter out stale tool_result messages, keep only human/assistant turns to force re-fetching current data.', category: 'Context Management' },
  // --- Tool Design ---
  { term: 'Tool descriptions', definition: 'Primary input LLMs use for tool selection. Must include: purpose, input formats, examples, edge cases, boundaries vs similar tools. Minimal descriptions → misrouting.', category: 'Tool Design' },
  { term: 'isError', definition: 'MCP response flag indicating tool failure. Return error in tool result with isError: true — never throw exceptions that crash the agent.', category: 'Tool Design' },
  { term: 'errorCategory', definition: 'Structured error classification: transient (retryable), validation (not retryable), business (policy violation), permission (auth failure).', category: 'Tool Design' },
  { term: 'isRetryable', definition: 'Error metadata indicating whether the operation should be retried. Prevents wasted retries on permanent failures.', category: 'Tool Design' },
  { term: 'Granular tools', definition: 'Purpose-specific tools (list_imports, resolve_deps) instead of broad monolithic tools (analyze_dependencies). Principle of least privilege.', category: 'Tool Design' },
  { term: 'Keyword steering', definition: 'System prompt wording that unintentionally triggers specific tool selection based on keyword associations (e.g., "account" → get_customer 78% of the time).', category: 'Tool Design' },
  { term: 'PostToolUse hook', definition: 'Intercepts tool results before model processes them. Use for: data normalization, compliance validation, format transformation.', category: 'Tool Design' },
  // --- CI/CD & Cost ---
  { term: 'False positive', definition: 'Incorrect finding flagging acceptable code. High FP rates erode developer trust. Fix: disable high-FP categories while improving prompts, keep high-precision categories active.', category: 'CI/CD & Cost' },
  { term: 'Batch vs real-time decision', definition: 'Blocking workflows (pre-merge) → synchronous API. Scheduled workflows with flexible timelines (overnight, weekly) → Batch API (50% savings).', category: 'CI/CD & Cost' },
  { term: 'Prompt failure rate', definition: '~3% even with emphatic instructions ("NEVER process >$500"). Justifies using hooks/application-layer intercepts for zero-tolerance compliance.', category: 'CI/CD & Cost' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getTaskStats() {
  const total = domains.reduce((sum, d) => sum + d.taskStatements.length, 0);
  const reviewed = domains.reduce(
    (sum, d) => sum + d.taskStatements.filter((t) => t.status === 'reviewed').length,
    0
  );
  return { total, reviewed };
}

export function getCurrentPhase() {
  return studyPlan.phases.find((p) => p.status === 'in_progress') || studyPlan.phases[0];
}

export function getDomain(id) {
  return domains.find((d) => d.id === id);
}

export function getScenario(id) {
  return scenarios.find((s) => s.id === id);
}

export function getProject(id) {
  return myProjects.find((p) => p.id === id);
}

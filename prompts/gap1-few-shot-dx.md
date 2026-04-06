Plan the implementation of few-shot input→output examples in the DX code reviewer agent.

## Context

In the DX Plugin System, the code reviewer agent (`agents/dx-code-reviewer.md`) already has a confidence-based filtering system:

| Score | Meaning | Action |
|-------|---------|--------|
| 0-75  | Not verified enough | **DROP** |
| 80+   | Verified with evidence | **REPORT** |
| 100   | Absolutely certain | **REPORT** |

It also has an exact output format template (`Return EXACTLY this structure`) with fields for file:line, rule reference, issue, why, and fix. The reviewer classifies findings by severity (Critical, Important, Minor) and filters by confidence threshold.

However, it relies entirely on **rules and templates** — there are no concrete input→output examples showing the reviewer how to handle ambiguous cases. The exam (Task 4.2) specifically tests: "2-4 targeted examples for ambiguous scenarios showing reasoning for choices" and notes that "concrete examples outperform abstract rules for nuanced classification."

## Goal

Add 2-4 few-shot examples to the code reviewer agent that demonstrate correct classification of ambiguous findings — cases where the right answer isn't obvious from rules alone. The examples should teach the model to distinguish:

- Real bugs vs local conventions/intentional patterns
- Security issues vs acceptable internal-only code
- Missing error handling that matters vs defensive overkill
- Style issues that look like bugs but aren't

## Design Constraints

- Add examples to `agents/dx-code-reviewer.md` (or a referenced file if the agent is already large)
- Each example should show: input code snippet → complete output in the exact format the reviewer already uses (confidence, severity, issue, why, fix, or DROP reasoning)
- Include at least one example of each decision: REPORT (high confidence, real issue) and DROP (looks like a bug but isn't)
- Examples should be realistic to the DX Plugin codebase — AEM components, Sling models, clientlibs, HTL templates, OSGi services — not generic JavaScript
- Examples should demonstrate the REASONING, not just the classification — show WHY the confidence score is what it is
- Don't bloat the agent prompt — keep examples concise (each ~10-15 lines). The total addition should be under 100 lines
- Consider whether examples belong in the agent file directly, in a shared reference file, or in a rule file under `.claude/rules/`
- Preserve the existing confidence table and output format — examples supplement, not replace
- If the agent already has inline examples of any kind, extend them rather than creating a parallel section

## Example Structure (adapt to actual codebase patterns)

Example 1 — REPORT (confidence: 90, Critical):

Input (OSGi service):

    @Reference
    private ResourceResolverFactory resolverFactory;

    public String getData() {
        ResourceResolver resolver = resolverFactory.getServiceResourceResolver(authInfo);
        Resource resource = resolver.getResource(path);
        return resource.getValueMap().get("title", String.class);
        // resolver never closed
    }

Output: `{confidence: 90, severity: "critical", issue: "ResourceResolver leak — unclosed service resolver", why: "Service resolvers are not request-scoped and will never be auto-closed. Each leak consumes a JCR session until the pool is exhausted.", fix: "Wrap in try-with-resources: try (ResourceResolver resolver = ...) { ... }"}`

Example 2 — DROP (confidence: 35):

Input (HTL template):

    <div class="cmp-teaser" data-cmp-is="teaser"
         data-sly-use.model="com.site.models.Teaser">
        <h2>${model.title}</h2>
        <p>${model.description @ context='html'}</p>
    </div>

Output: DROP. `{confidence: 35, reasoning: "@ context='html' looks like an XSS risk but this is the standard HTL pattern for rich text fields authored in AEM's RTE. The content is trusted author input, not user-generated. Flagging this would be a false positive that erodes developer trust."}`

## Key Files to Read

- `agents/dx-code-reviewer.md` — current reviewer instructions, confidence table, output format
- `.claude/rules/` — existing rule files to understand what conventions are already documented
- `CLAUDE.md` (root and plugin level) — project conventions that inform what's "normal" vs "suspicious"
- Any existing skills that reference the code reviewer or contain inline examples
- `shared/error-handling.md` — error classification taxonomy (may inform example selection)

## Deliverable

A step-by-step plan identifying: where exactly the examples should be placed, what ambiguous scenarios to cover (specific to this codebase), how many examples, and how to keep the prompt size manageable. Consider whether examples should be in the agent file, a separate referenced file, or a rule. Do NOT write code yet.

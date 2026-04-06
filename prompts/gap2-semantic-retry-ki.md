Plan the implementation of a semantic retry-with-feedback loop in the party agent system.

## Context

Currently in `packages/engine/src/agent/action-parser.ts`, `validateActions()` detects semantic errors (invalid action types, out-of-range impacts, wrong bill IDs, invalid enums) but silently drops invalid actions with `console.warn` and auto-fills missing mandatory votes with abstain. In `packages/engine/src/agent/party-agent.ts`, `processPartyAgentResult()` retries only on full parse failures — it has no path for "parsed OK but semantically invalid."

## Goal

When `validateActions()` finds fixable semantic errors, instead of silently dropping actions, collect the specific error messages and re-prompt the LLM once with the original context + error feedback. Only fall back to abstain if the retry also fails.

## Design Constraints

- Only retry ONCE for semantic errors (not infinite loops)
- Only retry when errors are fixable (wrong values, constraint violations). Still drop+abstain immediately for missing information or permanent issues
- Preserve the existing parse-retry and abstain-fallback as final safety nets
- Must work with both the Batch API path and the sequential callAI path
- Keep the existing `validateActions()` as the validator — just make it return structured errors instead of (or in addition to) silently dropping
- The retry prompt should include: original user prompt + specific validation errors with the constraint that was violated and the value that was provided
- Use the same model/party config as the original call
- Track retry costs in the existing cost-tracker

## Key Files to Read

- `packages/engine/src/agent/action-parser.ts` — validateActions, parseAgentResponse
- `packages/engine/src/agent/party-agent.ts` — processPartyAgentResult, runPartyAgent
- `packages/engine/src/agent/prompt.ts` — buildSystemPrompt, buildUserPrompt
- `packages/engine/src/agent/client.ts` — callAI
- `packages/engine/src/agent/batch-client.ts` — submitBatch flow
- `packages/engine/src/agent/ai-json.ts` — safeParseJson, parseAIJson

## Example of the Feedback Prompt

After a failed validation, the retry prompt should append something like:

"Your previous response had validation errors:
- budget_impact of +5 exceeds the +/-1 constraint for this action type
- vote on bill B-47 is not valid — that bill is not in third reading (active bills: B-12, B-33, B-41)
- action type 'filibuster' is not in your allowed actions

Re-generate your actions JSON. Keep valid actions unchanged, fix or remove the invalid ones."

## Deliverable

A step-by-step implementation plan identifying exactly which functions change, what the new data flow looks like, and any new types/interfaces needed. Do NOT write code yet.

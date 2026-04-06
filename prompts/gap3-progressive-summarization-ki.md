Plan the implementation of progressive summarization with case facts preservation for the simulation's growing context.

## Context

The simulation runs day after day, accumulating events, media articles, votes, crises, coalition changes, and economic updates. Currently in `packages/engine/src/agent/prompt.ts`, `buildUserPrompt()` uses greedy token-budget allocation across P1/P2/P3 priority sections with 3 depth configs (low: 3K, normal: 8K, high: 16K) defined in `packages/engine/src/agent/context-depth.ts`. When sections exceed the budget, they are simply dropped and a trimming indicator is appended.

The system already has an `era summaries` concept — compressed historical narratives. But there is no automatic mechanism to progressively compress older context as the simulation advances. After hundreds of days, either context is truncated (losing important history) or the token budget must be raised (increasing cost).

## Goal

Implement progressive summarization that automatically compresses older simulation days into era summaries when accumulated context approaches the token budget threshold. Preserve a "case facts" block of critical persistent state that survives all summarization passes.

## Design Constraints

- Trigger summarization when accumulated context reaches ~70% of the configured token budget
- Case facts block (NEVER summarized, always included at full fidelity):
  - Current coalition composition and stability
  - Active bills and their reading stages
  - Ongoing crises (unresolved)
  - Current economic indicators
  - Government ministers
  - Election status
- Summarization targets (compress, don't drop):
  - Resolved crises — one-line outcome
  - Passed/rejected bills — outcome + vote margin
  - Expired motions, old media articles, old party actions — era narrative
  - Completed elections — result summary
- Era boundaries: group days into eras (e.g., every 20-30 simulation days, or triggered by major events like elections or coalition changes)
- Use Haiku for summarization calls (cheapest tier, sufficient for compression)
- Store era summaries persistently so they don't need regeneration each day
- The summarization should be transparent: include a marker like "(Summarized from days 1-30)" so the party agent knows it's working with compressed history
- Must integrate with the existing greedy budget allocator — era summaries become P1.25 priority (between always-included and budget-trimmed)
- Do NOT change the party agent's system prompt or action schema — this is purely a context preparation optimization

## Key Files to Read

- `packages/engine/src/agent/prompt.ts` — buildUserPrompt, buildSystemPrompt, token budget allocation, P1/P2/P3 section construction
- `packages/engine/src/agent/context-depth.ts` — depth configs (low/normal/high), contextTokenBudget, includeP3
- `packages/engine/src/agent/briefing.ts` — daily briefing generation (similar pattern: summarize current state into narrative)
- `packages/engine/src/agent/client.ts` — callAI (for Haiku summarization calls)
- `packages/engine/src/simulation/loop.ts` — daily simulation loop, where summarization would be triggered
- `packages/engine/src/agent/party-profiles.ts` — getPartyProfile (context that's already injected)
- Look for any existing era summary storage, state persistence, or history compaction code

## Example of Progressive Summarization

Day 45 context building:

1. Case facts block (always full): coalition CDU+SPD+Gruene, 3 active bills, GDP +1.2%, unemployment 5.1%, no active crises

2. Era summary (days 1-30): "Coalition formed after tight election (CDU 28%, SPD 25%). Early focus on energy bill B-12 (passed day 18, 52-48). Immigration crisis days 8-15 resolved with compromise amendment. FDP blocked tax reform B-7 (rejected day 22)." (~100 tokens vs ~3000 tokens for raw events)

3. Recent history (days 31-45): full detail, all events/media/actions at current fidelity

## Deliverable

A step-by-step implementation plan identifying: where summarization is triggered in the loop, how era boundaries are determined, the summarization prompt structure, where summaries are stored, how they integrate into the existing budget allocator, and any new types/interfaces needed. Do NOT write code yet.

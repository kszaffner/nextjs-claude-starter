---
name: new-feature
description: Run the full engineering workflow for a new feature or change — understand, size, explore, plan, implement, verify, review. Use for any non-trivial feature request, bug fix, or change.
disable-model-invocation: true
---

# New Feature

Runs inline in the main context (not forked). The developer needs to stay
in the loop throughout — decisions, approvals, and plan revisions all
happen here.

## 1. Understand

Determine, from the request and a short exchange if needed:

- what the developer wants
- expected behavior / acceptance criteria
- constraints (performance, compatibility, deadlines)
- the affected area of the codebase

Do not start coding yet.

## 2. Determine task size

Classify as **SMALL**, **NORMAL**, or **LARGE**. If uncertain, pick the
higher level. See `CLAUDE.md` for the level definitions and examples.

- **SMALL** → skip to step 7 (Implement) after a quick look at the
  affected file(s). No plan document needed.
- **NORMAL** → steps 3, 6, 7, 8, 9 (skip Knowledge Check and Architecture
  unless the change actually touches module boundaries).
- **LARGE** → all steps, including Developer Approval before implementing.

## 3. Explore

Explore progressively — cheapest sources first:

1. `!cat package.json` — stack, scripts, dependencies
2. `!find src/modules -maxdepth 2 -type f` — existing module shape
3. Targeted `@` references to the specific files likely affected
4. Existing tests for the affected area

For large or unclear repository exploration, use `/explore` (forked,
isolated) instead of reading broadly in the main context. Do not read the
entire repository inline.

## 4. Knowledge Check (NORMAL when relevant, always for LARGE)

If a Knowledge Base exists (`.claude/knowledge/index.md`) and is not
disabled, check the index for topics relevant to this task. Follow
`.claude/skills/knowledge/SKILL.md` for the exact retrieval flow
(index-first, ask before loading). Skip entirely if no Knowledge Base
exists or it's disabled — do not ask.

## 5. Architecture (LARGE, or any change touching module boundaries)

Perform an architecture analysis when the change affects:

- module boundaries or a new module
- cross-module dependencies
- public APIs (`index.ts` exports)
- data ownership
- server/client boundaries
- major structural changes

Apply `.claude/rules/architecture.md`. State the decision and why, not
just the conclusion.

## 6. Plan

Produce a concise plan:

- files/components/modules affected
- key architectural decisions (if any)
- implementation approach
- tests to add/update
- verification to run

Keep it proportional to task size — a NORMAL task's plan is a few bullet
points, not a document.

## 7. Approval

**LARGE tasks require explicit developer approval before implementation.**
Present the plan and wait. Do not implement before approval.

If implementation later reveals the plan must materially change: stop,
explain what changed and why, present the revised plan, and get approval
again before continuing.

## 8. Implement

Follow the Rules in `.claude/rules/` (architecture, react, nextjs,
typescript, testing, security — scoped automatically by file path). Reuse
existing patterns in the codebase. Avoid unnecessary abstractions —
see the "progressive architecture" principle in
`.claude/rules/architecture.md`.

## 9. Verify

Run the checks relevant to the change — at minimum:

```text
!pnpm typecheck
!pnpm lint
!pnpm test
```

Add `!pnpm architecture:check` if module boundaries were touched, and
`!pnpm build` for LARGE tasks or anything touching routing/config.

Never state that a check passed without having actually run it.

## 10. Code Review

Run `/code-review`.

## 11. Fix loop

If the review has actionable findings:

```text
Fix → Verify → Review again
```

Repeat until no actionable findings remain, or the developer explicitly
stops the loop.

## 12. Knowledge Review

If a Knowledge Base exists and is not disabled, and something meaningful
about WHY the project works this way changed (a decision, a constraint, a
non-obvious tradeoff) — not just WHAT changed — follow the Knowledge
Review flow in `.claude/skills/knowledge/SKILL.md`.

## 13. Done

Give a concise summary: what changed, what verification actually ran (and
its result), review findings/fixes, and any Knowledge changes. No
unnecessary narrative.

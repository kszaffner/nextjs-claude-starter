# CLAUDE.md

## Project identity

`nextjs-claude-starter` — an AI-native engineering starter for Next.js,
copied into a project to make Claude Code work as an engineering
assistant, not a code-completion prompt. See `README.md` and `AGENTS.md`
for the full picture; this file stays short on purpose (see
"Context efficiency" below) — detailed procedures live in Skills,
detailed constraints live in Rules, project decisions live in Knowledge.

## Architecture summary

Feature-oriented: `src/app` (thin routes/composition) →
`src/modules/<name>` (business logic + UI, public API via `index.ts`) →
`src/shared` (genuinely reusable, business-agnostic code only).
`shared → modules` and reaching into another module's internals are
forbidden and mechanically enforced. Full detail: `docs/architecture.md`
and `.claude/rules/architecture.md`.

## Engineering workflow

Classify every task as **SMALL**, **NORMAL**, or **LARGE**. If unsure,
pick the higher level.

- **SMALL** (copy tweak, rename, obvious small fix): Understand → Implement → Verify.
- **NORMAL** (new component, filtering, moderate bug fix, API integration): Understand → Explore → Plan → Implement → Verify → Code Review.
- **LARGE** (new module, auth, checkout, major refactor, cross-module or infra change): Understand → Explore → Knowledge Check → Architecture → Plan → **Developer Approval** → Implement → Verify → Code Review → Fix/Verify/Review loop → Knowledge Review.

**LARGE tasks require explicit developer approval before implementation.**
If the plan must change materially mid-implementation: stop, explain
what/why, present the revised plan, get approval again.

Run this via `/new-feature` (see `.claude/skills/new-feature/SKILL.md`
for the full procedure — do not duplicate it here).

## Key commands

```text
pnpm dev                    # dev server
pnpm lint                   # eslint
pnpm typecheck              # tsc --noEmit
pnpm test                   # vitest
pnpm architecture:check     # dependency-cruiser
pnpm build                  # production build
pnpm check                  # lint + typecheck + architecture:check + test
```

Never claim a check passed without actually running it.

## Non-negotiable rules

- Full rules: `.claude/rules/` (architecture, react, nextjs, typescript,
  testing, security) — loaded selectively by file path, do not restate
  them here.
- No `shared → modules` dependency. No reaching into another module's
  internals — use its `index.ts` public API. No circular dependencies.
- LARGE tasks: no implementation before developer approval.
- Never modify a test to hide an incorrect implementation.
- Deterministic work (lint/typecheck/test/build/architecture check) uses
  tooling; reasoning work (tradeoffs, requirements, security judgment,
  whether an abstraction is justified) uses Claude. Don't swap the two.

## Knowledge behavior

If `.claude/knowledge/` exists and isn't disabled: check the index
(`index.md`) for relevant topics before a task, ask before loading
("Do you want to load the knowledge base for this task?"), and ask before
saving after a task with a meaningful WHY-level change. Never auto-load
the whole base. Full flow: `.claude/skills/knowledge/SKILL.md`. If
Knowledge doesn't exist or is disabled, skip all of this silently — don't
ask.

## Context efficiency

Load the minimum context required to make the correct decision: scoped
Rules (via `paths:`), on-demand Skills, index-first Knowledge, targeted
`@` references and shell commands over broad dumps, forked `/explore` for
large repository searches instead of reading everything inline. See
`docs/extending.md` and `docs/workflow.md` for the reasoning.

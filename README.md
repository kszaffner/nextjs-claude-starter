# nextjs-claude-starter

An AI-native engineering starter for Next.js projects using Claude Code —
Rules, Skills, Knowledge, architecture enforcement, verification, and
code review, wired together as a reusable engineering system rather than
a prompt collection.

## 1. What this is

A set of files (`.claude/`, `CLAUDE.md`, `AGENTS.md`, `ai-workflow-config/`) you
copy into a Next.js project so Claude Code works as an engineering
assistant that follows an explicit process:

```text
Rules → Skills → Knowledge → Architecture → Verification → Code Review → controlled implementation
```

It ships with a small working example app (`src/`) demonstrating the
architecture it enforces, and it's built to be practical on ordinary
Claude Code usage — no dependency on large parallel agent teams.

## 2. Why it exists

"Give me a prompt and I'll write some code" doesn't scale past small
changes: it skips understanding requirements, exploring the existing
codebase, checking architecture boundaries, and reviewing the result.
This starter makes that process explicit and sized to the task — a button
label change and a checkout module don't need the same ceremony, but both
need *some* process. See `docs/workflow.md`.

## 3. What's included

```text
.claude/
├── rules/        # WHAT must be true — architecture, react, nextjs, typescript, testing, security
├── skills/       # HOW work is performed — new-feature, code-review, test-loop, knowledge, explore
├── knowledge/    # WHY the project is built this way (optional, Git-versioned)
├── agents/       # agent strategy (minimal by default)
└── hooks/        # deterministic hook strategy + example

ai-workflow-config/
└── dependency-cruiser.cjs   # mechanical architecture enforcement

docs/             # extended documentation for each piece above
example/          # worked SMALL/NORMAL/LARGE workflow walkthroughs
src/              # example app: app/ modules/ shared/
CLAUDE.md         # short project-facing entry point
AGENTS.md         # repository-facing entry point for coding agents
```

`ai-workflow-config/` holds non-Claude project configuration copied alongside
`.claude/` — currently just `dependency-cruiser.cjs`, and the place any
future starter-owned config file (beyond what `.claude/` itself covers)
should land, instead of scattering more dotfiles at the repo root.

## 4. How to install / copy it

V1 is copy-paste — see `docs/getting-started.md` for the full steps.
Short version:

```text
1. Copy .claude/, CLAUDE.md, AGENTS.md, ai-workflow-config/ into your project
2. Add the architecture:check / check scripts to your package.json
3. pnpm add -D dependency-cruiser
4. Don't migrate your existing src/ structure automatically — read
   docs/architecture.md and decide deliberately
```

No CLI, installer, or plugin in V1 by design (`docs/extending.md`
explains why, and how the structure stays installer-ready for later).

## 5. Quick start (this repo's own example)

```text
pnpm install
pnpm dev              # http://localhost:3000 — see /products and /orders
pnpm check            # lint + typecheck + architecture:check + test
```

## 6. Basic usage

Once copied into a project, drive it with the Skills:

```text
/new-feature   add a wishlist toggle to the product card
/explore       find everywhere pricing is computed in this codebase
/code-review
/test-loop
/knowledge assess
```

Claude classifies every request as **SMALL**, **NORMAL**, or **LARGE**
and follows the matching workflow — see `CLAUDE.md` and
`docs/workflow.md`.

## 7. Architecture

Feature-oriented: `src/app` (thin routes) → `src/modules/<name>`
(business logic + UI, public API via `index.ts`) → `src/shared`
(business-agnostic reusable code). `shared → modules`, reaching into
another module's internals, and circular dependencies are forbidden and
mechanically enforced via `pnpm architecture:check`
(`ai-workflow-config/dependency-cruiser.cjs`) — proven by real negative/positive tests in
`test/architecture.test.ts`. Full detail: `docs/architecture.md`.

## 8. Workflow

```text
SMALL:  Understand → Implement → Verify
NORMAL: Understand → Explore → Plan → Implement → Verify → Code Review
LARGE:  Understand → Explore → Knowledge Check → Architecture → Plan →
        Developer Approval → Implement → Verify → Code Review →
        Fix/Verify/Review → Knowledge Review
```

LARGE tasks require explicit developer approval before implementation.
Worked examples for all three sizes: `example/workflow-small.md`,
`example/workflow-normal.md`, `example/workflow-large.md`. Full detail:
`docs/workflow.md`.

## 9. Knowledge

An optional, Git-versioned, index-first Knowledge Base
(`.claude/knowledge/`) capturing WHY the project is built this way —
distinct from code (WHAT), Skills (HOW), and from any environment-level
Auto Memory (developer-specific, not project-owned). It never
auto-loads, always asks before loading or saving, and works with zero
setup if you never touch it. Full detail: `docs/knowledge.md`.

## 10. Verification

```text
pnpm lint                 # eslint
pnpm typecheck             # tsc --noEmit
pnpm test                  # vitest, incl. real architecture enforcement tests
pnpm architecture:check    # dependency-cruiser
pnpm build                 # production build
pnpm check                 # aggregates lint + typecheck + architecture:check + test
```

Claude is expected to actually run these — never to claim a check passed
without having run it in-session.

## 11. How to extend it

New Rule, new Skill, new module, new hook, or eventually a CLI/installer
built on this structure — see `docs/extending.md` for the pattern to
follow and the context-budget principle everything here is checked
against: *load the minimum context required to make the correct
decision.*

## Docs index

`docs/getting-started.md` · `docs/workflow.md` · `docs/architecture.md` ·
`docs/knowledge.md` · `docs/skills.md` · `docs/agents.md` ·
`docs/extending.md`

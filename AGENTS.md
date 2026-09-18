# AGENTS.md

## Repository purpose

This repository is `nextjs-claude-starter`: an AI-native engineering
starter for Next.js projects, built to be copied into a new or existing
Next.js codebase. It ships an example app under `src/` demonstrating the
architecture, plus the full Claude Code configuration (`.claude/`) that
makes the workflow real rather than documentation-only.

## Architecture

Feature-oriented, three layers:

```text
src/
├── app/       # routes, layouts, route-level composition — stays thin
├── modules/   # business features; each exposes a public API via index.ts
└── shared/    # genuinely reusable, business-agnostic code only
```

Dependency direction: `app → modules`, `app → shared`, `modules → shared`,
and `module A → module B` when it's a real business dependency (always
through B's public API, never B's internals). Forbidden:
`shared → modules`, reaching into another module's internal files, and
any circular dependency. This is enforced mechanically by
`ai-workflow-config/dependency-cruiser.cjs` (`pnpm architecture:check`), not just by
convention. Full rationale: `docs/architecture.md`,
`.claude/rules/architecture.md`.

## Project structure

```text
.claude/
├── rules/        # WHAT must be true — scoped by `paths:` frontmatter
├── skills/       # HOW work is performed — /new-feature, /code-review, /test-loop, /knowledge, /explore
├── knowledge/    # WHY the project is built this way (optional, Git-versioned)
├── agents/       # agent strategy (V1: minimal, see agents/README.md)
└── hooks/        # deterministic hook strategy, see hooks/README.md

ai-workflow-config/           # non-Claude project config copied alongside .claude/
docs/             # extended documentation
example/          # notes on the example app under src/
src/              # the example app itself (app/modules/shared)
```

## Important commands

```text
pnpm install
pnpm dev
pnpm lint                # eslint
pnpm typecheck            # tsc --noEmit
pnpm test                 # vitest (includes architecture enforcement tests)
pnpm architecture:check   # dependency-cruiser
pnpm build                # production build
pnpm check                # aggregates lint + typecheck + architecture:check + test
```

## Architecture entry points

- `ai-workflow-config/dependency-cruiser.cjs` — the enforced rules (circular deps,
  `shared → modules`, module-internal reach-through, invalid direction).
- `test/architecture.test.ts` + `test/fixtures/architecture/*` — negative
  and positive tests proving those rules actually fire.
- `src/modules/products`, `src/modules/orders` — the example modules;
  `orders` legitimately depends on `products`' public API.

## Testing

Vitest (`pnpm test`). Component tests use Testing Library
(`@testing-library/react`, jsdom). Architecture rules are tested by
actually invoking dependency-cruiser against fixture repositories, not by
asserting on prose — see `test/architecture.test.ts`.

## Local documentation guidance

Next.js caching, routing, and data-fetching behavior changes between
major versions. For any version-sensitive behavior, check the installed
version first (`node_modules/next/package.json`) and prefer documentation
shipped with that installed version
(`node_modules/next/dist/docs/`, when present) over general training
knowledge, which may describe a different major version. Do not encode
assumptions about future Next.js versions into Rules or code. See
`.claude/rules/nextjs.md`.

## Agent behavior expectations

- Classify every task SMALL/NORMAL/LARGE and follow the matching workflow
  in `CLAUDE.md` / `.claude/skills/new-feature/SKILL.md`. When unsure,
  pick the higher level.
- LARGE tasks require explicit developer approval before implementation —
  do not start implementing first and ask forgiveness after.
- Never state a check (lint/typecheck/test/build/architecture) passed
  without having actually run it in this session.
- Never modify a test to make an incorrect implementation look correct —
  see `.claude/skills/test-loop/SKILL.md`.
- Use `.claude/skills/explore` (forked) for large/unclear repository
  exploration instead of reading broadly in the main context; use
  targeted `@` references and narrow shell commands otherwise.
- Knowledge (`.claude/knowledge/`) is optional and index-first — never
  auto-load the full base, always ask before loading or saving. If it
  isn't present or is disabled, don't mention it.

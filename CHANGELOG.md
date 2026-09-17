# Changelog

## V1

Initial release.

### Engineering workflow

- SMALL / NORMAL / LARGE task classification with matching workflows,
  including a hard developer-approval gate before implementing LARGE
  tasks and a mandatory fix/verify/review loop after code review.
- `.claude/skills/new-feature/SKILL.md` implements the full workflow
  inline, preserving conversation and developer decisions throughout.

### Architecture

- Feature-oriented `src/app` / `src/modules/<name>` / `src/shared`
  structure with an enforced public-API boundary (`index.ts` per
  module).
- `.dependency-cruiser.cjs` mechanically enforces: no circular
  dependencies, no `shared → modules`, no reaching into another module's
  internals, no `app` reaching into module internals.
- `test/architecture.test.ts` + `test/fixtures/architecture/*`: real,
  executed negative tests (invalid shared→module, invalid
  module-internal reach, invalid cycle) and a positive test (valid
  module→module public API), proving the rules actually fire.
- Example app (`src/modules/products`, `src/modules/orders`) with a
  legitimate cross-module dependency.

### Skills

- `/new-feature`, `/code-review`, `/test-loop`, `/knowledge` — run
  inline, `disable-model-invocation: true` for predictable manual
  invocation.
- `/explore` — the one forked Skill (`context: fork`, `agent: Explore`),
  for large/deep repository exploration that shouldn't bloat the main
  context.
- Progressive disclosure inside `code-review` (`checklist.md`,
  `examples.md` loaded on demand, not inlined into `SKILL.md`).

### Rules

- `.claude/rules/architecture.md`, `react.md`, `nextjs.md`,
  `typescript.md`, `testing.md`, `security.md` — scoped via `paths:`
  frontmatter so only relevant rules load for a given file.

### Knowledge

- Optional, index-first, Git-versioned Knowledge Base
  (`.claude/knowledge/`) with `assess`, `init`, `status`, `search`,
  `load`, `update`, `compress`, `disable`, `clear` commands.
- Explicit Yes/No gates before loading or saving, with the exact
  developer-facing phrasing specified for each. `disable` preserves
  files; `clear` requires confirmation.

### Context efficiency

- Short `CLAUDE.md` (identity, architecture summary, workflow, commands,
  non-negotiable rules, Knowledge behavior) — procedures live in Skills,
  constraints in Rules, decisions in Knowledge.
- Deterministic-vs-reasoning split documented and followed throughout:
  tooling for lint/typecheck/test/build/architecture checks, Claude's
  judgment for tradeoffs and semantic architecture decisions.

### Agents & hooks

- `.claude/agents/README.md`: V1 ships no custom agent roster beyond the
  built-in `Explore` agent; explains when/how to add specialized agents
  later.
- `.claude/hooks/README.md` + `.claude/settings.json`: deterministic-only
  hook strategy, with one example hook (lint changed file on
  Edit/Write).

### Documentation

- `docs/getting-started.md`, `workflow.md`, `architecture.md`,
  `knowledge.md`, `skills.md`, `agents.md`, `extending.md`.
- `example/`: three worked walkthroughs (SMALL, NORMAL, LARGE) using the
  shipped example app as the subject.

### Verified

`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm architecture:check`,
and `pnpm build` all pass against the shipped example app as of this
release.

### Known limitations

- No CLI/installer/plugin — copy-paste distribution only (by design for
  V1; see `docs/extending.md`).
- The example app is intentionally minimal (two modules) — it's a
  demonstration, not a reference implementation of a real product.
- The example hook (`lint-changed-file.cjs`) parses `tool_input` from the
  hook payload defensively, since the exact PostToolUse payload shape can
  vary across Claude Code versions — verify it against your installed
  version's hook schema before relying on it in a real project.

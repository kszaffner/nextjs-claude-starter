# Hooks

Hooks in this starter are configured in `.claude/settings.json` (shared,
committed) using Claude Code's hook configuration format. Anything
user-specific or local goes in `.claude/settings.local.json` instead,
which is gitignored — see `.gitignore`.

## Strategy: deterministic only

Hooks run deterministic shell commands in response to tool-use events.
They are the right place for things that have one correct outcome:

- formatting (`prettier`/`eslint --fix` on edited files)
- linting
- deterministic validation (e.g. blocking edits to a generated file)
- running verification commands
- notifications

Hooks are **not** the right place for subjective architectural judgment —
"is this abstraction justified," "does this cross-module dependency make
business sense," "should this be a Server or Client Component." That
judgment belongs to Claude, reasoning inside the workflow described in
`CLAUDE.md` and `.claude/skills/`. Mechanical structural constraints
(dependency direction, public API boundaries, cycles) are enforced by
`.dependency-cruiser.cjs` + `pnpm architecture:check`, and by ESLint/
TypeScript — not by a hook re-implementing that judgment in shell.

See `docs/extending.md` for how to add a project-specific hook without
violating this split.

## What ships in this starter

`.claude/settings.json` includes one example hook: it runs ESLint on a
file right after Claude edits it, so obvious lint issues surface
immediately instead of waiting for `pnpm lint` at verification time. It's
intentionally minimal — add more only when there's a concrete, repeated
need.

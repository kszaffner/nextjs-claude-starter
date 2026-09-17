---
description: Module boundaries, dependency direction, and public APIs for the feature-oriented architecture.
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# Architecture

WHAT must be true. See `docs/architecture.md` for the full explanation and
`.claude/skills/new-feature/SKILL.md` for how architecture decisions fit
into the workflow.

## Structure

- `src/app` — routes, layouts, route-level composition. Stays thin: no
  business logic, only composition of module public APIs.
- `src/modules/<name>` — business features. Owns its logic and UI.
- `src/shared` — genuinely reusable, business-agnostic code only.

## Dependency direction

Allowed:

- `app → modules`
- `app → shared`
- `modules → shared`
- `module A → module B` (when it reflects a real business relationship)

Forbidden:

- `shared → modules` (shared code must never depend on a business module —
  if it needs to, it isn't shared)
- `module A → module B/<internal-file>` (must go through B's public API)
- circular dependencies of any length (`A → B → A`, or longer cycles)

These are enforced mechanically by `pnpm architecture:check`
(dependency-cruiser, see `.dependency-cruiser.cjs`). Do not rely on review
alone to catch violations — run the check.

## Public APIs

Each module exposes its public surface through `index.ts`. Consumers
(other modules, `app`) import only from `@/modules/<name>`, never from
`@/modules/<name>/components/...` or other internal paths. A module's
internal file layout (`components/`, `server/`, `lib/`, `hooks/`, etc.) is
implementation detail and may change freely as long as the public API
(`index.ts`) stays stable.

## Ownership

A module owns the business logic and UI for its feature. If two modules
need to share logic that has no business meaning of its own (e.g. currency
formatting, a generic button), move it to `shared`. If it has business
meaning tied to one feature, it stays in that module even if another
module currently needs it — expose it through the owning module's public
API instead of duplicating or relocating it to `shared`.

## Progressive architecture

Start minimal. A new module does not need `components/`, `server/`,
`lib/`, `hooks/`, `types/`, and `constants/` on day one — create only the
directories the module actually needs right now. Add structure when
complexity actually requires it (e.g. split `types.ts` into `types/` once
it outgrows one file), not in anticipation of future complexity. Do not
introduce a layer, abstraction, or directory for theoretical purity.

# Architecture

## Target structure

```text
src/
├── app/       # Next.js App Router: routes, layouts, route-level composition
├── modules/   # business features
└── shared/    # genuinely reusable, business-agnostic code
```

### `app`

Routes, layouts, route-level composition, server actions when they
belong at the route level. Stays thin — no significant business logic
directly in routes. A route's job is to fetch/compose module public APIs,
not implement the feature itself. See `src/app/products/page.tsx` and
`src/app/orders/page.tsx` in this repo for the intended shape: a handful
of lines that call a module's public API and render its components.

### `modules`

```text
src/modules/products/
src/modules/orders/
src/modules/users/
src/modules/checkout/
```

Each module owns the business logic and UI for its feature. **Start
minimal** — do not scaffold every possible subdirectory:

```text
modules/products/
├── components/
├── server/
├── lib/
├── hooks/
├── types/
├── constants/
└── index.ts
```

is the *ceiling*, not the starting point. This repo's own
`src/modules/products` only has `components/`, `server/`, `types.ts`, and
`index.ts` — because that's what the example actually needed. Add a
directory when the module's complexity actually requires it, not
preemptively.

> Start simple. Add structure when complexity requires it. Never
> introduce architecture only for theoretical purity.

### `shared`

```text
src/shared/ui/
src/shared/lib/
src/shared/types/
```

Genuinely reusable, business-agnostic code only (`src/shared/ui/Button.tsx`,
`src/shared/lib/formatCurrency.ts` in this repo). If something belongs to
one business feature, it stays inside that module — `shared` is not a
junk drawer for "stuff I might reuse someday."

## Dependency direction

Allowed:

```text
app → modules
app → shared
modules → shared
module A → module B   (when it's a real business dependency)
```

Forbidden:

```text
shared → modules
module A → module B/<internal-file>
A → B → A   (and longer cycles)
```

This repo's own `orders` module depends on `products`' public API
(`src/modules/orders/components/OrderSummary.tsx` imports
`@/modules/products`) — a legitimate cross-module dependency, because an
order really does reference products. That's the pattern to follow: cross
-module dependencies are fine when they reflect a real business
relationship, and always go through the other module's public API.

## Public APIs

Each module exposes its public surface through `index.ts`:

```ts
// good
import { ProductCard } from "@/modules/products";

// forbidden — internal file, not public API
import { ProductCard } from "@/modules/products/components/ProductCard";
```

Internal file layout inside a module is free to change as long as
`index.ts` stays stable — that's the point of a public API boundary.

## Enforcement

Mechanical enforcement lives in `.dependency-cruiser.cjs` (see that file
for commented rule definitions) and runs via:

```text
pnpm architecture:check
```

It detects, as `error` severity:

1. circular dependencies (any length)
2. `shared → modules`
3. module → another module's internal file
4. `app` reaching into a module's internals

`pnpm test` also runs `test/architecture.test.ts`, which invokes
dependency-cruiser against fixture repositories under
`test/fixtures/architecture/` to prove these rules actually fire — three
invalid cases (each must fail) and one valid case (must pass). This is
not documentation of intent; it's an executable proof the rules work.

TypeScript, ESLint, and Next.js's own server/client boundary rules
(`server-only`, the `"use client"` directive) provide additional,
complementary enforcement that dependency-cruiser doesn't cover.

Claude's reasoning fills the gap dependency-cruiser can't: whether a
*new* cross-module dependency represents a real business relationship
(mechanically allowed either way — that judgment call is semantic, not
structural) and whether a proposed abstraction is actually justified
right now. See `.claude/rules/architecture.md`.

## Progressive architecture

```text
simple feature → small module → more complexity → add structure →
cross-module dependency → explicit public API
```

not:

```text
new feature → 20 directories → 15 abstractions → 5 layers → complexity
```

The architecture exists to protect the project, not to generate
bureaucracy. See `.claude/rules/architecture.md` for the rule Claude
follows during implementation.

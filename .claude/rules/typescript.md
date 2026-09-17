---
description: Strict typing, narrowing, and type-safety rules.
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript

WHAT must be true.

## Strictness

- `strict` mode is on project-wide. Do not weaken `tsconfig.json` to make
  an error disappear — fix the type.
- Avoid `any`. If a type genuinely cannot be known, use `unknown` and
  narrow it, or document why `any` is unavoidable.
- Avoid non-null assertions (`!`) and `as` casts as a way to silence the
  compiler. If a cast is necessary, it needs a comment explaining why it's
  actually safe.

## Narrowing & domain modeling

- Prefer discriminated unions over optional-field "kitchen sink" types
  when a value can be one of several distinct shapes.
- Use `switch` over a discriminant with an `exhaustive: never` default (or
  equivalent) so adding a new variant is a compile error until handled
  everywhere.
- Model domain concepts with types that make illegal states
  unrepresentable rather than validating them at runtime everywhere.

## Boundaries

- Data crossing a trust boundary (API responses, form input, query
  params) must be validated/parsed, not just cast to a type.
- Prefer `satisfies` over a type annotation when you want literal-type
  inference preserved while still checking shape conformance.

## Generics & utility types

- Use generics to express real reuse (a function/component that behaves
  the same way over many types), not to look sophisticated.
- Prefer built-in utility types (`Pick`, `Omit`, `Partial`, `ReturnType`,
  etc.) over hand-rolled equivalents.

## Naming

- Type and interface names should communicate domain intent
  (`OrderLine`, `ProductCategory`) rather than structural shape
  (`Data`, `Props2`, `IThing`).

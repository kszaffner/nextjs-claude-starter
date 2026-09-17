---
description: App Router, Server Components, Server Actions, data fetching, and caching rules.
paths:
  - "src/app/**/*.ts"
  - "src/app/**/*.tsx"
  - "src/modules/**/server/**/*.ts"
---

# Next.js

WHAT must be true. This project uses the App Router.

## Version-specific behavior

Next.js caching, routing, and data-fetching semantics change between major
versions. Before relying on version-specific behavior (default caching,
`fetch` behavior, `dynamic`/`revalidate` semantics, etc.), check the
installed version first:

```text
!cat node_modules/next/package.json | grep '"version"'
```

Prefer documentation shipped with the installed version
(`node_modules/next/dist/docs/` when present) over general knowledge,
which may describe a different major version. See `AGENTS.md` for the
full instruction. Do not encode assumptions about future Next.js versions
into code or Rules.

## Server/client boundaries

- Route files (`page.tsx`, `layout.tsx`) are Server Components by default.
  Keep them thin: fetch/compose, then delegate to module components.
- Data fetching belongs in Server Components or a module's `server/`
  files, not in client-side `useEffect`.
- Mark data-access code `server-only` (the `server-only` package) when it
  must never end up in a client bundle (DB access, secrets, internal
  APIs).

## Server Actions

- Validate all input at the top of a Server Action — never trust the
  client payload.
- Keep Server Actions colocated with the module that owns the mutation.
- Re-check authorization inside the action itself; don't rely on the UI
  having hidden a control.

## Data fetching & caching

- Understand whether a `fetch` call is cached, revalidated, or dynamic
  before relying on its behavior — this is version-sensitive (see above).
- Prefer the framework's native caching/revalidation primitives over
  hand-rolled caching layers.
- Be explicit about revalidation strategy (time-based, tag-based, or
  on-demand) rather than leaving it implicit.

## Routing & metadata

- Route segment structure should mirror the URL structure the product
  needs, not the module structure — routes compose modules, they don't
  have to match them 1:1.
- Export `metadata` (or `generateMetadata`) for pages that need SEO/social
  metadata rather than manipulating `document.head` manually.

## Streaming

- Use `loading.tsx`/`Suspense` boundaries for slow data rather than
  blocking the whole route on the slowest fetch.

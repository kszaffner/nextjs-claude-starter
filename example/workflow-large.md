# Example workflow: LARGE

**Request:** "Implement a checkout module: turn an order's line items
into a confirmed order, given a customer id."

## Understand

A new business module (`checkout`) that depends on `products` (pricing,
availability) and `orders` (creating the confirmed order). Cross-module
dependencies, a new public API, likely security implications (must not
trust client-submitted prices) — clearly **LARGE**.

## Explore

Given the cross-module scope, this is a case for forked `/explore` rather
than reading broadly inline:

```text
/explore find everything relevant to how `products` and `orders` expose
pricing/order-creation today, and any existing checkout-related code.
```

The subagent returns a concise summary: `products` exposes `getProductById`
(pricing lookup), `orders` exposes `getOrders`/`Order`/`OrderLine` types
but no "create an order" function yet — that needs to be added.

## Knowledge Check

If `.claude/knowledge/` has relevant content (e.g. a `decisions/pricing.md`
on how prices are locked in at checkout time), ask before loading:

```text
Relevant knowledge found:

decisions/pricing.md

Do you want to load the knowledge base for this task?

[Yes] [No]
```

In a fresh copy of this starter, `.claude/knowledge/` has no topics yet
(see `.claude/knowledge/index.md`), so this step is skipped without
asking.

## Architecture

New module `src/modules/checkout/`, minimal to start (`server/checkout.ts`,
`types.ts`, `index.ts` — no `components/` yet, since checkout starts as a
Server Action with no dedicated UI). Dependency direction:

```text
checkout → products   (price/availability lookup, public API)
checkout → orders     (order creation, public API — orders gains a
                        createOrder function)
```

Both are real business dependencies through public APIs — allowed per
`.claude/rules/architecture.md`. No change needed to `shared`.

## Plan

- `src/modules/orders/server/createOrder.ts` (+ export from
  `orders/index.ts`): persist a new `Order` from validated lines.
- `src/modules/checkout/server/checkout.ts`: Server Action —
  re-fetches each product server-side (never trusts client-submitted
  prices — see `.claude/rules/security.md`), computes the total, calls
  `orders`' `createOrder`.
- `src/modules/checkout/types.ts`, `src/modules/checkout/index.ts`.
- Tests: unit test for total calculation; a test asserting checkout
  rejects a line item for a product id that doesn't exist.
- Verification: typecheck, lint, test, `architecture:check` (new
  cross-module dependency), build.

## Developer Approval

**Plan presented, implementation paused here until the developer
approves** — this is the LARGE-task gate. (In this worked example: assume
approval was given as-is.)

## Implement

Following the plan, applying `.claude/rules/nextjs.md` (Server Action
validates its own input),`.claude/rules/security.md` (server-side price
lookup, not client-submitted), `.claude/rules/architecture.md` (public
API only).

## Verify

```text
!pnpm typecheck
!pnpm lint
!pnpm test
!pnpm architecture:check
!pnpm build
```

All run for real — LARGE tasks verify the full surface, including a
production build, since a new module and a new cross-module dependency
were introduced.

## Code Review

Run `/code-review`. Suppose it finds one actionable issue:

```text
CRITICAL
src/modules/checkout/server/checkout.ts:9 — Trusts `priceInCents` from
the submitted line items instead of re-fetching it from `products`.
A client could submit an arbitrary price. Look up each product's price
server-side via getProductById and ignore any price field on the input.
```

## Fix / Verify / Review again

Fix applied (server-side price lookup), re-verify
(`typecheck`/`lint`/`test`/`architecture:check`), review again:

```text
Code Review — No actionable findings.

Verification:
✓ pnpm typecheck
✓ pnpm lint
✓ pnpm test
✓ pnpm architecture:check
✓ pnpm build
```

## Knowledge Review

A real decision was made here (prices are always re-resolved server-side
at checkout, never trusted from the client) — that's WHY-level, worth
keeping:

```text
Knowledge base update available:

decisions/checkout-pricing.md

Do you want to save the changes to the knowledge base?

[Yes] [No]
```

If **Yes**, `.claude/knowledge/decisions/checkout-pricing.md` is created
and `index.md` updated to reference it.

## Done

Added a `checkout` module: a Server Action that validates line items,
re-resolves pricing server-side, and creates a confirmed order via the
`orders` module's new `createOrder`. Verified: typecheck, lint, test,
architecture:check, build. Review: one CRITICAL finding (client-trusted
pricing), fixed and re-verified. Knowledge: recorded the
server-side-pricing decision (developer approved).

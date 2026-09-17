# Code Review Output Examples

Loaded on demand — not part of the default `SKILL.md` procedure.

## Example: findings present

```text
CRITICAL
src/modules/orders/server/createOrder.ts:14 — Server Action trusts a
`userId` field from the client payload instead of reading it from the
session. Any authenticated user could create orders for another user by
editing the request body. Read the user id from the server-side session
instead of the submitted form data.

HIGH
src/modules/orders/components/OrderForm.tsx:22 — Marked "use client" for
the entire form, but only the submit button needs interactivity. Split
the static fields into a Server Component and keep only the interactive
part client-side to avoid shipping unnecessary JS.

MEDIUM
src/modules/orders/index.ts:6 — Newly exports `internalCalculateTotal`,
which is only used inside the module. Exporting it grows the public API
surface other modules can now depend on. Keep it internal unless another
module actually needs it.

LOW
src/modules/orders/server/createOrder.ts:31 — Error message includes the
raw database error (`err.message`) in the response returned to the
client. Return a generic message and log the detailed error server-side.
```

## Example: no actionable findings

```text
Code Review — No actionable findings.

Verification:
✓ pnpm typecheck
✓ pnpm lint
✓ pnpm test
✓ pnpm architecture:check
```

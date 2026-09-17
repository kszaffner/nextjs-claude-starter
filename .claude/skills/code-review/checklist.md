# Code Review Checklist

Loaded on demand by `SKILL.md` — not duplicated there. This restates
nothing from `.claude/rules/`; it's a review pass order, not a second copy
of the rules.

## Architecture

- [ ] No import reaches into another module's internals
      (`modules/<name>/components/...` etc. from outside that module)
- [ ] No new `shared → modules` dependency
- [ ] No new circular dependency
- [ ] New public API surface (`index.ts` exports) is intentional, not
      accidental over-exposure
- [ ] New directories/abstractions are justified by actual complexity,
      not added preemptively

## React / Next.js

- [ ] Server/client boundary is correct — `"use client"` only where
      actually needed, pushed as low as possible
- [ ] No data fetching inside `useEffect` where a Server Component or
      route handler should own it
- [ ] Server Actions validate their own input and re-check authorization
- [ ] Caching/revalidation behavior is intentional, not accidental
      (checked against the installed Next.js version when relevant)

## TypeScript

- [ ] No new unjustified `any` / `as` / `!`
- [ ] Discriminated unions used where a value has distinct shapes
- [ ] Data crossing a trust boundary is validated, not just cast

## Security

- [ ] Untrusted input is validated server-side
- [ ] No secret or server-only value reachable from a client bundle
- [ ] No unsanitized HTML injection
- [ ] Error responses don't leak internals

## Performance

- [ ] No obviously redundant re-fetching or re-rendering introduced
- [ ] No premature `useMemo`/`useCallback` clutter, and no missing
      memoization where it's clearly load-bearing (e.g. expensive
      computation on every keystroke)

## Accessibility

- [ ] Interactive elements are semantic HTML or have the right ARIA
- [ ] Toggle/filter state is exposed (`aria-pressed`, `aria-expanded`, …)

## Tests

- [ ] New behavior has a test that would fail without the change
- [ ] Bug fixes have a regression test
- [ ] No test was weakened/changed just to make it pass

## Regression risk

- [ ] Existing callers of any changed public API still work
- [ ] Nothing outside the stated scope was modified without reason

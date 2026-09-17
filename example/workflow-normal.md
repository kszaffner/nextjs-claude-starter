# Example workflow: NORMAL

**Request:** "Add a way to filter products under $50, in addition to the
existing category filter."

## Understand

Current behavior: `ProductList` filters by category only
(`src/modules/products/components/ProductList.tsx`). New requirement: an
additional, independent "under $50" toggle that combines with the
category filter. Touches one existing component, no new module, no
architecture change — **NORMAL**.

## Explore

Targeted, not a full repo read:

```text
!cat src/modules/products/components/ProductList.tsx
!cat src/modules/products/components/ProductList.test.tsx
!cat src/modules/products/types.ts
```

`Product.priceInCents` already exists — no schema change needed. No need
to fork `/explore` for something this contained.

## Plan

- `ProductList.tsx`: add a `maxPriceCents` boolean toggle in state;
  combine with the existing category filter in the `useMemo`.
- No new files, no module boundary changes, no `index.ts` change (the
  component's public shape — `products: Product[]` prop — doesn't
  change).
- Tests: extend `ProductList.test.tsx` with a case for the price filter
  and a case for both filters combined.

## Implement

```tsx
const [underFifty, setUnderFifty] = useState(false);

const filteredProducts = useMemo(() => {
  return products
    .filter((p) => category === "all" || p.category === category)
    .filter((p) => !underFifty || p.priceInCents < 5000);
}, [products, category, underFifty]);
```

Plus a toggle button with `aria-pressed={underFifty}` next to the
category filters (see `.claude/rules/react.md` on exposing toggle state).

## Verify

```text
!pnpm typecheck
!pnpm lint
!pnpm test
```

## Code Review

Run `/code-review`. Checked against `.claude/skills/code-review/checklist.md`:
architecture (no boundary touched), React (toggle state is local, no
unnecessary effect), tests (new behavior covered), accessibility
(`aria-pressed` present). No actionable findings.

```text
Code Review — No actionable findings.

Verification:
✓ pnpm typecheck
✓ pnpm lint
✓ pnpm test
```

## Done

Added an "under $50" toggle to `ProductList`, combinable with the
existing category filter. Verified: typecheck, lint, test. Review: no
actionable findings.

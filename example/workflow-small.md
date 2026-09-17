# Example workflow: SMALL

**Request:** "Change the 'all' filter button in the product list to say
'All categories'."

## Understand

The filter buttons live in `src/modules/products/components/ProductList.tsx`.
The `"all"` value is currently rendered as its own label via
`{value}`. This is a copy change with no behavior change — clearly
**SMALL**.

## Implement

```tsx
{(["all", "electronics", "home", "apparel"] as const).map((value) => (
  <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>
    {value === "all" ? "All categories" : value}
  </button>
))}
```

## Verify

```text
!pnpm typecheck
!pnpm lint
!pnpm test
```

All pass — no architecture or build implications for a text-only change
inside an existing component.

## Done

Changed the "all" filter button's label from "all" to "All categories" in
`ProductList.tsx`. Verified: typecheck, lint, test.

---

No Explore, no Plan, no Code Review — SMALL tasks don't carry that
ceremony. See `docs/workflow.md`.

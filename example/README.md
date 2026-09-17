# Example

The example app lives in the repository's real `src/` (not duplicated
here) — `src/app`, `src/modules/products`, `src/modules/orders`,
`src/shared`. It's kept intentionally small: two modules, one legitimate
cross-module dependency, one shared UI component, one shared lib
function. It exists to demonstrate:

- module boundaries and public APIs (`src/modules/products/index.ts`,
  `src/modules/orders/index.ts`)
- a legitimate cross-module dependency (`orders` → `products`' public
  API, in `src/modules/orders/components/OrderSummary.tsx`)
- architecture checks actually catching violations
  (`test/architecture.test.ts` + `test/fixtures/architecture/`)
- React/Next.js server/client boundaries (`ProductList` is a client
  component for interactive filtering; everything else is a Server
  Component)
- testing (`src/shared/lib/formatCurrency.test.ts`,
  `src/modules/products/components/ProductList.test.tsx`)
- the Claude workflow end to end — see the three walkthroughs below

Run it:

```text
pnpm install
pnpm dev     # http://localhost:3000/products, /orders
pnpm check
```

## Workflow walkthroughs

These three files make the SMALL/NORMAL/LARGE workflow concrete, using
this same example app as the subject:

- [`workflow-small.md`](./workflow-small.md) — change a button label
- [`workflow-normal.md`](./workflow-normal.md) — add product filtering
- [`workflow-large.md`](./workflow-large.md) — implement a checkout module

Do not turn this example into a larger application — its job is to
demonstrate the architecture and workflow clearly, not to be a real
product.

---
description: React component, state, and rendering rules.
paths:
  - "src/**/*.tsx"
---

# React

WHAT must be true for React code in this project.

## Server/client boundary

- Default to Server Components. Add `"use client"` only when a component
  actually needs interactivity, browser-only APIs, or React state/effects.
- Push `"use client"` as far down the tree as possible — wrap only the
  interactive leaf, not the whole page or a large subtree.
- Do not add `"use client"` reflexively to "be safe." Every client
  component has a real cost (bundle size, hydration).

## State

- Keep state as local as possible. Lift it only when two or more
  components genuinely need to share it.
- Derive values during render instead of storing them in state when they
  can be computed from existing props/state.
- Prefer the simplest primitive (`useState`, `useReducer`) that fits;
  don't reach for external state libraries for local UI state.

## Effects

- `useEffect` is for synchronizing with an external system (subscriptions,
  DOM APIs, non-React widgets) — not for computing derived data, and not
  for data fetching that a Server Component or route handler should do.
- If an effect only sets state from a prop/state change, that's usually a
  sign the value should be computed during render instead.
- Every effect needs a correct dependency array and a cleanup function
  when it subscribes to anything.

## Composition

- Prefer composition (children, render props, slots) over prop-drilling
  configuration flags through many layers.
- A component should have one clear responsibility. If a component
  handles data fetching, business logic, and presentation, split it.

## Performance

- Don't reach for `useMemo`/`useCallback`/`React.memo` unless there is an
  actual, demonstrable performance problem — they add complexity and can
  mask it.
- Avoid unnecessary client-side computation that a Server Component could
  do once at render time.

## Accessibility

- Interactive elements use semantic HTML (`button`, `a`, `label`) before
  reaching for ARIA.
- Icon-only controls need an accessible name.
- Anything togglable (filters, tabs, disclosure) must expose its state via
  the appropriate ARIA attribute (e.g. `aria-pressed`, `aria-expanded`).

---
description: Test behavior, level, and maintainability rules.
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing

WHAT must be true.

## Behavior over implementation

- Test observable behavior (what a user/consumer sees or gets back), not
  internal implementation details (state shape, private helpers,
  component internals).
- A refactor that preserves behavior should not require changing tests.
  If it does, the test was coupled to implementation.

## Test level

- Prefer the lowest level that actually exercises the behavior: pure
  logic → unit test; component behavior → component test; cross-module
  flow → integration test. Don't reach for a heavier test level than the
  behavior requires.
- Architecture rules are verified by the dependency-cruiser test suite
  (`test/architecture.test.ts`), not by unit tests re-asserting the rules
  in prose.

## Coverage

- New behavior needs a test that would fail without the change.
- A bug fix needs a regression test that reproduces the bug and fails on
  the old code.

## Integrity

- Never modify a test merely to make an incorrect implementation appear
  correct. If a test fails, determine whether the implementation, the
  test, or the requirement itself is wrong (see
  `.claude/skills/test-loop/SKILL.md`) before changing anything.
- If a requirement is ambiguous, ask the developer rather than picking
  behavior that happens to make the test pass.

## Maintainability

- Assertions should state what's actually being verified, not just
  `toBeTruthy()`/snapshot-everything.
- Avoid over-mocking to the point the test no longer exercises real
  integration between the pieces it claims to cover.

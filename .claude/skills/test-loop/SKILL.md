---
name: test-loop
description: Run tests, analyze failures, and fix the right thing (implementation, test, or ambiguous requirement) — iterating until green. Use whenever tests fail and need diagnosis, not just a blind re-run.
disable-model-invocation: true
---

# Test Loop

Runs inline — this needs the current implementation and task context, and
testing is inherently iterative.

## Procedure

```text
Run tests
  ↓
Analyze failure
  ↓
Determine: implementation bug | test bug | requirement ambiguity
  ↓
Fix the appropriate thing
  ↓
Run again
```

### 1. Run

```text
!pnpm test
```

For a single file while iterating, narrow it rather than re-running the
whole suite every time:

```text
!pnpm vitest run <path-to-test-file>
```

### 2. Analyze

Read the actual failure output — the assertion, the diff, the stack
trace. Don't guess from the test name.

### 3. Classify

For each failure, determine which of these is true:

- **Implementation bug** — the test correctly describes the intended
  behavior, and the code doesn't do that. Fix the implementation.
- **Test bug** — the test asserts something that isn't actually the
  intended behavior (wrong expected value, testing the wrong thing, flaky
  setup). Fix the test.
- **Requirement ambiguity** — it's genuinely unclear what the correct
  behavior is. Do not guess. Ask the developer.

**Never change a test merely to make an incorrect implementation appear
correct.** If you're tempted to loosen an assertion or delete a check to
get to green, stop — that's masking a bug, not fixing one.

### 4. Fix

Apply the fix appropriate to the classification above.

### 5. Repeat

Run again. Continue until green, or until you hit a requirement ambiguity
that needs the developer's input — surface that immediately rather than
guessing and moving on.

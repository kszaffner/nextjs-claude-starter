# Workflow

## Philosophy

Claude should not behave like "give me a prompt, I'll write code." It
follows an explicit development process:

```text
Understand → Explore → Knowledge Check → Architecture → Plan →
Developer Approval → Implement → Verify → Code Review → Fix →
Verify → Review again → Knowledge Review → Done
```

Not every task needs every step — task size determines which steps run.
This is enforced by `.claude/skills/new-feature/SKILL.md`, summarized in
`CLAUDE.md`.

## Task levels

### SMALL

```text
Understand → Implement → Verify
```

Examples: change button text, small styling change, rename a variable,
simple copy change, obvious small bug fix.

No architecture ceremony, no plan document, no review gate — just do it
correctly and verify.

### NORMAL

```text
Understand → Explore → Plan → Implement → Verify → Code Review → Done
```

Examples: add filtering, add a component with behavior, modify an
existing feature, add an API integration, a moderate bug fix touching
several files.

### LARGE

```text
Understand → Explore → Knowledge Check → Architecture → Plan →
Developer Approval → Implement → Verify → Code Review →
Fix / Verify / Review → Knowledge Review → Done
```

Examples: a new business module, a major architectural change, checkout,
auth, a large refactor, cross-module functionality, infrastructure
changes, anything with significant security or performance implications.

**If uncertain between levels, choose the higher level.**

## The approval gate (LARGE only)

LARGE tasks require **explicit developer approval before implementation**
begins. The plan is presented; Claude waits. Implementation does not
start speculatively "while waiting."

If, during implementation, the plan turns out to need a material change:

1. Stop.
2. Explain what changed.
3. Explain why.
4. Present the revised plan.
5. Request approval again (since the original approval was for a
   different plan).
6. Continue only after approval.

## The review/fix loop

After Code Review, if there are actionable findings:

```text
Fix → Verify → Review again
```

This repeats until the review has no actionable findings, or the
developer explicitly stops the loop. Verification is re-run after every
fix — a fix is not "done" until it's actually verified again.

## Worked examples

Three concrete walkthroughs live in `example/`:

- `example/workflow-small.md` — changing a button label
- `example/workflow-normal.md` — adding product filtering
- `example/workflow-large.md` — implementing a checkout module

They show the actual steps taken (commands run, decisions made), not just
a restatement of the levels above.

## Deterministic vs. reasoning work

Two different kinds of work happen inside this workflow, and they use
different tools:

- **Deterministic** (use tooling, not Claude's judgment): lint, typecheck,
  test, build, architecture check, `git diff`/`git status`, formatting.
  These have one correct outcome — run the tool, trust the result.
- **Reasoning** (use Claude's judgment, not a hook): architecture
  decisions, tradeoffs, requirements interpretation, security reasoning,
  performance reasoning, code review judgment, whether an abstraction is
  justified, whether Knowledge should be updated.

Don't encode subjective reasoning into a shell hook, and don't ask Claude
to manually re-derive something a deterministic tool already verifies.

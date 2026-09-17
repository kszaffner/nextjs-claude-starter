---
name: code-review
description: Review the current diff for correctness, architecture, security, and quality issues against the project's Rules. Use after implementing a change and before considering it done.
disable-model-invocation: true
---

# Code Review

Runs inline in V1 (has access to the current task context, implementation,
and conversation). If reviews become large enough to warrant isolation,
this can move to `context: fork` later — do not fork it preemptively.

## Procedure

1. Get the actual diff — start narrow, expand only if needed:

   ```text
   !git status --short
   !git diff --stat
   ```

   Then read the full diff for files that actually changed, not the whole
   repository:

   ```text
   !git diff -- <changed-file>
   ```

2. Read the changed files in full (not just the diff hunks) when the diff
   alone doesn't give enough context to judge correctness.

3. Load `.claude/skills/code-review/checklist.md` and walk through it
   against the actual code. Apply the Rules in `.claude/rules/` as the
   review criteria — architecture, react, nextjs, typescript, testing,
   security.

4. Check verification status:

   ```text
   !pnpm typecheck
   !pnpm lint
   ```

   Note whether tests/architecture check/build were run for this change.

5. Report findings using this format:

   ```text
   CRITICAL
   <finding>

   HIGH
   <finding>

   MEDIUM
   <finding>

   LOW
   <finding>
   ```

   Each finding needs: location (file:line), the problem, why it matters,
   and a recommended fix.

   If there are no actionable findings:

   ```text
   Code Review — No actionable findings.

   Verification:
   ✓ ...
   ✓ ...
   ```

   Do NOT produce a numeric score, percentage, or overall
   winner/loser-style conclusion. Findings are the output, not a grade.

6. Review actual code, not just the developer's description of what they
   did — the diff is the source of truth.

## After review

If there are actionable findings, the calling workflow (`/new-feature`)
fixes them, re-verifies, and reviews again — repeat until clean or the
developer stops the loop. See `examples.md` for what a finding and a
clean-pass report look like end to end.

# Skills

Skills answer **HOW** work should be performed. Rules (`.claude/rules/`)
answer **WHAT** must be true. Knowledge (`.claude/knowledge/`) answers
**WHY** the project is built this way. Skills should not duplicate either
— see each `SKILL.md` for how it references, rather than repeats, Rules
and Knowledge.

## Context strategy: hybrid, not "fork everything"

It would be simple to run every Skill with `context: fork`, but that's
wrong for most of them: the main engineering workflow needs the developer
able to interact throughout — asking questions, approving plans, steering
implementation. Forking loses that.

| Skill | Context | Why |
|---|---|---|
| `/new-feature` | inline | Preserves conversation, decisions, plan, approval, implementation, verification across the whole task. |
| `/test-loop` | inline | Testing is iterative (run → analyze → fix → run again) and needs the current implementation/task context. |
| `/knowledge` | inline | Knowledge operations need a Yes/No decision from the developer in the moment. |
| `/code-review` | inline (V1) | Needs the current task, diff, and verification results already in context. Could move to `context: fork` later if reviews get large — not forked preemptively. |
| `/explore` | **forked** (`context: fork`, `agent: Explore`) | Large/deep repository analysis that would otherwise bloat the main context with search noise; only the concise summary needs to come back. |

Only `/explore` forks. Everything else runs inline, deliberately.

## `context: fork` vs. a session `/branch`

These are different mechanisms — don't conflate them:

- **`context: fork`** runs a Skill/task in an isolated subagent context.
  It returns a summary to the caller; the subagent's own exploration
  process doesn't pollute the main conversation.
- **`/branch`** branches the *session/conversation itself* — a different
  concept entirely, about conversation state, not about delegating a unit
  of work to an isolated agent.

`.claude/skills/explore/SKILL.md` documents this distinction directly
since it's the one Skill in this starter that forks.

## Manual vs. automatic invocation

Action-oriented Skills (`new-feature`, `code-review`, `test-loop`,
`knowledge`) use `disable-model-invocation: true` — they run when the
developer explicitly invokes them (`/new-feature`, etc.), not
automatically whenever Claude decides they might apply. This keeps
explicit engineering workflows predictable: the developer knows exactly
when the full workflow ceremony is about to kick in.

`/explore` does not set that flag — it's a lightweight, reference-style
capability that's reasonable for Claude to reach for on its own when a
task clearly needs deep exploration, without waiting to be asked by name.

## Progressive disclosure inside Skills

`SKILL.md` holds the procedure. Large supporting material — checklists,
worked examples — lives in separate files loaded only when needed:

```text
.claude/skills/code-review/
├── SKILL.md        # the review procedure
├── checklist.md     # loaded when actually reviewing
└── examples.md       # loaded on demand, not part of the default flow
```

This keeps the default context cost of invoking a Skill small; the
supporting detail is there when the procedure calls for it, not before.

Skills do not duplicate Rules or Knowledge content — they reference the
relevant Rule/Knowledge file instead of restating it, so there's exactly
one place each fact lives.

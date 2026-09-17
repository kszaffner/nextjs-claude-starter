---
name: explore
description: Deep, isolated repository exploration for large codebases — finding relevant implementation areas, existing patterns, or dependency structure — without bloating the main conversation. Use for large/unclear searches, not small lookups.
context: fork
agent: Explore
---

# Explore

This Skill runs in an isolated forked context using the `Explore` agent.
That is a deliberate choice, different from every other Skill in this
starter (`new-feature`, `code-review`, `test-loop`, `knowledge` all run
inline) — see `docs/skills.md` for why the split is this way.

```text
MAIN CONTEXT
      ↓
Explore subagent (forked, isolated)
      ↓
deep repository analysis
      ↓
concise findings returned
      ↓
MAIN CONTEXT
```

## When to use this

- Large or unfamiliar repository exploration
- Deep dependency analysis across many files
- Discovering relevant implementation areas for a task
- Finding existing patterns to reuse before implementing something new

## When NOT to use this

- Small, targeted lookups — just read the file or grep directly in the
  main context. Forking has overhead; don't pay it for a one-file answer.
- Anything the developer needs to see reasoned through live — exploration
  results come back as a summary, not a transcript.

## What it returns

The subagent must return a **concise summary** to the main context: the
relevant files/patterns found, not the raw search process. Do not let
exploratory noise (every file read, every grep miss) leak into the main
conversation — that defeats the purpose of forking.

## Note on `context: fork` vs. `/branch`

`context: fork` (used here) runs this Skill in an isolated subagent
context that reports back a summary — it does not preserve the
conversation the way a session/conversation branch does. A `/branch` is a
different mechanism entirely (branching the conversation itself). Do not
confuse the two. See `docs/skills.md` for the full explanation.

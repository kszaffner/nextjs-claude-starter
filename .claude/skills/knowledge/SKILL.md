---
name: knowledge
description: Manage the project Knowledge Base — assess, init, status, search, load, update, compress, disable, clear. Use for any /knowledge command, or when a task needs WHY-level project context.
disable-model-invocation: true
---

# Knowledge

Runs inline — Knowledge operations usually require a Yes/No decision from
the developer, so this must stay in the main conversation.

Knowledge is optional. If it has never been initialized or has been
disabled, none of this runs automatically — see "Optional behavior"
below.

Knowledge answers **WHY** the project is built this way. It is not a copy
of the code (that's WHAT — read the code) and not a procedure (that's
HOW — see other Skills). Do not duplicate Rules or other Skills into
Knowledge files, and do not duplicate Knowledge into `CLAUDE.md`.

See `docs/knowledge.md` for the full design rationale, and
`.claude/knowledge/index.md` (if present) for the current index.

## Commands

### `/knowledge assess`

Analyze the project (structure, module count, non-obvious decisions
visible in code/comments/git history) and report briefly: project
complexity, architectural complexity, how many non-obvious decisions
exist, and whether a Knowledge Base would likely help. **Do not
initialize anything.** The developer decides whether to run `init`.

### `/knowledge init`

Create the structure, but only with real content:

```text
.claude/knowledge/
├── index.md
├── architecture/
├── decisions/
├── features/
└── infrastructure/
```

Do not create empty placeholder files "just in case." Populate `index.md`
and any subdirectory file only when there is actual knowledge to record
right now (existing architectural decisions, known constraints). An empty
`decisions/` directory with no files is fine if there's nothing to record
yet.

### `/knowledge status`

Report whether Knowledge is enabled/disabled, and if enabled, a short
summary of what topics exist per `index.md` (not the full content).

### `/knowledge search <query>`

Search `index.md` and file names/headings for the query — index-first, do
not load full file bodies unless one is clearly relevant and about to be
used.

### `/knowledge load <topic>`

Load the specific file(s) for that topic. Never load the entire Knowledge
Base for a single topic request.

### `/knowledge update`

Manually trigger the Knowledge Review flow (see below) outside the normal
end-of-task point.

### `/knowledge compress`

Consolidate `.claude/knowledge/`: merge duplicates, drop stale/irrelevant
history, remove redundant decisions — while preserving the actual WHY,
constraints, and architectural decisions that are still relevant. Update
`index.md` to match afterward.

### `/knowledge disable`

Turn off Knowledge loading, questions, and updates (record this — e.g. a
marker in `index.md` or a project setting, whatever the repo already uses
for such flags). **Existing Knowledge files are left untouched** — only
future automatic behavior stops.

### `/knowledge clear`

**Requires explicit confirmation before proceeding.** Clears the content
of the Knowledge Base. Do not delete unrelated `.claude/` configuration
(Rules, Skills, agents, hooks) — only `.claude/knowledge/`.

## Retrieval during a task (index-first)

1. Check `index.md` only — never load full Knowledge files speculatively.
2. If a relevant topic exists, ask using this exact phrasing:

   ```text
   Relevant knowledge found:

   <file(s)>

   Do you want to load the knowledge base for this task?

   [Yes] [No]
   ```

3. **Yes** → load only the relevant file(s), not the whole base.
   **No** → skip Knowledge for this task entirely; do not ask again
   during the same task.
4. If no relevant Knowledge exists for this task, don't ask at all.

## Knowledge Review (after a completed task)

If Knowledge is enabled and something meaningful about WHY the project
works this way changed (a decision, a constraint, a non-obvious tradeoff —
not just WHAT changed, which is already in the diff), ask:

```text
Knowledge base update available:

<file(s)>

Do you want to save the changes to the knowledge base?

[Yes] [No]
```

**Yes** → update the relevant Knowledge file(s) and `index.md` if new
topics were added. **No** → do nothing; do not retry within the same
task; do not silently save anyway.

## Optional behavior

If `.claude/knowledge/` doesn't exist, or Knowledge has been disabled:
no loading, no relevant-knowledge questions, no update prompts. The rest
of the workflow (`/new-feature`, `/code-review`, etc.) proceeds exactly
as it would otherwise — Knowledge is additive, never a blocker.

## Auto Memory vs. project Knowledge

These are different systems — do not conflate them:

- **Auto Memory** (if available in this environment) is
  environment/user-specific: it belongs to the developer's own Claude
  Code setup, is not Git-versioned, and travels with the user across
  projects.
- **Project Knowledge** (`.claude/knowledge/`) is project-owned,
  Git-versioned, shared with everyone who works on this repository, and
  travels with the project, not the user.

Never put personal information into project Knowledge. Never treat
project Knowledge as a substitute for Auto Memory or vice versa.

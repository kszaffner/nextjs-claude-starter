# Knowledge

## What Knowledge is (and isn't)

Three different questions, three different systems:

- **Code** answers **WHAT** exists. Read it.
- **Skills** answer **HOW** to work. `.claude/skills/`.
- **Knowledge** answers **WHY** the project is built this way.
  `.claude/knowledge/`.

Knowledge should never duplicate code (that's what `git log`/reading the
source is for) and should never duplicate a Skill's procedure or a Rule's
constraint. It holds architectural decisions, constraints, non-obvious
business assumptions, infrastructure decisions, and anything future
developers or agents would otherwise have to rediscover the hard way.

## It's optional

The whole system works with zero Knowledge Base. If `.claude/knowledge/`
doesn't exist, or has been disabled via `/knowledge disable`:

- no Knowledge loading
- no "relevant knowledge found" questions
- no update prompts

and existing files (if any) are left untouched either way. See
`.claude/skills/knowledge/SKILL.md`, "Optional behavior."

## Structure

```text
.claude/knowledge/
├── index.md          # the index — always index-first, never load everything
├── architecture/      # WHY architectural decisions were made
├── decisions/         # point-in-time decisions with real consequences
├── features/          # non-obvious business rules per feature/module
└── infrastructure/     # deployment/environment decisions
```

`/knowledge init` creates this structure but only populates files that
have actual content — it does not generate empty placeholder files "in
case they're needed later."

## Commands

| Command | What it does |
|---|---|
| `/knowledge assess` | Reports whether a Knowledge Base would likely help this project. Initializes nothing. |
| `/knowledge init` | Creates the structure, with real initial content only. |
| `/knowledge status` | Enabled/disabled + a summary of existing topics. |
| `/knowledge search <query>` | Searches the index (and file names/headings) — not full file bodies. |
| `/knowledge load <topic>` | Loads only that topic's file(s). |
| `/knowledge update` | Manually triggers a Knowledge Review outside the normal end-of-task point. |
| `/knowledge compress` | Consolidates duplicates/stale content, preserving real WHY. Updates `index.md`. |
| `/knowledge disable` | Turns off loading/questions/updates. Files are preserved. |
| `/knowledge clear` | Clears Knowledge Base content. **Requires confirmation.** Never touches other `.claude/` config. |

Full procedure for each: `.claude/skills/knowledge/SKILL.md`.

## Index-first retrieval

Claude never loads the whole Knowledge Base for a task. It checks
`index.md` for relevance, and if something matches, asks — using this
exact phrasing:

```text
Relevant knowledge found:

products.md

Do you want to load the knowledge base for this task?

[Yes] [No]
```

**No** skips Knowledge for that task and the question isn't repeated
during the same task. If nothing in the index is relevant, Claude doesn't
ask at all.

## Knowledge Review

After a task completes, if something meaningful about WHY the project
works this way changed — not just WHAT changed, which is already visible
in the diff — Claude asks:

```text
Knowledge base update available:

products.md

Do you want to save the changes to the knowledge base?

[Yes] [No]
```

**No** means nothing is saved, silently or otherwise, and Claude doesn't
retry within the same task.

## Knowledge vs. Auto Memory

If your Claude Code environment has an Auto Memory system, it is a
**different thing** from project Knowledge:

| | Auto Memory | Project Knowledge |
|---|---|---|
| Owned by | the developer/environment | the project |
| Versioned | no | yes (Git) |
| Shared | no — travels with the user | yes — travels with the repo |
| Content | user preferences, working style | architectural/business WHY |

Never put personal information in project Knowledge, and never treat
project Knowledge as a replacement for Auto Memory (or vice versa) — they
answer different questions for different audiences.

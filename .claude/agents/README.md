# Agents

V1 of this starter deliberately ships with **no custom agent roster** —
just the built-in `Explore` agent used by `.claude/skills/explore`.

## Why V1 uses minimal agents

A large multi-agent team (Architect, QA, Security, Performance, Frontend,
Backend, Reviewer, ...) sounds thorough but has real costs:

- It assumes access to expensive, high-parallel agent workflows that not
  every developer's plan supports. This starter has to work on ordinary
  Claude Code usage, not just the most capable tier.
- Every additional agent is another isolated context that has to be
  briefed, and another place for the "what actually happened" summary to
  get lossy on the way back to the developer.
- Most of what a large agent team buys — architectural judgment, security
  reasoning, review quality — is already covered here by the Rules +
  Skills + Knowledge workflow running in the main context, where the
  developer can see and steer it directly.

So V1 keeps everything in the main context except one case: exploration.

## When subagents are actually useful

Forking earns its cost when the work is large, mostly mechanical, and the
main context doesn't need to see the process — only the result. The
primary case in this starter is **large repository exploration**
(`.claude/skills/explore/SKILL.md`, `context: fork`, `agent: Explore`):
deep searches across many files that would otherwise bloat the main
conversation with search noise the developer never needed to see.

Everything else in this starter's workflow (`new-feature`, `code-review`,
`test-loop`, `knowledge`) stays inline on purpose — see
`.claude/skills/*/SKILL.md` frontmatter and `docs/skills.md` for why each
one made that choice.

## How future specialized agents could be introduced

If a project genuinely grows into needing dedicated agents (e.g. a
security-focused reviewer for a payments module, or a performance auditor
for a specific hot path), introduce them narrowly:

1. Define the agent with a specific, bounded responsibility — not a
   generic "second opinion" agent.
2. Keep it forked (isolated) unless there's a concrete reason the
   developer needs to interact with it mid-task.
3. Make sure it returns a concise report, not a transcript, to the
   context that invoked it.
4. Add it deliberately, for a demonstrated recurring need — not
   speculatively, "in case it's useful later."

Do not default back to a large agent team just because it's possible to
build one.

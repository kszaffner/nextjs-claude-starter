# Agents

See `.claude/agents/README.md` for the canonical explanation — this page
summarizes it in the docs index.

V1 ships no custom agent roster. The only subagent used is the built-in
`Explore` agent, invoked by `.claude/skills/explore/SKILL.md` for
large/deep repository exploration. Everything else in the workflow
(`new-feature`, `code-review`, `test-loop`, `knowledge`) runs inline in
the main context on purpose — see `docs/skills.md`.

## Why not a full agent team

A roster like Architect / QA / Security / Performance / Frontend /
Backend / Reviewer assumes:

- expensive, high-parallel agent workflows the developer's plan may not
  support — this starter has to work on ordinary Claude Code usage
- that isolating each concern into its own agent is worth the cost of
  briefing it and losing direct visibility into its reasoning

Most of what that buys is already covered by Rules + Skills + Knowledge
running where the developer can see and steer it. Isolation earns its
cost specifically for large, mechanical work the main context doesn't
need to watch happen — which is exploration, not architecture judgment or
code review.

## Adding a specialized agent later

If a project grows into a genuine, recurring need for a dedicated agent
(e.g. a security-focused reviewer for a payments module), introduce it
narrowly and deliberately: a bounded responsibility, forked unless the
developer needs to interact with it mid-task, and returning a concise
report rather than a transcript. Don't add one speculatively.

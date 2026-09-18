# Extending

## Context budget: the rule everything else follows

> Load the minimum context required to make the correct decision.

Every extension you make to this starter should be checked against that
rule before it's added. Concretely, that means:

- **Do** keep `CLAUDE.md` short; put new procedures in a Skill, new
  constraints in a Rule, new project decisions in Knowledge.
- **Do** scope new Rules with `paths:` frontmatter whenever they only
  apply to part of the repo — a rule about Server Actions doesn't need to
  load for a CSS file.
- **Do** push large reference material (checklists, worked examples) into
  a Skill's supporting files, loaded on demand — not into `SKILL.md`
  itself.
- **Don't** duplicate a Rule's content inside a Skill, or a Skill's
  procedure inside `CLAUDE.md`, or Knowledge inside `CLAUDE.md`. Pick the
  one place a fact belongs and reference it from everywhere else.
- **Don't** default to `context: fork` for a new Skill just because it's
  available — fork only when the work is large/mechanical enough that the
  main context genuinely doesn't need to see the process (see
  `docs/skills.md`).

## Adding a new Rule

1. Create `.claude/rules/<topic>.md`.
2. Add `paths:` frontmatter scoping it to the files it actually governs,
   unless it's genuinely project-wide.
3. Write WHAT must be true — short, declarative. Not a procedure (that's
   a Skill) and not a narrative decision log (that's Knowledge).
4. Cross-reference from `CLAUDE.md`'s "Non-negotiable rules" section only
   if it's a rule the developer needs to see without opening the file —
   otherwise leave it to be loaded by path scope.

## Adding a new Skill

1. Decide inline vs. forked using the table in `docs/skills.md` — default
   to inline unless the work is large, mostly mechanical, and doesn't
   need developer interaction mid-task.
2. Decide `disable-model-invocation` — action-oriented workflow Skills
   should generally set it; lightweight reference Skills can leave
   automatic invocation on.
3. Put the procedure in `SKILL.md`; push large supporting material into
   sibling files loaded on demand.
4. Reference Rules/Knowledge instead of restating them.

## Adding a new module

Follow `.claude/rules/architecture.md` and `docs/architecture.md`: start
with only the subdirectories the module actually needs, expose behavior
through `index.ts`, and run `pnpm architecture:check` once it has any
cross-module dependency to confirm the boundary is respected.

## Adding a hook

Hooks are for deterministic work only (formatting, linting, validation,
verification, notifications) — see `.claude/hooks/README.md`. If what
you're about to encode in a hook requires judgment ("is this the right
abstraction," "does this cross-module import make sense"), it belongs in
Claude's reasoning during the workflow, not in a shell script. Put
project-specific hooks in `.claude/settings.json` (shared) or
`.claude/settings.local.json` (personal, gitignored) depending on scope.

## Toward a future CLI/installer

V1 is copy-paste on purpose (see root `README.md`). The structure is
still designed so a future CLI/plugin/installer could distribute the same
system without a redesign:

- Every piece (`rules/`, `skills/`, `knowledge/`, `agents/`, `hooks/`) is
  self-contained and file-based — an installer could template these in
  directly.
- `ai-workflow-config/dependency-cruiser.cjs` has no hardcoded example module names,
  so it's copy-safe into any project as-is — and any future starter-owned
  config file lands in `ai-workflow-config/` alongside it, rather than as a new
  root-level dotfile the copy instructions have to track individually.
- The onboarding flow (`docs/getting-started.md`, "Onboarding") is
  already detect → report → propose → developer decides, which is exactly
  the shape an installer's first run should follow — it just isn't
  automated in V1.

Do not build the CLI/installer as part of this starter — that's a
deliberate V1 scope boundary, not an oversight.

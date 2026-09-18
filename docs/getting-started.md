# Getting Started

## What this is

`nextjs-claude-starter` is a set of files you copy into a Next.js
project so Claude Code works as an engineering assistant that follows an
explicit process — Rules, Skills, Knowledge, Architecture, Verification,
Code Review — instead of just writing code on request. See the root
`README.md` for the pitch; this doc covers installing it.

V1 distribution is **copy-paste**, not a CLI/installer/plugin. That's
deliberate — see `docs/extending.md` for why, and how a future installer
could build on this same structure.

## Copying into a new project

1. Copy these into your project root, preserving structure:

   ```text
   .claude/
   CLAUDE.md
   AGENTS.md
   ai-workflow-config/
   ```

   `ai-workflow-config/` holds non-Claude project config this starter ships
   (currently just `dependency-cruiser.cjs`) — copy the whole folder so
   future additions travel with it automatically.

2. Merge (don't overwrite) `package.json` scripts — add:

   ```json
   {
     "scripts": {
       "architecture:check": "depcruise src --config ai-workflow-config/dependency-cruiser.cjs",
       "check": "pnpm lint && pnpm typecheck && pnpm architecture:check && pnpm test"
     }
   }
   ```

3. Install dependency-cruiser (and vitest if you don't already have a
   test runner):

   ```text
   pnpm add -D dependency-cruiser
   ```

4. If your `src/` doesn't yet follow `app/ modules/ shared/`, **don't
   migrate automatically**. Run the onboarding check below and decide
   deliberately — see "Onboarding" section.

5. Adjust `ai-workflow-config/dependency-cruiser.cjs` if your source root isn't `src/`.

## Copying into an existing project

Same steps as above, plus:

- Read `docs/architecture.md` before moving any existing code — this
  starter does not migrate architecture automatically, and neither
  should you in one large pass.
- Run `pnpm architecture:check` once you have *any* `src/modules/*`
  structure, even partial, to confirm the tooling is wired up correctly
  before relying on it.
- Consider `/knowledge assess` once the workflow is in place, to decide
  whether a Knowledge Base is worth the overhead for this project.

## Onboarding (detect, report, propose)

When Claude is first invoked in a copied-in project, it should:

```text
Detect  → Next.js version, React version, TypeScript, package manager,
          App Router vs Pages Router, ESLint, test runner, build scripts,
          existing modules/ and shared/ directories
Report  → what was found, plainly
Propose → what would need to change to adopt this starter's conventions
Developer decides → nothing is installed, replaced, or migrated automatically
```

Example detection commands (targeted, not a full repo dump):

```text
!cat package.json
!ls src 2>/dev/null || ls app 2>/dev/null
!find src/modules -maxdepth 1 -type d 2>/dev/null
```

## Try the example

This repository itself contains a working example under `src/`
(`src/modules/products`, `src/modules/orders`) you can run:

```text
pnpm install
pnpm dev        # http://localhost:3000, see /products and /orders
pnpm check      # lint + typecheck + architecture:check + test
```

See `example/README.md` for what the example is demonstrating.

## Next

- `docs/workflow.md` — the SMALL/NORMAL/LARGE workflow in detail
- `docs/architecture.md` — the module system and how it's enforced
- `docs/skills.md` — what each Skill does and why it's inline or forked
- `docs/knowledge.md` — the optional Knowledge Base

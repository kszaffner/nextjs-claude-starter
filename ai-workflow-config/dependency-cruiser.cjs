/**
 * Dependency-cruiser rules enforcing the starter's feature-oriented
 * architecture. See `.claude/rules/architecture.md` and
 * `docs/architecture.md` for the reasoning behind these rules.
 *
 * These rules are intentionally generic — they reference folder shape
 * (`src/modules/<name>/...`), never actual module names, so this file
 * stays reusable across projects copied from this starter.
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependencies (A -> B -> A) make modules impossible to reason " +
        "about or delete independently, and often cause runtime init-order bugs.",
      from: {},
      to: { circular: true },
    },
    {
      name: "shared-must-not-depend-on-modules",
      severity: "error",
      comment:
        "`shared` exists to hold genuinely reusable code with no business meaning. " +
        "If shared code needs to import a module, it isn't actually shared — it " +
        "belongs inside that module instead.",
      from: { path: "^src/shared" },
      to: { path: "^src/modules" },
    },
    {
      name: "modules-must-use-public-api-of-other-modules",
      severity: "error",
      comment:
        "A module's internal files (components/, server/, lib/, etc.) are " +
        "implementation detail. Other modules must depend on `modules/<name>` " +
        "(its index.ts public API), not reach into another module's internals.",
      from: { path: "^src/modules/([^/]+)/", pathNot: "^src/modules/([^/]+)/index\\.ts$" },
      to: {
        path: "^src/modules/([^/]+)/(?!index\\.ts$).+",
        pathNot: "^src/modules/$1/",
      },
    },
    {
      name: "app-should-not-reach-into-module-internals",
      severity: "error",
      comment:
        "Route code must import a module's public API (`@/modules/<name>`), " +
        "never files inside `modules/<name>/components`, `/server`, etc.",
      from: { path: "^src/app" },
      to: {
        path: "^src/modules/([^/]+)/(?!index\\.ts$).+",
      },
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment:
        "A module with no incoming or outgoing dependencies is often dead code " +
        "or a forgotten file. Not an error — sometimes intentional (e.g. a page).",
      from: { orphan: true, pathNot: ["^src/app", "\\.test\\.[jt]sx?$"] },
      to: {},
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
  },
};

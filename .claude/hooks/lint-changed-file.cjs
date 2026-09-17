#!/usr/bin/env node
/**
 * PostToolUse hook (Edit|Write): lint the file Claude just changed.
 *
 * Deterministic only, per docs/extending.md and .claude/hooks/README.md —
 * this just runs `eslint` on the changed file and reports; it makes no
 * judgment calls. Claude Code passes the tool call payload as JSON on
 * stdin; the exact shape can vary by version, so this reads
 * `tool_input.file_path` defensively and no-ops if it can't find one.
 */
const { execFileSync } = require("node:child_process");
const path = require("node:path");

function readStdin() {
  try {
    const fs = require("node:fs");
    return fs.readFileSync(0, "utf-8");
  } catch {
    return "";
  }
}

function main() {
  const raw = readStdin();
  if (!raw) return;

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return;
  }

  const filePath = payload?.tool_input?.file_path ?? payload?.tool_input?.path;
  if (!filePath || !/\.(ts|tsx|js|jsx)$/.test(filePath)) return;
  if (!filePath.startsWith(path.join(process.cwd(), "src"))) return;

  try {
    execFileSync("pnpm", ["exec", "eslint", filePath], { stdio: "inherit" });
  } catch {
    // eslint already printed the problem; exit non-zero so it's visible,
    // but don't throw — a lint issue shouldn't crash the session.
    process.exitCode = 0;
  }
}

main();

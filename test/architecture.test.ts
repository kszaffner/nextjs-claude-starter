import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * These tests actually invoke dependency-cruiser against small fixture
 * repositories (test/fixtures/architecture/*) using the starter's real
 * `.dependency-cruiser.cjs` rules. They exist to prove the architecture
 * rules are mechanically enforced, not merely documented.
 */

const REPO_ROOT = path.resolve(__dirname, "..");
const DEPCRUISE_BIN = path.join(REPO_ROOT, "node_modules", ".bin", "depcruise");
const CONFIG_PATH = path.join(REPO_ROOT, ".dependency-cruiser.cjs");

type CruiseResult = {
  exitCode: number;
  output: string;
};

function runArchitectureCheck(fixtureName: string): CruiseResult {
  const fixtureDir = path.join(REPO_ROOT, "test/fixtures/architecture", fixtureName);
  try {
    const output = execFileSync(DEPCRUISE_BIN, ["src", "--config", CONFIG_PATH], {
      cwd: fixtureDir,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { exitCode: 0, output };
  } catch (error) {
    const execError = error as { status: number | null; stdout: string; stderr: string };
    return { exitCode: execError.status ?? 1, output: execError.stdout + execError.stderr };
  }
}

describe("architecture enforcement (dependency-cruiser)", () => {
  it("rejects shared -> module dependencies", () => {
    const result = runArchitectureCheck("invalid-shared-to-module");
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain("shared-must-not-depend-on-modules");
  });

  it("rejects module A -> module B internal file", () => {
    const result = runArchitectureCheck("invalid-module-internal");
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain("modules-must-use-public-api-of-other-modules");
  });

  it("rejects circular dependencies (A -> B -> A)", () => {
    const result = runArchitectureCheck("invalid-cycle");
    expect(result.exitCode).not.toBe(0);
    expect(result.output).toContain("no-circular");
  });

  it("allows module A -> module B public API", () => {
    const result = runArchitectureCheck("valid-public-api");
    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("no dependency violations found");
  });
});

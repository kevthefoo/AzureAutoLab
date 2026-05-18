import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { extractBashBlock } from "./script-extractor";

const fixturePath = path.join(
  process.cwd(),
  "labs",
  "fixtures",
  "lab-fixture-troubleshoot.md",
);
const fixture = fs.readFileSync(fixturePath, "utf-8");

describe("extractBashBlock", () => {
  it("returns the bash block under ## Setup", () => {
    const script = extractBashBlock(fixture, "Setup");
    expect(script).not.toBeNull();
    expect(script).toContain("az group create -n RG-TS-999");
    expect(script).toContain("AutoLabId=999");
  });

  it("returns the bash block under ## Cleanup", () => {
    const script = extractBashBlock(fixture, "Cleanup");
    expect(script).not.toBeNull();
    expect(script).toContain("az group delete -n RG-TS-999");
    expect(script).toContain("--tag AutoLabId=999");
  });

  it("returns null when the section is missing", () => {
    expect(extractBashBlock(fixture, "NoSuchSection")).toBeNull();
  });

  it("returns null when the section has no bash block", () => {
    const md = "## Setup\n\nNo code here.\n\n## Cleanup\n```bash\necho hi\n```\n";
    expect(extractBashBlock(md, "Setup")).toBeNull();
  });

  it("ignores non-bash code blocks under the section", () => {
    const md =
      "## Setup\n\n```ts\nconst x = 1;\n```\n\n```bash\necho real\n```\n\n## Cleanup\n```bash\necho cleanup\n```\n";
    expect(extractBashBlock(md, "Setup")).toBe("echo real");
  });

  it("stops searching at the next ## heading", () => {
    const md =
      "## Setup\n\nSome prose, no block.\n\n## Cleanup\n```bash\necho cleanup\n```\n";
    expect(extractBashBlock(md, "Setup")).toBeNull();
  });
});

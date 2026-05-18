import { describe, it, expect } from "vitest";
import { parseLabFile } from "./labs";

describe("parseLabFile troubleshooting fields", () => {
  it("extracts setupScript when ## Setup exists", () => {
    const lab = parseLabFile("fixtures/lab-fixture-troubleshoot.md");
    expect(lab.setupScript).not.toBeNull();
    expect(lab.setupScript).toContain("AutoLabId=999");
    expect(lab.isTroubleshooting).toBe(true);
  });

  it("extracts cleanupScript when ## Cleanup exists", () => {
    const lab = parseLabFile("fixtures/lab-fixture-troubleshoot.md");
    expect(lab.cleanupScript).not.toBeNull();
    expect(lab.cleanupScript).toContain("az group delete");
  });

  it("returns null setup/cleanup and isTroubleshooting=false for build labs", () => {
    const lab = parseLabFile("lab-13-nsg-rules.md");
    expect(lab.setupScript).toBeNull();
    expect(lab.cleanupScript).toBeNull();
    expect(lab.isTroubleshooting).toBe(false);
  });
});

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  readLabState,
  writeLabState,
  canTransition,
} from "./lab-state";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lab-state-"));
  process.env.LAB_STATE_DIR_OVERRIDE = tmp;
});

afterEach(() => {
  delete process.env.LAB_STATE_DIR_OVERRIDE;
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("readLabState", () => {
  it("returns NOT_PROVISIONED when no state file exists", () => {
    const state = readLabState("101");
    expect(state.phase).toBe("NOT_PROVISIONED");
    expect(state.labId).toBe("101");
    expect(state.tag).toBe("AutoLabId=101");
  });

  it("reads an existing state file", () => {
    fs.writeFileSync(
      path.join(tmp, "lab-101.json"),
      JSON.stringify({
        labId: "101",
        phase: "READY",
        tag: "AutoLabId=101",
        startedAt: "2026-05-13T10:00:00Z",
        lastVerifiedAt: null,
        lastError: null,
      }),
    );
    const state = readLabState("101");
    expect(state.phase).toBe("READY");
    expect(state.startedAt).toBe("2026-05-13T10:00:00Z");
  });
});

describe("writeLabState", () => {
  it("persists state and creates the directory if missing", () => {
    fs.rmSync(tmp, { recursive: true, force: true });
    writeLabState({
      labId: "101",
      phase: "PROVISIONING",
      tag: "AutoLabId=101",
      startedAt: "2026-05-13T10:00:00Z",
      lastVerifiedAt: null,
      lastError: null,
      result: null,
    });
    const raw = JSON.parse(
      fs.readFileSync(path.join(tmp, "lab-101.json"), "utf-8"),
    );
    expect(raw.phase).toBe("PROVISIONING");
  });
});

describe("canTransition", () => {
  it("allows Start from NOT_PROVISIONED", () => {
    expect(canTransition("NOT_PROVISIONED", "start").ok).toBe(true);
  });
  it("allows Start from CLEANED_UP", () => {
    expect(canTransition("CLEANED_UP", "start").ok).toBe(true);
  });
  it("rejects Start from READY", () => {
    const r = canTransition("READY", "start");
    expect(r.ok).toBe(false);
  });
  it("allows Verify from READY, VERIFIED, FAILED", () => {
    expect(canTransition("READY", "verify").ok).toBe(true);
    expect(canTransition("VERIFIED", "verify").ok).toBe(true);
    expect(canTransition("FAILED", "verify").ok).toBe(true);
  });
  it("rejects Verify from PROVISIONING", () => {
    expect(canTransition("PROVISIONING", "verify").ok).toBe(false);
  });
  it("allows Cleanup from READY, VERIFIED, FAILED", () => {
    expect(canTransition("READY", "cleanup").ok).toBe(true);
    expect(canTransition("VERIFIED", "cleanup").ok).toBe(true);
    expect(canTransition("FAILED", "cleanup").ok).toBe(true);
  });
  it("rejects Cleanup from CLEANED_UP", () => {
    expect(canTransition("CLEANED_UP", "cleanup").ok).toBe(false);
  });
});

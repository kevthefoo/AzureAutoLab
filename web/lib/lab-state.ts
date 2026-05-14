import fs from "node:fs";
import path from "node:path";
import type { LabPhase, LabState } from "./lab-state-types";

const DEFAULT_STATE_DIR = path.join(process.cwd(), "..", "labs", ".state");

export const STATE_DIR = DEFAULT_STATE_DIR;

function stateDir(): string {
  return process.env.LAB_STATE_DIR_OVERRIDE || DEFAULT_STATE_DIR;
}

function stateFile(labId: string): string {
  return path.join(stateDir(), `lab-${labId}.json`);
}

export function readLabState(labId: string): LabState {
  const file = stateFile(labId);
  if (!fs.existsSync(file)) {
    return {
      labId,
      phase: "NOT_PROVISIONED",
      tag: `AutoLabId=${labId}`,
      startedAt: null,
      lastVerifiedAt: null,
      lastError: null,
    };
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as LabState;
}

export function writeLabState(state: LabState): void {
  const dir = stateDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(stateFile(state.labId), JSON.stringify(state, null, 2));
}

export type Action = "start" | "verify" | "cleanup";

const ALLOWED: Record<Action, LabPhase[]> = {
  start: ["NOT_PROVISIONED", "CLEANED_UP"],
  verify: ["READY", "VERIFIED", "FAILED"],
  cleanup: ["READY", "VERIFIED", "FAILED"],
};

export function canTransition(
  phase: LabPhase,
  action: Action,
): { ok: true } | { ok: false; reason: string } {
  if (ALLOWED[action].includes(phase)) return { ok: true };
  return {
    ok: false,
    reason: `Cannot ${action} from phase ${phase}. Allowed phases: ${ALLOWED[action].join(", ")}.`,
  };
}

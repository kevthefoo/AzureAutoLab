export type LabPhase =
  | "NOT_PROVISIONED"
  | "PROVISIONING"
  | "READY"
  | "VERIFYING"
  | "VERIFIED"
  | "FAILED"
  | "CLEANING_UP"
  | "CLEANED_UP";

export interface LabResult {
  status: string;
  dateCompleted: string;
  notes: string[];
}

export interface LabState {
  labId: string;
  phase: LabPhase;
  tag: string;
  startedAt: string | null;
  lastVerifiedAt: string | null;
  lastError: string | null;
  result: LabResult | null;
}

export const TRANSIENT_PHASES: LabPhase[] = [
  "PROVISIONING",
  "VERIFYING",
  "CLEANING_UP",
];

export function isTransientPhase(phase: LabPhase): boolean {
  return TRANSIENT_PHASES.includes(phase);
}

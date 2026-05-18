const STATUS_STYLES: Record<string, string> = {
  PASSED: "bg-status-passed/15 text-status-passed",
  SKIPPED: "bg-status-skipped/15 text-status-skipped",
  "NOT STARTED": "bg-status-not-started/15 text-status-not-started",
  READY: "bg-accent/15 text-accent",
  PROVISIONING: "bg-accent/15 text-accent",
  VERIFYING: "bg-accent/15 text-accent",
  CLEANING_UP: "bg-accent/15 text-accent",
  VERIFIED: "bg-status-passed/15 text-status-passed",
  FAILED: "bg-red-500/15 text-red-400",
  CLEANED_UP: "bg-status-skipped/15 text-status-skipped",
};

export default function StatusBadge({ status }: { status: string }) {
  const normalized =
    status.startsWith("PASSED") || status === "PASS" ? "PASSED" : status;
  const style = STATUS_STYLES[normalized] || STATUS_STYLES["NOT STARTED"];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {normalized}
    </span>
  );
}

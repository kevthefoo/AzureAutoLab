import Link from "next/link";
import type { LabSummary } from "@/lib/labs";
import StatusBadge from "./status-badge";
import DomainBadge from "./domain-badge";
import DifficultyBadge from "./difficulty-badge";

export default function LabCard({ lab }: { lab: LabSummary }) {
  return (
    <Link
      href={`/labs/${lab.id}`}
      className="flex items-center justify-between bg-bg-surface border border-border rounded-lg px-5 py-4 hover:border-accent/50 transition-colors"
    >
      <div>
        <p className="font-medium">{lab.topic}</p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <DomainBadge domain={lab.domain} />
          <DifficultyBadge difficulty={lab.difficulty} />
        </div>
      </div>
      <StatusBadge status={lab.status} />
    </Link>
  );
}

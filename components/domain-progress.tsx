import type { DomainStats } from "@/lib/labs";

export default function DomainProgress({ domain, total, passed }: DomainStats) {
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4">
      <span className="text-text-secondary text-sm w-48 shrink-0">
        {domain}
      </span>
      <div className="flex-1 bg-border rounded-full h-2">
        <div
          className="bg-accent h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-text-secondary text-sm w-12 text-right">
        {passed}/{total}
      </span>
    </div>
  );
}

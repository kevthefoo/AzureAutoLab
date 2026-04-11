"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface LabFiltersProps {
  domains: string[];
  statuses: string[];
  activeDomain?: string;
  activeStatus?: string;
}

export default function LabFilters({
  domains,
  statuses,
  activeDomain,
  activeStatus,
}: LabFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/labs?${params.toString()}`);
  }

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
      active
        ? "bg-accent text-white"
        : "bg-bg-surface border border-border text-text-secondary hover:text-text-primary"
    }`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button className={pillClass(!activeDomain)} onClick={() => setFilter("domain", null)}>
          All Domains
        </button>
        {domains.map((d) => (
          <button key={d} className={pillClass(activeDomain === d)} onClick={() => setFilter("domain", activeDomain === d ? null : d)}>
            {d}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={pillClass(!activeStatus)} onClick={() => setFilter("status", null)}>
          All Statuses
        </button>
        {statuses.map((s) => (
          <button key={s} className={pillClass(activeStatus === s)} onClick={() => setFilter("status", activeStatus === s ? null : s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

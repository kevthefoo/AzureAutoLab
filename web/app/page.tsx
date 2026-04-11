import Link from "next/link";
import { getOverallStats, getDomainStats } from "@/lib/labs";
import StatCard from "@/components/stat-card";
import DomainProgress from "@/components/domain-progress";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const stats = getOverallStats();
  const domains = getDomainStats();

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Total Labs" value={stats.total} />
        <StatCard label="Passed" value={stats.passed} color="text-status-passed" />
      </div>

      {/* Overall Progress */}
      <div className="bg-bg-surface border border-border rounded-lg p-5 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-text-secondary">Overall Progress</span>
          <span className="text-sm font-bold text-accent">{stats.percentage}%</span>
        </div>
        <div className="bg-border rounded-full h-3">
          <div
            className="bg-accent h-3 rounded-full transition-all"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="bg-bg-surface border border-border rounded-lg p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Domains</h2>
        <div className="space-y-3">
          {domains.map((d) => (
            <DomainProgress key={d.domain} {...d} />
          ))}
        </div>
      </div>

      {/* Quick Link */}
      <Link
        href="/labs"
        className="inline-block bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        View All Labs
      </Link>
    </main>
  );
}

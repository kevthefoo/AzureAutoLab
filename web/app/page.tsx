import { getOverallStats, getLabSummaries } from "@/lib/labs";

export default function DashboardPage() {
  const stats = getOverallStats();
  const labs = getLabSummaries();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">AzureAutoLab</h1>
      <p className="text-text-secondary mt-2">
        {stats.passed}/{stats.total} labs passed ({stats.percentage}%)
      </p>
      <ul className="mt-4 space-y-1">
        {labs.map((lab) => (
          <li key={lab.id} className="text-text-secondary">
            {lab.number}. {lab.topic} — {lab.status}
          </li>
        ))}
      </ul>
    </main>
  );
}

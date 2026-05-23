import { getLabSummaries, normalizeLabStatus } from "@/lib/labs";
import LabCard from "@/components/lab-card";
import LabFilters from "./filters";

export const dynamic = "force-dynamic";

const STATUS_ORDER = ["PASSED", "NOT STARTED", "FAILED"] as const;

export default async function LabsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; status?: string }>;
}) {
  const params = await searchParams;
  const allLabs = getLabSummaries();

  const domains = [...new Set(allLabs.map((l) => l.domain))];
  const present = new Set(allLabs.map((l) => normalizeLabStatus(l.status)));
  const statuses = STATUS_ORDER.filter((s) => present.has(s));

  let filtered = allLabs;
  if (params.domain) {
    filtered = filtered.filter((l) => l.domain === params.domain);
  }
  if (params.status) {
    filtered = filtered.filter(
      (l) => normalizeLabStatus(l.status) === params.status,
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Labs</h1>

      <LabFilters
        domains={domains}
        statuses={statuses}
        activeDomain={params.domain}
        activeStatus={params.status}
      />

      <div className="space-y-2 mt-6">
        {filtered.map((lab) => (
          <LabCard key={lab.id} lab={lab} />
        ))}
        {filtered.length === 0 && (
          <p className="text-text-secondary text-center py-8">
            No labs match the selected filters.
          </p>
        )}
      </div>
    </main>
  );
}

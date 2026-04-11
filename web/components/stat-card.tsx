interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
}

export default function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5">
      <p className={`text-3xl font-bold ${color || "text-accent"}`}>{value}</p>
      <p className="text-text-secondary text-sm mt-1">{label}</p>
    </div>
  );
}

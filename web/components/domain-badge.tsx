const DOMAIN_STYLES: Record<string, string> = {
  "Identity & Governance": "bg-purple-500/15 text-purple-400",
  "Storage": "bg-blue-500/15 text-blue-400",
  "Compute": "bg-orange-500/15 text-orange-400",
  "Networking": "bg-teal-500/15 text-teal-400",
  "Monitoring & Backup": "bg-pink-500/15 text-pink-400",
};

export default function DomainBadge({ domain }: { domain: string }) {
  const style = DOMAIN_STYLES[domain] || "bg-bg-surface text-text-secondary";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {domain}
    </span>
  );
}

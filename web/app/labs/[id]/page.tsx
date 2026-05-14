import Link from "next/link";
import { notFound } from "next/navigation";
import { getLabById } from "@/lib/labs";
import StatusBadge from "@/components/status-badge";
import DomainBadge from "@/components/domain-badge";
import DifficultyBadge from "@/components/difficulty-badge";
import SectionCard from "@/components/section-card";
import ChatPanel from "@/components/chat-panel";
import TroubleshootPanel from "@/components/troubleshoot-panel";

export const dynamic = "force-dynamic";

export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lab = getLabById(id);
  if (!lab) notFound();

  return (
    <main className="max-w-4xl mx-auto p-8">
      {/* Back link */}
      <Link
        href="/labs"
        className="text-text-secondary hover:text-accent text-sm mb-6 inline-block transition-colors"
      >
        &larr; Back to Labs
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold">{lab.title}</h1>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={lab.result.status} />
            <ChatPanel labId={id} showVerify={!lab.isTroubleshooting} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <DomainBadge domain={lab.domain} />
          <DifficultyBadge difficulty={lab.difficulty} />
          <span className="text-text-secondary text-xs py-0.5">
            Assigned: {lab.dateAssigned}
          </span>
        </div>
      </div>

      {lab.isTroubleshooting && (
        <div className="mb-4">
          <TroubleshootPanel labId={id} />
        </div>
      )}

      {/* Content sections */}
      <div className="space-y-4">
        {/* Scenario */}
        <SectionCard title="Scenario">
          <p className="text-text-secondary leading-relaxed">{lab.scenario}</p>
        </SectionCard>

        {/* Tasks */}
        <SectionCard title="Tasks">
          <ul className="space-y-2">
            {lab.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 ${task.completed ? "text-status-passed" : "text-text-secondary"}`}
                >
                  {task.completed ? "✓" : "○"}
                </span>
                <span className="text-text-secondary">{task.text}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Skills Tested */}
        <SectionCard title="Skills Tested">
          <ul className="space-y-1">
            {lab.skillsTested.map((skill, i) => (
              <li key={i} className="text-text-secondary text-sm">
                • {skill}
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Verification Criteria */}
        <SectionCard title="Verification Criteria">
          <div
            className="text-text-secondary text-sm overflow-x-auto
              [&_table]:w-full [&_table]:border-collapse
              [&_th]:text-left [&_th]:px-3 [&_th]:py-2 [&_th]:border-b [&_th]:border-border [&_th]:text-text-primary [&_th]:text-xs [&_th]:uppercase
              [&_td]:px-3 [&_td]:py-2 [&_td]:border-b [&_td]:border-border
              [&_code]:bg-bg-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: lab.verificationHtml }}
          />
        </SectionCard>

        {/* Result */}
        <SectionCard title="Result">
          <div className="space-y-2 text-text-secondary">
            <p>
              <span className="text-text-primary font-medium">Status:</span>{" "}
              {lab.result.status}
            </p>
            {lab.result.date && (
              <p>
                <span className="text-text-primary font-medium">Date:</span>{" "}
                {lab.result.date}
              </p>
            )}
            {lab.result.notes && (
              <div>
                <span className="text-text-primary font-medium">Notes:</span>
                <p className="mt-1 whitespace-pre-line">{lab.result.notes}</p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </main>
  );
}

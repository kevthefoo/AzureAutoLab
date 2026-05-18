import SetupWizard from "@/components/setup-wizard";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <SetupWizard />
    </main>
  );
}

import QuizPanel from "@/components/quiz-panel";

export const dynamic = "force-dynamic";

export default function QuizPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">AZ-104 Quiz</h1>
      <QuizPanel />
    </main>
  );
}

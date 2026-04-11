const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-400",
  Intermediate: "bg-yellow-500/15 text-yellow-400",
  Advanced: "bg-red-500/15 text-red-400",
};

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: string;
}) {
  const style =
    DIFFICULTY_STYLES[difficulty] || "bg-bg-surface text-text-secondary";

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {difficulty}
    </span>
  );
}

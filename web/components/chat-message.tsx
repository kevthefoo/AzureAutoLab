"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? "bg-accent/20 text-text-primary"
            : "bg-bg-surface border border-border text-text-secondary"
        }`}
      >
        <span className="block text-[10px] uppercase tracking-wide text-text-secondary/60 mb-1">
          {isUser ? "You" : "Claude"}
        </span>
        <div className="whitespace-pre-wrap break-words leading-relaxed [&_code]:bg-bg-primary [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono">
          {content}
        </div>
      </div>
    </div>
  );
}

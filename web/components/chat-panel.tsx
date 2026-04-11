"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./chat-message";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const VERIFY_PROMPT =
  "Verify all tasks for this lab. Run the appropriate az CLI commands to check each task, then update the lab file's Result section with the results.";

export default function ChatPanel({ labId }: { labId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);

      const userMessage: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        abortRef.current = new AbortController();

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, labId, sessionId }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;

            try {
              const event = JSON.parse(payload);

              if (event.type === "text") {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: event.text,
                  };
                  return updated;
                });
                if (event.sessionId) setSessionId(event.sessionId);
              }

              if (event.type === "done") {
                if (event.sessionId) setSessionId(event.sessionId);
                if (event.text) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: event.text,
                    };
                    return updated;
                  });
                }
              }

              if (event.type === "error") {
                setError(event.text);
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [isLoading, labId, sessionId],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    sendMessage(trimmed);
  }

  function handleVerify() {
    setIsOpen(true);
    sendMessage(VERIFY_PROMPT);
  }

  function handleClear() {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setSessionId(null);
    setError(null);
    setIsLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const panel = isOpen ? (
    <div className="fixed right-6 bottom-6 w-[360px] h-[450px] bg-bg-primary border border-border rounded-xl flex flex-col z-50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Ask Claude</h3>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-secondary hover:text-text-primary transition-colors text-lg leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-text-secondary text-sm text-center mt-8">
            Ask Claude about this lab — get help with tasks, explanations, or
            verification.
          </p>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start">
            <div className="bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-secondary">
              <span className="animate-pulse">Claude is thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-3">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this lab..."
            rows={2}
            disabled={isLoading}
            className="flex-1 bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/50 resize-none focus:outline-none focus:border-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="self-end bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:hover:bg-accent text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-[10px] text-text-secondary/40 mt-1.5 px-1">
          Shift+Enter for newline. Uses your Claude Code subscription.
        </p>
      </form>
    </div>
  ) : null;

  return (
    <>
      {/* Verify button — renders inline where ChatPanel is placed */}
      <button
        onClick={handleVerify}
        disabled={isLoading}
        className="bg-status-passed/20 hover:bg-status-passed/30 text-status-passed border border-status-passed/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
      >
        Verify
      </button>

      {/* Chat icon button — fixed bottom-right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-accent hover:bg-accent-hover text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg z-50 cursor-pointer"
          aria-label="Ask Claude"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {panel}
    </>
  );
}

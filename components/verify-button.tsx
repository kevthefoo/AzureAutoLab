"use client";

import { useState } from "react";

export default function VerifyButton({ labId }: { labId: string }) {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    if (running) return;
    setRunning(true);
    setOutput("");
    setError(null);
    try {
      const res = await fetch(`/api/labs/${labId}/verify`, { method: "POST" });
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      const reader = res.body?.getReader();
      if (!reader) {
        setError("No response stream");
        return;
      }
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === "stdout" || ev.type === "stderr") {
              setOutput((prev) => prev + (ev.text || ""));
            } else if (ev.type === "error") {
              setError(ev.text);
            }
          } catch {
            // ignore malformed events
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verify failed");
    } finally {
      setRunning(false);
      // Reload to show updated Result section
      setTimeout(() => window.location.reload(), 400);
    }
  }

  return (
    <>
      <button
        onClick={verify}
        disabled={running}
        className="bg-status-passed/20 hover:bg-status-passed/30 text-status-passed border border-status-passed/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {running ? "Verifying..." : "Verify"}
      </button>
      {(running || error) && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-4">
          {running && (
            <div className="bg-bg-surface border border-accent/30 rounded-xl shadow-2xl px-5 py-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium text-text-primary">Verifying…</span>
              </div>
              {output && (
                <pre className="bg-bg-primary border border-border rounded p-2 text-xs text-text-secondary font-mono max-h-48 overflow-auto whitespace-pre-wrap">
                  {output}
                </pre>
              )}
            </div>
          )}
          {error && !running && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl shadow-2xl px-5 py-4">
              <p className="text-sm text-red-400 font-medium mb-1">Verify error</p>
              <p className="text-xs text-red-300 whitespace-pre-wrap">{error}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import type { LabPhase, LabState } from "@/lib/lab-state-types";

const POLL_INTERVAL_MS = 2000;
const TRANSIENT: LabPhase[] = ["PROVISIONING", "VERIFYING", "CLEANING_UP"];

export default function TroubleshootPanel({ labId }: { labId: string }) {
  const [state, setState] = useState<LabState | null>(null);
  const [output, setOutput] = useState<string>("");
  const [activeAction, setActiveAction] = useState<
    "start" | "verify" | "cleanup" | null
  >(null);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/labs/${labId}/state`);
    if (res.ok) setState(await res.json());
  }, [labId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (state && TRANSIENT.includes(state.phase)) {
      const t = setInterval(refresh, POLL_INTERVAL_MS);
      return () => clearInterval(t);
    }
  }, [state, refresh]);

  async function run(action: "start" | "verify" | "cleanup") {
    setActiveAction(action);
    setOutput("");
    try {
      const res = await fetch(`/api/labs/${labId}/${action}`, {
        method: "POST",
      });
      if (!res.ok) {
        const text = await res.text();
        setOutput(`Error: ${text}`);
        return;
      }
      const reader = res.body?.getReader();
      if (!reader) return;
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
            if (ev.type === "stdout" || ev.type === "stderr" || ev.type === "text") {
              setOutput((prev) => prev + (ev.text || ""));
            }
            if (ev.type === "status") {
              setOutput((prev) => prev + `\n[${ev.text}]\n`);
            }
            if (ev.type === "error") {
              setOutput((prev) => prev + `\nERROR: ${ev.text}\n`);
            }
          } catch {
            // ignore
          }
        }
      }
    } finally {
      setActiveAction(null);
      await refresh();
      if (action === "verify") window.location.reload();
    }
  }

  if (!state) return null;

  const phase = state.phase;
  const transient = TRANSIENT.includes(phase) || activeAction !== null;
  const canStart =
    !transient && (phase === "NOT_PROVISIONED" || phase === "CLEANED_UP");
  const canVerify =
    !transient &&
    (phase === "READY" || phase === "VERIFIED" || phase === "FAILED");
  const canCleanup = canVerify;

  return (
    <section className="border border-border rounded-xl p-5 bg-bg-surface">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Troubleshooting Lab Controls
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Phase: <span className="font-mono">{phase}</span>
            {state.lastError && (
              <span className="text-red-400 ml-2">— {state.lastError}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => run("start")}
            disabled={!canStart}
            className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            {activeAction === "start" ? "Provisioning..." : "Start"}
          </button>
          <button
            onClick={() => run("verify")}
            disabled={!canVerify}
            className="bg-status-passed/20 hover:bg-status-passed/30 text-status-passed border border-status-passed/30 disabled:opacity-40 text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            {activeAction === "verify" ? "Verifying..." : "Verify"}
          </button>
          <button
            onClick={() => run("cleanup")}
            disabled={!canCleanup}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 disabled:opacity-40 text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            {activeAction === "cleanup" ? "Cleaning up..." : "Cleanup"}
          </button>
        </div>
      </div>

      {output && (
        <pre className="bg-bg-primary border border-border rounded-lg p-3 text-xs text-text-secondary overflow-auto max-h-64 whitespace-pre-wrap font-mono">
          {output}
        </pre>
      )}
    </section>
  );
}

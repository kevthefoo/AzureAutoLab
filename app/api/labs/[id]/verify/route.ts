import { spawn } from "node:child_process";
import { getLabById } from "@/lib/labs";
import { readLabState, writeLabState, canTransition } from "@/lib/lab-state";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 5 * 60 * 1000;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paddedId = String(id).padStart(2, "0");

  const lab = getLabById(paddedId);
  if (!lab) return new Response("Lab not found", { status: 404 });
  if (!lab.verifyScript) {
    return new Response(
      "Lab has no ## Verify section — add one with a bash block emitting [PASS]/[FAIL] lines.",
      { status: 400 },
    );
  }

  // Troubleshooting labs use the sidecar state machine; build labs don't.
  const useState = lab.isTroubleshooting;
  if (useState) {
    const current = readLabState(paddedId);
    const transition = canTransition(current.phase, "verify");
    if (!transition.ok) {
      return new Response(transition.reason, { status: 409 });
    }
    writeLabState({ ...current, phase: "VERIFYING", lastError: null });
  }

  const encoder = new TextEncoder();
  const verifyScript = lab.verifyScript;

  const stream = new ReadableStream({
    start(controller) {
      const child = spawn("bash", ["-lc", verifyScript], {
        stdio: "pipe",
        env: {
          ...process.env,
          MSYS_NO_PATHCONV: "1",
          MSYS2_ARG_CONV_EXCL: "*",
        },
      });

      let stdoutBuf = "";
      let stderrTail = "";

      const send = (type: string, text: string) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, text })}\n\n`),
        );

      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        send("error", `Timed out after ${TIMEOUT_MS / 60000} minutes`);
      }, TIMEOUT_MS);

      child.stdout.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        stdoutBuf += text;
        send("stdout", text);
      });
      child.stderr.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        stderrTail = (stderrTail + text).slice(-2000);
        send("stderr", text);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        const summary = parseVerifyOutput(stdoutBuf);
        const allPassed = summary.fail === 0 && summary.pass > 0;
        const total = summary.pass + summary.fail;

        let status: string;
        if (total === 0) {
          status = `FAILED (script emitted no [PASS]/[FAIL] lines, exit ${code ?? -1})`;
        } else if (allPassed) {
          status = `PASSED (${summary.pass}/${total})`;
        } else if (summary.pass > 0) {
          status = `PARTIAL PASS (${summary.pass}/${total})`;
        } else {
          status = "FAILED";
        }

        const result = {
          status,
          dateCompleted: new Date().toISOString().slice(0, 10),
          notes: summary.lines.map((l) => `${l.pass ? "✅" : "❌"} ${l.text}`),
        };

        const state = readLabState(paddedId);
        writeLabState({
          ...state,
          ...(useState
            ? {
                phase: allPassed ? "VERIFIED" : "FAILED",
                lastError: allPassed ? null : (stderrTail || "Verification reported failures"),
              }
            : {}),
          lastVerifiedAt: new Date().toISOString(),
          result,
        });

        send("done", `${summary.pass} passed, ${summary.fail} failed`);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });
      child.on("error", (err) => {
        clearTimeout(timer);
        if (useState) {
          const state = readLabState(paddedId);
          writeLabState({ ...state, phase: "FAILED", lastError: err.message });
        }
        send("error", err.message);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

interface TaskLine {
  pass: boolean;
  text: string;
}

interface VerifySummary {
  pass: number;
  fail: number;
  lines: TaskLine[];
}

function parseVerifyOutput(stdout: string): VerifySummary {
  const lines: TaskLine[] = [];
  for (const raw of stdout.split("\n")) {
    const m = raw.match(/^\s*\[(PASS|FAIL)\]\s*(.*)$/);
    if (m) {
      lines.push({ pass: m[1] === "PASS", text: m[2].trim() });
    }
  }
  return {
    pass: lines.filter((l) => l.pass).length,
    fail: lines.filter((l) => !l.pass).length,
    lines,
  };
}


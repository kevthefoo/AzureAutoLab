import { spawn } from "node:child_process";
import { getLabById } from "@/lib/labs";
import { readLabState, writeLabState, canTransition } from "@/lib/lab-state";
import { validateSetupScript } from "@/lib/script-validator";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 15 * 60 * 1000;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paddedId = String(id).padStart(2, "0");

  const lab = getLabById(paddedId);
  if (!lab) return new Response("Lab not found", { status: 404 });
  if (!lab.setupScript) {
    return new Response("Lab has no ## Setup section", { status: 400 });
  }

  const current = readLabState(paddedId);
  const transition = canTransition(current.phase, "start");
  if (!transition.ok) {
    return new Response(transition.reason, { status: 409 });
  }

  const validation = validateSetupScript(lab.setupScript, paddedId);
  if (!validation.ok) {
    return new Response(validation.reason, { status: 400 });
  }

  writeLabState({
    ...current,
    phase: "PROVISIONING",
    startedAt: new Date().toISOString(),
    lastError: null,
  });

  return runBashStream({
    labId: paddedId,
    script: lab.setupScript,
    onSuccess: () => ({
      ...readLabState(paddedId),
      phase: "READY",
    }),
    onFailure: (err) => ({
      ...readLabState(paddedId),
      phase: "FAILED",
      lastError: err,
    }),
  });
}

export function runBashStream(opts: {
  labId: string;
  script: string;
  onSuccess: () => ReturnType<typeof readLabState>;
  onFailure: (err: string) => ReturnType<typeof readLabState>;
}): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const child = spawn("bash", ["-lc", opts.script], { stdio: "pipe" });
      let stderrTail = "";

      const send = (type: string, text: string) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, text })}\n\n`),
        );

      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        send("error", `Timed out after ${TIMEOUT_MS / 60000} minutes`);
      }, TIMEOUT_MS);

      child.stdout.on("data", (chunk: Buffer) => send("stdout", chunk.toString()));
      child.stderr.on("data", (chunk: Buffer) => {
        const t = chunk.toString();
        stderrTail = (stderrTail + t).slice(-4000);
        send("stderr", t);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0) {
          writeLabState(opts.onSuccess());
          send("done", "ok");
        } else {
          writeLabState(opts.onFailure(stderrTail || `exit code ${code}`));
          send("done", `failed (exit ${code})`);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });
      child.on("error", (err) => {
        clearTimeout(timer);
        writeLabState(opts.onFailure(err.message));
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

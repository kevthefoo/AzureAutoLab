import { spawn } from "node:child_process";
import path from "node:path";
import { getLabById } from "@/lib/labs";
import { readLabState, writeLabState, canTransition } from "@/lib/lab-state";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paddedId = String(id).padStart(2, "0");

  const lab = getLabById(paddedId);
  if (!lab) return new Response("Lab not found", { status: 404 });
  if (!lab.isTroubleshooting) {
    return new Response("Lab is not a troubleshooting lab", { status: 400 });
  }

  const current = readLabState(paddedId);
  const transition = canTransition(current.phase, "verify");
  if (!transition.ok) {
    return new Response(transition.reason, { status: 409 });
  }

  writeLabState({ ...current, phase: "VERIFYING", lastError: null });

  const projectRoot = path.join(process.cwd(), "..");
  const prompt = [
    `You are verifying troubleshooting Lab ${paddedId}.`,
    `Read labs/lab-${paddedId}-*.md and run every command in the Verification Criteria table.`,
    `Judge each task PASSED or FAILED and write the Result section in the existing format.`,
    `Do NOT create, modify, or delete any Azure resources.`,
    `Resources are tagged AutoLabId=${paddedId} — limit queries to that tag where possible.`,
  ].join("\n");

  const systemPrompt = [
    "You are an Azure administrator tutor verifying lab results.",
    "When updating results, edit the lab file's Result section using EXACTLY this format:",
    "",
    "## Result",
    "",
    "- **Status:** PASSED (N/N) or PARTIAL PASS (N/N) or FAILED",
    "- **Date Completed:** YYYY-MM-DD",
    "- **Notes:**",
    "  - ✅ Task 1: description",
    "",
    "CRITICAL: You MUST only READ Azure resources via `az` queries. NEVER create, upload, modify, or delete any Azure resource.",
    "Be concise.",
  ].join("\n");

  const args = [
    "-p",
    prompt,
    "--output-format",
    "stream-json",
    "--verbose",
    "--model",
    "sonnet",
    "--system-prompt",
    systemPrompt,
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const child = spawn("claude", args, { cwd: projectRoot });
      let lastText = "";
      let buffer = "";

      const send = (type: string, payload: object) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, ...payload })}\n\n`),
        );

      child.stdout.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === "assistant" && event.message?.content) {
              for (const block of event.message.content) {
                if (block.type === "text" && block.text) {
                  send("text", { text: block.text });
                  lastText = block.text;
                }
                if (block.type === "tool_use") {
                  const label =
                    block.name === "Bash"
                      ? `Running: ${block.input?.command || "command"}`
                      : `Using tool: ${block.name}`;
                  send("status", { text: label });
                }
              }
            }
            if (event.type === "result") {
              const success =
                /PASSED/.test(event.result || lastText) &&
                !/FAILED/.test(event.result || lastText);
              const state = readLabState(paddedId);
              writeLabState({
                ...state,
                phase: success ? "VERIFIED" : "FAILED",
                lastVerifiedAt: new Date().toISOString(),
                lastError: success ? null : "Verification reported failures",
              });
              send("done", { text: event.result || lastText });
            }
          } catch {
            // ignore malformed JSON
          }
        }
      });

      child.on("close", () => {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });
      child.on("error", (err) => {
        const state = readLabState(paddedId);
        writeLabState({ ...state, phase: "FAILED", lastError: err.message });
        send("error", { text: `Failed to start Claude: ${err.message}` });
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

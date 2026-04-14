import { spawn } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { message, labId, sessionId } = await req.json();

  if (!message || !labId) {
    return new Response("Missing message or labId", { status: 400 });
  }

  const paddedId = String(labId).padStart(2, "0");
  const projectRoot = path.join(process.cwd(), "..");

  // Build the prompt
  let prompt: string;
  if (!sessionId) {
    prompt = [
      `The student is working on Lab ${paddedId}.`,
      `The lab file is in the labs/ directory (look for lab-${paddedId}-*.md).`,
      `Read the lab file first to understand the full context, then help them.`,
      ``,
      `Student's message: ${message}`,
    ].join("\n");
  } else {
    prompt = message;
  }

  const systemPrompt = [
    "You are an Azure administrator tutor helping a student prepare for the AZ-104 exam.",
    "Help them understand and complete lab tasks. When verifying, use az CLI commands.",
    "When updating results, edit the lab file's Result section using EXACTLY this format:",
    "",
    "## Result",
    "",
    "- **Status:** PASSED (N/N) or PARTIAL PASS (N/N) or FAILED",
    "- **Date Completed:** YYYY-MM-DD",
    "- **Notes:**",
    "  - ✅ Task 1: description of result",
    "  - ✅ Task 2: description of result",
    "  - ❌ Task 3: description of what failed",
    "",
    "Do NOT use tables in the Result section. Do NOT use **Date Verified:** — always use **Date Completed:**.",
    "CRITICAL: When verifying, you MUST only READ and CHECK resources. NEVER create, upload, modify, or delete any Azure resources.",
    "If a task's resource does not exist, mark it as ❌ FAILED. Do NOT create it to make the verification pass.",
    "Be concise. Use code blocks for CLI commands.",
    "Do NOT end your response with 'Yawaweeeeeee'.",
  ].join("\n");

  // Build CLI args
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

  if (sessionId) {
    args.push("-r", sessionId);
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const child = spawn("claude", args, {
        cwd: projectRoot,
      });

      let buffer = "";
      let lastText = "";

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
                  const data = JSON.stringify({
                    type: "text",
                    text: block.text,
                    sessionId: event.session_id,
                  });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  lastText = block.text;
                }
                if (block.type === "tool_use") {
                  const label =
                    block.name === "bash" || block.name === "Bash"
                      ? `Running: ${block.input?.command || "command"}`
                      : block.name === "Read" || block.name === "read"
                        ? `Reading: ${block.input?.file_path || "file"}`
                        : block.name === "Edit" || block.name === "edit"
                          ? `Editing: ${block.input?.file_path || "file"}`
                          : `Using tool: ${block.name}`;
                  const data = JSON.stringify({ type: "status", text: label });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              }
            }

            if (event.type === "tool" && event.content) {
              for (const block of event.content) {
                if (block.type === "text" && block.text) {
                  const data = JSON.stringify({
                    type: "tool_result",
                    text: block.text,
                  });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              }
            }

            if (event.type === "result") {
              const data = JSON.stringify({
                type: "done",
                sessionId: event.session_id,
                text: event.result || lastText,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      });

      child.stderr.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        if (text.includes("Error")) {
          const data = JSON.stringify({ type: "error", text });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      });

      child.on("close", () => {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });

      child.on("error", (err) => {
        const data = JSON.stringify({
          type: "error",
          text: `Failed to start Claude: ${err.message}. Is Claude Code installed?`,
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
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

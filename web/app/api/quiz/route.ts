import { spawn } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

const DOMAINS = [
  "Identity & Governance",
  "Storage",
  "Compute",
  "Networking",
  "Monitoring & Backup",
];

const systemPrompt = [
  "You are an AZ-104 exam quiz master.",
  "Generate challenging multiple-choice questions that test Azure administrator knowledge.",
  "When generating a question, respond with ONLY a JSON block (no markdown fences, no extra text) in this exact format:",
  '{"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "correct": "B"}',
  "When evaluating an answer, explain why the correct answer is right and why the others are wrong. Be concise (3-5 sentences).",
  "Do NOT end your response with 'Yawaweeeeeee'.",
].join(" ");

export async function POST(req: Request) {
  const body = await req.json();
  const { action, domain, sessionId, selected, prompt: clientPrompt } = body;

  if (!action) {
    return new Response("Missing action", { status: 400 });
  }

  const projectRoot = path.join(process.cwd(), "..");

  let prompt: string;

  if (action === "generate") {
    const domainFilter =
      domain && domain !== "All"
        ? `Focus on the "${domain}" domain.`
        : `Pick randomly from these domains: ${DOMAINS.join(", ")}.`;
    prompt = [
      "Generate one AZ-104 multiple-choice question.",
      domainFilter,
      "Make it exam-realistic. Vary difficulty.",
      "Do NOT repeat questions from this session.",
      "Respond with ONLY the JSON object, no other text.",
    ].join(" ");
  } else if (action === "answer") {
    if (!selected || !sessionId) {
      return new Response("Missing selected or sessionId", { status: 400 });
    }
    prompt = `The student selected "${selected}". Tell them if they are correct or incorrect, then explain why the correct answer is right and why each wrong option is wrong. Be concise.`;
  } else if (action === "explain") {
    if (!clientPrompt) {
      return new Response("Missing prompt", { status: 400 });
    }
    prompt = clientPrompt;
  } else {
    return new Response("Invalid action", { status: 400 });
  }

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

import OpenAI from "openai";
import { getLabById } from "@/lib/labs";

export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const SYSTEM_PROMPT = [
  "You are an Azure administrator tutor helping a student prepare for the AZ-104 exam.",
  "Help the student understand and complete lab tasks. Reference the specific lab they're working on when relevant.",
  "When suggesting CLI commands, use Azure CLI (`az`) and show them in code blocks.",
  "Be concise and direct. Default to short answers unless the student asks for depth.",
].join("\n");

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

interface RequestBody {
  message: string;
  labId?: string;
  history?: ChatMessage[];
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      "OPENAI_API_KEY is not set. Add it to web/.env.local and restart the dev server.",
      { status: 500 },
    );
  }

  const body = (await req.json()) as RequestBody;
  if (!body?.message) {
    return new Response("Missing 'message' in body", { status: 400 });
  }

  // Build messages: system + (optional) lab context + history + new user message
  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  if (body.labId) {
    const paddedId = String(body.labId).padStart(2, "0");
    const lab = getLabById(paddedId);
    if (lab) {
      messages.push({
        role: "system",
        content: [
          `The student is working on Lab ${paddedId} — ${lab.title}.`,
          `Domain: ${lab.domain}. Difficulty: ${lab.difficulty}.`,
          ``,
          `Scenario: ${lab.scenario}`,
          ``,
          `Tasks:`,
          ...lab.tasks.map((t, i) => `  ${i + 1}. ${t.text}`),
        ].join("\n"),
      });
    }
  }

  if (Array.isArray(body.history)) {
    for (const m of body.history) {
      if (m.role === "user" || m.role === "assistant") {
        messages.push({ role: m.role, content: m.content });
      }
    }
  }
  messages.push({ role: "user", content: body.message });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, text: string) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, text })}\n\n`),
        );

      try {
        const completion = await client.chat.completions.create({
          model: MODEL,
          messages,
          stream: true,
        });
        let acc = "";
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            acc += delta;
            send("text", acc);
          }
        }
        send("done", acc);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        send("error", msg);
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
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

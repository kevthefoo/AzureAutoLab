import { writeOpenAiKey } from "@/lib/setup-checks";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as { key?: string };
  if (!body?.key || typeof body.key !== "string") {
    return new Response("Missing key", { status: 400 });
  }
  try {
    writeOpenAiKey(body.key);
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "Failed to save key", {
      status: 400,
    });
  }
  return Response.json({ ok: true });
}

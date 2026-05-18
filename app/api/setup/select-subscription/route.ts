import { setSubscription } from "@/lib/setup-checks";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as { subscriptionId?: string };
  if (!body?.subscriptionId) {
    return new Response("Missing subscriptionId", { status: 400 });
  }
  try {
    await setSubscription(body.subscriptionId);
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "Failed to switch subscription", {
      status: 400,
    });
  }
  return Response.json({ ok: true });
}

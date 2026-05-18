import { cookies } from "next/headers";
import { getSetupReport, isAzureReady } from "@/lib/setup-checks";

export const dynamic = "force-dynamic";

export async function POST() {
  const report = await getSetupReport({ fresh: true });
  if (!isAzureReady(report)) {
    return new Response("Azure prerequisites not satisfied", { status: 400 });
  }
  const jar = await cookies();
  jar.set("setup-ok", "1", {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
  });
  return Response.json({ ok: true });
}

import { getSetupReport, listSubscriptions, isAzureReady } from "@/lib/setup-checks";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const fresh = new URL(req.url).searchParams.get("fresh") === "1";
  const report = await getSetupReport({ fresh });
  const subscriptions = report.azLogin.ok ? await listSubscriptions() : [];
  return Response.json({
    report,
    subscriptions,
    azureReady: isAzureReady(report),
  });
}

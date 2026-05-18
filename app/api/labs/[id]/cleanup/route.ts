import { getLabById } from "@/lib/labs";
import { readLabState, writeLabState, canTransition } from "@/lib/lab-state";
import { validateCleanupScript } from "@/lib/script-validator";
import { runBashStream } from "../start/route";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paddedId = String(id).padStart(2, "0");

  const lab = getLabById(paddedId);
  if (!lab) return new Response("Lab not found", { status: 404 });
  if (!lab.cleanupScript) {
    return new Response("Lab has no ## Cleanup section", { status: 400 });
  }

  const current = readLabState(paddedId);
  const transition = canTransition(current.phase, "cleanup");
  if (!transition.ok) {
    return new Response(transition.reason, { status: 409 });
  }

  const validation = validateCleanupScript(lab.cleanupScript, paddedId);
  if (!validation.ok) {
    return new Response(validation.reason, { status: 400 });
  }

  writeLabState({ ...current, phase: "CLEANING_UP", lastError: null });

  return runBashStream({
    labId: paddedId,
    script: lab.cleanupScript,
    onSuccess: () => ({
      ...readLabState(paddedId),
      phase: "CLEANED_UP",
    }),
    onFailure: (err) => ({
      ...readLabState(paddedId),
      phase: "FAILED",
      lastError: err,
    }),
  });
}

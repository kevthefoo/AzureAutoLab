import { readLabState } from "@/lib/lab-state";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paddedId = String(id).padStart(2, "0");
  const state = readLabState(paddedId);
  return Response.json(state);
}

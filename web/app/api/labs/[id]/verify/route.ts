import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { getLabById } from "@/lib/labs";
import { readLabState, writeLabState, canTransition } from "@/lib/lab-state";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 5 * 60 * 1000;
const LABS_DIR = path.join(process.cwd(), "..", "labs");

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
  if (!lab.verifyScript) {
    return new Response(
      "Lab has no ## Verify section — add one with a bash block emitting [PASS]/[FAIL] lines.",
      { status: 400 },
    );
  }

  const current = readLabState(paddedId);
  const transition = canTransition(current.phase, "verify");
  if (!transition.ok) {
    return new Response(transition.reason, { status: 409 });
  }

  writeLabState({ ...current, phase: "VERIFYING", lastError: null });

  const encoder = new TextEncoder();
  const verifyScript = lab.verifyScript;
  const labFilename = lab.filename;

  const stream = new ReadableStream({
    start(controller) {
      const child = spawn("bash", ["-lc", verifyScript], {
        stdio: "pipe",
        env: {
          ...process.env,
          MSYS_NO_PATHCONV: "1",
          MSYS2_ARG_CONV_EXCL: "*",
        },
      });

      let stdoutBuf = "";
      let stderrTail = "";

      const send = (type: string, text: string) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, text })}\n\n`),
        );

      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        send("error", `Timed out after ${TIMEOUT_MS / 60000} minutes`);
      }, TIMEOUT_MS);

      child.stdout.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        stdoutBuf += text;
        send("stdout", text);
      });
      child.stderr.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        stderrTail = (stderrTail + text).slice(-2000);
        send("stderr", text);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        const summary = parseVerifyOutput(stdoutBuf);
        const allPassed = summary.fail === 0 && summary.pass > 0;
        const state = readLabState(paddedId);
        writeLabState({
          ...state,
          phase: allPassed ? "VERIFIED" : "FAILED",
          lastVerifiedAt: new Date().toISOString(),
          lastError: allPassed ? null : (stderrTail || "Verification reported failures"),
        });

        // Write Result section to the lab markdown file
        try {
          writeResultSection(labFilename, summary, allPassed, code ?? -1);
        } catch (err) {
          send("error", `Failed to update Result section: ${err instanceof Error ? err.message : String(err)}`);
        }

        send("done", `${summary.pass} passed, ${summary.fail} failed`);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      });
      child.on("error", (err) => {
        clearTimeout(timer);
        const state = readLabState(paddedId);
        writeLabState({ ...state, phase: "FAILED", lastError: err.message });
        send("error", err.message);
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

interface TaskLine {
  pass: boolean;
  text: string;
}

interface VerifySummary {
  pass: number;
  fail: number;
  lines: TaskLine[];
}

function parseVerifyOutput(stdout: string): VerifySummary {
  const lines: TaskLine[] = [];
  for (const raw of stdout.split("\n")) {
    const m = raw.match(/^\s*\[(PASS|FAIL)\]\s*(.*)$/);
    if (m) {
      lines.push({ pass: m[1] === "PASS", text: m[2].trim() });
    }
  }
  return {
    pass: lines.filter((l) => l.pass).length,
    fail: lines.filter((l) => !l.pass).length,
    lines,
  };
}

function writeResultSection(
  filename: string,
  summary: VerifySummary,
  allPassed: boolean,
  exitCode: number,
): void {
  const filepath = path.join(LABS_DIR, filename);
  const md = fs.readFileSync(filepath, "utf-8");

  const total = summary.pass + summary.fail;
  let status: string;
  if (total === 0) {
    status = `FAILED (script emitted no [PASS]/[FAIL] lines, exit ${exitCode})`;
  } else if (allPassed) {
    status = `PASSED (${summary.pass}/${total})`;
  } else if (summary.pass > 0) {
    status = `PARTIAL PASS (${summary.pass}/${total})`;
  } else {
    status = "FAILED";
  }

  const date = new Date().toISOString().slice(0, 10);
  const notes = summary.lines
    .map((l) => `  - ${l.pass ? "✅" : "❌"} ${l.text}`)
    .join("\n");

  const newResult = [
    "## Result",
    "",
    `- **Status:** ${status}`,
    `- **Date Completed:** ${date}`,
    "- **Notes:**",
    notes || "  - (no per-task lines were emitted)",
    "",
  ].join("\n");

  // Replace existing ## Result section (everything from "## Result" to EOF or next ## heading)
  const resultRe = /## Result[\s\S]*$/m;
  let updated: string;
  if (resultRe.test(md)) {
    updated = md.replace(resultRe, newResult);
  } else {
    updated = md.replace(/\s*$/, "\n\n" + newResult);
  }

  fs.writeFileSync(filepath, updated);
}

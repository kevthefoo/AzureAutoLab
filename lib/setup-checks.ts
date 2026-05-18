import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";

const execAsync = promisify(exec);

const ENV_LOCAL = path.join(process.cwd(), ".env.local");

const EXEC_OPTS = {
  timeout: 15_000,
  env: {
    ...process.env,
    MSYS_NO_PATHCONV: "1",
    MSYS2_ARG_CONV_EXCL: "*",
  },
} as const;

export interface CheckResult {
  ok: boolean;
  message: string;
  detail?: unknown;
}

export interface SetupReport {
  azCli: CheckResult;
  azLogin: CheckResult & { subscription?: Subscription };
  azPermissions: CheckResult;
  openAi: CheckResult;
}

export interface Subscription {
  id: string;
  name: string;
  tenantId: string;
  user?: { name?: string; type?: string };
}

interface CachedReport {
  report: SetupReport;
  at: number;
}

const CACHE_TTL_MS = 60_000;
let cached: CachedReport | null = null;

export function invalidateSetupCache(): void {
  cached = null;
}

export async function getSetupReport(opts?: { fresh?: boolean }): Promise<SetupReport> {
  if (!opts?.fresh && cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.report;
  }
  const report = await runAllChecks();
  cached = { report, at: Date.now() };
  return report;
}

async function runAllChecks(): Promise<SetupReport> {
  const azCli = await checkAzCli();
  if (!azCli.ok) {
    const skip: CheckResult = { ok: false, message: "Skipped — Azure CLI not installed." };
    return { azCli, azLogin: skip, azPermissions: skip, openAi: await checkOpenAi() };
  }
  const azLogin = await checkAzLogin();
  if (!azLogin.ok) {
    const skip: CheckResult = { ok: false, message: "Skipped — not logged in." };
    return { azCli, azLogin, azPermissions: skip, openAi: await checkOpenAi() };
  }
  const azPermissions = await checkAzPermissions(azLogin.subscription!);
  const openAi = await checkOpenAi();
  return { azCli, azLogin, azPermissions, openAi };
}

async function checkAzCli(): Promise<CheckResult> {
  try {
    const { stdout } = await execAsync("az --version", EXEC_OPTS);
    const firstLine = stdout.split("\n")[0]?.trim() ?? "";
    return { ok: true, message: firstLine || "Azure CLI is installed." };
  } catch {
    return {
      ok: false,
      message:
        "Azure CLI is not installed or not in PATH. Install from https://aka.ms/installazurecli, then click Recheck.",
    };
  }
}

async function checkAzLogin(): Promise<CheckResult & { subscription?: Subscription }> {
  try {
    const { stdout } = await execAsync("az account show -o json", EXEC_OPTS);
    const acc = JSON.parse(stdout);
    const subscription: Subscription = {
      id: acc.id,
      name: acc.name,
      tenantId: acc.tenantId,
      user: acc.user,
    };
    return {
      ok: true,
      message: `Signed in as ${acc.user?.name ?? "(unknown)"} on subscription "${acc.name}".`,
      subscription,
    };
  } catch {
    return {
      ok: false,
      message: "Not logged in. Run `az login` in your terminal, then click Recheck.",
    };
  }
}

const WRITE_CAPABLE_ROLES = new Set([
  "Owner",
  "Contributor",
  "User Access Administrator",
]);

async function checkAzPermissions(sub: Subscription): Promise<CheckResult> {
  try {
    // Get signed-in user's object id
    const { stdout: userOut } = await execAsync(
      "az ad signed-in-user show --query id -o tsv",
      EXEC_OPTS,
    );
    const userId = userOut.trim();
    if (!userId) {
      return {
        ok: false,
        message:
          "Could not resolve signed-in user id from Microsoft Entra. Check that `az login` completed successfully.",
      };
    }

    // List role assignments at the subscription scope, including inherited
    const cmd = `az role assignment list --assignee ${userId} --scope /subscriptions/${sub.id} --include-inherited -o json`;
    const { stdout } = await execAsync(cmd, EXEC_OPTS);
    const assignments = JSON.parse(stdout) as Array<{ roleDefinitionName: string }>;
    const roles = assignments.map((a) => a.roleDefinitionName).filter(Boolean);
    const writeCapable = roles.filter((r) => WRITE_CAPABLE_ROLES.has(r));

    if (writeCapable.length > 0) {
      return {
        ok: true,
        message: `You have role(s) that can create/update resources: ${[...new Set(writeCapable)].join(", ")}.`,
        detail: roles,
      };
    }

    if (roles.length > 0) {
      return {
        ok: false,
        message: `Your subscription roles (${[...new Set(roles)].join(", ")}) may not include create/update permissions. Owner or Contributor is recommended.`,
        detail: roles,
      };
    }

    return {
      ok: false,
      message:
        "No role assignments found at the subscription scope. Ask an admin to grant you Contributor or Owner.",
    };
  } catch (err) {
    return {
      ok: false,
      message: `Could not check permissions: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

async function checkOpenAi(): Promise<CheckResult> {
  // Prefer process.env (set at server start), fall back to live read of .env.local
  if (process.env.OPENAI_API_KEY) {
    return { ok: true, message: "OpenAI API key is configured (chat is ready)." };
  }
  if (fs.existsSync(ENV_LOCAL)) {
    const contents = fs.readFileSync(ENV_LOCAL, "utf-8");
    if (/^OPENAI_API_KEY\s*=\s*\S+/m.test(contents)) {
      return {
        ok: true,
        message:
          "OPENAI_API_KEY is in .env.local but the dev server hasn't picked it up yet. Restart `npm run dev` to enable chat.",
      };
    }
  }
  return {
    ok: false,
    message: "No OpenAI API key configured. Chat will be disabled. Paste a key below to enable it (optional).",
  };
}

export function isAzureReady(report: SetupReport): boolean {
  return report.azCli.ok && report.azLogin.ok && report.azPermissions.ok;
}

export function writeOpenAiKey(key: string): void {
  const trimmed = key.trim();
  if (!trimmed) throw new Error("Empty API key.");
  let body = "";
  if (fs.existsSync(ENV_LOCAL)) {
    body = fs.readFileSync(ENV_LOCAL, "utf-8");
  }
  if (/^OPENAI_API_KEY\s*=.*$/m.test(body)) {
    body = body.replace(/^OPENAI_API_KEY\s*=.*$/m, `OPENAI_API_KEY=${trimmed}`);
  } else {
    if (body.length > 0 && !body.endsWith("\n")) body += "\n";
    body += `OPENAI_API_KEY=${trimmed}\n`;
  }
  fs.writeFileSync(ENV_LOCAL, body);
  invalidateSetupCache();
}

export async function setSubscription(subId: string): Promise<void> {
  if (!/^[a-f0-9-]+$/i.test(subId)) throw new Error("Invalid subscription id.");
  await execAsync(`az account set --subscription ${subId}`, EXEC_OPTS);
  invalidateSetupCache();
}

export async function listSubscriptions(): Promise<Subscription[]> {
  try {
    const { stdout } = await execAsync("az account list -o json", EXEC_OPTS);
    const accounts = JSON.parse(stdout) as Array<{
      id: string;
      name: string;
      tenantId: string;
      user?: { name?: string; type?: string };
    }>;
    return accounts.map((a) => ({
      id: a.id,
      name: a.name,
      tenantId: a.tenantId,
      user: a.user,
    }));
  } catch {
    return [];
  }
}

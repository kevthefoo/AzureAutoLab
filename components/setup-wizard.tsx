"use client";

import { useEffect, useState, useCallback } from "react";

interface CheckResult {
    ok: boolean;
    message: string;
}

interface Subscription {
    id: string;
    name: string;
    tenantId: string;
}

interface SetupReport {
    azCli: CheckResult;
    azLogin: CheckResult & { subscription?: Subscription };
    azPermissions: CheckResult;
    openAi: CheckResult;
}

interface CheckResponse {
    report: SetupReport;
    subscriptions: Subscription[];
    azureReady: boolean;
}

function Pill({ ok }: { ok: boolean | null }) {
    if (ok === null) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg-primary text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-text-secondary/40 animate-pulse" />
                Checking…
            </span>
        );
    }
    if (ok) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-status-passed/15 text-status-passed">
                ✓ OK
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400">
            ✗ Needs attention
        </span>
    );
}

export default function SetupWizard() {
    const [data, setData] = useState<CheckResponse | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openAiKey, setOpenAiKey] = useState("");
    const [completing, setCompleting] = useState(false);

    const refresh = useCallback(async (fresh = true) => {
        setBusy("Re-running checks…");
        setError(null);
        try {
            const res = await fetch(
                `/api/setup/check${fresh ? "?fresh=1" : ""}`,
                {
                    cache: "no-store",
                },
            );
            if (!res.ok) throw new Error(`Check failed: ${res.status}`);
            setData(await res.json());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Check failed");
        } finally {
            setBusy(null);
        }
    }, []);

    useEffect(() => {
        refresh(false);
    }, [refresh]);

    async function switchSubscription(id: string) {
        setBusy("Switching subscription…");
        setError(null);
        try {
            const res = await fetch("/api/setup/select-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId: id }),
            });
            if (!res.ok) throw new Error(await res.text());
            await refresh(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Subscription switch failed",
            );
        } finally {
            setBusy(null);
        }
    }

    async function saveOpenAiKey() {
        if (!openAiKey.trim()) return;
        setBusy("Saving OpenAI key…");
        setError(null);
        try {
            const res = await fetch("/api/setup/save-openai-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: openAiKey }),
            });
            if (!res.ok) throw new Error(await res.text());
            setOpenAiKey("");
            await refresh(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setBusy(null);
        }
    }

    async function complete() {
        setCompleting(true);
        setError(null);
        try {
            const res = await fetch("/api/setup/complete", { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            window.location.href = "/";
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Could not complete setup",
            );
            setCompleting(false);
        }
    }

    const r = data?.report;
    const ready = !!data?.azureReady;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Setup</h1>
                <p className="text-text-secondary text-sm mt-1">
                    Quick prerequisites check. The app needs Azure CLI installed
                    and signed in before any lab can run.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Step 1 */}
            <section className="bg-bg-surface border border-border rounded-lg p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="font-semibold">
                            1. Azure CLI installed
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            {r ? r.azCli.message : "Checking…"}
                        </p>
                    </div>
                    <Pill ok={r ? r.azCli.ok : null} />
                </div>
            </section>

            {/* Step 2 */}
            <section className="bg-bg-surface border border-border rounded-lg p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h2 className="font-semibold">
                            2. Logged in with a subscription
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            {r ? r.azLogin.message : "Checking…"}
                        </p>

                        {data &&
                            data.subscriptions.length > 1 &&
                            r?.azLogin.ok && (
                                <div className="mt-3">
                                    <label className="text-xs text-text-secondary block mb-1">
                                        Switch subscription
                                    </label>
                                    <select
                                        defaultValue={
                                            r.azLogin.subscription?.id || ""
                                        }
                                        onChange={(e) =>
                                            switchSubscription(e.target.value)
                                        }
                                        disabled={!!busy}
                                        className="bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent disabled:opacity-50"
                                    >
                                        {data.subscriptions.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.id.slice(0, 8)}…)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        {!r?.azLogin.ok && r?.azCli.ok && (
                            <p className="text-xs text-text-secondary/70 mt-2 font-mono bg-bg-primary border border-border rounded px-2 py-1 inline-block">
                                az login
                            </p>
                        )}
                    </div>
                    <Pill ok={r ? r.azLogin.ok : null} />
                </div>
            </section>

            {/* Step 3 */}
            <section className="bg-bg-surface border border-border rounded-lg p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="font-semibold">
                            3. Can create/update resources
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            {r ? r.azPermissions.message : "Checking…"}
                        </p>
                    </div>
                    <Pill ok={r ? r.azPermissions.ok : null} />
                </div>
            </section>

            {/* Step 4 */}
            <section className="bg-bg-surface border border-border rounded-lg p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h2 className="font-semibold">
                            4. OpenAI API key{" "}
                            <span className="text-text-secondary/60 text-xs font-normal">
                                (optional)
                            </span>
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            {r ? r.openAi.message : "Checking…"}
                        </p>

                        {r && !r.openAi.ok && (
                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    type="password"
                                    value={openAiKey}
                                    onChange={(e) =>
                                        setOpenAiKey(e.target.value)
                                    }
                                    placeholder="sk-..."
                                    disabled={!!busy}
                                    className="flex-1 bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent disabled:opacity-50 font-mono"
                                />
                                <button
                                    onClick={saveOpenAiKey}
                                    disabled={!openAiKey.trim() || !!busy}
                                    className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-text-secondary/60 mt-2">
                            Written to{" "}
                            <code className="font-mono">web/.env.local</code>.
                            Restart{" "}
                            <code className="font-mono">npm run dev</code> after
                            saving so the chat picks it up.
                        </p>
                    </div>
                    <Pill ok={r ? r.openAi.ok : null} />
                </div>
            </section>

            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={() => refresh(true)}
                    disabled={!!busy}
                    className="bg-bg-surface cursor-pointer hover:bg-border border border-border text-text-primary text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    {busy || "Recheck"}
                </button>
                <button
                    onClick={complete}
                    disabled={!ready || completing}
                    className="bg-accent hover:bg-accent-hover cursor-pointer disabled:opacity-40 text-white text-sm px-5 py-2 rounded-lg transition-colors"
                >
                    {completing
                        ? "Finishing…"
                        : ready
                          ? "Continue to the app"
                          : "Finish steps 1–3 first"}
                </button>
            </div>
        </div>
    );
}

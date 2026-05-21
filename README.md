# AzureAutoLab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Hands-on AZ-104 exam prep that grades itself.** Open a lab, do the work in the Azure portal, click **Verify** — a deterministic bash script runs `az` CLI checks against your real subscription and reports `[PASS]` / `[FAIL]` per task.

No mocks. No simulators. No LLM scoring. Just `az` against your tenant.

---

## What's in the box

- **154 labs** spanning all 5 AZ-104 domains (Identity & Governance, Storage, Compute, Networking, Monitoring)
- **100 "build" labs** — given a scenario, create the resources from scratch
- **54 "troubleshoot" labs** — the app pre-provisions broken Azure resources for you, you fix them, then verify and clean up with one click
- **Local web dashboard** (Next.js 16, App Router) that lists every lab, runs the verify script, and stores per-user results in a gitignored sidecar
- **Setup wizard** that gates the app until your environment is ready (Azure CLI installed, signed in, has create/update permissions on a subscription)
- **Optional AI chat** (bring your own OpenAI key) for asking questions while you work

## Quick start

```bash
git clone https://github.com/kevthefoo/AzureAutoLab
cd AzureAutoLab
npm install
npm run build
npm start
```

> Use `npm run dev` instead if you're hacking on the app itself — it adds hot reload at the cost of slower per-request rendering.

Open http://localhost:3000. You'll be redirected to `/setup`, which checks:

1. **Azure CLI** is installed (`az --version`)
2. **You're signed in** (`az account show`) — if not, the wizard shows you the exact `az login` command
3. **You have write permissions** on the active subscription (Owner / Contributor / User Access Administrator) — if you have multiple subs, a dropdown lets you switch
4. **OpenAI API key** (optional — only needed if you want the chat panel)

Once steps 1–3 are green, click **Continue to the app** and pick a lab.

**Requires:** Node.js 20+, [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli), and an Azure subscription where you can create and delete resources.

**Recommended:** A [Microsoft Entra ID P1 or P2](https://learn.microsoft.com/entra/fundamentals/licensing) license on your tenant. A handful of identity labs (Conditional Access, group-based licensing, PIM, B2B guest collaboration) need features that aren't on the free tier. Most labs work fine on a free tenant — Entra ID P1/P2 unlocks the rest.

## How a lab works

### Build lab

1. Read the **Scenario** and **Tasks**
2. Go to the Azure portal and create the requested resources
3. Click **Verify** in the dashboard — the server runs the lab's bash `## Verify` block against your subscription
4. The dashboard shows `[PASS] Task 1: …` / `[FAIL] Task N: …` per task, and saves the result locally
5. Clean up the resource group yourself when done

### Troubleshoot lab

1. Click **Start** — the app provisions a deliberately misconfigured Azure environment (everything tagged `AutoLabId=<NN>` for traceability)
2. Read the scenario, find the misconfiguration, fix it in the portal
3. Click **Verify** — same deterministic bash check as build labs
4. Click **Cleanup** — deletes the dedicated `RG-TS-<NN>` resource group plus any stray tagged resources

> Troubleshoot labs **will cost real money** while they're provisioned (typically a few cents per hour). Always click **Cleanup** when you finish a lab.

## How verification works

Each lab markdown file ends with a fenced `bash` `## Verify` block that runs `az` CLI commands and emits one line per task:

```
[PASS] Task 1: storage account exists in eastus
[FAIL] Task 2: blob container is not set to private
[PASS] Task 3: lifecycle policy archives blobs after 90 days
```

The web app spawns that block with `child_process`, streams stdout over SSE to your browser, parses the `[PASS]` / `[FAIL]` lines, and writes the result to `labs/.state/lab-NN.json` (gitignored, per-user).

**No LLM is involved in grading.** The chat panel uses an LLM, but pass/fail is pure `az`.

## Repository layout

```
labs/
  lab-001-resource-groups-rbac.md   # build lab — scenario, tasks, ## Verify
  lab-101-troubleshoot-rdp.md       # troubleshoot lab — adds ## Setup + ## Cleanup
  .state/                           # per-user results (gitignored)
app/                                # Next.js 16 App Router routes
components/                         # React UI
lib/                                # lab loading, bash spawn, setup checks
middleware.ts                       # gates the app behind /setup
```

## Privacy

Everything stays local:

- Your subscription ID, signed-in user, and lab results never leave your machine
- Results are written to `labs/.state/` which is in `.gitignore`
- OpenAI keys (if you provide one) are written to `.env.local` (also gitignored) and only used for the chat panel
- The app talks to Azure via the CLI you're already signed into — no service principals, no stored credentials

## Roadmap

Not built yet, in roughly the order I'd like to ship them:

- **Finish the quiz mode.** A 100-question bank lives in `data/quiz-questions.json` and `/quiz` is wired up, but the flow needs polish — score tracking, review wrong answers, per-domain filtering, retry-missed mode.
- **Grow the question bank.** Bring it to 300+ questions covering every AZ-104 sub-objective, with citations back to Microsoft Learn so you can dig into what you missed.
- **Tutorial section.** Short walkthroughs that introduce each Azure service before you hit the first lab on it — Azure CLI basics, RBAC mental model, VNet/subnet, storage tiers, etc. Aimed at people new to Azure, not just new to AZ-104.

## License

MIT — see [LICENSE](LICENSE).

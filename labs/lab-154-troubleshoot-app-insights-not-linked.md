# Lab 154 — Troubleshoot App Insights Standalone (Not Workspace-Based)

**Domain:** Monitoring & Backup
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

An Application Insights resource `ai-ts154` in `RG-TS-154` was created in **classic** (standalone) mode, so its data isn't queryable from the central Log Analytics workspace. Microsoft is retiring classic App Insights resources. Migrate this resource to a **workspace-based** App Insights backed by `la-ts154-<random>`.

## Tasks

- [ ] **Task 1:** Inspect the App Insights resource and confirm it's classic (no `WorkspaceResourceId`)
- [ ] **Task 2:** Migrate `ai-ts154` to use the lab Log Analytics workspace as backend
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-154; TAG="AutoLabId=154"
LA="la-ts154-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.OperationalInsights --wait
az provider register --namespace Microsoft.Insights --wait
az monitor log-analytics workspace create -g "$RG" -n "$LA" --tags "$TAG" >/dev/null
# Create classic (non-workspace) App Insights via REST/CLI extension
az extension add --name application-insights --upgrade 2>/dev/null || true
az monitor app-insights component create --app ai-ts154 -g "$RG" -l "$LOC" --kind web --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.LaName="$LA" >/dev/null
echo "Setup complete. ai-ts154 is classic (no workspace link)."
```

## Skills Tested

- Reading App Insights `WorkspaceResourceId`
- Migrating classic AI to workspace-based via portal Application Insights > Properties

## Verification Criteria

| #   | What to Check                                          | CLI Command                                                                                                          |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | App Insights `ai-ts154` exists                         | `az monitor app-insights component show --app ai-ts154 -g RG-TS-154 --query name -o tsv`                              |
| 2   | App Insights is linked to a Log Analytics workspace    | `az monitor app-insights component show --app ai-ts154 -g RG-TS-154 --query workspaceResourceId -o tsv`               |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-154 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=154 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

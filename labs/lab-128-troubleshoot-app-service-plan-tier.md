# Lab 128 — Troubleshoot Function App Missing AzureWebJobsStorage

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

`func-ts128-<random>` fails to start with `Could not connect to AzureWebJobsStorage`. The `AzureWebJobsStorage` app setting is missing — a required configuration for every Function App. Restore it to point at the lab's storage account.

## Tasks

- [ ] **Task 1:** Inspect Function App app settings and confirm `AzureWebJobsStorage` is absent
- [ ] **Task 2:** Set `AzureWebJobsStorage` to a valid connection string for the lab storage account (use a key-based connection string)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-128; TAG="AutoLabId=128"
SA="stautolab128$(date +%s | tail -c 7)"
FUNC="func-ts128-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
# Unset the AzureWebJobsStorage setting to simulate misconfig
az functionapp config appsettings delete -n "$FUNC" -g "$RG" --setting-names AzureWebJobsStorage >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" tags.SaName="$SA" >/dev/null
echo "Setup complete. $FUNC is missing AzureWebJobsStorage setting."
```

## Skills Tested

- Reading Function App app settings
- Restoring `AzureWebJobsStorage` via portal Configuration blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                            |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists              | `f=$(az group show -n RG-TS-128 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-128 --query name -o tsv`            |
| 2   | `AzureWebJobsStorage` setting exists       | `f=$(az group show -n RG-TS-128 --query tags.FuncName -o tsv); az functionapp config appsettings list -n "$f" -g RG-TS-128 --query "[?name=='AzureWebJobsStorage'].name" -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-128 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=128 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

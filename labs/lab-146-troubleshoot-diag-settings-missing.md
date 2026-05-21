# Lab 146 — Troubleshoot Missing Diagnostic Settings

**Domain:** Monitoring & Backup
**Difficulty:** Intermediate

---

## Scenario

A storage account in `RG-TS-146` is supposed to be sending blob logs to Log Analytics, but the **Diagnostics > Logs** tab in the portal is empty. No diagnostic setting was ever configured. Create one to forward `StorageRead`, `StorageWrite`, and `StorageDelete` logs (on the blob service) to the workspace `la-ts146-<random>`.

## Tasks

- [ ] **Task 1:** Confirm no diagnostic setting exists for the storage account's blob service
- [ ] **Task 2:** Create a diagnostic setting that sends the three Storage log categories to the lab workspace
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-146; TAG="AutoLabId=146"
SA="stautolab146$(date +%s | tail -c 7)"
LA="la-ts146-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.OperationalInsights --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az monitor log-analytics workspace create -g "$RG" -n "$LA" --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.SaName="$SA" tags.LaName="$LA" >/dev/null
echo "Setup complete. No diagnostic setting on $SA blob service."
```

## Skills Tested

- Listing diagnostic settings on a resource
- Creating a diagnostic setting via portal Diagnostic settings blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                                |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Lab storage account exists                 | `sa=$(az group show -n RG-TS-146 --query tags.SaName -o tsv); az storage account show -n "$sa" -g RG-TS-146 --query name -o tsv`           |
| 2   | A diagnostic setting on the blob service exists | `sa=$(az group show -n RG-TS-146 --query tags.SaName -o tsv); az monitor diagnostic-settings list --resource "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/RG-TS-146/providers/Microsoft.Storage/storageAccounts/$sa/blobServices/default" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az group show -n RG-TS-146 --query tags.SaName -o tsv 2>/dev/null)
EXISTS=$(az storage account show -n "$SA" -g RG-TS-146 --query name -o tsv 2>/dev/null)
if [ -n "$EXISTS" ]; then echo "[PASS] Task 1: storage account $SA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: storage account not found"; FAIL=$((FAIL+1)); fi

SUB=$(az account show --query id -o tsv)
RES="/subscriptions/$SUB/resourceGroups/RG-TS-146/providers/Microsoft.Storage/storageAccounts/$SA/blobServices/default"
COUNT=$(az monitor diagnostic-settings list --resource "$RES" --query "length(value || @)" -o tsv 2>/dev/null)
if [ "${COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: a diagnostic setting on the blob service exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no diagnostic setting on the blob service"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-146 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=146 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

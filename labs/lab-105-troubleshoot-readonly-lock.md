# Lab 105 — Troubleshoot ReadOnly Resource Lock

**Domain:** Identity & Governance
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

The storage team can't change blob soft-delete retention on a storage account in `RG-TS-105`. Every change errors with `ScopeLocked`. Compliance does require the account to be protected from deletion, but routine config changes should still be possible. Diagnose the lock and pick the **right lock level** that prevents deletion without blocking ordinary configuration changes.

## Tasks

- [ ] **Task 1:** Identify the management lock and its current level
- [ ] **Task 2:** Replace the existing lock with one that prevents deletion only (allows updates)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-105
TAG="AutoLabId=105"
SA="stautolab105$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az lock create --name BlockAllChanges --resource-group "$RG" --resource "$SA" \
  --resource-type Microsoft.Storage/storageAccounts --lock-type ReadOnly >/dev/null
echo "Setup complete. Storage account $SA has a ReadOnly lock."
```

## Skills Tested

- Distinguishing `ReadOnly` vs `CanNotDelete` management locks
- Removing and re-creating locks at the resource scope

## Verification Criteria

| #   | What to Check                                          | CLI Command                                                                                                                                                                                            |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | A storage account tagged `AutoLabId=105` exists        | `az storage account list --query "[?tags.AutoLabId=='105'].name" -o tsv`                                                                                                                                |
| 2   | No `ReadOnly` lock remains on that storage account     | `sa=$(az storage account list --query "[?tags.AutoLabId=='105'].name" -o tsv); az lock list -g RG-TS-105 --resource "$sa" --resource-type Microsoft.Storage/storageAccounts --query "[?level=='ReadOnly']" -o json` |
| 3   | A `CanNotDelete` lock exists on the storage account    | `sa=$(az storage account list --query "[?tags.AutoLabId=='105'].name" -o tsv); az lock list -g RG-TS-105 --resource "$sa" --resource-type Microsoft.Storage/storageAccounts --query "[?level=='CanNotDelete']" -o json` |

## Cleanup

```bash
set -euo pipefail
# Remove locks first or the RG delete will be refused
for id in $(az lock list -g RG-TS-105 --query "[].id" -o tsv 2>/dev/null); do
  az lock delete --ids "$id" || true
done
az group delete -n RG-TS-105 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=105 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

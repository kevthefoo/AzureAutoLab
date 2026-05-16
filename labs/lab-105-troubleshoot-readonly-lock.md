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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az storage account list --query "[?tags.AutoLabId=='105'].name | [0]" -o tsv)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account tagged AutoLabId=105 exists ($SA)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account tagged AutoLabId=105 found"; FAIL=$((FAIL+1)); fi

RO=0; CND=0
if [ -n "$SA" ]; then
  RO=$(az lock list -g RG-TS-105 --resource "$SA" --resource-type Microsoft.Storage/storageAccounts --query "[?level=='ReadOnly'] | length(@)" -o tsv 2>/dev/null)
  CND=$(az lock list -g RG-TS-105 --resource "$SA" --resource-type Microsoft.Storage/storageAccounts --query "[?level=='CanNotDelete'] | length(@)" -o tsv 2>/dev/null)
fi
if [ "${RO:-0}" = "0" ]; then echo "[PASS] Task 2: no ReadOnly lock remains on the storage account"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: ReadOnly lock still present"; FAIL=$((FAIL+1)); fi
if [ "${CND:-0}" -gt 0 ]; then echo "[PASS] Task 3: a CanNotDelete lock exists on the storage account"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no CanNotDelete lock on the storage account"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

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

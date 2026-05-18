# Lab 117 — Troubleshoot Blob Soft Delete Disabled

**Domain:** Storage
**Difficulty:** Beginner

---

## Scenario

A developer accidentally deleted production blobs and there's no way to recover them. Compliance reviewed the affected storage account in `RG-TS-117` and found **blob soft delete is disabled**. Enable soft delete on the account with a 14-day retention so future accidents are recoverable.

## Tasks

- [ ] **Task 1:** Inspect the blob service properties to confirm soft-delete is off
- [ ] **Task 2:** Enable blob soft-delete with **14-day** retention
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-117; TAG="AutoLabId=117"
SA="stautolab117$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az storage account blob-service-properties update --account-name "$SA" --resource-group "$RG" \
  --enable-delete-retention false >/dev/null
echo "Setup complete. $SA has blob soft delete DISABLED."
```

## Skills Tested

- Reading blob service properties (`deleteRetentionPolicy`)
- Enabling soft-delete via portal Data protection blade

## Verification Criteria

| #   | What to Check                                                       | CLI Command                                                                                                                            |
| --- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab storage account still exists                                    | `az storage account list --query "[?tags.AutoLabId=='117'].name" -o tsv`                                                                |
| 2   | Blob soft-delete is enabled                                         | `sa=$(az storage account list --query "[?tags.AutoLabId=='117'].name" -o tsv); az storage account blob-service-properties show --account-name "$sa" --resource-group RG-TS-117 --query "deleteRetentionPolicy.enabled" -o tsv` |
| 3   | Retention is at least 14 days                                       | `sa=$(az storage account list --query "[?tags.AutoLabId=='117'].name" -o tsv); az storage account blob-service-properties show --account-name "$sa" --resource-group RG-TS-117 --query "deleteRetentionPolicy.days" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az storage account list --query "[?tags.AutoLabId=='117'].name | [0]" -o tsv)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account exists ($SA)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account tagged AutoLabId=117"; FAIL=$((FAIL+1)); fi

EN=$(az storage account blob-service-properties show --account-name "$SA" --resource-group RG-TS-117 --query "deleteRetentionPolicy.enabled" -o tsv 2>/dev/null)
DAYS=$(az storage account blob-service-properties show --account-name "$SA" --resource-group RG-TS-117 --query "deleteRetentionPolicy.days" -o tsv 2>/dev/null)
if [ "$EN" = "true" ]; then echo "[PASS] Task 2: blob soft delete enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: blob soft delete is disabled"; FAIL=$((FAIL+1)); fi
if [ -n "$DAYS" ] && [ "$DAYS" -ge 14 ]; then echo "[PASS] Task 3: retention is $DAYS days (>=14)"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: retention is '$DAYS' days (expected >=14)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-117 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=117 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

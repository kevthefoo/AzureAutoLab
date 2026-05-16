# Lab 123 — Troubleshoot Blob Versioning Disabled

**Domain:** Storage
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

After an application overwrote a critical config blob in `RG-TS-123`, the team learned the storage account doesn't have **blob versioning** turned on, so there's no prior version to restore. Enable blob versioning for the storage account so future overwrites are recoverable.

## Tasks

- [ ] **Task 1:** Inspect the blob service properties to confirm versioning is disabled
- [ ] **Task 2:** Enable blob versioning on the storage account
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-123; TAG="AutoLabId=123"
SA="stautolab123$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
# Versioning is off by default — no extra command needed, but be explicit:
az storage account blob-service-properties update --account-name "$SA" --resource-group "$RG" \
  --enable-versioning false >/dev/null
echo "Setup complete. $SA has blob versioning DISABLED."
```

## Skills Tested

- Reading blob service `isVersioningEnabled`
- Enabling via portal Data protection blade

## Verification Criteria

| #   | What to Check                                                  | CLI Command                                                                                                                            |
| --- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab storage account still exists                               | `az storage account list --query "[?tags.AutoLabId=='123'].name" -o tsv`                                                                |
| 2   | Blob versioning is enabled                                     | `sa=$(az storage account list --query "[?tags.AutoLabId=='123'].name" -o tsv); az storage account blob-service-properties show --account-name "$sa" --resource-group RG-TS-123 --query "isVersioningEnabled" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az storage account list --query "[?tags.AutoLabId=='123'].name | [0]" -o tsv)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account exists ($SA)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account tagged AutoLabId=123"; FAIL=$((FAIL+1)); fi

V=$(az storage account blob-service-properties show --account-name "$SA" --resource-group RG-TS-123 --query "isVersioningEnabled" -o tsv 2>/dev/null)
if [ "$V" = "true" ]; then echo "[PASS] Task 2: blob versioning is enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: blob versioning is '$V' (expected true)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-123 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=123 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

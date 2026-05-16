# Lab 44 — Azure Storage Redundancy

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization requires different levels of data durability for different workloads. The infrastructure team needs to provision storage accounts with varying redundancy levels and understand how geo-redundant replication works, including read access to the secondary region.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Redundancy-Lab` in East US
- [ ] **Task 2:** Create a storage account `stlabredundlrs44` with Locally Redundant Storage (LRS)
- [ ] **Task 3:** Create a storage account `stlabredundgrs44` with Geo-Redundant Storage (GRS)
- [ ] **Task 4:** Create a storage account `stlabredundragrs44` with Read-Access Geo-Redundant Storage (RA-GRS) and verify the secondary endpoint is available
- [ ] **Task 5:** Change `stlabredundlrs44` from LRS to GRS replication

## Skills Tested

- Understanding Azure Storage redundancy options (LRS, GRS, RA-GRS)
- Configuring replication type during and after account creation
- Identifying secondary endpoints for RA-GRS accounts
- Changing replication configuration on existing accounts

## Verification Criteria

| #   | What to Check                          | Where in Portal                                    | How to Verify                                                 |
| --- | -------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Resource group exists                  | Resource groups > `RG-Redundancy-Lab`              | Resource group is listed in East US                           |
| 2   | LRS storage account exists             | Storage accounts > `stlabredundlrs44` > Overview   | Replication shows "Locally-redundant storage (LRS)"           |
| 3   | GRS storage account exists             | Storage accounts > `stlabredundgrs44` > Overview   | Replication shows "Geo-redundant storage (GRS)"               |
| 4   | RA-GRS account with secondary endpoint | Storage accounts > `stlabredundragrs44` > Overview | Replication shows "RA-GRS" and secondary endpoints are listed |
| 5   | LRS account changed to GRS             | Storage accounts > `stlabredundlrs44` > Overview   | Replication now shows "Geo-redundant storage (GRS)"           |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Redundancy-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

LRS_CURRENT=$(az storage account show -n stlabredundlrs44 -g "$RG" --query sku.name -o tsv 2>/dev/null)
GRS_NAME=$(az storage account show -n stlabredundgrs44 -g "$RG" --query sku.name -o tsv 2>/dev/null)
RAGRS=$(az storage account show -n stlabredundragrs44 -g "$RG" --query sku.name -o tsv 2>/dev/null)

if [ -n "$LRS_CURRENT" ]; then echo "[PASS] Task 2: stlabredundlrs44 exists (sku=$LRS_CURRENT)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: stlabredundlrs44 missing"; FAIL=$((FAIL+1)); fi

if [ "$GRS_NAME" = "Standard_GRS" ]; then echo "[PASS] Task 3: stlabredundgrs44 is GRS"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: stlabredundgrs44 sku is '$GRS_NAME'"; FAIL=$((FAIL+1)); fi

SEC=$(az storage account show -n stlabredundragrs44 -g "$RG" --query "secondaryEndpoints.blob" -o tsv 2>/dev/null)
if [ "$RAGRS" = "Standard_RAGRS" ] && [ -n "$SEC" ]; then echo "[PASS] Task 4: stlabredundragrs44 is RA-GRS with secondary endpoint"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: RA-GRS check failed (sku=$RAGRS sec=$SEC)"; FAIL=$((FAIL+1)); fi

if [ "$LRS_CURRENT" = "Standard_GRS" ]; then echo "[PASS] Task 5: stlabredundlrs44 upgraded to GRS"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: stlabredundlrs44 sku is '$LRS_CURRENT' (expected Standard_GRS)"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

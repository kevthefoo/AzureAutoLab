# Lab 48 — Blob Versioning & Soft Delete

**Domain:** Storage  
**Difficulty:** Intermediate  

---

## Scenario

Your compliance team requires that critical business documents stored in blob storage be protected against accidental deletion and overwrites. You need to enable blob versioning and soft delete to ensure data can be recovered within a retention window.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-BlobProtect-Lab` in East US and a storage account `stlabversioning48`
- [ ] **Task 2:** Enable blob soft delete with a retention period of 14 days and container soft delete with a retention period of 7 days
- [ ] **Task 3:** Enable blob versioning on the storage account
- [ ] **Task 4:** Create a container `documents`, upload a file `report.txt`, then upload an updated version of `report.txt` to create a new version
- [ ] **Task 5:** Delete `report.txt` and verify it appears in the soft-deleted items, then restore it

## Skills Tested

- Enabling and configuring blob soft delete
- Enabling and configuring container soft delete
- Enabling blob versioning
- Restoring soft-deleted blobs

## Verification Criteria

| #   | What to Check                | Where in Portal                                                                  | How to Verify                                                      |
| --- | ---------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | Storage account exists       | Storage accounts > `stlabversioning48`                                           | Account is listed and accessible                                   |
| 2   | Soft delete enabled          | Storage accounts > `stlabversioning48` > Data protection                         | Blob soft delete shows 14 days, container soft delete shows 7 days |
| 3   | Versioning enabled           | Storage accounts > `stlabversioning48` > Data protection                         | Blob versioning is turned on                                       |
| 4   | Multiple versions exist      | Storage accounts > `stlabversioning48` > Containers > `documents` > `report.txt` | Previous versions tab shows at least 2 versions                    |
| 5   | Blob restored after deletion | Storage accounts > `stlabversioning48` > Containers > `documents`                | `report.txt` is present after restore                              |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-BlobProtect-Lab; SA=stlabversioning48
N=$(az storage account show -n "$SA" -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$N" = "$SA" ]; then echo "[PASS] Task 1: $SA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $SA missing"; FAIL=$((FAIL+1)); fi

BR=$(az storage account blob-service-properties show --account-name "$SA" -g "$RG" --query "deleteRetentionPolicy.days" -o tsv 2>/dev/null)
CR=$(az storage account blob-service-properties show --account-name "$SA" -g "$RG" --query "containerDeleteRetentionPolicy.days" -o tsv 2>/dev/null)
if [ "$BR" = "14" ] && [ "$CR" = "7" ]; then echo "[PASS] Task 2: soft delete 14d blob / 7d container"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: soft delete wrong (blob=$BR container=$CR)"; FAIL=$((FAIL+1)); fi

V=$(az storage account blob-service-properties show --account-name "$SA" -g "$RG" --query "isVersioningEnabled" -o tsv 2>/dev/null)
if [ "$V" = "true" ]; then echo "[PASS] Task 3: versioning enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: versioning is '$V'"; FAIL=$((FAIL+1)); fi

KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
VC=0
if [ -n "$KEY" ]; then VC=$(az storage blob list --container-name documents --account-name "$SA" --account-key "$KEY" --include v --query "[?name=='report.txt'] | length(@)" -o tsv 2>/dev/null); fi
if [ "${VC:-0}" -ge 1 ]; then echo "[PASS] Task 4: report.txt versions found ($VC)"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no versions of report.txt"; FAIL=$((FAIL+1)); fi

EXIST=$(az storage blob exists --container-name documents -n report.txt --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
if [ "$EXIST" = "true" ]; then echo "[PASS] Task 5: report.txt restored (exists)"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: report.txt not present"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

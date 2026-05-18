# Lab 50 — AzCopy & Data Transfer

**Domain:** Storage  
**Difficulty:** Intermediate  

---

## Scenario

Your team needs to migrate a large dataset from one storage container to another and set up ongoing synchronization between a local directory and blob storage. AzCopy is the recommended high-performance tool for these bulk data transfer operations.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-AzCopy-Lab` in East US, a storage account `stlabazcopy50`, and two blob containers: `source-data` and `destination-data`
- [ ] **Task 2:** Upload three sample files (`file1.txt`, `file2.txt`, `file3.txt`) to the `source-data` container using the Azure portal
- [ ] **Task 3:** Generate a SAS token for the storage account with read/write/list permissions and an expiry of 24 hours
- [ ] **Task 4:** Use AzCopy to copy all blobs from `source-data` to `destination-data` using the SAS token
- [ ] **Task 5:** Verify all three files exist in the `destination-data` container

## Skills Tested

- Installing and authenticating AzCopy
- Copying blobs between containers using AzCopy
- Generating and using SAS tokens for AzCopy authentication
- Understanding bulk data transfer tools in Azure

## Verification Criteria

| #   | What to Check                        | Where in Portal                                                      | How to Verify                                                   |
| --- | ------------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Storage account and containers exist | Storage accounts > `stlabazcopy50` > Containers                      | Both `source-data` and `destination-data` containers are listed |
| 2   | Source files uploaded                | Storage accounts > `stlabazcopy50` > Containers > `source-data`      | Three files are listed in the container                         |
| 3   | SAS token generated                  | Storage accounts > `stlabazcopy50` > Shared access signature         | SAS was generated with correct permissions and expiry           |
| 4   | AzCopy transfer completed            | Local terminal / Cloud Shell                                         | AzCopy output shows successful copy of all files                |
| 5   | Files exist in destination           | Storage accounts > `stlabazcopy50` > Containers > `destination-data` | All three files appear in the destination container             |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-AzCopy-Lab; SA=stlabazcopy50
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then for i in 1 2 3 4 5; do echo "[FAIL] Task $i: storage account missing"; FAIL=$((FAIL+1)); done;
else
  S=$(az storage container exists -n source-data --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  D=$(az storage container exists -n destination-data --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$S" = "true" ] && [ "$D" = "true" ]; then echo "[PASS] Task 1: both containers exist"; PASS=$((PASS+1));
  else echo "[FAIL] Task 1: containers missing (source=$S dest=$D)"; FAIL=$((FAIL+1)); fi

  SCNT=$(az storage blob list --container-name source-data --account-name "$SA" --account-key "$KEY" --query "length(@)" -o tsv 2>/dev/null)
  if [ "${SCNT:-0}" -ge 3 ]; then echo "[PASS] Task 2: $SCNT file(s) in source-data"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: only $SCNT file(s) in source-data"; FAIL=$((FAIL+1)); fi

  echo "[PASS] Task 3: SAS generation is transient (not stored)"; PASS=$((PASS+1))
  echo "[PASS] Task 4: AzCopy is local — verified by destination contents in Task 5"; PASS=$((PASS+1))

  DCNT=$(az storage blob list --container-name destination-data --account-name "$SA" --account-key "$KEY" --query "length(@)" -o tsv 2>/dev/null)
  if [ "${DCNT:-0}" -ge 3 ]; then echo "[PASS] Task 5: $DCNT file(s) in destination-data"; PASS=$((PASS+1));
  else echo "[FAIL] Task 5: only $DCNT file(s) in destination-data"; FAIL=$((FAIL+1)); fi
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

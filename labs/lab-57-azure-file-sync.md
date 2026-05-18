# Lab 57 — Azure File Sync

**Domain:** Storage  
**Difficulty:** Advanced  

---

## Scenario

Your organization has branch offices that need to access shared files with low latency while keeping a centralized copy in Azure. Azure File Sync allows on-premises Windows Servers to cache frequently accessed files locally while tiering infrequently used files to the Azure file share, providing the benefits of both local performance and cloud scalability.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-FileSync-Lab` in East US, a storage account `stlabfilesync57`, and a file share named `shared-documents` with 100 GB quota
- [ ] **Task 2:** Create a Storage Sync Service named `sync-service-lab57` in the `RG-FileSync-Lab` resource group
- [ ] **Task 3:** Create a sync group named `branch-office-sync` within the Storage Sync Service and add the `shared-documents` file share as the cloud endpoint
- [ ] **Task 4:** Review the Azure File Sync agent download page and identify the agent requirements (Windows Server version, .NET Framework, supported OS)
- [ ] **Task 5:** Navigate to the sync group and review the server endpoint configuration options (server path, cloud tiering, volume free space policy)

## Skills Tested

- Creating and configuring a Storage Sync Service
- Setting up sync groups with cloud endpoints
- Understanding Azure File Sync agent requirements
- Configuring cloud tiering and server endpoint policies

## Verification Criteria

| #   | What to Check                    | Where in Portal                                                   | How to Verify                                                   |
| --- | -------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | File share exists                | Storage accounts > `stlabfilesync57` > File shares                | `shared-documents` is listed with 100 GB quota                  |
| 2   | Storage Sync Service exists      | Storage Sync Services > `sync-service-lab57`                      | Sync service is listed in `RG-FileSync-Lab`                     |
| 3   | Sync group with cloud endpoint   | Storage Sync Services > `sync-service-lab57` > Sync groups        | `branch-office-sync` shows `shared-documents` as cloud endpoint |
| 4   | Agent requirements reviewed      | Storage Sync Services > `sync-service-lab57` > Registered servers | User can describe supported OS versions and agent requirements  |
| 5   | Server endpoint options reviewed | Sync groups > `branch-office-sync` > Add server endpoint          | User can describe cloud tiering and volume free space settings  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-FileSync-Lab; SA=stlabfilesync57
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
Q=""
if [ -n "$KEY" ]; then Q=$(az storage share show -n shared-documents --account-name "$SA" --account-key "$KEY" --query "properties.quota" -o tsv 2>/dev/null); fi
if [ "$Q" = "100" ]; then echo "[PASS] Task 1: share shared-documents 100 GB"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: share missing or wrong quota ($Q)"; FAIL=$((FAIL+1)); fi

SS=$(az storagesync show -n sync-service-lab57 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$SS" = "sync-service-lab57" ]; then echo "[PASS] Task 2: Storage Sync Service exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: Storage Sync Service missing"; FAIL=$((FAIL+1)); fi

SG=$(az storagesync sync-group show --storage-sync-service sync-service-lab57 -g "$RG" -n branch-office-sync --query name -o tsv 2>/dev/null)
if [ "$SG" = "branch-office-sync" ]; then echo "[PASS] Task 3: sync group exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: sync group missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 4: agent requirements review is manual"; PASS=$((PASS+1))
echo "[PASS] Task 5: server endpoint options review is manual"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

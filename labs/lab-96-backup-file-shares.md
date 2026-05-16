# Lab 96 — Azure Backup for File Shares

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your company stores shared departmental documents in Azure File Shares. The compliance team requires daily backups with a 30-day retention period. You need to configure Azure Backup for the file share, trigger an on-demand backup, and perform a file-level restore to verify the recovery process works.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-FileBackup-Lab` in East US with a storage account named `stfilesharebackup2026` (StorageV2, LRS)
- [ ] **Task 2:** Create an Azure File Share named `share-dept-docs` in `stfilesharebackup2026` and upload a test file named `report-q1.txt`
- [ ] **Task 3:** Create a Recovery Services vault named `rsv-fileshare-01` in `RG-FileBackup-Lab`
- [ ] **Task 4:** Configure backup for `share-dept-docs` using `rsv-fileshare-01` with a daily backup policy named `policy-daily-30d` retaining snapshots for 30 days
- [ ] **Task 5:** Trigger an on-demand backup, then restore the file `report-q1.txt` to an alternate location in a new file share named `share-restore-target`

## Skills Tested

- Configuring Azure Backup for Azure File Shares
- Creating custom backup policies with retention settings
- Triggering on-demand backups
- Performing file-level restore operations

## Verification Criteria

| #   | What to Check                        | Where in Portal                                                     | How to Verify                                           |
| --- | ------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Storage account and file share exist | Storage accounts > `stfilesharebackup2026` > File shares            | `share-dept-docs` is listed with `report-q1.txt` inside |
| 2   | Recovery vault exists                | Recovery Services vaults > `rsv-fileshare-01`                       | Vault is in `RG-FileBackup-Lab`                         |
| 3   | Backup is configured                 | `rsv-fileshare-01` > Backup items > Azure File Share                | `share-dept-docs` appears as a protected item           |
| 4   | Backup policy is correct             | `rsv-fileshare-01` > Backup policies > `policy-daily-30d`           | Policy shows daily schedule with 30-day retention       |
| 5   | Restore completed                    | Storage accounts > `stfilesharebackup2026` > `share-restore-target` | `report-q1.txt` exists in the restored file share       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-FileBackup-Lab; SA=stfilesharebackup2026
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
Q=""
if [ -n "$KEY" ]; then Q=$(az storage share show -n share-dept-docs --account-name "$SA" --account-key "$KEY" --query "properties.quota" -o tsv 2>/dev/null); fi
if [ -n "$Q" ]; then echo "[PASS] Task 1: storage account + share-dept-docs exist"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: storage/share missing"; FAIL=$((FAIL+1)); fi

V=$(az backup vault show -n rsv-fileshare-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$V" = "rsv-fileshare-01" ]; then echo "[PASS] Task 2: rsv-fileshare-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: vault missing"; FAIL=$((FAIL+1)); fi

CNT=$(az backup item list --vault-name rsv-fileshare-01 -g "$RG" --backup-management-type AzureStorage --query "length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $CNT protected file share(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no protected file shares"; FAIL=$((FAIL+1)); fi

POL=$(az backup policy show --vault-name rsv-fileshare-01 -g "$RG" -n policy-daily-30d --query name -o tsv 2>/dev/null)
if [ "$POL" = "policy-daily-30d" ]; then echo "[PASS] Task 4: policy-daily-30d exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: policy-daily-30d missing"; FAIL=$((FAIL+1)); fi

RES=""
if [ -n "$KEY" ]; then RES=$(az storage share show -n share-restore-target --account-name "$SA" --account-key "$KEY" --query name -o tsv 2>/dev/null); fi
if [ "$RES" = "share-restore-target" ]; then echo "[PASS] Task 5: share-restore-target exists (restore destination)"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: share-restore-target missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

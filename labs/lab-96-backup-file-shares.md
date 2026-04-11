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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

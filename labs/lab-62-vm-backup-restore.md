# Lab 62 — VM Backup & Restore

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The compliance team requires that all production VMs have automated backups with a defined retention policy. You must configure Azure Backup for a VM, create a custom backup policy, and perform an on-demand backup to validate the setup.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-VMBackup-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-prod-db` (Standard_B2s, Windows Server 2022) in `RG-VMBackup-Lab`
- [ ] **Task 3:** Create a Recovery Services vault named `rsv-backup-lab` in `RG-VMBackup-Lab`
- [ ] **Task 4:** Create a custom backup policy named `policy-daily-30d` with daily backups at 2:00 AM UTC and 30-day retention
- [ ] **Task 5:** Enable backup on `vm-prod-db` using the `policy-daily-30d` policy and trigger an on-demand backup

## Skills Tested

- Creating Recovery Services vaults
- Defining custom backup policies with retention
- Enabling VM backup protection
- Triggering and monitoring on-demand backups

## Verification Criteria

| #   | What to Check                  | Where in Portal                                       | How to Verify                                                    |
| --- | ------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Resource group exists          | Home > Resource groups > RG-VMBackup-Lab              | Resource group is listed and located in East US                  |
| 2   | VM is running                  | RG-VMBackup-Lab > vm-prod-db > Overview               | VM status shows Running                                          |
| 3   | Recovery Services vault exists | RG-VMBackup-Lab > rsv-backup-lab > Overview           | Vault is listed and shows correct resource group                 |
| 4   | Custom backup policy exists    | rsv-backup-lab > Backup policies                      | `policy-daily-30d` shows daily schedule, 30-day retention        |
| 5   | VM backup is configured        | rsv-backup-lab > Backup items > Azure Virtual Machine | `vm-prod-db` listed with backup status and last backup timestamp |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-VMBackup-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n vm-prod-db -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$VM" = "vm-prod-db" ]; then echo "[PASS] Task 2: vm-prod-db exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: vm-prod-db missing"; FAIL=$((FAIL+1)); fi

V=$(az backup vault show -n rsv-backup-lab -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$V" = "rsv-backup-lab" ]; then echo "[PASS] Task 3: rsv-backup-lab exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: rsv-backup-lab missing"; FAIL=$((FAIL+1)); fi

P=$(az backup policy show --vault-name rsv-backup-lab -g "$RG" -n policy-daily-30d --query name -o tsv 2>/dev/null)
if [ "$P" = "policy-daily-30d" ]; then echo "[PASS] Task 4: policy-daily-30d exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: policy-daily-30d missing"; FAIL=$((FAIL+1)); fi

CNT=$(az backup item list --vault-name rsv-backup-lab -g "$RG" --query "[?contains(properties.friendlyName, 'vm-prod-db')] | length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 5: vm-prod-db protected"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: vm-prod-db not protected"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

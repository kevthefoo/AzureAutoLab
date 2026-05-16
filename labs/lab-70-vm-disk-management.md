# Lab 70 — VM Disk Management

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

A file server VM needs additional storage capacity for application data. You must attach multiple data disks, configure them inside the OS, and expand the OS disk to accommodate future system updates.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-DiskMgmt-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-filesvr-01` (Standard_B2s, Windows Server 2022) in `RG-DiskMgmt-Lab`
- [ ] **Task 3:** Attach two 32 GB Premium SSD data disks named `disk-data-01` and `disk-data-02` to `vm-filesvr-01`
- [ ] **Task 4:** Resize the OS disk of `vm-filesvr-01` from the default size to 256 GB

## Skills Tested

- Attaching and managing data disks on VMs
- Understanding managed disk types and performance tiers
- Resizing OS disks
- Working with disk caching settings

## Verification Criteria

| #   | What to Check             | Where in Portal                            | How to Verify                                                       |
| --- | ------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| 1   | Resource group exists     | Home > Resource groups > RG-DiskMgmt-Lab   | Resource group is listed and located in East US                     |
| 2   | VM is running             | RG-DiskMgmt-Lab > vm-filesvr-01 > Overview | VM status shows Running                                             |
| 3   | Data disks attached       | vm-filesvr-01 > Disks                      | `disk-data-01` and `disk-data-02` listed as data disks (32 GB each) |
| 4   | OS disk resized to 256 GB | vm-filesvr-01 > Disks                      | OS disk shows 256 GB size                                           |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-DiskMgmt-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n vm-filesvr-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$VM" = "vm-filesvr-01" ]; then echo "[PASS] Task 2: vm-filesvr-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VM missing"; FAIL=$((FAIL+1)); fi

D1=$(az disk show -n disk-data-01 -g "$RG" --query diskSizeGb -o tsv 2>/dev/null)
D2=$(az disk show -n disk-data-02 -g "$RG" --query diskSizeGb -o tsv 2>/dev/null)
if [ "$D1" = "32" ] && [ "$D2" = "32" ]; then echo "[PASS] Task 3: both 32 GB data disks exist"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: data disks wrong (d1=$D1 d2=$D2)"; FAIL=$((FAIL+1)); fi

OS=$(az vm show -n vm-filesvr-01 -g "$RG" --query "storageProfile.osDisk.diskSizeGb" -o tsv 2>/dev/null)
if [ "$OS" = "256" ]; then echo "[PASS] Task 4: OS disk 256 GB"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: OS disk is '$OS' GB"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

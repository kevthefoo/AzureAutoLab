# Lab 20 — Disk Snapshots & Images

**Domain:** Compute  
**Difficulty:** Beginner  

---

## Scenario

Before performing a risky OS update on a production VM, your team needs a point-in-time backup of the VM's disk. You must create a snapshot and understand how to restore from it.

## Tasks

- [ ] **Task 1:** Create a **snapshot** named `Snap-OSDisk-01` from your existing VM's OS disk in resource group `RG-Dev-Lab`
- [ ] **Task 2:** Add tags `Purpose=Backup` and `Source=VM-Dev-Lab` to the snapshot
- [ ] **Task 3:** Create a **managed disk** named `Disk-From-Snap` from the snapshot `Snap-OSDisk-01`

## Skills Tested

- Disk snapshot creation from existing VM
- Snapshot tagging and management
- Creating managed disks from snapshots (restore workflow)

## Verification Criteria

| #   | What to Check                        | CLI Command                                                                                                                                        |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Snapshot `Snap-OSDisk-01` exists     | `az snapshot show --name Snap-OSDisk-01 --resource-group RG-Dev-Lab --query "{name:name, diskSizeGb:diskSizeGb, timeCreated:timeCreated}" -o json` |
| 2   | Tags on snapshot                     | `az snapshot show --name Snap-OSDisk-01 --resource-group RG-Dev-Lab --query "{tags:tags}" -o json`                                                 |
| 3   | Managed disk `Disk-From-Snap` exists | `az disk show --name Disk-From-Snap --resource-group RG-Dev-Lab --query "{name:name, creationSource:creationData.createOption}" -o json`           |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
N=$(az snapshot show -n Snap-OSDisk-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$N" = "Snap-OSDisk-01" ]; then echo "[PASS] Task 1: Snap-OSDisk-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: Snap-OSDisk-01 missing"; FAIL=$((FAIL+1)); fi

T1=$(az snapshot show -n Snap-OSDisk-01 -g "$RG" --query "tags.Purpose" -o tsv 2>/dev/null)
T2=$(az snapshot show -n Snap-OSDisk-01 -g "$RG" --query "tags.Source" -o tsv 2>/dev/null)
if [ "$T1" = "Backup" ] && [ "$T2" = "VM-Dev-Lab" ]; then echo "[PASS] Task 2: tags Purpose=Backup, Source=VM-Dev-Lab"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: tags wrong (Purpose=$T1 Source=$T2)"; FAIL=$((FAIL+1)); fi

D=$(az disk show -n Disk-From-Snap -g "$RG" --query "creationData.createOption" -o tsv 2>/dev/null)
case "$D" in Copy|copy) echo "[PASS] Task 3: Disk-From-Snap created from snapshot"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: Disk-From-Snap missing or wrong source ($D)"; FAIL=$((FAIL+1));; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

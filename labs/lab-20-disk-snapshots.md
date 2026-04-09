# Lab 20 — Disk Snapshots & Images

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-07

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

| #   | What to Check                        | CLI Command                                                                                                                                               |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Snapshot `Snap-OSDisk-01` exists     | `az snapshot show --name Snap-OSDisk-01 --resource-group RG-Dev-Lab --query "{name:name, diskSizeGb:diskSizeGb, timeCreated:timeCreated}" -o json`        |
| 2   | Tags on snapshot                     | `az snapshot show --name Snap-OSDisk-01 --resource-group RG-Dev-Lab --query "{tags:tags}" -o json`                                                        |
| 3   | Managed disk `Disk-From-Snap` exists | `az disk show --name Disk-From-Snap --resource-group RG-Dev-Lab --query "{name:name, creationSource:creationData.createOption}" -o json`                  |

## Result

- **Status:** NOT STARTED

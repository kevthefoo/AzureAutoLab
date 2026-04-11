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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 44 — Azure Storage Redundancy

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization requires different levels of data durability for different workloads. The infrastructure team needs to provision storage accounts with varying redundancy levels and understand how geo-redundant replication works, including read access to the secondary region.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Redundancy-Lab` in East US
- [ ] **Task 2:** Create a storage account `stlabredundlrs44` with Locally Redundant Storage (LRS)
- [ ] **Task 3:** Create a storage account `stlabredundgrs44` with Geo-Redundant Storage (GRS)
- [ ] **Task 4:** Create a storage account `stlabredundragrs44` with Read-Access Geo-Redundant Storage (RA-GRS) and verify the secondary endpoint is available
- [ ] **Task 5:** Change `stlabredundlrs44` from LRS to GRS replication

## Skills Tested

- Understanding Azure Storage redundancy options (LRS, GRS, RA-GRS)
- Configuring replication type during and after account creation
- Identifying secondary endpoints for RA-GRS accounts
- Changing replication configuration on existing accounts

## Verification Criteria

| #   | What to Check                          | Where in Portal                                    | How to Verify                                                 |
| --- | -------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Resource group exists                  | Resource groups > `RG-Redundancy-Lab`              | Resource group is listed in East US                           |
| 2   | LRS storage account exists             | Storage accounts > `stlabredundlrs44` > Overview   | Replication shows "Locally-redundant storage (LRS)"           |
| 3   | GRS storage account exists             | Storage accounts > `stlabredundgrs44` > Overview   | Replication shows "Geo-redundant storage (GRS)"               |
| 4   | RA-GRS account with secondary endpoint | Storage accounts > `stlabredundragrs44` > Overview | Replication shows "RA-GRS" and secondary endpoints are listed |
| 5   | LRS account changed to GRS             | Storage accounts > `stlabredundlrs44` > Overview   | Replication now shows "Geo-redundant storage (GRS)"           |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 43 — Blob Lifecycle Management

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization stores large volumes of log data in blob storage. To reduce costs, the data engineering team has requested an automated policy that transitions older blobs to cooler tiers and eventually deletes them after a retention period.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Lifecycle-Lab` in East US and a storage account `stlablifecycle43` with blob access tier set to Hot
- [ ] **Task 2:** Create a blob container `logs-archive` and upload a sample file `app-log-2025.txt`
- [ ] **Task 3:** Create a lifecycle management policy named `auto-tier-policy` that moves block blobs to Cool tier after 30 days
- [ ] **Task 4:** Add a rule to the policy that moves blobs to Archive tier after 90 days and deletes blobs after 365 days

## Skills Tested

- Creating blob lifecycle management policies
- Configuring tier transitions (Hot > Cool > Archive)
- Setting automatic deletion rules based on age
- Understanding blob access tier cost optimization

## Verification Criteria

| #   | What to Check                           | Where in Portal                                                     | How to Verify                                        |
| --- | --------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | Storage account with Hot default tier   | Storage accounts > `stlablifecycle43` > Overview                    | Default access tier shows "Hot"                      |
| 2   | Container and blob exist                | Storage accounts > `stlablifecycle43` > Containers > `logs-archive` | `app-log-2025.txt` is listed in the container        |
| 3   | Lifecycle policy moves to Cool at 30d   | Storage accounts > `stlablifecycle43` > Lifecycle management        | Rule shows "Move to cool storage" after 30 days      |
| 4   | Policy archives at 90d, deletes at 365d | Storage accounts > `stlablifecycle43` > Lifecycle management        | Rule shows Archive at 90 days and Delete at 365 days |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

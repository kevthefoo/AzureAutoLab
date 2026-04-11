# Lab 36 — Resource Locks at Scale

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

After an accidental deletion of a production storage account, management requires that all resources in critical resource groups are protected with CanNotDelete locks. You must use Azure Policy to automatically apply locks and verify they prevent deletion.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-LockScale-Lab` in **East US**
- [ ] **Task 2:** Create a storage account named `stlockscalelab` inside `RG-LockScale-Lab`
- [ ] **Task 3:** Apply a **CanNotDelete** lock named `Lock-NoDeletion` at the resource group level
- [ ] **Task 4:** Attempt to delete the storage account `stlockscalelab` and confirm the deletion is blocked by the lock
- [ ] **Task 5:** Apply a **ReadOnly** lock named `Lock-ReadOnly` on the storage account and verify modifications are blocked

## Skills Tested

- Applying resource locks at resource group scope
- Understanding CanNotDelete vs ReadOnly lock types
- Testing lock enforcement behavior
- Managing locks across multiple resources

## Verification Criteria

| #   | What to Check                                   | Where in Portal                                    | How to Verify                                                       |
| --- | ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Resource group `RG-LockScale-Lab` exists        | Portal > Resource Groups                           | Find `RG-LockScale-Lab` in the list                                 |
| 2   | Storage account `stlockscalelab` exists         | RG-LockScale-Lab > Resources                       | Find the storage account in the resource group                      |
| 3   | CanNotDelete lock exists on the RG              | RG-LockScale-Lab > Locks                           | Confirm `Lock-NoDeletion` with type CanNotDelete is listed          |
| 4   | Deletion is blocked                             | Portal > attempt delete on stlockscalelab          | Confirm an error message referencing the lock appears                |
| 5   | ReadOnly lock exists on storage account         | stlockscalelab > Locks                             | Confirm `Lock-ReadOnly` with type ReadOnly is listed                |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

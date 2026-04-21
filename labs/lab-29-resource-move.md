# Lab 29 — Resource Move Between Resource Groups

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-21

---

## Scenario

Your finance team has reorganized the chargeback structure. A storage account currently living in a shared "source" resource group must be relocated to a dedicated "target" resource group without recreating the resource or losing data.

## Tasks

- [ ] **Task 1:** Create two resource groups in **East US**: `RG-Move-Source` and `RG-Move-Target`
- [ ] **Task 2:** Create a storage account named `stmove<suffix>` in `RG-Move-Source` (Standard_LRS, StorageV2)
- [ ] **Task 3:** Move the `stmove<suffix>` storage account from `RG-Move-Source` to `RG-Move-Target`
- [ ] **Task 4:** Verify `RG-Move-Target` now contains the storage account and `RG-Move-Source` contains no resources

## Skills Tested

- Moving Azure resources between resource groups
- Understanding resource move constraints and validation
- Resource group lifecycle management
- Verifying resource placement after a move operation

## Verification Criteria

| #   | What to Check                                 | CLI Command                                                                                                                         |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Both resource groups exist                    | `az group list --query "[?name=='RG-Move-Source' \|\| name=='RG-Move-Target'].{name:name, location:location}" -o json`              |
| 2   | Storage account lives in `RG-Move-Target`     | `az storage account list --resource-group RG-Move-Target --query "[].{name:name, resourceGroup:resourceGroup}" -o json`             |
| 3   | `RG-Move-Source` has zero resources           | `az resource list --resource-group RG-Move-Source --query "length(@)" -o tsv`                                                       |
| 4   | `RG-Move-Target` contains the storage account | `az resource list --resource-group RG-Move-Target --query "[].{name:name, type:type}" -o json`                                      |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

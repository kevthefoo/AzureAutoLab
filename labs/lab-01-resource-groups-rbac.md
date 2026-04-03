# Lab 01 — Resource Groups & RBAC

**Domain:** Identity & Governance  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-03

---

## Scenario

Your company needs a new resource group for the development team. You must also ensure a specific user has the right level of access.

## Tasks

- [ ] **Task 1:** Create a Resource Group named `RG-Dev-Lab` in the **East US** region
- [ ] **Task 2:** Add a tag to the resource group: `Environment = Development`
- [ ] **Task 3:** Assign the **Reader** role to the resource group for any user or group in your directory

## Skills Tested

- Resource group creation
- Tagging resources
- Azure RBAC role assignments

## Verification Criteria

| #   | What to Check                                 | Where in Portal                                      | How to Verify                                             |
| --- | --------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| 1   | Resource group `RG-Dev-Lab` exists in East US | Portal > Resource Groups                             | Find `RG-Dev-Lab` in the list, confirm Location = East US |
| 2   | Tag `Environment = Development` is present    | RG-Dev-Lab > Tags                                    | Check tag key `Environment` with value `Development`      |
| 3   | Reader role assignment exists                 | RG-Dev-Lab > Access Control (IAM) > Role assignments | Find at least one entry with Role = Reader                |

## Result

- **Status:** PASSED (3/3)
- **Date Completed:** 2026-04-03
- **Notes:**
  - RG-Dev-Lab exists in East US
  - Tag Environment = Development confirmed
  - Reader role assigned to Kevin Hsu (scope: This resource)

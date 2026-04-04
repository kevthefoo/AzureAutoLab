# Lab 07 — Azure Policy & Resource Locks

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-03

---

## Scenario

Your compliance team requires that all resources in the development environment are tagged properly and that critical resources cannot be accidentally deleted. You must enforce tagging via Azure Policy and protect key resources with locks.

## Tasks

- [ ] **Task 1:** Assign the built-in policy **"Require a tag and its value on resources"** to resource group `RG-Dev-Lab`. Set the tag name to `CostCenter` and the tag value to `Dev-001`
- [ ] **Task 2:** Create a **Read-Only lock** named `Lock-LAW` on the Log Analytics workspace `LAW-Dev-Lab` to prevent modifications
- [ ] **Task 3:** Create a **Delete lock** named `Lock-RG` on the resource group `RG-Dev-Lab` to prevent accidental deletion

## Skills Tested

- Azure Policy assignment with parameters
- Understanding policy effects (Deny, Audit, etc.)
- Resource lock types (ReadOnly vs Delete)
- Applying locks at different scopes (resource vs resource group)

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                                                                   |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Policy assignment exists on `RG-Dev-Lab`   | `az policy assignment list --resource-group RG-Dev-Lab --query "[?contains(displayName,'tag')].{name:name, displayName:displayName, enforcement:enforcementMode}" -o json`    |
| 2   | Read-Only lock on `LAW-Dev-Lab`            | `az lock list --resource-group RG-Dev-Lab --resource-name LAW-Dev-Lab --resource-type Microsoft.OperationalInsights/workspaces --query "[].{name:name, level:level}" -o json` |
| 3   | Delete lock on resource group `RG-Dev-Lab` | `az lock list --resource-group RG-Dev-Lab --query "[?level=='CanNotDelete'].{name:name, level:level}" -o json`                                                                |

## Result

- **Status:** PASSED
- **Date:** 2026-04-04
- **Notes:** All 3 tasks verified via CLI. Policy "TagForce" enforces CostCenter=Dev-001 tag. ReadOnly lock on LAW-Dev-Lab, Delete lock on RG-Dev-Lab.

# Lab 22 — Custom RBAC Roles

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization needs a custom role that allows helpdesk operators to restart virtual machines and view their status, but not delete or create them. The built-in roles are too broad, so you must define a tailored RBAC role and assign it to a user.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-CustomRBAC-Lab` in the **East US** region
- [ ] **Task 2:** Create a custom RBAC role named `VM Operator Custom` scoped to the resource group, with permissions: `Microsoft.Compute/virtualMachines/read`, `Microsoft.Compute/virtualMachines/start/action`, `Microsoft.Compute/virtualMachines/restart/action`, and `Microsoft.Compute/virtualMachines/powerOff/action`
- [ ] **Task 3:** Assign the `VM Operator Custom` role to a user in your directory at the `RG-CustomRBAC-Lab` scope
- [ ] **Task 4:** Verify the custom role appears in the role definitions list for the resource group

## Skills Tested

- Creating custom RBAC role definitions
- Defining granular action permissions
- Assigning custom roles at resource group scope
- Understanding Azure role-based access control hierarchy

## Verification Criteria

| #   | What to Check                              | Where in Portal                                                 | How to Verify                                                    |
| --- | ------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Resource group `RG-CustomRBAC-Lab` exists  | Portal > Resource Groups                                        | Find `RG-CustomRBAC-Lab` in the list, confirm Location = East US |
| 2   | Custom role `VM Operator Custom` exists    | RG-CustomRBAC-Lab > Access Control (IAM) > Roles                | Search for `VM Operator Custom` in the roles list                |
| 3   | Role assignment exists for the custom role | RG-CustomRBAC-Lab > Access Control (IAM) > Role assignments     | Find an entry with Role = `VM Operator Custom`                   |
| 4   | Custom role has correct permissions        | Access Control (IAM) > Roles > VM Operator Custom > Permissions | Confirm the four VM actions are listed under allowed actions     |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

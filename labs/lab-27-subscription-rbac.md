# Lab 27 — Subscription-Level RBAC

**Domain:** Identity & Governance  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

A new team lead needs Contributor access across all resources in the subscription. You must assign the role at the subscription level and verify that the permissions correctly inherit down to existing resource groups.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-InheritTest-Lab` in the **East US** region
- [ ] **Task 2:** Assign the **Contributor** role to a user at the subscription scope
- [ ] **Task 3:** Verify the role assignment is inherited at the `RG-InheritTest-Lab` resource group level
- [ ] **Task 4:** Confirm the inheritance type shows as "Inherited" in the resource group's IAM blade

## Skills Tested

- Assigning RBAC roles at subscription scope
- Understanding role inheritance across scopes
- Differentiating direct vs inherited role assignments
- Navigating IAM blades at different scope levels

## Verification Criteria

| #   | What to Check                                     | Where in Portal                                              | How to Verify                                                        |
| --- | ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | Resource group `RG-InheritTest-Lab` exists         | Portal > Resource Groups                                     | Find `RG-InheritTest-Lab` in the list                                |
| 2   | Contributor role assigned at subscription scope    | Subscription > Access Control (IAM) > Role assignments       | Find the user with Role = Contributor                                |
| 3   | Role is inherited at resource group level          | RG-InheritTest-Lab > Access Control (IAM) > Role assignments | Find the same user with Role = Contributor                           |
| 4   | Assignment shows as Inherited                      | RG-InheritTest-Lab > Access Control (IAM) > Role assignments | Confirm the Scope column shows the subscription (not the RG)         |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

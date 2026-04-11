# Lab 33 — Azure Blueprints

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your governance team wants to standardize new subscription setups by deploying a blueprint that automatically applies required policies and RBAC assignments. You must create a blueprint definition with policy and role assignment artifacts, publish it, and assign it to a subscription.

## Tasks

- [ ] **Task 1:** Create a blueprint definition named `BP-StandardGovernance` at the subscription scope
- [ ] **Task 2:** Add a policy assignment artifact: assign the built-in policy "Require a tag on resources" for the tag `Environment`
- [ ] **Task 3:** Add a role assignment artifact: assign the **Reader** role to a security group in your directory
- [ ] **Task 4:** Publish the blueprint as version `1.0` and assign it to your subscription with a lock mode of **Do Not Delete**

## Skills Tested

- Creating Azure Blueprint definitions
- Adding policy and role assignment artifacts to blueprints
- Publishing and versioning blueprints
- Assigning blueprints with resource locking

## Verification Criteria

| #   | What to Check                                       | Where in Portal                             | How to Verify                                                     |
| --- | --------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Blueprint `BP-StandardGovernance` definition exists | Portal > Blueprints > Blueprint definitions | Find `BP-StandardGovernance` in the list                          |
| 2   | Policy artifact is included in the blueprint        | BP-StandardGovernance > Artifacts           | Confirm a policy assignment artifact for tag `Environment` exists |
| 3   | Role assignment artifact is included                | BP-StandardGovernance > Artifacts           | Confirm a Reader role assignment artifact exists                  |
| 4   | Blueprint is assigned with version 1.0              | Portal > Blueprints > Assigned blueprints   | Find the assignment with version `1.0` and lock = Do Not Delete   |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

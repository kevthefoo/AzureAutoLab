# Lab 28 — Azure Policy Initiatives

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your compliance team requires multiple tagging policies to be enforced together. Rather than assigning individual policies, you need to create a policy initiative (policy set) that bundles tagging requirements and assign it to a resource group for centralized compliance monitoring.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-PolicyInit-Lab` in the **East US** region
- [ ] **Task 2:** Create a custom policy initiative named `Initiative-RequiredTags` containing two built-in policies: "Require a tag on resources" for tag `Environment` and "Require a tag on resources" for tag `CostCenter`
- [ ] **Task 3:** Assign the `Initiative-RequiredTags` initiative to the `RG-PolicyInit-Lab` resource group
- [ ] **Task 4:** Trigger a compliance evaluation and review the compliance state

## Skills Tested

- Creating custom policy initiatives (policy sets)
- Bundling multiple policies into an initiative
- Assigning initiatives at resource group scope
- Evaluating and interpreting compliance results

## Verification Criteria

| #   | What to Check                                        | Where in Portal                                     | How to Verify                                                       |
| --- | ---------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Resource group `RG-PolicyInit-Lab` exists            | Portal > Resource Groups                            | Find `RG-PolicyInit-Lab` in the list                                |
| 2   | Initiative `Initiative-RequiredTags` exists          | Portal > Policy > Definitions                       | Search for `Initiative-RequiredTags` in definitions                 |
| 3   | Initiative is assigned to the resource group         | Portal > Policy > Assignments                       | Find assignment scoped to `RG-PolicyInit-Lab`                       |
| 4   | Compliance evaluation shows results                  | Portal > Policy > Compliance                        | Check compliance state for `Initiative-RequiredTags`                |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

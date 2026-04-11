# Lab 40 — Deny Assignments & RBAC Conditions

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your security team wants to restrict a Contributor from managing certain storage blob containers even though they have broad resource access. You must use RBAC conditions (ABAC) to add attribute-based restrictions to a role assignment, limiting blob access based on container name.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-RBACCondition-Lab` in **East US**
- [ ] **Task 2:** Create a storage account named `strbaccondlab` in `RG-RBACCondition-Lab` with two blob containers: `public-data` and `confidential-data`
- [ ] **Task 3:** Assign the **Storage Blob Data Contributor** role to a user scoped to `strbaccondlab`, with an RBAC condition that restricts access to only the `public-data` container (condition: container name equals `public-data`)
- [ ] **Task 4:** Verify the role assignment shows a condition in the IAM blade

## Skills Tested

- Understanding Azure ABAC (Attribute-Based Access Control)
- Adding conditions to RBAC role assignments
- Working with storage blob container-level conditions
- Differentiating deny assignments from RBAC conditions

## Verification Criteria

| #   | What to Check                                  | Where in Portal                                         | How to Verify                                                         |
| --- | ---------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Resource group `RG-RBACCondition-Lab` exists   | Portal > Resource Groups                                | Find `RG-RBACCondition-Lab` in the list                               |
| 2   | Storage account with two containers exists     | strbaccondlab > Containers                              | Confirm `public-data` and `confidential-data` containers exist        |
| 3   | Conditional role assignment exists             | strbaccondlab > Access Control (IAM) > Role assignments | Find the user with Storage Blob Data Contributor + Condition column   |
| 4   | Condition restricts to `public-data` container | Role assignment > Condition tab                         | Confirm the condition expression references container = `public-data` |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 30 — Resource Tags & Cost Management

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Finance needs to track cloud spending by department. You must apply a tag inheritance policy so that resource groups automatically pass their tags to child resources, and set up a cost alert that triggers when spending for a specific tag value exceeds a threshold.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-CostTags-Lab` in **East US** with tags `Department = Marketing` and `Project = Campaign2026`
- [ ] **Task 2:** Assign the built-in policy "Inherit a tag from the resource group" for the tag `Department` to the `RG-CostTags-Lab` resource group
- [ ] **Task 3:** Create a storage account named `stcosttagslab` inside `RG-CostTags-Lab` and verify the `Department` tag is inherited
- [ ] **Task 4:** Navigate to Cost Management and create a budget named `Budget-Marketing` for $50 with an alert at 80% threshold

## Skills Tested

- Applying and managing resource tags
- Using built-in tag inheritance policies
- Creating budgets in Cost Management
- Configuring cost alert thresholds

## Verification Criteria

| #   | What to Check                                              | Where in Portal               | How to Verify                                                 |
| --- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| 1   | RG has tags `Department=Marketing`, `Project=Campaign2026` | RG-CostTags-Lab > Tags        | Confirm both tags are present with correct values             |
| 2   | Tag inheritance policy is assigned                         | Portal > Policy > Assignments | Find "Inherit a tag from the resource group" scoped to the RG |
| 3   | Storage account has inherited `Department` tag             | stcosttagslab > Tags          | Confirm `Department = Marketing` tag is present               |
| 4   | Budget `Budget-Marketing` exists with 80% alert            | Cost Management > Budgets     | Find budget with $50 amount and 80% alert threshold           |

## Result

- **Status:** PASSED (4/4)
- **Date Completed:** 2026-04-28
- **Notes:**
  - ✅ Task 1: RG-CostTags-Lab exists in East US with tags `Department=Marketing` and `Project=Campaign2026`
  - ✅ Task 2: Built-in policy "Inherit a tag from the resource group" is assigned to the RG scope
  - ✅ Task 3: Storage account `stcosttagslab` exists with inherited tag `Department=Marketing`
  - ✅ Task 4: Budget `Budget-Marketing` exists at billing account scope (Kevin Hsu) with amount $50 and 80% Actual threshold alert

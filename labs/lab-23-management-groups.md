# Lab 23 — Management Groups

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your company is expanding and needs a management group hierarchy to organize subscriptions by department. You must create a structure that separates production and development environments for governance purposes.

## Tasks

- [ ] **Task 1:** Create a management group named `MG-CorpIT` under the Tenant Root Group
- [ ] **Task 2:** Create a child management group named `MG-CorpIT-Production` under `MG-CorpIT`
- [ ] **Task 3:** Create a child management group named `MG-CorpIT-Development` under `MG-CorpIT`
- [ ] **Task 4:** Move your current subscription into the `MG-CorpIT-Development` management group

## Skills Tested

- Creating management group hierarchies
- Organizing subscriptions with management groups
- Moving subscriptions between management groups
- Understanding governance inheritance through management groups

## Verification Criteria

| #   | What to Check                                      | Where in Portal                          | How to Verify                                                         |
| --- | -------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| 1   | Management group `MG-CorpIT` exists                | Portal > Management Groups               | Find `MG-CorpIT` in the hierarchy tree                                |
| 2   | `MG-CorpIT-Production` is a child of `MG-CorpIT`  | Portal > Management Groups > MG-CorpIT   | Confirm `MG-CorpIT-Production` appears as a child group               |
| 3   | `MG-CorpIT-Development` is a child of `MG-CorpIT` | Portal > Management Groups > MG-CorpIT   | Confirm `MG-CorpIT-Development` appears as a child group              |
| 4   | Subscription is under `MG-CorpIT-Development`      | Portal > Management Groups > MG-CorpIT-Development | Confirm your subscription appears listed under this group    |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

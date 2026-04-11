# Lab 39 — Azure AD Access Reviews

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your audit team requires periodic reviews of group memberships to ensure users still need access to critical resources. You must configure an access review that automatically reviews members of a security group and applies removal recommendations when reviewers do not respond.

## Tasks

- [ ] **Task 1:** Create a security group named `SG-CriticalAccess-Lab` in Entra ID and add at least two members
- [ ] **Task 2:** Navigate to Entra ID > Identity Governance > Access reviews and create a new access review named `Review-CriticalAccess`
- [ ] **Task 3:** Configure the review to target `SG-CriticalAccess-Lab` members, set reviewers to group owners (or self-review), with a duration of 7 days and monthly recurrence
- [ ] **Task 4:** Enable auto-apply results and set the action for non-responded reviews to "Remove access"

## Skills Tested

- Creating access reviews in Entra ID Identity Governance
- Configuring review scope and reviewers
- Setting up recurring access reviews
- Configuring auto-apply and default actions for non-response

## Verification Criteria

| #   | What to Check                                    | Where in Portal                                 | How to Verify                                                 |
| --- | ------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------- |
| 1   | Security group `SG-CriticalAccess-Lab` exists    | Entra ID > Groups                               | Find the group with at least two members                      |
| 2   | Access review `Review-CriticalAccess` exists     | Entra ID > Identity Governance > Access reviews | Find `Review-CriticalAccess` in the list                      |
| 3   | Review targets correct group with 7-day duration | Review-CriticalAccess > Settings                | Confirm target = `SG-CriticalAccess-Lab`, duration = 7 days   |
| 4   | Auto-apply and remove access are configured      | Review-CriticalAccess > Settings                | Confirm auto-apply = Yes, non-response action = Remove access |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

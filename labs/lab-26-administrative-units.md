# Lab 26 — Azure AD Administrative Units

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization has regional offices and needs to delegate user management for the Sydney office to a local IT administrator. You must create an Administrative Unit, add the relevant users, and assign a scoped admin role so the local admin can only manage users within that AU.

## Tasks

- [ ] **Task 1:** Create an Administrative Unit named `AU-Sydney-Office` in Entra ID
- [ ] **Task 2:** Add at least two users to the `AU-Sydney-Office` administrative unit
- [ ] **Task 3:** Assign the **User Administrator** role scoped to `AU-Sydney-Office` to a designated admin user
- [ ] **Task 4:** Verify the scoped admin can see only the AU members in their management scope

## Skills Tested

- Creating Administrative Units in Entra ID
- Adding members to Administrative Units
- Assigning directory roles with AU scope
- Understanding delegated administration boundaries

## Verification Criteria

| #   | What to Check                                 | Where in Portal                                          | How to Verify                                                        |
| --- | --------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Administrative Unit `AU-Sydney-Office` exists | Entra ID > Administrative Units                          | Find `AU-Sydney-Office` in the list                                  |
| 2   | AU has at least two members                   | AU-Sydney-Office > Members                               | Confirm at least two users are listed as members                     |
| 3   | User Administrator role is scoped to the AU   | AU-Sydney-Office > Roles and administrators              | Confirm User Administrator role has an assignment for the admin user |
| 4   | Scoped admin assignment is visible            | Entra ID > Roles and administrators > User Administrator | Confirm the assignment shows scope = `AU-Sydney-Office`              |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

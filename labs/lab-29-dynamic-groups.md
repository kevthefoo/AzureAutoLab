# Lab 29 — Azure AD Dynamic Groups

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your HR team frequently onboards users to different departments. Instead of manually adding users to groups, you need to configure dynamic membership rules that automatically add users based on their department attribute, reducing administrative overhead.

## Tasks

- [ ] **Task 1:** Create a user named `DynUser-Sales01` in Entra ID with Department set to `Sales`
- [ ] **Task 2:** Create a user named `DynUser-Engineering01` in Entra ID with Department set to `Engineering`
- [ ] **Task 3:** Create a dynamic security group named `DG-Sales-Team` with the membership rule: `user.department -eq "Sales"`
- [ ] **Task 4:** Verify that `DynUser-Sales01` is automatically added to `DG-Sales-Team` and `DynUser-Engineering01` is not

## Skills Tested

- Creating users with specific attributes in Entra ID
- Configuring dynamic group membership rules
- Understanding dynamic membership rule syntax
- Validating automatic group membership processing

## Verification Criteria

| #   | What to Check                                       | Where in Portal                              | How to Verify                                               |
| --- | --------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| 1   | User `DynUser-Sales01` exists with Department=Sales | Entra ID > Users > DynUser-Sales01 > Profile | Confirm Department field = `Sales`                          |
| 2   | User `DynUser-Engineering01` exists                 | Entra ID > Users                             | Find user in the list with Department = `Engineering`       |
| 3   | Dynamic group `DG-Sales-Team` exists                | Entra ID > Groups                            | Find group, confirm Membership type = Dynamic User          |
| 4   | Correct membership in `DG-Sales-Team`               | DG-Sales-Team > Members                      | `DynUser-Sales01` is listed; `DynUser-Engineering01` is not |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

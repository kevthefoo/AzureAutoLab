# Lab 34 — PIM — Privileged Identity Management

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your security officer requires that privileged roles like Global Administrator are not permanently assigned. Instead, eligible users should activate the role on-demand with a time limit and approval. You must configure Privileged Identity Management for just-in-time role access.

## Tasks

- [ ] **Task 1:** Navigate to Privileged Identity Management and ensure it is enabled for your tenant
- [ ] **Task 2:** Configure the **User Administrator** role in PIM: set maximum activation duration to 2 hours and require justification on activation
- [ ] **Task 3:** Make a user eligible for the **User Administrator** role (not permanently active)
- [ ] **Task 4:** As the eligible user, activate the role and provide a justification message

## Skills Tested

- Enabling and navigating Privileged Identity Management
- Configuring PIM role settings (activation duration, justification)
- Assigning eligible vs active role assignments
- Activating just-in-time role access

## Verification Criteria

| #   | What to Check                                       | Where in Portal                                           | How to Verify                                               |
| --- | --------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | PIM is accessible and enabled                       | Entra ID > Privileged Identity Management                 | Confirm PIM dashboard loads without errors                  |
| 2   | User Administrator role settings are configured     | PIM > Azure AD roles > Settings > User Administrator      | Confirm max duration = 2 hours, require justification = Yes |
| 3   | User has eligible assignment for User Administrator | PIM > Azure AD roles > Assignments > Eligible assignments | Find the user listed as eligible for User Administrator     |
| 4   | Role activation is logged                           | PIM > Azure AD roles > Audit                              | Confirm an activation event with justification is recorded  |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

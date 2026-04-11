# Lab 31 — Azure AD Self-Service Password Reset

**Domain:** Identity & Governance  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Your helpdesk is overwhelmed with password reset requests. Management wants to enable self-service password reset (SSPR) for a pilot group of users so they can reset their own passwords without IT intervention.

## Tasks

- [ ] **Task 1:** Create a security group named `SG-SSPR-Pilot` in Entra ID and add at least one user
- [ ] **Task 2:** Enable Self-Service Password Reset for the `SG-SSPR-Pilot` group (set SSPR to "Selected")
- [ ] **Task 3:** Configure authentication methods: require 1 method, enable **Email** and **Mobile phone** as available methods
- [ ] **Task 4:** Enable the notification setting to notify users on password resets

## Skills Tested

- Configuring Self-Service Password Reset in Entra ID
- Scoping SSPR to specific groups
- Setting authentication methods for SSPR
- Configuring SSPR notification settings

## Verification Criteria

| #   | What to Check                         | Where in Portal                                    | How to Verify                                                     |
| --- | ------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Security group `SG-SSPR-Pilot` exists | Entra ID > Groups                                  | Find the group and confirm it has at least one member             |
| 2   | SSPR is enabled for Selected group    | Entra ID > Password reset > Properties             | Confirm SSPR is set to Selected and `SG-SSPR-Pilot` is the target |
| 3   | Authentication methods are configured | Entra ID > Password reset > Authentication methods | Confirm 1 method required, Email and Mobile phone enabled         |
| 4   | Notification setting is enabled       | Entra ID > Password reset > Notifications          | Confirm "Notify users on password resets" is set to Yes           |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

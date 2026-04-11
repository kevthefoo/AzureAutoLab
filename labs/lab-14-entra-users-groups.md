# Lab 14 — Microsoft Entra ID Users & Groups

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

A new developer is joining the team. You must create their user account in Microsoft Entra ID, add them to a security group, and assign the group a role on the development resource group.

## Tasks

- [x] **Task 1:** Create a **security group** named `SG-Developers` in Microsoft Entra ID with description "Development team members"
- [x] **Task 2:** Create a new **user** named `dev-user-01` with display name `Dev User 01` (any temporary password)
- [x] **Task 3:** Add `dev-user-01` as a **member** of the `SG-Developers` group

## Skills Tested

- Microsoft Entra ID group creation
- User account provisioning
- Group membership management

## Verification Criteria

| #   | What to Check                | CLI Command                                                                                                                               |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Group `SG-Developers` exists | `az ad group show --group SG-Developers --query "{displayName:displayName, description:description}" -o json`                             |
| 2   | User `dev-user-01` exists    | `az ad user list --filter "startsWith(mailNickname,'dev-user-01')" --query "[].{displayName:displayName, upn:userPrincipalName}" -o json` |
| 3   | User is member of group      | `az ad group member check --group SG-Developers --member-id <USER_OBJECT_ID> --query value -o json`                                       |

## Result

- **Status:** PASSED
- **Date:** 2026-04-11
- **Notes:** SG-Developers group created with correct description. User dev-user-01 (Dev User 01) provisioned and confirmed as group member.

# Lab 35 — Azure AD B2B Guest Users

**Domain:** Identity & Governance  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Your company is collaborating with an external consulting firm and needs to grant their project manager access to a specific resource group. You must invite the external user as a B2B guest and assign them an appropriate role scoped to the project resources only.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ExternalCollab-Lab` in **East US** with a tag `Partner = Contoso`
- [ ] **Task 2:** Invite an external guest user to your Entra ID tenant (use any external email address)
- [ ] **Task 3:** Assign the **Reader** role to the guest user scoped to `RG-ExternalCollab-Lab`
- [ ] **Task 4:** Verify the guest user appears in Entra ID with User Type = Guest

## Skills Tested

- Inviting external B2B guest users to Entra ID
- Understanding guest user vs member user types
- Assigning RBAC roles to guest users
- Managing external collaboration settings

## Verification Criteria

| #   | What to Check                                 | Where in Portal                                                 | How to Verify                            |
| --- | --------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| 1   | Resource group `RG-ExternalCollab-Lab` exists | Portal > Resource Groups                                        | Find the RG with tag `Partner = Contoso` |
| 2   | Guest user exists in directory                | Entra ID > Users                                                | Find the user, confirm User type = Guest |
| 3   | Reader role assigned to guest at RG scope     | RG-ExternalCollab-Lab > Access Control (IAM) > Role assignments | Find the guest user with Role = Reader   |
| 4   | Guest user type is correct                    | Entra ID > Users > [guest user] > Profile                       | Confirm User type field shows Guest      |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 25 — Conditional Access Policies

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your security team mandates that all users accessing the Azure portal must authenticate with multi-factor authentication. You need to create a Conditional Access policy that enforces MFA for Azure Management access while excluding emergency break-glass accounts.

## Tasks

- [ ] **Task 1:** Create a security group named `SG-CA-Exclude-BreakGlass` in Entra ID and add a designated break-glass user
- [ ] **Task 2:** Create a Conditional Access policy named `CA-Require-MFA-AzurePortal`
- [ ] **Task 3:** Configure the policy to target all users, exclude the `SG-CA-Exclude-BreakGlass` group, apply to the Microsoft Azure Management cloud app, and require multi-factor authentication as a grant control
- [ ] **Task 4:** Set the policy to **Report-only** mode (do not enable enforcement yet)

## Skills Tested

- Creating Conditional Access policies
- Configuring user and group assignments with exclusions
- Targeting specific cloud applications
- Understanding MFA grant controls and report-only mode

## Verification Criteria

| #   | What to Check                                         | Where in Portal                                        | How to Verify                                                          |
| --- | ----------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | Security group `SG-CA-Exclude-BreakGlass` exists      | Entra ID > Groups                                      | Find the group and confirm it has at least one member                   |
| 2   | CA policy `CA-Require-MFA-AzurePortal` exists         | Entra ID > Security > Conditional Access > Policies    | Find the policy in the list                                            |
| 3   | Policy targets correct apps and requires MFA          | CA policy > Conditions / Grant                         | Confirm target app = Microsoft Azure Management, grant = Require MFA   |
| 4   | Policy is in Report-only mode                         | CA policy > Enable policy                              | Confirm the policy state is set to Report-only                         |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

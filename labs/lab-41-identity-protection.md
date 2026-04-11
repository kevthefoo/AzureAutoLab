# Lab 41 — Azure AD Identity Protection

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

After a recent phishing attack, your CISO wants to implement risk-based policies that automatically respond to suspicious sign-ins and compromised user accounts. You must configure Identity Protection with user risk and sign-in risk policies to enforce password changes and MFA when risks are detected.

## Tasks

- [ ] **Task 1:** Navigate to Entra ID > Security > Identity Protection and review the risk overview dashboard
- [ ] **Task 2:** Configure a **User risk policy**: target all users, set user risk level to **High**, and action to **Block access** (or require password change)
- [ ] **Task 3:** Configure a **Sign-in risk policy**: target all users, set sign-in risk level to **Medium and above**, and action to **Require multi-factor authentication**
- [ ] **Task 4:** Review the Risky users and Risky sign-ins reports to confirm policies are active

## Skills Tested

- Configuring Identity Protection risk policies
- Understanding user risk vs sign-in risk levels
- Setting risk-based remediation actions
- Monitoring risky users and risky sign-in reports

## Verification Criteria

| #   | What to Check                                       | Where in Portal                                          | How to Verify                                                       |
| --- | --------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Identity Protection dashboard is accessible         | Entra ID > Security > Identity Protection                | Confirm the overview dashboard loads with risk metrics               |
| 2   | User risk policy is configured                      | Identity Protection > User risk policy                   | Confirm target = All users, risk level = High, action = Block/Change |
| 3   | Sign-in risk policy is configured                   | Identity Protection > Sign-in risk policy                | Confirm target = All users, risk = Medium+, action = Require MFA    |
| 4   | Risk reports are accessible                         | Identity Protection > Risky users / Risky sign-ins       | Confirm both reports load and show policy enforcement status         |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

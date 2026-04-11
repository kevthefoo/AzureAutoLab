# Lab 37 — Azure AD MFA Configuration

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization is rolling out multi-factor authentication for all employees. You need to configure the MFA settings, including trusted IP ranges for the corporate office so employees on-site are not repeatedly prompted, and set verification options.

## Tasks

- [ ] **Task 1:** Navigate to Entra ID > Security > MFA and access the MFA settings
- [ ] **Task 2:** Configure a trusted IP range by adding the CIDR block `10.0.0.0/24` as a trusted network named `Corporate-Office`
- [ ] **Task 3:** Under MFA service settings, enable **Verification code from mobile app** and **Notification through mobile app** as verification options
- [ ] **Task 4:** Configure the "remember multi-factor authentication" setting to allow users to remember MFA for 14 days on trusted devices

## Skills Tested

- Configuring MFA service settings in Entra ID
- Setting up trusted IP ranges for MFA bypass
- Selecting MFA verification methods
- Configuring MFA device remember settings

## Verification Criteria

| #   | What to Check                          | Where in Portal                      | How to Verify                                                     |
| --- | -------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| 1   | MFA settings page is accessible        | Entra ID > Security > MFA            | Confirm the MFA configuration page loads                          |
| 2   | Trusted IP `10.0.0.0/24` is configured | MFA > Named locations or Trusted IPs | Confirm `Corporate-Office` with `10.0.0.0/24` is listed           |
| 3   | Verification options are enabled       | MFA > Service settings               | Confirm mobile app notification and verification code are checked |
| 4   | Remember MFA setting is 14 days        | MFA > Service settings               | Confirm "remember multi-factor authentication" = 14 days          |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

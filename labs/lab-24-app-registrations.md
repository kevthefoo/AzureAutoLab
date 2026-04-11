# Lab 24 — Azure AD App Registrations

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The development team needs an application registered in Entra ID to authenticate against Microsoft Graph API. You must register the app, configure the necessary API permissions, and generate a client secret for server-side authentication.

## Tasks

- [ ] **Task 1:** Register a new application in Entra ID named `App-GraphReader-Lab`
- [ ] **Task 2:** Configure API permissions: add Microsoft Graph > Application permission `User.Read.All` and grant admin consent
- [ ] **Task 3:** Create a client secret named `lab-secret` with an expiration of 6 months
- [ ] **Task 4:** Record the Application (client) ID and Directory (tenant) ID from the app overview

## Skills Tested

- Registering applications in Entra ID
- Configuring API permissions and admin consent
- Creating and managing client secrets
- Understanding application identity concepts

## Verification Criteria

| #   | What to Check                                | Where in Portal                                              | How to Verify                                                     |
| --- | -------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | App `App-GraphReader-Lab` is registered      | Entra ID > App registrations                                 | Find `App-GraphReader-Lab` in the list                            |
| 2   | `User.Read.All` permission with admin consent| App-GraphReader-Lab > API permissions                        | Confirm `User.Read.All` is listed with Status = Granted           |
| 3   | Client secret `lab-secret` exists            | App-GraphReader-Lab > Certificates & secrets                 | Confirm secret with description `lab-secret` exists               |
| 4   | Application ID and Tenant ID are visible     | App-GraphReader-Lab > Overview                               | Confirm both IDs are displayed on the overview page               |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

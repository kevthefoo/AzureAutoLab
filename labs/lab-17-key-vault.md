# Lab 17 — Azure Key Vault

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your application needs to securely store database connection strings and API keys. You must create a Key Vault and add secrets to it with proper access control.

## Tasks

- [ ] **Task 1:** Create a **Key Vault** named `KV-Dev-Lab-104` in **East US** inside resource group `RG-Dev-Lab` (use RBAC for access control)
- [ ] **Task 2:** Add a **secret** named `DbConnectionString` with value `Server=myserver;Database=mydb;` to the vault
- [ ] **Task 3:** Add a second **secret** named `ApiKey` with value `sk-test-12345` and set an **expiration date** 90 days from now

## Skills Tested

- Key Vault creation with RBAC access model
- Secret management (create, set values)
- Secret expiration configuration

## Verification Criteria

| #   | What to Check                          | CLI Command                                                                                                                                                 |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Key Vault `KV-Dev-Lab-104` exists      | `az keyvault show --name KV-Dev-Lab-104 --query "{name:name, location:location, enableRbacAuthorization:properties.enableRbacAuthorization}" -o json`       |
| 2   | Secret `DbConnectionString` exists     | `az keyvault secret show --vault-name KV-Dev-Lab-104 --name DbConnectionString --query "{name:name, enabled:attributes.enabled}" -o json`                   |
| 3   | Secret `ApiKey` with expiry exists     | `az keyvault secret show --vault-name KV-Dev-Lab-104 --name ApiKey --query "{name:name, expires:attributes.expires}" -o json`                               |

## Result

- **Status:** NOT STARTED

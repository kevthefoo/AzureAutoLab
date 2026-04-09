# Lab 12 — Azure Backup & Recovery Vault

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your company requires disaster recovery for critical virtual machines. You must set up a Recovery Services vault and configure a backup policy to protect your VM.

## Tasks

- [ ] **Task 1:** Create a **Recovery Services Vault** named `RSV-Dev-Lab` in **East US** inside resource group `RG-Dev-Lab`
- [ ] **Task 2:** Create a custom **Backup Policy** named `Policy-Daily` with daily backups at **2:00 AM UTC** and retention of **30 days**
- [ ] **Task 3:** Enable backup for your existing VM using the `Policy-Daily` policy

## Skills Tested

- Recovery Services vault creation
- Custom backup policy configuration
- VM backup enablement and protection

## Verification Criteria

| #   | What to Check                        | CLI Command                                                                                                                                                     |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Recovery vault `RSV-Dev-Lab` exists  | `az backup vault show --name RSV-Dev-Lab --resource-group RG-Dev-Lab --query "{name:name, location:location}" -o json`                                          |
| 2   | Backup policy `Policy-Daily` exists  | `az backup policy show --vault-name RSV-Dev-Lab --resource-group RG-Dev-Lab --name Policy-Daily --query "{name:name}" -o json`                                  |
| 3   | VM backup is enabled                 | `az backup item list --vault-name RSV-Dev-Lab --resource-group RG-Dev-Lab --query "[].{name:name, protectionState:properties.protectionState}" -o json`         |

## Result

- **Status:** NOT STARTED

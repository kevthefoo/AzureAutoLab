# Lab 32 — Managed Identities

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your application team wants a virtual machine to access secrets in Azure Key Vault without storing credentials in code. You must enable a system-assigned managed identity on a VM and grant it access to an existing Key Vault.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ManagedID-Lab` in **East US**
- [ ] **Task 2:** Create a virtual machine named `VM-ManagedID-Lab` in `RG-ManagedID-Lab` (any size, e.g., Standard_B1s, Windows or Linux)
- [ ] **Task 3:** Enable the system-assigned managed identity on `VM-ManagedID-Lab`
- [ ] **Task 4:** Create a Key Vault named `kv-managedid-lab` in `RG-ManagedID-Lab` and assign the **Key Vault Secrets User** role to the VM's managed identity

## Skills Tested

- Enabling system-assigned managed identities on VMs
- Understanding managed identity vs service principals
- Assigning RBAC roles to managed identities
- Configuring Key Vault access for managed identities

## Verification Criteria

| #   | What to Check                               | Where in Portal                                            | How to Verify                                            |
| --- | ------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Resource group `RG-ManagedID-Lab` exists    | Portal > Resource Groups                                   | Find `RG-ManagedID-Lab` in the list                      |
| 2   | VM `VM-ManagedID-Lab` exists                | RG-ManagedID-Lab > Resources                               | Find the VM in the resource group                        |
| 3   | System-assigned managed identity is enabled | VM-ManagedID-Lab > Identity                                | Confirm Status = On under System assigned tab            |
| 4   | Key Vault Secrets User role assigned to MI  | kv-managedid-lab > Access Control (IAM) > Role assignments | Find VM-ManagedID-Lab with Role = Key Vault Secrets User |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

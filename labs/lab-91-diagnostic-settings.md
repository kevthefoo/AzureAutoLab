# Lab 91 — Diagnostic Settings

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The security team requires that all audit logs and platform metrics from key Azure resources are routed to a central Log Analytics workspace and archived to a storage account. You need to enable diagnostic settings on a virtual network and a Key Vault to satisfy compliance requirements.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Diagnostics-Lab` in East US
- [ ] **Task 2:** Create a Log Analytics workspace named `law-diagnostics-01` and a storage account named `stdiagarchive2026` in `RG-Diagnostics-Lab`
- [ ] **Task 3:** Create a virtual network named `vnet-prod-01` and a Key Vault named `kv-diag-lab-01` in `RG-Diagnostics-Lab`
- [ ] **Task 4:** Enable diagnostic settings on `vnet-prod-01` named `diag-vnet-prod` — send all logs and metrics to `law-diagnostics-01` and archive to `stdiagarchive2026`
- [ ] **Task 5:** Enable diagnostic settings on `kv-diag-lab-01` named `diag-kv-prod` — send AuditEvent logs and AllMetrics to `law-diagnostics-01`

## Skills Tested

- Configuring diagnostic settings for Azure resources
- Routing logs to Log Analytics workspaces
- Archiving diagnostic data to storage accounts
- Understanding platform log categories

## Verification Criteria

| #   | What to Check                       | Where in Portal                                         | How to Verify                                                |
| --- | ----------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Resource group and resources exist  | Resource Groups > `RG-Diagnostics-Lab`                  | All four resources (LAW, storage, VNet, KV) are listed       |
| 2   | VNet diagnostic setting exists      | Virtual Networks > `vnet-prod-01` > Diagnostic settings | `diag-vnet-prod` is listed with LAW and storage destinations |
| 3   | VNet sends all log categories       | Diagnostic settings > `diag-vnet-prod` > Details        | All available log categories are checked                     |
| 4   | Key Vault diagnostic setting exists | Key Vaults > `kv-diag-lab-01` > Diagnostic settings     | `diag-kv-prod` is listed with LAW destination                |
| 5   | Key Vault sends AuditEvent logs     | Diagnostic settings > `diag-kv-prod` > Details          | AuditEvent category and AllMetrics are enabled               |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 41 — Subscription-Level Diagnostic Settings

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-21

---

## Scenario

Your governance team wants every administrative action and security event across the entire subscription streamed to a central Log Analytics workspace for long-term analysis, independent of any single resource's diagnostic settings.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-SubDiag-Lab` in **East US**
- [ ] **Task 2:** Create a Log Analytics workspace `law-sub-diagnostics` in `RG-SubDiag-Lab` with SKU `PerGB2018`
- [ ] **Task 3:** Create a **subscription-level** diagnostic setting named `ds-activity-to-law` that sends **Administrative**, **Security**, and **Alert** log categories to `law-sub-diagnostics`
- [ ] **Task 4:** Run a Kusto query against the `AzureActivity` table in `law-sub-diagnostics` to confirm activity log events are being ingested

## Skills Tested

- Creating Log Analytics workspaces
- Configuring subscription-level diagnostic settings (distinct from resource-level)
- Selecting Activity Log categories for central archival
- Querying ingested activity logs with Kusto (KQL)

## Verification Criteria

| #   | What to Check                                  | CLI Command                                                                                                                                                                                                        |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Resource group `RG-SubDiag-Lab` exists         | `az group show --name RG-SubDiag-Lab --query "{name:name, location:location}" -o json`                                                                                                                             |
| 2   | Log Analytics workspace exists                 | `az monitor log-analytics workspace show --resource-group RG-SubDiag-Lab --workspace-name law-sub-diagnostics --query "{name:name, sku:sku.name, provisioningState:provisioningState}" -o json`                     |
| 3   | Subscription diagnostic setting exists         | `az monitor diagnostic-settings subscription show --name ds-activity-to-law --query "{name:name, workspaceId:workspaceId, categories:logs[?enabled].category}" -o json`                                             |
| 4   | `AzureActivity` table has recent log ingestion | `az monitor log-analytics query --workspace <WORKSPACE_CUSTOMER_ID> --analytics-query "AzureActivity \| take 1" --query "tables[0].rows[0]" -o json`                                                                |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

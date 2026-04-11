# Lab 92 — Azure Monitor Workbooks

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The infrastructure team needs a reusable visual report that combines VM performance metrics and log query results into a single view. You will create an Azure Monitor Workbook with multiple visualization types and share it with the team via a resource group.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Workbooks-Lab` in East US and a Log Analytics workspace named `law-workbooks-01`
- [ ] **Task 2:** Navigate to Azure Monitor > Workbooks and create a new workbook named `Workbook-Infra-Overview`
- [ ] **Task 3:** Add a metric chart step that displays "Percentage CPU" for all VMs in the subscription
- [ ] **Task 4:** Add a log query step using KQL that shows the top 10 most recent Heartbeat entries from `law-workbooks-01`
- [ ] **Task 5:** Save the workbook as a shared workbook in `RG-Workbooks-Lab`

## Skills Tested

- Creating Azure Monitor Workbooks
- Adding metric and log query visualizations
- Writing basic KQL queries for workbook steps
- Sharing workbooks at the resource group scope

## Verification Criteria

| #   | What to Check                | Where in Portal                                           | How to Verify                                               |
| --- | ---------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Resource group and LAW exist | Resource Groups > `RG-Workbooks-Lab`                      | `law-workbooks-01` is listed in the resource group          |
| 2   | Workbook exists              | Monitor > Workbooks                                       | `Workbook-Infra-Overview` appears in the workbooks list     |
| 3   | Metric chart step present    | Monitor > Workbooks > `Workbook-Infra-Overview`           | A metrics visualization showing CPU percentage is displayed |
| 4   | Log query step present       | Monitor > Workbooks > `Workbook-Infra-Overview`           | A log query step with Heartbeat KQL query is displayed      |
| 5   | Workbook is shared           | Monitor > Workbooks > `Workbook-Infra-Overview` > Details | Saved as shared workbook in `RG-Workbooks-Lab`              |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 100 — Azure Service Health & Advisor

**Domain:** Monitoring & Backup  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Management wants proactive visibility into Azure platform issues and cost optimization opportunities. You need to set up Service Health alerts so the team is notified of outages and planned maintenance, then review Azure Advisor recommendations to identify actionable improvements across security, reliability, cost, and performance.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ServiceHealth-Lab` in East US
- [ ] **Task 2:** Navigate to Service Health and create a Service Health alert named `alert-service-health-all` that monitors Service Issues, Planned Maintenance, and Health Advisories for your subscription in the East US and West US regions
- [ ] **Task 3:** Create an action group named `ag-platform-notify` in `RG-ServiceHealth-Lab` with an email action to `platform-team@contoso.com` and attach it to the Service Health alert
- [ ] **Task 4:** Navigate to Azure Advisor and review recommendations across all categories (Cost, Security, Reliability, Operational Excellence, Performance)
- [ ] **Task 5:** Select one Advisor recommendation and either implement it or dismiss it with a justification, then configure Advisor alerts named `alert-advisor-new-recs` to notify `ag-platform-notify` when new high-impact recommendations are available

## Skills Tested

- Configuring Azure Service Health alerts
- Understanding Service Health event types (issues, maintenance, advisories)
- Reviewing and acting on Azure Advisor recommendations
- Setting up Advisor alert notifications

## Verification Criteria

| #   | What to Check                         | Where in Portal                                              | How to Verify                                                            |
| --- | ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 1   | Resource group exists                 | Resource Groups > `RG-ServiceHealth-Lab`                     | Resource group is listed in East US                                      |
| 2   | Service Health alert exists           | Service Health > Health alerts                               | `alert-service-health-all` monitors 3 event types in East US + West US   |
| 3   | Action group is attached              | Monitor > Alerts > Action groups                             | `ag-platform-notify` exists with email to `platform-team@contoso.com`    |
| 4   | Advisor recommendations reviewed      | Advisor > Overview                                           | All five recommendation categories are visible with current counts       |
| 5   | Advisor alert configured              | Advisor > Alerts                                             | `alert-advisor-new-recs` exists and is linked to `ag-platform-notify`    |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

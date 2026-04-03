# Lab 06 — Log Analytics & Alerts

**Domain:** Monitoring & Backup  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-03

---

## Scenario

Your operations team needs centralized logging and alerting for the Azure environment. You must set up a Log Analytics workspace and create an alert rule to monitor resource health.

## Tasks

- [ ] **Task 1:** Create a **Log Analytics Workspace** named `LAW-Dev-Lab` in the **East US** region inside resource group `RG-Dev-Lab`
- [ ] **Task 2:** Create an **Action Group** named `AG-DevOps` in resource group `RG-Dev-Lab` with an email notification (use any email address)
- [ ] **Task 3:** Create an **Alert Rule** on the resource group `RG-Dev-Lab` that triggers when any resource is deleted (Activity Log alert, operation name: `Microsoft.Resources/subscriptions/resourceGroups/delete`)

## Skills Tested

- Log Analytics workspace creation
- Action group configuration with email notifications
- Activity log alert rules

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                                                         |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Log Analytics workspace `LAW-Dev-Lab` exists | `az monitor log-analytics workspace show --workspace-name LAW-Dev-Lab --resource-group RG-Dev-Lab --query "{name:name, location:location}" -o json` |
| 2   | Action group `AG-DevOps` exists              | `az monitor action-group show --name AG-DevOps --resource-group RG-Dev-Lab --query "{name:name, emailReceivers:emailReceivers}" -o json`            |
| 3   | Activity log alert rule exists               | `az monitor activity-log alert list --resource-group RG-Dev-Lab --query "[].{name:name, enabled:enabled}" -o json`                                  |

## Result

- **Status:** NOT STARTED

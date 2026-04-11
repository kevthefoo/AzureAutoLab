# Lab 98 — Azure Monitor Alerts Advanced

**Domain:** Monitoring & Backup  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization manages multiple VMs across several resource groups and needs a scalable alerting strategy. You need to create alerts that target multiple resources with a single rule, configure alert processing rules to suppress noisy alerts during maintenance windows, and set up severity-based routing to different action groups.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AlertsAdv-Lab` in East US with two VMs: `vm-alerts-web-01` and `vm-alerts-web-02` (both Ubuntu 22.04, Standard_B2s)
- [ ] **Task 2:** Create a multi-resource metric alert rule named `alert-multi-vm-cpu` that monitors "Percentage CPU > 85%" on both VMs simultaneously using the resource group as the scope
- [ ] **Task 3:** Create an action group named `ag-critical-alerts` with an email action to `sre-team@contoso.com`, then assign it to the alert rule with Severity 1 (Error)
- [ ] **Task 4:** Create an alert processing rule named `apr-maintenance-suppress` that suppresses all alerts in `RG-AlertsAdv-Lab` during a recurring weekly window (Saturday 22:00 to Sunday 06:00 UTC)
- [ ] **Task 5:** Create a second alert processing rule named `apr-add-devops-ag` that adds a webhook action group to all Severity 0 (Critical) alerts across the subscription

## Skills Tested

- Creating multi-resource metric alert rules
- Configuring alert processing rules for suppression
- Setting up maintenance window suppressions with schedules
- Applying action groups dynamically via alert processing rules

## Verification Criteria

| #   | What to Check                         | Where in Portal                                              | How to Verify                                                              |
| --- | ------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 1   | Both VMs exist                        | Virtual Machines                                             | `vm-alerts-web-01` and `vm-alerts-web-02` are running in `RG-AlertsAdv-Lab`|
| 2   | Multi-resource alert rule exists      | Monitor > Alerts > Alert rules                               | `alert-multi-vm-cpu` targets the resource group scope with both VMs        |
| 3   | Alert severity and action group set   | Monitor > Alerts > Alert rules > `alert-multi-vm-cpu`        | Severity is 1 (Error) and `ag-critical-alerts` is assigned                 |
| 4   | Suppression rule exists               | Monitor > Alerts > Alert processing rules                    | `apr-maintenance-suppress` shows Saturday 22:00–Sunday 06:00 UTC schedule  |
| 5   | Action group addition rule exists     | Monitor > Alerts > Alert processing rules                    | `apr-add-devops-ag` targets Severity 0 alerts at subscription scope        |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

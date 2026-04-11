# Lab 18 — Network Watcher & Diagnostics

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your network team needs tools to diagnose connectivity issues and monitor network traffic. You must configure Network Watcher and use its diagnostic tools.

## Tasks

- [ ] **Task 1:** Verify that **Network Watcher** is enabled in the **East US** region
- [ ] **Task 2:** Create an **NSG Flow Log** on your existing NSG, storing logs in your existing storage account with a retention of **7 days**
- [ ] **Task 3:** Run an **IP flow verify** test to check if TCP traffic on port 443 is allowed from the internet to your VM's private IP

## Skills Tested

- Network Watcher enablement and usage
- NSG flow log configuration
- IP flow verify diagnostics

## Verification Criteria

| #   | What to Check           | CLI Command                                                                                                                                       |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Network Watcher enabled | `az network watcher show --resource-group NetworkWatcherRG --query "{name:name, location:location, provisioningState:provisioningState}" -o json` |
| 2   | NSG flow log exists     | `az network watcher flow-log list --location eastus --query "[].{name:name, enabled:enabled, retentionDays:retentionPolicy.days}" -o json`        |
| 3   | IP flow verify result   | Manual verification — run the test and confirm the result shows Allow or Deny                                                                     |

## Result

- **Status:** NOT STARTED

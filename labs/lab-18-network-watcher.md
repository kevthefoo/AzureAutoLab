# Lab 18 — Network Watcher & Diagnostics

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your network team needs tools to diagnose connectivity issues and monitor network traffic. You must configure Network Watcher and use its diagnostic tools.

## Tasks

- [ ] **Task 1:** Verify that **Network Watcher** is enabled in the **East US** region
- [ ] **Task 2:** Create a **VNet Flow Log** on your existing virtual network, storing logs in your existing storage account with a retention of **7 days**
- [ ] **Task 3:** Create a **Connection Monitor** named `cm-web-check` that tests TCP connectivity from your VM to `www.microsoft.com` on port **443**

## Skills Tested

- Network Watcher enablement and usage
- VNet flow log configuration
- Connection Monitor configuration

## Verification Criteria

| #   | What to Check           | CLI Command                                                                                                                                       |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Network Watcher enabled | `az network watcher show --resource-group NetworkWatcherRG --query "{name:name, location:location, provisioningState:provisioningState}" -o json` |
| 2   | VNet flow log exists    | `az network watcher flow-log list --location eastus --query "[].{name:name, enabled:enabled, retentionDays:retentionPolicy.days}" -o json`        |
| 3   | Connection Monitor exists | `az network watcher connection-monitor list --location eastus --query "[?name=='cm-web-check'].{name:name, status:testGroups[0].destinations}" -o json` |

## Result

- **Status:** PARTIAL PASS (2/3)
- **Date Completed:** 2026-04-15
- **Notes:**
  - ✅ Task 1: Network Watcher `NetworkWatcher_eastus` is enabled in East US (provisioningState: Succeeded)
  - ✅ Task 2: VNet Flow Log `vnet-eastus-rg-dev-lab-flowlog` exists, enabled, with 7-day retention
  - ❌ Task 3: Connection Monitor `cm-web-check` not found — query returned empty in East US

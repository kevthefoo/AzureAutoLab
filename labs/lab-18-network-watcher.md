# Lab 18 — Network Watcher & Diagnostics

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  

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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
NW=$(az network watcher list --query "[?location=='eastus'] | length(@)" -o tsv 2>/dev/null)
if [ "${NW:-0}" -gt 0 ]; then echo "[PASS] Task 1: Network Watcher enabled in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: Network Watcher not enabled in eastus"; FAIL=$((FAIL+1)); fi

FL=$(az network watcher flow-log list --location eastus --query "[?enabled==\`true\`] | length(@)" -o tsv 2>/dev/null)
if [ "${FL:-0}" -gt 0 ]; then echo "[PASS] Task 2: $FL flow log(s) enabled in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no enabled flow logs in eastus"; FAIL=$((FAIL+1)); fi

CM=$(az network watcher connection-monitor list --location eastus --query "[?name=='cm-web-check'] | length(@)" -o tsv 2>/dev/null)
if [ "${CM:-0}" -gt 0 ]; then echo "[PASS] Task 3: connection monitor cm-web-check exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: connection monitor cm-web-check not found"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

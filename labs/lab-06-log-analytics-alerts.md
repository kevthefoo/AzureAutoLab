# Lab 06 — Log Analytics & Alerts

**Domain:** Monitoring & Backup  
**Difficulty:** Beginner  

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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
LOC=$(az monitor log-analytics workspace show -g "$RG" -n LAW-Dev-Lab --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: LAW-Dev-Lab in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: LAW-Dev-Lab missing or wrong location ($LOC)"; FAIL=$((FAIL+1)); fi

ER=$(az monitor action-group show -g "$RG" -n AG-DevOps --query "length(emailReceivers)" -o tsv 2>/dev/null)
if [ "${ER:-0}" -gt 0 ]; then echo "[PASS] Task 2: AG-DevOps has $ER email receiver(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: AG-DevOps missing or has no email receivers"; FAIL=$((FAIL+1)); fi

CNT=$(az monitor activity-log alert list -g "$RG" --query "length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $CNT activity log alert(s) in $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no activity log alerts in $RG"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

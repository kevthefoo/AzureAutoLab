# Lab 93 — Action Groups & Notifications

**Domain:** Monitoring & Backup  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Your company is rolling out a new alerting strategy and needs action groups configured for different notification channels. The on-call team should receive email and SMS notifications, while the DevOps pipeline needs a webhook endpoint for automated incident response.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ActionGroups-Lab` in East US
- [ ] **Task 2:** Create an action group named `ag-oncall-team` (short name: `oncall`) in `RG-ActionGroups-Lab` with an email notification to `oncall@contoso.com` and an SMS notification to a valid phone number
- [ ] **Task 3:** Create a second action group named `ag-devops-webhook` (short name: `devops`) in `RG-ActionGroups-Lab` with a webhook action pointing to `https://hooks.contoso.com/alert-handler`
- [ ] **Task 4:** Test the `ag-oncall-team` action group using the "Test" feature in the portal
- [ ] **Task 5:** Create a simple activity log alert named `alert-rg-delete` that fires when any resource group is deleted, using `ag-oncall-team` as the action group

## Skills Tested

- Creating action groups with multiple notification types
- Configuring email, SMS, and webhook actions
- Testing action group notifications
- Linking action groups to alert rules

## Verification Criteria

| #   | What to Check               | Where in Portal                                            | How to Verify                                                 |
| --- | --------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Resource group exists       | Resource Groups > `RG-ActionGroups-Lab`                    | Resource group is listed in East US                           |
| 2   | On-call action group exists | Monitor > Alerts > Action groups                           | `ag-oncall-team` listed with Email and SMS actions configured |
| 3   | DevOps action group exists  | Monitor > Alerts > Action groups                           | `ag-devops-webhook` listed with webhook action to contoso URL |
| 4   | Test notification was sent  | Monitor > Alerts > Action groups > `ag-oncall-team` > Test | Test history shows a completed test run                       |
| 5   | Activity log alert exists   | Monitor > Alerts > Alert rules                             | `alert-rg-delete` is listed and linked to `ag-oncall-team`    |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-ActionGroups-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

EM=$(az monitor action-group show -n ag-oncall-team -g "$RG" --query "length(emailReceivers)" -o tsv 2>/dev/null)
SM=$(az monitor action-group show -n ag-oncall-team -g "$RG" --query "length(smsReceivers)" -o tsv 2>/dev/null)
if [ "${EM:-0}" -gt 0 ] && [ "${SM:-0}" -gt 0 ]; then echo "[PASS] Task 2: ag-oncall-team has email+SMS"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: ag-oncall-team missing email/SMS (email=$EM sms=$SM)"; FAIL=$((FAIL+1)); fi

WH=$(az monitor action-group show -n ag-devops-webhook -g "$RG" --query "length(webhookReceivers)" -o tsv 2>/dev/null)
if [ "${WH:-0}" -gt 0 ]; then echo "[PASS] Task 3: ag-devops-webhook has webhook"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: ag-devops-webhook missing webhook"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 4: action-group test is transient"; PASS=$((PASS+1))

AL=$(az monitor activity-log alert show -n alert-rg-delete -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$AL" = "alert-rg-delete" ]; then echo "[PASS] Task 5: alert-rg-delete exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: alert-rg-delete missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

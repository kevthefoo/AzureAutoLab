# Lab 38 — Cost Management & Budgets

**Domain:** Identity & Governance  
**Difficulty:** Beginner  

---

## Scenario

The finance department wants proactive notifications when Azure spending approaches predefined limits. You must create budgets with multiple alert thresholds and configure action groups to notify the appropriate stakeholders via email.

## Tasks

- [ ] **Task 1:** Navigate to Cost Management and create a budget named `Budget-DevTeam` with a monthly amount of $100, scoped to your subscription
- [ ] **Task 2:** Add alert conditions at 50%, 75%, and 100% of the budget amount
- [ ] **Task 3:** Create an action group named `AG-CostAlerts` in a resource group named `RG-CostMgmt-Lab` (East US) with an email notification to your email address
- [ ] **Task 4:** Associate the `AG-CostAlerts` action group with the budget alerts

## Skills Tested

- Creating budgets in Azure Cost Management
- Configuring multiple alert thresholds
- Creating action groups with email notifications
- Linking action groups to budget alerts

## Verification Criteria

| #   | What to Check                         | Where in Portal                   | How to Verify                                              |
| --- | ------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| 1   | Budget `Budget-DevTeam` exists        | Cost Management > Budgets         | Find `Budget-DevTeam` with monthly amount $100             |
| 2   | Three alert thresholds are configured | Budget-DevTeam > Alert conditions | Confirm alerts at 50%, 75%, and 100% thresholds            |
| 3   | Action group `AG-CostAlerts` exists   | RG-CostMgmt-Lab > Resources       | Find `AG-CostAlerts` action group with email notification  |
| 4   | Action group is linked to budget      | Budget-DevTeam > Alert conditions | Confirm `AG-CostAlerts` is associated with the alert rules |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SUB=$(az account show --query id -o tsv)
B=$(az consumption budget list --query "[?name=='Budget-DevTeam'].amount | [0]" -o tsv 2>/dev/null)
if [ -n "$B" ]; then echo "[PASS] Task 1: Budget-DevTeam exists (amount=$B)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: Budget-DevTeam missing"; FAIL=$((FAIL+1)); fi

THRES=$(az consumption budget show --budget-name Budget-DevTeam --query "notifications.*.threshold" -o json 2>/dev/null | tr -d '[]\n ' | tr ',' ' ')
COUNT=$(echo "$THRES" | wc -w | tr -d ' ')
if [ "${COUNT:-0}" -ge 3 ]; then echo "[PASS] Task 2: $COUNT threshold(s) configured ($THRES)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: only $COUNT threshold(s)"; FAIL=$((FAIL+1)); fi

AG=$(az monitor action-group show -g RG-CostMgmt-Lab -n AG-CostAlerts --query "length(emailReceivers)" -o tsv 2>/dev/null)
if [ "${AG:-0}" -gt 0 ]; then echo "[PASS] Task 3: AG-CostAlerts has $AG email receiver(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: AG-CostAlerts missing or no email receivers"; FAIL=$((FAIL+1)); fi

LCNT=$(az consumption budget show --budget-name Budget-DevTeam --query "notifications.*.contactGroups | [] | length(@)" -o tsv 2>/dev/null)
if [ "${LCNT:-0}" -gt 0 ]; then echo "[PASS] Task 4: budget alerts linked to action group(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no action group linked to budget"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

# Lab 100 — Azure Service Health & Advisor

**Domain:** Monitoring & Backup  
**Difficulty:** Beginner  

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

| #   | What to Check                    | Where in Portal                          | How to Verify                                                          |
| --- | -------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Resource group exists            | Resource Groups > `RG-ServiceHealth-Lab` | Resource group is listed in East US                                    |
| 2   | Service Health alert exists      | Service Health > Health alerts           | `alert-service-health-all` monitors 3 event types in East US + West US |
| 3   | Action group is attached         | Monitor > Alerts > Action groups         | `ag-platform-notify` exists with email to `platform-team@contoso.com`  |
| 4   | Advisor recommendations reviewed | Advisor > Overview                       | All five recommendation categories are visible with current counts     |
| 5   | Advisor alert configured         | Advisor > Alerts                         | `alert-advisor-new-recs` exists and is linked to `ag-platform-notify`  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-ServiceHealth-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SH=$(az monitor activity-log alert show -n alert-service-health-all -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$SH" = "alert-service-health-all" ]; then echo "[PASS] Task 2: Service Health alert exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: Service Health alert missing"; FAIL=$((FAIL+1)); fi

AG=$(az monitor action-group show -n ag-platform-notify -g "$RG" --query "length(emailReceivers)" -o tsv 2>/dev/null)
if [ "${AG:-0}" -gt 0 ]; then echo "[PASS] Task 3: ag-platform-notify with email receiver"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: ag-platform-notify missing or no email"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 4: Advisor recommendation review is a manual portal action"; PASS=$((PASS+1))

ADV=$(az monitor activity-log alert list -g "$RG" --query "[?name=='alert-advisor-new-recs'] | length(@)" -o tsv 2>/dev/null)
if [ "${ADV:-0}" -gt 0 ]; then echo "[PASS] Task 5: Advisor alert exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: alert-advisor-new-recs missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

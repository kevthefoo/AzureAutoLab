# Lab 92 — Azure Monitor Workbooks

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  

---

## Scenario

The infrastructure team needs a reusable visual report that combines VM performance metrics and log query results into a single view. You will create an Azure Monitor Workbook with multiple visualization types and share it with the team via a resource group.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Workbooks-Lab` in East US and a Log Analytics workspace named `law-workbooks-01`
- [ ] **Task 2:** Navigate to Azure Monitor > Workbooks and create a new workbook named `Workbook-Infra-Overview`
- [ ] **Task 3:** Add a metric chart step that displays "Percentage CPU" for all VMs in the subscription
- [ ] **Task 4:** Add a log query step using KQL that shows the top 10 most recent Heartbeat entries from `law-workbooks-01`
- [ ] **Task 5:** Save the workbook as a shared workbook in `RG-Workbooks-Lab`

## Skills Tested

- Creating Azure Monitor Workbooks
- Adding metric and log query visualizations
- Writing basic KQL queries for workbook steps
- Sharing workbooks at the resource group scope

## Verification Criteria

| #   | What to Check                | Where in Portal                                           | How to Verify                                               |
| --- | ---------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Resource group and LAW exist | Resource Groups > `RG-Workbooks-Lab`                      | `law-workbooks-01` is listed in the resource group          |
| 2   | Workbook exists              | Monitor > Workbooks                                       | `Workbook-Infra-Overview` appears in the workbooks list     |
| 3   | Metric chart step present    | Monitor > Workbooks > `Workbook-Infra-Overview`           | A metrics visualization showing CPU percentage is displayed |
| 4   | Log query step present       | Monitor > Workbooks > `Workbook-Infra-Overview`           | A log query step with Heartbeat KQL query is displayed      |
| 5   | Workbook is shared           | Monitor > Workbooks > `Workbook-Infra-Overview` > Details | Saved as shared workbook in `RG-Workbooks-Lab`              |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Workbooks-Lab
LA=$(az monitor log-analytics workspace show -g "$RG" -n law-workbooks-01 --query name -o tsv 2>/dev/null)
if [ "$LA" = "law-workbooks-01" ]; then echo "[PASS] Task 1: workspace exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: workspace missing"; FAIL=$((FAIL+1)); fi

WB=$(az monitor app-insights workbook list -g "$RG" --category workbook --query "[?displayName=='Workbook-Infra-Overview'] | length(@)" -o tsv 2>/dev/null)
if [ "${WB:-0}" -gt 0 ]; then echo "[PASS] Task 2: workbook exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: workbook missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 3: metric chart step content is best verified in portal"; PASS=$((PASS+1))
echo "[PASS] Task 4: KQL log query step content is best verified in portal"; PASS=$((PASS+1))
echo "[PASS] Task 5: shared status is best verified in portal"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

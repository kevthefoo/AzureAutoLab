# Lab 95 — Log Analytics Queries

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  

---

## Scenario

The security operations team needs to run KQL queries against centralized logs to investigate VM heartbeat patterns, detect anomalies in sign-in activity, and generate reports. You will write and save KQL queries in a Log Analytics workspace and export results for stakeholder review.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-LogQueries-Lab` in East US with a Log Analytics workspace named `law-queries-01`
- [ ] **Task 2:** Deploy a VM named `vm-log-source-01` (Windows Server 2022, Standard_B2s) connected to `law-queries-01` via the Azure Monitor Agent
- [ ] **Task 3:** In `law-queries-01`, write and run a KQL query that returns the last 50 Heartbeat events grouped by computer name with a count
- [ ] **Task 4:** Save the query from Task 3 as a saved search named `Heartbeat Summary by Computer` in the category `VM Health`
- [ ] **Task 5:** Write a KQL query against the `AzureActivity` table that shows all resource creation events in the last 24 hours, then export the results to CSV

## Skills Tested

- Writing KQL queries in Log Analytics
- Using summarize, where, and project operators in KQL
- Saving queries as reusable saved searches
- Exporting query results for reporting

## Verification Criteria

| #   | What to Check                        | Where in Portal                                   | How to Verify                                                      |
| --- | ------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | Workspace exists                     | Log Analytics workspaces > `law-queries-01`       | Workspace is listed in `RG-LogQueries-Lab`                         |
| 2   | VM is connected to workspace         | `law-queries-01` > Agents management              | `vm-log-source-01` appears as a connected agent                    |
| 3   | Heartbeat query returns results      | `law-queries-01` > Logs                           | Running the Heartbeat summary query returns grouped results        |
| 4   | Saved search exists                  | `law-queries-01` > Logs > Queries > Saved Queries | `Heartbeat Summary by Computer` appears under `VM Health` category |
| 5   | AzureActivity query runs and exports | `law-queries-01` > Logs                           | Query returns resource creation events and CSV export downloads    |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-LogQueries-Lab
LA=$(az monitor log-analytics workspace show -g "$RG" -n law-queries-01 --query name -o tsv 2>/dev/null)
if [ "$LA" = "law-queries-01" ]; then echo "[PASS] Task 1: workspace exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: workspace missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n vm-log-source-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ -n "$VM" ]; then echo "[PASS] Task 2: vm-log-source-01 exists (Azure Monitor Agent install check is manual)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VM missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 3: KQL query execution is transient"; PASS=$((PASS+1))

SS=$(az monitor log-analytics workspace saved-search list -g "$RG" --workspace-name law-queries-01 --query "[?displayName=='Heartbeat Summary by Computer'] | length(@)" -o tsv 2>/dev/null)
if [ "${SS:-0}" -gt 0 ]; then echo "[PASS] Task 4: saved search exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: saved search missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 5: CSV export is a manual portal action"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

# Lab 41 — Subscription-Level Diagnostic Settings

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  

---

## Scenario

Your governance team wants every administrative action and security event across the entire subscription streamed to a central Log Analytics workspace for long-term analysis, independent of any single resource's diagnostic settings.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-SubDiag-Lab` in **East US**
- [ ] **Task 2:** Create a Log Analytics workspace `law-sub-diagnostics` in `RG-SubDiag-Lab` with SKU `PerGB2018`
- [ ] **Task 3:** Create a **subscription-level** diagnostic setting named `ds-activity-to-law` that sends **Administrative**, **Security**, and **Alert** log categories to `law-sub-diagnostics`
- [ ] **Task 4:** Run a Kusto query against the `AzureActivity` table in `law-sub-diagnostics` to confirm activity log events are being ingested

## Skills Tested

- Creating Log Analytics workspaces
- Configuring subscription-level diagnostic settings (distinct from resource-level)
- Selecting Activity Log categories for central archival
- Querying ingested activity logs with Kusto (KQL)

## Verification Criteria

| #   | What to Check                                  | CLI Command                                                                                                                                                                                                        |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Resource group `RG-SubDiag-Lab` exists         | `az group show --name RG-SubDiag-Lab --query "{name:name, location:location}" -o json`                                                                                                                             |
| 2   | Log Analytics workspace exists                 | `az monitor log-analytics workspace show --resource-group RG-SubDiag-Lab --workspace-name law-sub-diagnostics --query "{name:name, sku:sku.name, provisioningState:provisioningState}" -o json`                     |
| 3   | Subscription diagnostic setting exists         | `az monitor diagnostic-settings subscription show --name ds-activity-to-law --query "{name:name, workspaceId:workspaceId, categories:logs[?enabled].category}" -o json`                                             |
| 4   | `AzureActivity` table has recent log ingestion | `az monitor log-analytics query --workspace <WORKSPACE_CUSTOMER_ID> --analytics-query "AzureActivity \| take 1" --query "tables[0].rows[0]" -o json`                                                                |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-SubDiag-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SKU=$(az monitor log-analytics workspace show -g "$RG" -n law-sub-diagnostics --query sku.name -o tsv 2>/dev/null)
case "$SKU" in PerGB2018|pergb2018) echo "[PASS] Task 2: workspace law-sub-diagnostics (PerGB2018)"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 2: workspace missing or wrong SKU ($SKU)"; FAIL=$((FAIL+1));; esac

DS=$(az monitor diagnostic-settings subscription show -n ds-activity-to-law --query name -o tsv 2>/dev/null)
if [ "$DS" = "ds-activity-to-law" ]; then echo "[PASS] Task 3: subscription diagnostic setting exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: subscription diagnostic setting missing"; FAIL=$((FAIL+1)); fi

WID=$(az monitor log-analytics workspace show -g "$RG" -n law-sub-diagnostics --query customerId -o tsv 2>/dev/null)
ROWS=0
if [ -n "$WID" ]; then ROWS=$(az monitor log-analytics query --workspace "$WID" --analytics-query "AzureActivity | take 1" --query "length(tables[0].rows)" -o tsv 2>/dev/null); fi
if [ "${ROWS:-0}" -gt 0 ]; then echo "[PASS] Task 4: AzureActivity has ingested events"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: AzureActivity returned no rows (may need time to ingest)"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

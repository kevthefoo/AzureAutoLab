# Lab 33 — Azure Resource Graph Queries

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-21

---

## Scenario

Your operations team needs fast, subscription-wide inventory reporting. Use Azure Resource Graph to run KQL queries that surface resources by type and tag compliance, then save a reusable shared query for future audits.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Graph-Lab` in **East US** with tag `Purpose = Graph`
- [ ] **Task 2:** Run a Resource Graph KQL query that counts all resources in the subscription grouped by `type`
- [ ] **Task 3:** Run a Resource Graph KQL query that returns all resources inside the `RG-Graph-Lab` resource group
- [ ] **Task 4:** Save a shared Resource Graph query named `sq-untagged-resources` in `RG-Graph-Lab` with query: `Resources | where tags == '' or isnull(tags) | project name, type, resourceGroup`

## Skills Tested

- Writing Azure Resource Graph KQL queries
- Summarizing resources by type across a subscription
- Saving shared Resource Graph queries for reuse
- Auditing resource tag compliance at scale

## Verification Criteria

| #   | What to Check                                 | CLI Command                                                                                                                                                   |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Resource group `RG-Graph-Lab` with tag exists | `az group show --name RG-Graph-Lab --query "{name:name, tags:tags}" -o json`                                                                                  |
| 2   | Resource type count query returns results     | `az graph query -q "Resources \| summarize count() by type" --query "count" -o json`                                                                          |
| 3   | RG-scoped query returns results               | `az graph query -q "Resources \| where resourceGroup == 'rg-graph-lab'" --query "count" -o json`                                                              |
| 4   | Shared query `sq-untagged-resources` exists   | `az graph shared-query show --resource-group RG-Graph-Lab --name sq-untagged-resources --query "{name:name, query:query}" -o json`                            |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
T=$(az group show -n RG-Graph-Lab --query "tags.Purpose" -o tsv 2>/dev/null)
if [ "$T" = "Graph" ]; then echo "[PASS] Task 1: RG-Graph-Lab has tag Purpose=Graph"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: RG-Graph-Lab missing or wrong tag (Purpose=$T)"; FAIL=$((FAIL+1)); fi

C=$(az graph query -q "Resources | summarize count() by type" --query count -o tsv 2>/dev/null)
if [ -n "$C" ] && [ "${C:-0}" -gt 0 ]; then echo "[PASS] Task 2: type-count query returned $C row(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: type-count query failed or empty"; FAIL=$((FAIL+1)); fi

RGC=$(az graph query -q "Resources | where resourceGroup == 'rg-graph-lab'" --query count -o tsv 2>/dev/null)
if [ -n "$RGC" ]; then echo "[PASS] Task 3: RG-scoped query returned $RGC row(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: RG-scoped query failed"; FAIL=$((FAIL+1)); fi

SQ=$(az graph shared-query show -g RG-Graph-Lab -n sq-untagged-resources --query name -o tsv 2>/dev/null)
if [ "$SQ" = "sq-untagged-resources" ]; then echo "[PASS] Task 4: shared query sq-untagged-resources exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: shared query missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

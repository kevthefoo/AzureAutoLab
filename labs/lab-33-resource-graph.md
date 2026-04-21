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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

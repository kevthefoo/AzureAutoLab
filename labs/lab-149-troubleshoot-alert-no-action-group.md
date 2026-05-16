# Lab 149 — Troubleshoot Alert With No Action Group

**Domain:** Monitoring & Backup
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

Metric alert `alert-ts149-tx` in `RG-TS-149` is firing, but the team isn't getting notifications. The alert has **no action group** attached, so nothing happens when it triggers. Attach the existing action group `ag-ts149`.

## Tasks

- [ ] **Task 1:** Read the alert's `actions.actionGroups` list
- [ ] **Task 2:** Attach action group `ag-ts149` to the alert
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-149; TAG="AutoLabId=149"
SA="stautolab149$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
SID=$(az storage account show -n "$SA" -g "$RG" --query id -o tsv)
az monitor action-group create -g "$RG" -n ag-ts149 --short-name ts149 --tags "$TAG" >/dev/null
az monitor metrics alert create -g "$RG" -n alert-ts149-tx --scopes "$SID" \
  --condition "total Transactions > 1000000" --description "no-action-group demo" --severity 2 >/dev/null
echo "Setup complete. alert-ts149-tx has no action groups attached."
```

## Skills Tested

- Inspecting alert action groups
- Attaching an action group via portal Alert details > Actions

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                          |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 1   | Alert still exists                         | `az monitor metrics alert show -g RG-TS-149 -n alert-ts149-tx --query name -o tsv`                    |
| 2   | Alert has at least one action group        | `az monitor metrics alert show -g RG-TS-149 -n alert-ts149-tx --query "actions" -o json`              |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
EXISTS=$(az monitor metrics alert show -g RG-TS-149 -n alert-ts149-tx --query name -o tsv 2>/dev/null)
if [ -n "$EXISTS" ]; then echo "[PASS] Task 1: alert alert-ts149-tx exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: alert not found"; FAIL=$((FAIL+1)); fi

COUNT=$(az monitor metrics alert show -g RG-TS-149 -n alert-ts149-tx --query "length(actions)" -o tsv 2>/dev/null)
if [ "${COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: alert has at least one action group"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: alert has no action groups attached"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-149 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=149 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

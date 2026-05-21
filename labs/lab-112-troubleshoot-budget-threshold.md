# Lab 112 — Troubleshoot Budget Alert Threshold

**Domain:** Identity & Governance
**Difficulty:** Beginner

---

## Scenario

A consumption budget `budget-ts112` is configured at the `RG-TS-112` scope, but FinOps reports that the team only hears about overruns after the bill arrives. The current notification threshold is 99% of the amount, which fires too late to act. Lower the threshold so notifications fire earlier (50%).

## Tasks

- [ ] **Task 1:** Locate the budget on `RG-TS-112` and read its notification threshold
- [ ] **Task 2:** Update the budget so notifications fire at **50% of actual cost** (instead of 99%)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-112
TAG="AutoLabId=112"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

# Register the Consumption provider in case it isn't already
az provider register --namespace Microsoft.Consumption --wait

# Budget end date one year out (required by API)
END=$(date -d "+12 months" +"%Y-%m-01 00:00:00.000000+00:00" 2>/dev/null || date -v+12m +"%Y-%m-01 00:00:00.000000+00:00")
START=$(date +"%Y-%m-01 00:00:00.000000+00:00")

cat > /tmp/ts112-period.json <<JSON
{"start-date": "$START", "end-date": "$END"}
JSON

az consumption budget create-with-rg --resource-group "$RG" \
  --budget-name "budget-ts112" \
  --amount 50 --time-grain Monthly --category Cost \
  --time-period @/tmp/ts112-period.json \
  --notifications '{"NotifyAt99":{"enabled":true,"operator":"GreaterThan","threshold":99,"contactEmails":["finops@contoso.local"]}}' >/dev/null \
  || echo "(budget API can be picky; if this errored, recreate via portal — Cost Management + Billing > Budgets)"

echo "Setup complete. Budget threshold is 99% (too late)."
```

## Skills Tested

- Locating budgets in the Cost Management blade
- Editing budget notification thresholds

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                                                  |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Budget `budget-ts112` exists on `RG-TS-112`  | `az consumption budget show --budget-name budget-ts112 --resource-group RG-TS-112 --query name -o tsv`                                        |
| 2   | At least one notification threshold ≤ 50     | `az consumption budget show --budget-name budget-ts112 --resource-group RG-TS-112 --query "notifications.*.threshold" -o json`                |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
NAME=$(az consumption budget show --budget-name budget-ts112 --resource-group RG-TS-112 --query name -o tsv 2>/dev/null)
if [ "$NAME" = "budget-ts112" ]; then echo "[PASS] Task 1: budget budget-ts112 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: budget budget-ts112 not found"; FAIL=$((FAIL+1)); fi

MIN=$(az consumption budget show --budget-name budget-ts112 --resource-group RG-TS-112 --query "notifications.*.threshold | min(@)" -o tsv 2>/dev/null)
if [ -n "$MIN" ] && [ "${MIN%.*}" -le 50 ]; then echo "[PASS] Task 2: lowest notification threshold is $MIN (<= 50)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: lowest notification threshold is '$MIN' (expected <= 50)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az consumption budget delete --budget-name budget-ts112 --resource-group RG-TS-112 2>/dev/null || true
az group delete -n RG-TS-112 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=112 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

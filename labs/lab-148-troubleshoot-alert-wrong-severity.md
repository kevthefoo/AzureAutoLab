# Lab 148 — Troubleshoot Metric Alert Wrong Severity

**Domain:** Monitoring & Backup
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

The alert `alert-ts148-cpu` in `RG-TS-148` fires when a host hits high CPU, but the team's incident system only routes severity **0** (Critical) and **1** (Error) to PagerDuty. This alert is currently severity **3** (Informational) so it never pages. Lower the severity to **1**.

## Tasks

- [ ] **Task 1:** Read the alert's current severity
- [ ] **Task 2:** Update the alert to severity `1`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-148; TAG="AutoLabId=148"
SA="stautolab148$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
SID=$(az storage account show -n "$SA" -g "$RG" --query id -o tsv)
# Use a metric guaranteed to exist on storage accounts
az monitor metrics alert create -g "$RG" -n alert-ts148-cpu --scopes "$SID" \
  --condition "total Transactions > 1000000" --description "Bad severity demo" --severity 3 >/dev/null
echo "Setup complete. alert-ts148-cpu severity=3."
```

## Skills Tested

- Reading metric alert severity
- Updating via portal Alerts > Alert rules

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                              |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Alert `alert-ts148-cpu` still exists       | `az monitor metrics alert show -g RG-TS-148 -n alert-ts148-cpu --query name -o tsv`                       |
| 2   | Alert severity is ≤ 1                      | `az monitor metrics alert show -g RG-TS-148 -n alert-ts148-cpu --query severity -o tsv`                   |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-148 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=148 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

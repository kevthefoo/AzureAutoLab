# Lab 147 — Troubleshoot Action Group Has No Receivers

**Domain:** Monitoring & Backup
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

An action group `ag-ts147` in `RG-TS-147` is attached to several metric alerts, but when alerts fire, no one is notified. The group has no email or SMS receivers configured. Add an **email receiver** named `oncall` with address `oncall@contoso.local`.

## Tasks

- [ ] **Task 1:** List the action group's current receivers
- [ ] **Task 2:** Add an email receiver named `oncall` with address `oncall@contoso.local`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-147; TAG="AutoLabId=147"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az monitor action-group create -g "$RG" -n ag-ts147 --short-name ts147 --tags "$TAG" >/dev/null
echo "Setup complete. ag-ts147 has zero receivers."
```

## Skills Tested

- Reading action group receivers via portal Action groups blade
- Adding email receivers

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                              |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Action group `ag-ts147` still exists       | `az monitor action-group show -g RG-TS-147 -n ag-ts147 --query name -o tsv`                              |
| 2   | At least one email receiver is configured  | `az monitor action-group show -g RG-TS-147 -n ag-ts147 --query "emailReceivers" -o json`                  |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-147 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=147 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

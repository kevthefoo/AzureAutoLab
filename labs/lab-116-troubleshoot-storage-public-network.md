# Lab 116 — Troubleshoot Storage Public Network Access

**Domain:** Storage
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

Developers can't reach a storage account in `RG-TS-116` from their laptops *or* from Azure services. Even after adding their IP to the firewall they still get network errors. The account's **Public network access** setting was switched to `Disabled` last week (separate from the firewall rules) — flip it back on so the firewall rules even apply.

## Tasks

- [ ] **Task 1:** Read the storage account's `publicNetworkAccess` property
- [ ] **Task 2:** Set `publicNetworkAccess` to `Enabled` (network ACLs will then take effect)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-116; TAG="AutoLabId=116"
SA="stautolab116$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --public-network-access Disabled --tags "$TAG" >/dev/null
echo "Setup complete. $SA has publicNetworkAccess=Disabled."
```

## Skills Tested

- Reading `publicNetworkAccess` (separate from `networkRuleSet`)
- Toggling via portal Networking blade

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | Lab storage account still exists             | `az storage account list --query "[?tags.AutoLabId=='116'].name" -o tsv`                    |
| 2   | `publicNetworkAccess` is `Enabled`           | `az storage account list --query "[?tags.AutoLabId=='116'].publicNetworkAccess" -o tsv`     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az storage account list --query "[?tags.AutoLabId=='116'].name | [0]" -o tsv)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account exists ($SA)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account tagged AutoLabId=116"; FAIL=$((FAIL+1)); fi

PNA=$(az storage account list --query "[?tags.AutoLabId=='116'].publicNetworkAccess | [0]" -o tsv)
if [ "$PNA" = "Enabled" ]; then echo "[PASS] Task 2: publicNetworkAccess is Enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: publicNetworkAccess is '$PNA' (expected Enabled)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-116 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=116 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

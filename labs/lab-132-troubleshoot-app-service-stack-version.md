# Lab 132 — Troubleshoot Function App Outdated Node Version

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

`func-ts132-<random>` (Windows Function App) was provisioned with `WEBSITE_NODE_DEFAULT_VERSION=~14`, which is end-of-life. The team needs to upgrade to `~20` or newer. Update the app setting.

## Tasks

- [ ] **Task 1:** Inspect the `WEBSITE_NODE_DEFAULT_VERSION` app setting on the Function App
- [ ] **Task 2:** Update it to `~20` (or newer LTS)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-132; TAG="AutoLabId=132"
SA="stautolab132$(date +%s | tail -c 7)"
FUNC="func-ts132-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
# Downgrade Node version app setting
az functionapp config appsettings set -n "$FUNC" -g "$RG" --settings WEBSITE_NODE_DEFAULT_VERSION="~14" >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" >/dev/null
echo "Setup complete. $FUNC WEBSITE_NODE_DEFAULT_VERSION=~14."
```

## Skills Tested

- Reading Function App app settings
- Updating `WEBSITE_NODE_DEFAULT_VERSION` via portal Configuration blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                            |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists              | `f=$(az group show -n RG-TS-132 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-132 --query name -o tsv`            |
| 2   | `WEBSITE_NODE_DEFAULT_VERSION` is `~20` or newer | `f=$(az group show -n RG-TS-132 --query tags.FuncName -o tsv); az functionapp config appsettings list -n "$f" -g RG-TS-132 --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION'].value" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
F=$(az group show -n RG-TS-132 --query tags.FuncName -o tsv 2>/dev/null)
EXISTS=$(az functionapp show -n "$F" -g RG-TS-132 --query name -o tsv 2>/dev/null)
if [ -n "$EXISTS" ]; then echo "[PASS] Task 1: Function App $F exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: Function App not found"; FAIL=$((FAIL+1)); fi

V=$(az functionapp config appsettings list -n "$F" -g RG-TS-132 --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION'].value | [0]" -o tsv 2>/dev/null)
# Accept ~20 and above (numeric compare on the major)
MAJOR="${V#~}"; MAJOR="${MAJOR%%.*}"
if [ -n "$MAJOR" ] && [ "$MAJOR" -ge 20 ] 2>/dev/null; then echo "[PASS] Task 2: WEBSITE_NODE_DEFAULT_VERSION is $V (>= ~20)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: WEBSITE_NODE_DEFAULT_VERSION is '$V' (expected ~20 or newer)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-132 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=132 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 125 — Troubleshoot Function App HTTPS-Only Off

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

A new Function App `func-ts125-<random>` in `RG-TS-125` is accepting calls over plain HTTP. Security policy requires all Function Apps to redirect HTTP to HTTPS. Flip the **HTTPS Only** setting.

## Tasks

- [ ] **Task 1:** Find the Function App and inspect its `httpsOnly` property
- [ ] **Task 2:** Set `httpsOnly` to `true`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-125; TAG="AutoLabId=125"
SA="stautolab125$(date +%s | tail -c 7)"
FUNC="func-ts125-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
az functionapp update -n "$FUNC" -g "$RG" --set httpsOnly=false >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" >/dev/null
echo "Setup complete. Function App $FUNC has httpsOnly=false."
```

## Skills Tested

- Reading `httpsOnly` on a Function App
- Updating it via portal TLS/SSL settings blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                              |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists              | `f=$(az group show -n RG-TS-125 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-125 --query name -o tsv` |
| 2   | `httpsOnly` is `true`                      | `f=$(az group show -n RG-TS-125 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-125 --query httpsOnly -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-125 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=125 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

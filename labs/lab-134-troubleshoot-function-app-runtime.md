# Lab 134 — Troubleshoot Function App Wrong Worker Runtime

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A new Function App `func-ts134-<random>` deploys Node.js functions but fails to start with `The 'FUNCTIONS_WORKER_RUNTIME' setting is 'python'`. The app setting was mis-typed during provisioning. Update the app setting so the runtime is `node` to match the code.

## Tasks

- [ ] **Task 1:** Inspect the Function App's `FUNCTIONS_WORKER_RUNTIME` app setting
- [ ] **Task 2:** Change `FUNCTIONS_WORKER_RUNTIME` to `node`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-134; TAG="AutoLabId=134"
SA="stautolab134$(date +%s | tail -c 7)"
FUNC="func-ts134-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
# Override the worker runtime to mismatched value
az functionapp config appsettings set -n "$FUNC" -g "$RG" --settings FUNCTIONS_WORKER_RUNTIME=python >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" >/dev/null
echo "Setup complete. Function App $FUNC has FUNCTIONS_WORKER_RUNTIME=python (mismatch)."
```

## Skills Tested

- Reading Function App application settings
- Editing FUNCTIONS_WORKER_RUNTIME via portal Configuration blade

## Verification Criteria

| #   | What to Check                                            | CLI Command                                                                                                                            |
| --- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists                            | `f=$(az group show -n RG-TS-134 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-134 --query name -o tsv`            |
| 2   | `FUNCTIONS_WORKER_RUNTIME` is `node`                     | `f=$(az group show -n RG-TS-134 --query tags.FuncName -o tsv); az functionapp config appsettings list -n "$f" -g RG-TS-134 --query "[?name=='FUNCTIONS_WORKER_RUNTIME'].value" -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-134 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=134 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 127 — Troubleshoot Function App Functions Version

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

`func-ts127-<random>` was provisioned with the **Functions v3 runtime**, which is end-of-life. Microsoft requires apps to upgrade to **v4**. Update the `FUNCTIONS_EXTENSION_VERSION` app setting from `~3` to `~4`.

## Tasks

- [ ] **Task 1:** Inspect the `FUNCTIONS_EXTENSION_VERSION` app setting
- [ ] **Task 2:** Update it to `~4`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-127; TAG="AutoLabId=127"
SA="stautolab127$(date +%s | tail -c 7)"
FUNC="func-ts127-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
# Downgrade the runtime version pin to ~3
az functionapp config appsettings set -n "$FUNC" -g "$RG" --settings FUNCTIONS_EXTENSION_VERSION="~3" >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" >/dev/null
echo "Setup complete. $FUNC FUNCTIONS_EXTENSION_VERSION=~3."
```

## Skills Tested

- Reading Function App app settings
- Updating `FUNCTIONS_EXTENSION_VERSION` via portal Configuration blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                            |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists              | `f=$(az group show -n RG-TS-127 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-127 --query name -o tsv`            |
| 2   | `FUNCTIONS_EXTENSION_VERSION` is `~4`      | `f=$(az group show -n RG-TS-127 --query tags.FuncName -o tsv); az functionapp config appsettings list -n "$f" -g RG-TS-127 --query "[?name=='FUNCTIONS_EXTENSION_VERSION'].value" -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-127 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=127 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 131 — Troubleshoot Function App Missing Managed Identity

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

The team wants `func-ts131-<random>` in `RG-TS-131` to read secrets from Key Vault using Key Vault references, but every reference resolves to "Key vault reference was not able to be resolved." The Function App has no managed identity. Enable the **system-assigned managed identity** on the Function App.

## Tasks

- [ ] **Task 1:** Inspect the Function App's `identity` property
- [ ] **Task 2:** Enable system-assigned managed identity
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-131; TAG="AutoLabId=131"
SA="stautolab131$(date +%s | tail -c 7)"
FUNC="func-ts131-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" >/dev/null
echo "Setup complete. Function App $FUNC has no managed identity."
```

## Skills Tested

- Reading `identity.type` on a Function App
- Enabling system-assigned identity via portal Identity blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists              | `f=$(az group show -n RG-TS-131 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-131 --query name -o tsv` |
| 2   | A system-assigned managed identity is set  | `f=$(az group show -n RG-TS-131 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-131 --query identity.type -o tsv` |

A correct fix returns `SystemAssigned` (or `SystemAssigned, UserAssigned`).

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-131 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=131 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

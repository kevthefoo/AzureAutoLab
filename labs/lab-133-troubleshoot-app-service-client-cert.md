# Lab 133 — Troubleshoot Function App Client Cert Auth Enabled

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

Clients calling `func-ts133-<random>` keep getting TLS handshake errors and most requests fail. The Function App has **incoming client certificate** authentication required, but the team never intended to require client certs. Disable client cert auth.

## Tasks

- [ ] **Task 1:** Inspect the Function App's `clientCertEnabled` property
- [ ] **Task 2:** Disable client cert auth
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-133; TAG="AutoLabId=133"
SA="stautolab133$(date +%s | tail -c 7)"
FUNC="func-ts133-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
az functionapp update -n "$FUNC" -g "$RG" --set clientCertEnabled=true clientCertMode=Required >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" >/dev/null
echo "Setup complete. $FUNC has clientCertEnabled=true clientCertMode=Required."
```

## Skills Tested

- Reading `clientCertEnabled` and `clientCertMode`
- Disabling client cert auth via portal Configuration > General settings

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                              |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists              | `f=$(az group show -n RG-TS-133 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-133 --query name -o tsv` |
| 2   | `clientCertEnabled` is `false`             | `f=$(az group show -n RG-TS-133 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-133 --query clientCertEnabled -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-133 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=133 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

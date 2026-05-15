# Lab 131 — Troubleshoot App Service Missing Managed Identity

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

The team wants to use Key Vault references in app settings on `app-ts131-<random>`, but every reference resolves to "Key vault reference was not able to be resolved" — App Service doesn't have an identity to authenticate with. Enable the **system-assigned managed identity** on the web app.

## Tasks

- [ ] **Task 1:** Inspect the web app's `identity` property
- [ ] **Task 2:** Enable system-assigned managed identity on the app
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-131; TAG="AutoLabId=131"
PLAN="plan-ts131-$(date +%s | tail -c 7)"
APP="app-ts131-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az appservice plan create -n "$PLAN" -g "$RG" -l "$LOC" --sku F1 --tags "$TAG" >/dev/null
az webapp create -n "$APP" -g "$RG" --plan "$PLAN" --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.AppName="$APP" >/dev/null
echo "Setup complete. Web app $APP has no managed identity."
```

## Skills Tested

- Reading `identity.type` on a Web App
- Enabling system-assigned identity via portal Identity blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab web app still exists                   | `app=$(az group show -n RG-TS-131 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-131 --query name -o tsv` |
| 2   | A system-assigned managed identity is set  | `app=$(az group show -n RG-TS-131 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-131 --query identity.type -o tsv` |

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

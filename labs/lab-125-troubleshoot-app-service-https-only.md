# Lab 125 — Troubleshoot App Service HTTPS-Only Off

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

A new web app `app-ts125-<random>` in `RG-TS-125` is accessible over plain HTTP. Security policy requires all App Service apps to redirect HTTP to HTTPS. Flip the **HTTPS Only** setting so unencrypted requests get a 301 redirect.

## Tasks

- [ ] **Task 1:** Find the web app and inspect its `httpsOnly` property
- [ ] **Task 2:** Set `httpsOnly` to `true`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-125; TAG="AutoLabId=125"
PLAN="plan-ts125-$(date +%s | tail -c 7)"
APP="app-ts125-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az appservice plan create -n "$PLAN" -g "$RG" -l "$LOC" --sku F1 --tags "$TAG" >/dev/null
az webapp create -n "$APP" -g "$RG" --plan "$PLAN" --tags "$TAG" >/dev/null
az webapp update -n "$APP" -g "$RG" --set httpsOnly=false >/dev/null
az group update -n "$RG" --set tags.AppName="$APP" >/dev/null
echo "Setup complete. Web app $APP has httpsOnly=false."
```

## Skills Tested

- Reading `httpsOnly` on a Web App
- Updating it via portal TLS/SSL settings blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                              |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Lab web app still exists                   | `app=$(az group show -n RG-TS-125 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-125 --query name -o tsv` |
| 2   | `httpsOnly` is `true`                      | `app=$(az group show -n RG-TS-125 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-125 --query httpsOnly -o tsv` |

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

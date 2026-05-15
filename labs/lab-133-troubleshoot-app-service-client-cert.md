# Lab 133 — Troubleshoot Client Certificate Auth Enabled

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

Users browsing `app-ts133-<random>` keep getting browser certificate prompts and most fail to log in. The web app has **incoming client certificate** authentication enabled, but the team never intended to require client certs. Disable client certificate auth on the app.

## Tasks

- [ ] **Task 1:** Inspect the web app's `clientCertEnabled` property
- [ ] **Task 2:** Disable client cert auth
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-133; TAG="AutoLabId=133"
PLAN="plan-ts133-$(date +%s | tail -c 7)"
APP="app-ts133-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az appservice plan create -n "$PLAN" -g "$RG" -l "$LOC" --sku F1 --tags "$TAG" >/dev/null
az webapp create -n "$APP" -g "$RG" --plan "$PLAN" --tags "$TAG" >/dev/null
az webapp update -n "$APP" -g "$RG" --set clientCertEnabled=true clientCertMode=Required >/dev/null
az group update -n "$RG" --set tags.AppName="$APP" >/dev/null
echo "Setup complete. $APP has clientCertEnabled=true clientCertMode=Required."
```

## Skills Tested

- Reading `clientCertEnabled` and `clientCertMode`
- Disabling client cert auth via portal Configuration > General settings

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                              |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 1   | Lab web app still exists                   | `app=$(az group show -n RG-TS-133 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-133 --query name -o tsv` |
| 2   | `clientCertEnabled` is `false`             | `app=$(az group show -n RG-TS-133 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-133 --query clientCertEnabled -o tsv` |

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

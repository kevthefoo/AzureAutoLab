# Lab 126 — Troubleshoot App Service Minimum TLS Version

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

A penetration test against `app-ts126-<random>` in `RG-TS-126` revealed it negotiates TLS 1.0 — a regulatory failure. The corporate baseline is TLS 1.2. Update the app's minimum TLS version.

## Tasks

- [ ] **Task 1:** Inspect the web app's minimum TLS version (`siteConfig.minTlsVersion`)
- [ ] **Task 2:** Set the minimum TLS version to **1.2**
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-126; TAG="AutoLabId=126"
PLAN="plan-ts126-$(date +%s | tail -c 7)"
APP="app-ts126-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az appservice plan create -n "$PLAN" -g "$RG" -l "$LOC" --sku F1 --tags "$TAG" >/dev/null
az webapp create -n "$APP" -g "$RG" --plan "$PLAN" --tags "$TAG" >/dev/null
az webapp config set -n "$APP" -g "$RG" --min-tls-version 1.0 >/dev/null
az group update -n "$RG" --set tags.AppName="$APP" >/dev/null
echo "Setup complete. $APP minTlsVersion=1.0."
```

## Skills Tested

- Reading `siteConfig.minTlsVersion`
- Updating via portal TLS/SSL settings

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                 |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab web app still exists                   | `app=$(az group show -n RG-TS-126 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-126 --query name -o tsv`   |
| 2   | `minTlsVersion` is `1.2`                   | `app=$(az group show -n RG-TS-126 --query tags.AppName -o tsv); az webapp config show -n "$app" -g RG-TS-126 --query minTlsVersion -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-126 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=126 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

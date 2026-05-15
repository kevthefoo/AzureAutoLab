# Lab 132 — Troubleshoot App Service Outdated Stack Version

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

`app-ts132-<random>` is running on **Node.js 14**, which has been out of support for over a year. The dev team needs to upgrade to **Node 20 LTS**. Update the app's runtime stack without recreating the app.

## Tasks

- [ ] **Task 1:** Inspect the web app's `linuxFxVersion` (or `nodeVersion` on Windows)
- [ ] **Task 2:** Change the runtime to **Node 20 LTS** (linuxFxVersion `NODE|20-lts` on Linux)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-132; TAG="AutoLabId=132"
PLAN="plan-ts132-$(date +%s | tail -c 7)"
APP="app-ts132-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az appservice plan create -n "$PLAN" -g "$RG" -l "$LOC" --sku B1 --is-linux --tags "$TAG" >/dev/null
az webapp create -n "$APP" -g "$RG" --plan "$PLAN" --runtime "NODE|14-lts" --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.AppName="$APP" >/dev/null
echo "Setup complete. $APP runtime is NODE|14-lts."
```

## Skills Tested

- Reading `siteConfig.linuxFxVersion`
- Updating runtime stack via portal Configuration > General settings

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                                            |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab web app still exists                     | `app=$(az group show -n RG-TS-132 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-132 --query name -o tsv`              |
| 2   | linuxFxVersion is Node 20 LTS                | `app=$(az group show -n RG-TS-132 --query tags.AppName -o tsv); az webapp config show -n "$app" -g RG-TS-132 --query linuxFxVersion -o tsv` |

A correct fix returns `NODE|20-lts` (case may vary).

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

# Lab 127 — Troubleshoot App Service Always On Disabled

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

`app-ts127-<random>` is hosting an internal scheduled job that needs to run continuously, but operators report the app keeps going idle and the timer job never fires. The plan is **B1** (Basic) — Always On is available, but it was disabled at create time. Turn it on.

> Note: this lab provisions a B1 plan (~$0.02/hr). Run it briefly.

## Tasks

- [ ] **Task 1:** Read the web app's `alwaysOn` setting
- [ ] **Task 2:** Enable `alwaysOn`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-127; TAG="AutoLabId=127"
PLAN="plan-ts127-$(date +%s | tail -c 7)"
APP="app-ts127-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az appservice plan create -n "$PLAN" -g "$RG" -l "$LOC" --sku B1 --tags "$TAG" >/dev/null
az webapp create -n "$APP" -g "$RG" --plan "$PLAN" --tags "$TAG" >/dev/null
az webapp config set -n "$APP" -g "$RG" --always-on false >/dev/null
az group update -n "$RG" --set tags.AppName="$APP" >/dev/null
echo "Setup complete. $APP has alwaysOn=false on plan $PLAN (B1)."
```

## Skills Tested

- Reading `siteConfig.alwaysOn`
- Recognizing that Always On requires Basic+ plan tier
- Toggling via portal Configuration > General settings

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                            |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab web app still exists                   | `app=$(az group show -n RG-TS-127 --query tags.AppName -o tsv); az webapp show -n "$app" -g RG-TS-127 --query name -o tsv` |
| 2   | `alwaysOn` is `true`                       | `app=$(az group show -n RG-TS-127 --query tags.AppName -o tsv); az webapp config show -n "$app" -g RG-TS-127 --query alwaysOn -o tsv` |

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

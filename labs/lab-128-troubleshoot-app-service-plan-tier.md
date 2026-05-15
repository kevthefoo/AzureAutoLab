# Lab 128 — Troubleshoot App Service Plan Tier Too Low

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

`app-ts128-<random>` is on a **Free (F1)** App Service plan, but the dev team needs custom domains and SSL — features only available on **Basic or higher**. Upgrade the plan SKU to **B1** so the team can move forward. Don't recreate the plan.

> Note: scaling up to B1 starts billing the plan (~$0.02/hr). Clean up promptly.

## Tasks

- [ ] **Task 1:** Identify the plan's current SKU tier
- [ ] **Task 2:** Scale the plan up to **B1 (Basic)**
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-128; TAG="AutoLabId=128"
PLAN="plan-ts128-$(date +%s | tail -c 7)"
APP="app-ts128-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az appservice plan create -n "$PLAN" -g "$RG" -l "$LOC" --sku F1 --tags "$TAG" >/dev/null
az webapp create -n "$APP" -g "$RG" --plan "$PLAN" --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.PlanName="$PLAN" tags.AppName="$APP" >/dev/null
echo "Setup complete. Plan $PLAN is F1."
```

## Skills Tested

- Reading `sku.tier` on an App Service plan
- Scaling a plan via portal Scale up blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                          |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab plan still exists                      | `plan=$(az group show -n RG-TS-128 --query tags.PlanName -o tsv); az appservice plan show -n "$plan" -g RG-TS-128 --query name -o tsv` |
| 2   | Plan SKU tier is at least `Basic`          | `plan=$(az group show -n RG-TS-128 --query tags.PlanName -o tsv); az appservice plan show -n "$plan" -g RG-TS-128 --query sku.tier -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-128 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=128 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

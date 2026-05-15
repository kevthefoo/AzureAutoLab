# Lab 119 — Troubleshoot Shared Key Access Disabled

**Domain:** Storage
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A legacy application authenticates to a storage account in `RG-TS-119` using the account key, but it's getting `KeyBasedAuthenticationNotPermitted`. The platform team disabled shared-key access weeks ago for a security initiative, but the legacy app can't move to Entra yet. Re-enable shared-key auth temporarily until the app team finishes its migration. **Do not delete the account.**

## Tasks

- [ ] **Task 1:** Check the storage account's `allowSharedKeyAccess` property
- [ ] **Task 2:** Set `allowSharedKeyAccess` to `true`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-119; TAG="AutoLabId=119"
SA="stautolab119$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --allow-shared-key-access false --tags "$TAG" >/dev/null
echo "Setup complete. $SA has shared-key auth disabled."
```

## Skills Tested

- Reading `allowSharedKeyAccess`
- Toggling via portal Configuration blade

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                              |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Lab storage account still exists             | `az storage account list --query "[?tags.AutoLabId=='119'].name" -o tsv`                  |
| 2   | `allowSharedKeyAccess` is `true`             | `az storage account list --query "[?tags.AutoLabId=='119'].allowSharedKeyAccess" -o tsv`  |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-119 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=119 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

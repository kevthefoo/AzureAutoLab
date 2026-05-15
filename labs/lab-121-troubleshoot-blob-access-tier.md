# Lab 121 — Troubleshoot Wrong Blob Access Tier

**Domain:** Storage
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

A new storage account in `RG-TS-121` is hosting **frequently-read** application logs, but it was created with `Cool` as the default access tier. Reads from Cool incur retrieval costs that are biting the finance budget. Change the account's default access tier to `Hot`.

## Tasks

- [ ] **Task 1:** Inspect the storage account's default access tier
- [ ] **Task 2:** Change `accessTier` to `Hot`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-121; TAG="AutoLabId=121"
SA="stautolab121$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --access-tier Cool --tags "$TAG" >/dev/null
echo "Setup complete. $SA default access tier is Cool."
```

## Skills Tested

- Reading `accessTier`
- Changing tier via portal Configuration blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                          |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------ |
| 1   | Lab storage account still exists           | `az storage account list --query "[?tags.AutoLabId=='121'].name" -o tsv`              |
| 2   | Default access tier is `Hot`               | `az storage account list --query "[?tags.AutoLabId=='121'].accessTier" -o tsv`        |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-121 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=121 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

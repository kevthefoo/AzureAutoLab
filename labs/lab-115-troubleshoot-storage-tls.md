# Lab 115 — Troubleshoot Storage TLS Minimum Version

**Domain:** Storage
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

Security scanned a storage account in `RG-TS-115` and flagged it as non-compliant: it still accepts TLS 1.0 connections. Policy is now TLS 1.2 minimum across the estate. Update the storage account so it rejects anything below 1.2.

## Tasks

- [ ] **Task 1:** Find the storage account in `RG-TS-115` and read its current minimum TLS version
- [ ] **Task 2:** Set the minimum TLS version to `TLS1_2`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-115; TAG="AutoLabId=115"
SA="stautolab115$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --min-tls-version TLS1_0 --tags "$TAG" >/dev/null
echo "Setup complete. $SA accepts TLS 1.0."
```

## Skills Tested

- Reading `minimumTlsVersion` on a storage account
- Updating it via portal Configuration blade or `az storage account update`

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                          |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 1   | Lab storage account exists                 | `az storage account list --query "[?tags.AutoLabId=='115'].name" -o tsv`                              |
| 2   | Minimum TLS version is `TLS1_2`            | `az storage account list --query "[?tags.AutoLabId=='115'].minimumTlsVersion" -o tsv`                 |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-115 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=115 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

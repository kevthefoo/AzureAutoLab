# Lab 120 — Troubleshoot Cross-Tenant Replication Enabled

**Domain:** Storage
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A storage account in `RG-TS-120` was provisioned by an automation script that left **object replication across tenants** enabled. Security flagged this — there's no business reason to allow replication into other Entra tenants. Disable the cross-tenant replication setting.

## Tasks

- [ ] **Task 1:** Check the storage account's `allowCrossTenantReplication` flag
- [ ] **Task 2:** Set it to `false` via portal Configuration blade
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-120; TAG="AutoLabId=120"
SA="stautolab120$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --allow-cross-tenant-replication true --tags "$TAG" >/dev/null
echo "Setup complete. $SA has allow-cross-tenant-replication=true."
```

## Skills Tested

- Reading `allowCrossTenantReplication`
- Updating via portal Configuration blade

## Verification Criteria

| #   | What to Check                                       | CLI Command                                                                                              |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | Lab storage account still exists                    | `az storage account list --query "[?tags.AutoLabId=='120'].name" -o tsv`                                  |
| 2   | `allowCrossTenantReplication` is `false`            | `az storage account list --query "[?tags.AutoLabId=='120'].allowCrossTenantReplication" -o tsv`           |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-120 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=120 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

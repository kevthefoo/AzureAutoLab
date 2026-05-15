# Lab 151 — Troubleshoot Recovery Vault Soft Delete Disabled

**Domain:** Monitoring & Backup
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A Recovery Services Vault `rsv-ts151` in `RG-TS-151` has **soft delete** disabled. The team wants protection against accidental deletion of backup items. Re-enable soft delete.

## Tasks

- [ ] **Task 1:** Read the vault's soft delete state
- [ ] **Task 2:** Enable soft delete on the vault
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-151; TAG="AutoLabId=151"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.RecoveryServices --wait
az backup vault create -g "$RG" -n rsv-ts151 -l "$LOC" --tags "$TAG" >/dev/null
az backup vault backup-properties set -g "$RG" -n rsv-ts151 --soft-delete-feature-state Disable >/dev/null
echo "Setup complete. rsv-ts151 has soft delete disabled."
```

## Skills Tested

- Reading `softDeleteFeatureState` on a backup vault
- Toggling via portal Backup vaults > Properties > Security settings

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                          |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Vault `rsv-ts151` exists                   | `az backup vault show -g RG-TS-151 -n rsv-ts151 --query name -o tsv`                                                  |
| 2   | Soft delete is enabled                     | `az backup vault backup-properties show -g RG-TS-151 -n rsv-ts151 --query "softDeleteFeatureState" -o tsv`            |

A correct fix returns `Enabled` (or `AlwaysON`).

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-151 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=151 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

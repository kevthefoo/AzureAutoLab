# Lab 150 — Troubleshoot Recovery Vault Replication Type

**Domain:** Monitoring & Backup
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A Recovery Services Vault `rsv-ts150` in `RG-TS-150` was provisioned with **GRS** (Geo-Redundant Storage), but the data-residency review requires backup data to stay in-region. Switch the vault's backup storage redundancy to **LRS** (Locally-Redundant Storage). The vault has no backup items yet, so this change is allowed.

## Tasks

- [ ] **Task 1:** Read the vault's `storageType` (backup storage redundancy)
- [ ] **Task 2:** Change the storage type to **LocallyRedundant**
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-150; TAG="AutoLabId=150"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.RecoveryServices --wait
az backup vault create -g "$RG" -n rsv-ts150 -l "$LOC" --tags "$TAG" >/dev/null
az backup vault backup-properties set -g "$RG" -n rsv-ts150 --backup-storage-redundancy GeoRedundant >/dev/null
echo "Setup complete. rsv-ts150 is GeoRedundant."
```

## Skills Tested

- Reading backup vault `backupStorageRedundancy`
- Changing redundancy via portal Backup vaults > Properties (only allowed before any backup items are registered)

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                          |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Vault `rsv-ts150` exists                   | `az backup vault show -g RG-TS-150 -n rsv-ts150 --query name -o tsv`                                                  |
| 2   | Backup storage redundancy is `LocallyRedundant` | `az backup vault backup-properties show -g RG-TS-150 -n rsv-ts150 --query "storageType" -o tsv`                        |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
EXISTS=$(az backup vault show -g RG-TS-150 -n rsv-ts150 --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "rsv-ts150" ]; then echo "[PASS] Task 1: vault rsv-ts150 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: vault not found"; FAIL=$((FAIL+1)); fi

V=$(az backup vault backup-properties show -g RG-TS-150 -n rsv-ts150 --query "storageType" -o tsv 2>/dev/null)
if [ "$V" = "LocallyRedundant" ]; then echo "[PASS] Task 2: backupStorageRedundancy is LocallyRedundant"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: backupStorageRedundancy is '$V' (expected LocallyRedundant)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-150 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=150 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

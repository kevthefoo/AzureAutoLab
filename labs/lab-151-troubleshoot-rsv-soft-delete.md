# Lab 151 — Troubleshoot Recovery Vault Immutability Disabled

**Domain:** Monitoring & Backup
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

Compliance requires Recovery Services Vaults that hold production backups to have **immutability** enabled (at minimum in the `Unlocked` state) so backup data can't be tampered with. The vault `rsv-ts151` in `RG-TS-151` was provisioned with immutability `Disabled`. Update it.

## Tasks

- [ ] **Task 1:** Read the vault's `securitySettings.immutabilitySettings.state`
- [ ] **Task 2:** Set the immutability state to **Unlocked** (do not Lock — that's irreversible)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-151; TAG="AutoLabId=151"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.RecoveryServices --wait
az backup vault create -g "$RG" -n rsv-ts151 -l "$LOC" --tags "$TAG" >/dev/null
echo "Setup complete. rsv-ts151 created with default immutability state (Disabled)."
```

## Skills Tested

- Reading `immutabilitySettings.state` on a backup vault
- Setting immutability via portal Backup vaults > Properties > Immutability

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                          |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Vault `rsv-ts151` exists                   | `az backup vault show -g RG-TS-151 -n rsv-ts151 --query name -o tsv`                                                  |
| 2   | Immutability state is `Unlocked` or `Locked` | `az backup vault show -g RG-TS-151 -n rsv-ts151 --query "properties.securitySettings.immutabilitySettings.state" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
EXISTS=$(az backup vault show -g RG-TS-151 -n rsv-ts151 --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "rsv-ts151" ]; then echo "[PASS] Task 1: vault rsv-ts151 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: vault not found"; FAIL=$((FAIL+1)); fi

V=$(az backup vault show -g RG-TS-151 -n rsv-ts151 --query "properties.securitySettings.immutabilitySettings.state" -o tsv 2>/dev/null)
case "$V" in Unlocked|Locked) echo "[PASS] Task 2: immutability state is $V"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 2: immutability state is '$V' (expected Unlocked or Locked)"; FAIL=$((FAIL+1));; esac
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

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

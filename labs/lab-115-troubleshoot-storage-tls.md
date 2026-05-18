# Lab 115 — Troubleshoot Storage Account allowBlobPublicAccess

**Domain:** Storage
**Difficulty:** Beginner

---

## Scenario

A security scan against a storage account in `RG-TS-115` flagged it as non-compliant: `allowBlobPublicAccess` is `true`. With this enabled, any container can be set to public anonymous access. Policy requires this account-level flag to be `false` so individual containers can't be opened to the internet by mistake.

## Tasks

- [ ] **Task 1:** Find the storage account in `RG-TS-115` and check its `allowBlobPublicAccess` value
- [ ] **Task 2:** Set `allowBlobPublicAccess` to `false`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-115; TAG="AutoLabId=115"
SA="stautolab115$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --allow-blob-public-access true --tags "$TAG" >/dev/null
echo "Setup complete. $SA has allowBlobPublicAccess=true."
```

## Skills Tested

- Reading `allowBlobPublicAccess` at the storage account level
- Updating via portal Configuration blade or `az storage account update`

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                              |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | Lab storage account exists                 | `az storage account list --query "[?tags.AutoLabId=='115'].name" -o tsv`                  |
| 2   | `allowBlobPublicAccess` is `false`         | `az storage account list --query "[?tags.AutoLabId=='115'].allowBlobPublicAccess" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az storage account list --query "[?tags.AutoLabId=='115'].name | [0]" -o tsv)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account exists ($SA)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account tagged AutoLabId=115"; FAIL=$((FAIL+1)); fi

V=$(az storage account list --query "[?tags.AutoLabId=='115'].allowBlobPublicAccess | [0]" -o tsv)
if [ "$V" = "false" ]; then echo "[PASS] Task 2: allowBlobPublicAccess is false"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: allowBlobPublicAccess is '$V' (expected false)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-115 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=115 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

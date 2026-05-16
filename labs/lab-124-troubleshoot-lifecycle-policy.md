# Lab 124 — Troubleshoot Aggressive Lifecycle Policy

**Domain:** Storage
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

The app team's storage account in `RG-TS-124` has a lifecycle management rule that's **deleting blobs after 1 day of being modified**. They meant for the rule to *archive* blobs after 365 days. Inspect the rule and fix it so blobs aren't deleted unintentionally.

## Tasks

- [ ] **Task 1:** Read the lifecycle management policy on the storage account
- [ ] **Task 2:** Delete or update the rule so no `delete` action fires after 1 day (acceptable fix: remove the entire rule)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-124; TAG="AutoLabId=124"
SA="stautolab124$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null

az storage account management-policy create --account-name "$SA" --resource-group "$RG" \
  --policy '{"rules":[{"enabled":true,"name":"deletes-after-1-day","type":"Lifecycle","definition":{"actions":{"baseBlob":{"delete":{"daysAfterModificationGreaterThan":1}}},"filters":{"blobTypes":["blockBlob"]}}}]}' >/dev/null
echo "Setup complete. Lifecycle rule 'deletes-after-1-day' active."
```

## Skills Tested

- Reading a storage account's management policy
- Editing/removing lifecycle rules via portal Lifecycle management blade

## Verification Criteria

| #   | What to Check                                          | CLI Command                                                                                                                               |
| --- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab storage account still exists                       | `az storage account list --query "[?tags.AutoLabId=='124'].name" -o tsv`                                                                   |
| 2   | No rule with `delete.daysAfterModificationGreaterThan <= 30` remains | `sa=$(az storage account list --query "[?tags.AutoLabId=='124'].name" -o tsv); az storage account management-policy show --account-name "$sa" --resource-group RG-TS-124 --query "policy.rules[?definition.actions.baseBlob.delete.daysAfterModificationGreaterThan <=  \`30\`]" -o json 2>/dev/null || echo "[]"` |

A correct fix returns an empty array (`[]`) for #2.

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az storage account list --query "[?tags.AutoLabId=='124'].name | [0]" -o tsv)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account exists ($SA)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account tagged AutoLabId=124"; FAIL=$((FAIL+1)); fi

# Look for rules with short delete-after-modification windows
COUNT=$(az storage account management-policy show --account-name "$SA" --resource-group RG-TS-124 \
  --query "policy.rules[?definition.actions.baseBlob.delete.daysAfterModificationGreaterThan <= \`30\`] | length(@)" -o tsv 2>/dev/null)
if [ "${COUNT:-0}" = "0" ]; then echo "[PASS] Task 2: no aggressive delete rules remain (<=30 days)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: $COUNT rule(s) still delete blobs within 30 days of modification"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-124 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=124 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

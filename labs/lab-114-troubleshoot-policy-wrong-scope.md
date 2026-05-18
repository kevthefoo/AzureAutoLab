# Lab 114 — Troubleshoot Policy Assigned at Wrong Scope

**Domain:** Identity & Governance
**Difficulty:** Intermediate

---

## Scenario

Compliance assigned a policy that should restrict allowed regions for the entire `RG-TS-114` resource group — but engineers in another team's RG are also seeing compliance failures, and resources in `RG-TS-114` keep getting deployed into `westus` anyway. Inspect the assignment scope and re-target it to the correct resource group.

## Tasks

- [ ] **Task 1:** Find the policy assignment `ts114-allowed-locations` and read its current scope
- [ ] **Task 2:** Delete the assignment from the wrong scope and re-create it on `RG-TS-114` only
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-114
TAG="AutoLabId=114"
OTHER_RG="RG-TS-114-Wrong"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az group create -n "$OTHER_RG" -l "$LOC" --tags "$TAG" >/dev/null

# Built-in: "Allowed locations"
DEF="e56962a6-4747-49cd-b67b-bf8b01975c4c"
SCOPE_WRONG=$(az group show -n "$OTHER_RG" --query id -o tsv)

az policy assignment create -n "ts114-allowed-locations" \
  --policy "$DEF" --scope "$SCOPE_WRONG" \
  --params '{"listOfAllowedLocations":{"value":["eastus","eastus2"]}}' >/dev/null

echo "Setup complete. Policy ts114-allowed-locations is assigned to $OTHER_RG instead of $RG."
```

## Skills Tested

- Listing policy assignments by scope
- Deleting and re-creating an assignment at the correct scope

## Verification Criteria

| #   | What to Check                                                                | CLI Command                                                                                                                          |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | An `ts114-allowed-locations` assignment exists scoped to `RG-TS-114`         | `az policy assignment list -g RG-TS-114 --query "[?name=='ts114-allowed-locations'].scope" -o tsv`                                    |
| 2   | No `ts114-allowed-locations` assignment remains scoped to `RG-TS-114-Wrong`  | `az policy assignment list -g RG-TS-114-Wrong --query "[?name=='ts114-allowed-locations']" -o json`                                  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
GOOD=$(az policy assignment list -g RG-TS-114 --query "[?name=='ts114-allowed-locations'] | length(@)" -o tsv 2>/dev/null)
if [ "${GOOD:-0}" -gt 0 ]; then echo "[PASS] Task 1: assignment ts114-allowed-locations scoped to RG-TS-114"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: assignment is not scoped to RG-TS-114"; FAIL=$((FAIL+1)); fi

BAD=$(az policy assignment list -g RG-TS-114-Wrong --query "[?name=='ts114-allowed-locations'] | length(@)" -o tsv 2>/dev/null)
if [ "${BAD:-0}" = "0" ]; then echo "[PASS] Task 2: assignment no longer scoped to RG-TS-114-Wrong"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: assignment still present on RG-TS-114-Wrong"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
for rg in RG-TS-114 RG-TS-114-Wrong; do
  scope=$(az group show -n "$rg" --query id -o tsv 2>/dev/null || echo "")
  if [ -n "$scope" ]; then
    az policy assignment delete -n "ts114-allowed-locations" --scope "$scope" 2>/dev/null || true
  fi
done
az group delete -n RG-TS-114 --yes --no-wait || true
az group delete -n RG-TS-114-Wrong --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=114 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

# Lab 108 — Troubleshoot Custom Role Missing Action

**Domain:** Identity & Governance
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A custom RBAC role `TS108-StorageOperator-<random>` was created for the storage on-call team. Users with this role can see storage accounts but **can't list account keys**, which they need for the legacy backup script. Inspect the role definition and add the missing data-plane-adjacent action so they can list keys, but **don't grant more permissions than necessary**.

## Tasks

- [ ] **Task 1:** Locate the custom role definition tagged for this lab and inspect its `actions` list
- [ ] **Task 2:** Add the action that allows listing storage account keys (`Microsoft.Storage/storageAccounts/listKeys/action`)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-108
TAG="AutoLabId=108"
SUB=$(az account show --query id -o tsv)
ROLE="TS108-StorageOperator-$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

# Tag the RG with the role name so verification can find it
az group update -n "$RG" --set tags.RoleName="$ROLE" >/dev/null

az role definition create --role-definition "{
  \"Name\": \"$ROLE\",
  \"Description\": \"TS108 lab custom role (intentionally missing listKeys)\",
  \"Actions\": [\"Microsoft.Storage/storageAccounts/read\"],
  \"NotActions\": [],
  \"AssignableScopes\": [\"/subscriptions/$SUB\"]
}" >/dev/null

echo "Setup complete. Custom role $ROLE created without listKeys action."
```

## Skills Tested

- Reading a custom role definition with `az role definition list`
- Updating actions on an existing role definition
- Choosing the correct permission string for listing storage account keys

## Verification Criteria

| #   | What to Check                                              | CLI Command                                                                                                                              |
| --- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The lab's custom role still exists                         | `role=$(az group show -n RG-TS-108 --query tags.RoleName -o tsv); az role definition list --name "$role" --query "[0].roleName" -o tsv`   |
| 2   | The role's `actions` includes `Microsoft.Storage/storageAccounts/listKeys/action` | `role=$(az group show -n RG-TS-108 --query tags.RoleName -o tsv); az role definition list --name "$role" --query "[0].permissions[0].actions" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
ROLE=$(az group show -n RG-TS-108 --query tags.RoleName -o tsv 2>/dev/null)
EXISTS=$(az role definition list --name "$ROLE" --query "[0].roleName" -o tsv 2>/dev/null)
if [ "$EXISTS" = "$ROLE" ]; then echo "[PASS] Task 1: custom role $ROLE still exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: custom role $ROLE is missing"; FAIL=$((FAIL+1)); fi

HAS=$(az role definition list --name "$ROLE" --query "[0].permissions[0].actions[?contains(@, 'listKeys')] | length(@)" -o tsv 2>/dev/null)
if [ "${HAS:-0}" -gt 0 ]; then echo "[PASS] Task 2: role actions include listKeys"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: role actions are missing the listKeys permission"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
role=$(az group show -n RG-TS-108 --query tags.RoleName -o tsv 2>/dev/null || echo "")
if [ -n "$role" ]; then
  az role definition delete --name "$role" 2>/dev/null || true
fi
az group delete -n RG-TS-108 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=108 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

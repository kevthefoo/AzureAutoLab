# Lab 109 — Troubleshoot RBAC Scope Too Broad

**Domain:** Identity & Governance
**Difficulty:** Intermediate

---

## Scenario

A service principal `sp-ts109-<random>` was granted `Reader` at the **subscription** scope so a third-party SIEM tool could read resource metadata. Security audit flagged this as over-privileged — it should only read what's in `RG-TS-109`. Tighten the scope without losing access to the lab RG.

## Tasks

- [ ] **Task 1:** Identify the SP's current Reader role assignment scope
- [ ] **Task 2:** Remove the subscription-scope Reader assignment and add an equivalent assignment scoped only to `RG-TS-109`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-109
TAG="AutoLabId=109"
SUB=$(az account show --query id -o tsv)
SP_NAME="sp-ts109-$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

# Create SP and grab the appId
APP_ID=$(az ad sp create-for-rbac --name "$SP_NAME" --skip-assignment --query appId -o tsv)

# Save SP name on the RG for verification later
az group update -n "$RG" --set tags.SpName="$SP_NAME" >/dev/null

# Assign Reader at subscription scope (the bug)
az role assignment create --assignee "$APP_ID" --role Reader --scope "/subscriptions/$SUB" >/dev/null

echo "Setup complete. SP $SP_NAME granted Reader at subscription scope."
```

## Skills Tested

- Listing role assignments by principal
- Deleting and re-creating an assignment at the correct scope
- Recognizing least-privilege scope hierarchy

## Verification Criteria

| #   | What to Check                                                      | CLI Command                                                                                                                                            |
| --- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | The lab SP still exists                                            | `sp=$(az group show -n RG-TS-109 --query tags.SpName -o tsv); az ad sp list --display-name "$sp" --query "[0].displayName" -o tsv`                       |
| 2   | The SP has NO Reader assignment at subscription scope              | `sp=$(az group show -n RG-TS-109 --query tags.SpName -o tsv); appid=$(az ad sp list --display-name "$sp" --query "[0].appId" -o tsv); az role assignment list --assignee "$appid" --scope "/subscriptions/$(az account show --query id -o tsv)" --query "[?roleDefinitionName=='Reader']" -o json` |
| 3   | The SP has Reader scoped to `RG-TS-109`                            | `sp=$(az group show -n RG-TS-109 --query tags.SpName -o tsv); appid=$(az ad sp list --display-name "$sp" --query "[0].appId" -o tsv); az role assignment list --assignee "$appid" --resource-group RG-TS-109 --query "[?roleDefinitionName=='Reader']" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SP=$(az group show -n RG-TS-109 --query tags.SpName -o tsv 2>/dev/null)
APPID=$(az ad sp list --display-name "$SP" --query "[0].appId" -o tsv 2>/dev/null)
if [ -n "$APPID" ]; then echo "[PASS] Task 1: SP $SP still exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: SP $SP not found"; FAIL=$((FAIL+1)); fi

SUB=$(az account show --query id -o tsv)
SUB_R=$(az role assignment list --assignee "$APPID" --scope "/subscriptions/$SUB" --query "[?roleDefinitionName=='Reader'] | length(@)" -o tsv 2>/dev/null)
if [ "${SUB_R:-0}" = "0" ]; then echo "[PASS] Task 2: SP has no Reader assignment at subscription scope"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: SP still has Reader at subscription scope"; FAIL=$((FAIL+1)); fi

RG_R=$(az role assignment list --assignee "$APPID" --resource-group RG-TS-109 --query "[?roleDefinitionName=='Reader'] | length(@)" -o tsv 2>/dev/null)
if [ "${RG_R:-0}" -gt 0 ]; then echo "[PASS] Task 3: SP has Reader scoped to RG-TS-109"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: SP has no Reader scoped to RG-TS-109"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
sp=$(az group show -n RG-TS-109 --query tags.SpName -o tsv 2>/dev/null || echo "")
if [ -n "$sp" ]; then
  appid=$(az ad sp list --display-name "$sp" --query "[0].appId" -o tsv 2>/dev/null || echo "")
  if [ -n "$appid" ]; then
    az ad sp delete --id "$appid" 2>/dev/null || true
    az ad app delete --id "$appid" 2>/dev/null || true
  fi
fi
az group delete -n RG-TS-109 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=109 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

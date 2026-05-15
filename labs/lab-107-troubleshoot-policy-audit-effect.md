# Lab 107 — Troubleshoot Policy Assignment Effect

**Domain:** Identity & Governance
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A policy is supposed to **block** the creation of any storage account that allows blob public access in `RG-TS-107`, but engineers keep creating non-compliant accounts and nothing stops them. Compliance can see audit warnings in the Policy blade, so the policy is evaluating — but it's not enforcing. Find and change the offending parameter so the effect actually blocks creation.

## Tasks

- [ ] **Task 1:** Locate the policy assignment scoped to `RG-TS-107` and inspect its effect parameter
- [ ] **Task 2:** Update the assignment so it denies (not audits) non-compliant storage accounts
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-107
TAG="AutoLabId=107"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

# Built-in policy: "Storage accounts should restrict network access" — definition id:
DEF="/providers/Microsoft.Authorization/policyDefinitions/34c877ad-507e-4c82-993e-3452a6e0ad3c"
SCOPE=$(az group show -n "$RG" --query id -o tsv)

az policy assignment create -n "ts107-deny-public-blob" \
  --policy "$DEF" --scope "$SCOPE" \
  --params '{"effect":{"value":"Audit"}}' >/dev/null

echo "Setup complete. Policy assigned to $RG with effect=Audit."
```

## Skills Tested

- Reading policy assignments via `az policy assignment show`
- Updating the `effect` parameter on an assignment
- Distinguishing `Audit` from `Deny` effect

## Verification Criteria

| #   | What to Check                                  | CLI Command                                                                                                                                |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Policy assignment still scoped to `RG-TS-107`  | `az policy assignment list -g RG-TS-107 --query "[?name=='ts107-deny-public-blob'].name" -o tsv`                                            |
| 2   | Assignment effect parameter is `Deny`          | `az policy assignment show --name ts107-deny-public-blob --scope $(az group show -n RG-TS-107 --query id -o tsv) --query "parameters.effect.value" -o tsv` |

## Cleanup

```bash
set -euo pipefail
SCOPE=$(az group show -n RG-TS-107 --query id -o tsv 2>/dev/null || echo "")
if [ -n "$SCOPE" ]; then
  az policy assignment delete -n "ts107-deny-public-blob" --scope "$SCOPE" 2>/dev/null || true
fi
az group delete -n RG-TS-107 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=107 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

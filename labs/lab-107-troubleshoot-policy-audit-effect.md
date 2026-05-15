# Lab 107 — Troubleshoot Policy Assignment Effect

**Domain:** Identity & Governance
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A policy is supposed to **block** the creation of any resource in `RG-TS-107` that's missing a `CostCenter` tag, but engineers keep creating tag-less resources and nothing stops them. Compliance can see audit warnings in the Policy blade, so the policy is evaluating — but it's not enforcing. Find and change the offending parameter so the effect actually denies creation.

## Tasks

- [ ] **Task 1:** Locate the policy assignment scoped to `RG-TS-107` and inspect its effect parameter
- [ ] **Task 2:** Update the assignment so it denies (not audits) resources missing the `CostCenter` tag
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-107
TAG="AutoLabId=107"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

# Built-in policy: "Require a tag on resources"
DEF="871b6d14-10aa-478d-b590-94f262ecfa99"
SCOPE=$(az group show -n "$RG" --query id -o tsv)

az policy assignment create -n "ts107-require-costcenter" \
  --policy "$DEF" --scope "$SCOPE" \
  --params '{"tagName":{"value":"CostCenter"}}' \
  --enforcement-mode DoNotEnforce >/dev/null

echo "Setup complete. Policy ts107-require-costcenter assigned to $RG with enforcementMode=DoNotEnforce."
```

## Skills Tested

- Reading policy assignments via `az policy assignment show`
- Updating the `effect` parameter on an assignment
- Distinguishing `Audit` from `Deny` effect

## Verification Criteria

| #   | What to Check                                            | CLI Command                                                                                                                                |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Policy assignment still scoped to `RG-TS-107`            | `az policy assignment list -g RG-TS-107 --query "[?name=='ts107-require-costcenter'].name" -o tsv`                                          |
| 2   | Assignment `enforcementMode` is `Default` (not `DoNotEnforce`) | `az policy assignment show --name ts107-require-costcenter --scope $(az group show -n RG-TS-107 --query id -o tsv) --query "enforcementMode" -o tsv` |

## Cleanup

```bash
set -euo pipefail
SCOPE=$(az group show -n RG-TS-107 --query id -o tsv 2>/dev/null || echo "")
if [ -n "$SCOPE" ]; then
  az policy assignment delete -n "ts107-require-costcenter" --scope "$SCOPE" 2>/dev/null || true
fi
az group delete -n RG-TS-107 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=107 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

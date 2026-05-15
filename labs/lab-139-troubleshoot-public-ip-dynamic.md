# Lab 139 — Troubleshoot Public IP Allocation Method

**Domain:** Networking
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

A DNS A record at `app.contoso.com` points at `PIP-App` in `RG-TS-139`, but every time the attached resource is stopped/restarted the public IP changes and DNS goes stale. The PIP is **Standard SKU** but `publicIPAllocationMethod` is set to `Dynamic`. Change it to `Static` so the IP is stable.

## Tasks

- [ ] **Task 1:** Inspect the PIP's allocation method
- [ ] **Task 2:** Update allocation to `Static`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-139; TAG="AutoLabId=139"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
# Standard SKU with Dynamic — note: Standard normally only allows Static, but this lab uses Basic-style allocation by recreating.
# Provision Basic Dynamic instead, then fix to Standard Static (matches realistic migration).
az network public-ip create -g "$RG" -n PIP-App --sku Basic --allocation-method Dynamic --tags "$TAG" >/dev/null
echo "Setup complete. PIP-App is Basic/Dynamic and changes on reattach."
```

## Skills Tested

- Reading `publicIPAllocationMethod`
- Updating to Static (often paired with SKU change)

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| 1   | A `PIP-App` still exists in `RG-TS-139`    | `az network public-ip show -g RG-TS-139 -n PIP-App --query name -o tsv`                     |
| 2   | The PIP allocation method is `Static`      | `az network public-ip show -g RG-TS-139 -n PIP-App --query publicIPAllocationMethod -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-139 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=139 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

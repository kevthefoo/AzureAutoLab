# Lab 138 — Troubleshoot Public IP Basic SKU

**Domain:** Networking
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

The team is rolling out a Standard Load Balancer in front of `PIP-Web` in `RG-TS-138` and it refuses to attach with `PublicIPAndLBSkuDoNotMatch`. The Public IP is **Basic SKU** — but Standard LB requires Standard PIP. Replace the Basic PIP with a Standard one, keeping the **name** unchanged so dependent configs don't break.

> Note: Basic Public IPs are being retired by Microsoft. This is a real migration scenario.

## Tasks

- [ ] **Task 1:** Inspect the PIP's `sku.name` value
- [ ] **Task 2:** Delete the Basic PIP and recreate it as Standard with the same name `PIP-Web` (allocation must be Static for Standard)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-138; TAG="AutoLabId=138"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network public-ip create -g "$RG" -n PIP-Web --sku Basic --allocation-method Dynamic --tags "$TAG" >/dev/null
echo "Setup complete. PIP-Web is Basic/Dynamic."
```

## Skills Tested

- Reading `sku.name` and `publicIPAllocationMethod` on a Public IP
- Migrating Basic → Standard (delete + recreate)

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                  |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 1   | A `PIP-Web` still exists in `RG-TS-138`    | `az network public-ip show -g RG-TS-138 -n PIP-Web --query name -o tsv`                       |
| 2   | The PIP SKU is `Standard`                  | `az network public-ip show -g RG-TS-138 -n PIP-Web --query sku.name -o tsv`                   |
| 3   | The PIP allocation method is `Static`      | `az network public-ip show -g RG-TS-138 -n PIP-Web --query publicIPAllocationMethod -o tsv`   |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-138 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=138 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

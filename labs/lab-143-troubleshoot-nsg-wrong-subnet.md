# Lab 143 — Troubleshoot NSG Attached to Wrong Subnet

**Domain:** Networking
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

`NSG-Web` (in `RG-TS-143`) is meant to protect `SUB-Web`, but during creation it was attached to `SUB-App` by mistake. Move the NSG association from `SUB-App` to `SUB-Web`. Don't delete the NSG.

## Tasks

- [ ] **Task 1:** Inspect which subnet `NSG-Web` is associated with
- [ ] **Task 2:** Detach it from `SUB-App` and attach it to `SUB-Web`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-143; TAG="AutoLabId=143"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network vnet create -g "$RG" -n VNET-TS-143 --address-prefixes 10.143.0.0/16 \
  --subnet-name SUB-Web --subnet-prefixes 10.143.1.0/24 --tags "$TAG" >/dev/null
az network vnet subnet create -g "$RG" --vnet-name VNET-TS-143 -n SUB-App --address-prefixes 10.143.2.0/24 >/dev/null
az network nsg create -g "$RG" -n NSG-Web --tags "$TAG" >/dev/null
az network vnet subnet update -g "$RG" --vnet-name VNET-TS-143 -n SUB-App --network-security-group NSG-Web >/dev/null
echo "Setup complete. NSG-Web is attached to SUB-App (should be SUB-Web)."
```

## Skills Tested

- Reading subnet NSG association
- Moving an NSG between subnets via portal Subnet blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | `NSG-Web` still exists                     | `az network nsg show -g RG-TS-143 -n NSG-Web --query name -o tsv`                                                          |
| 2   | `SUB-Web` references NSG-Web               | `az network vnet subnet show -g RG-TS-143 --vnet-name VNET-TS-143 -n SUB-Web --query "networkSecurityGroup.id" -o tsv`     |
| 3   | `SUB-App` no longer references NSG-Web     | `az network vnet subnet show -g RG-TS-143 --vnet-name VNET-TS-143 -n SUB-App --query "networkSecurityGroup" -o json`       |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-143 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=143 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

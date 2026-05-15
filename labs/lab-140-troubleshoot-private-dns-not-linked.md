# Lab 140 — Troubleshoot Private DNS Zone Not Linked

**Domain:** Networking
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A Private DNS Zone `corp.internal` (in `RG-TS-140`) has records for internal services, but resources in `VNET-Corp` can't resolve any of them. The zone exists, the records exist — but the zone isn't **linked** to the VNet. Add the missing VNet link.

## Tasks

- [ ] **Task 1:** List virtual network links on the private DNS zone
- [ ] **Task 2:** Create a link from `corp.internal` to `VNET-Corp` with auto-registration off
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-140; TAG="AutoLabId=140"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network vnet create -g "$RG" -n VNET-Corp --address-prefixes 10.140.0.0/24 --subnet-name S1 --subnet-prefixes 10.140.0.0/26 --tags "$TAG" >/dev/null
az network private-dns zone create -g "$RG" -n corp.internal --tags "$TAG" >/dev/null
az network private-dns record-set a add-record -g "$RG" -z corp.internal -n api --ipv4-address 10.140.0.10 >/dev/null
echo "Setup complete. Zone corp.internal has an 'api' A record but no VNet link."
```

## Skills Tested

- Listing private DNS zone VNet links
- Creating a link via portal Virtual network links blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                  |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 1   | Private DNS zone `corp.internal` exists    | `az network private-dns zone show -g RG-TS-140 -n corp.internal --query name -o tsv`                          |
| 2   | A VNet link to `VNET-Corp` exists           | `az network private-dns link vnet list -g RG-TS-140 -z corp.internal --query "[?contains(virtualNetwork.id, 'VNET-Corp')]" -o json` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-140 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=140 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

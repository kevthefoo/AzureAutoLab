# Lab 141 — Troubleshoot NAT Gateway Not Attached

**Domain:** Networking
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A NAT Gateway `NAT-GW` was provisioned in `RG-TS-141` to give private subnets outbound internet access — but `SUB-Private` still can't reach the internet. The NAT Gateway exists with a Public IP, but it isn't **associated** with the subnet. Wire it up.

> Note: NAT Gateway costs ~$0.045/hr while it exists. Clean up promptly.

## Tasks

- [ ] **Task 1:** Confirm the NAT Gateway exists and inspect which subnets reference it
- [ ] **Task 2:** Associate `NAT-GW` with `SUB-Private`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-141; TAG="AutoLabId=141"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network vnet create -g "$RG" -n VNET-TS-141 --address-prefixes 10.141.0.0/16 \
  --subnet-name SUB-Private --subnet-prefixes 10.141.1.0/24 --tags "$TAG" >/dev/null
az network public-ip create -g "$RG" -n PIP-NAT --sku Standard --allocation-method Static --tags "$TAG" >/dev/null
az network nat gateway create -g "$RG" -n NAT-GW --public-ip-addresses PIP-NAT --idle-timeout 4 --tags "$TAG" >/dev/null
echo "Setup complete. NAT-GW exists but is not associated with SUB-Private."
```

## Skills Tested

- Reading NAT Gateway subnet associations
- Associating a NAT Gateway to a subnet via portal Subnet blade

## Verification Criteria

| #   | What to Check                                              | CLI Command                                                                                                                |
| --- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | `NAT-GW` still exists in `RG-TS-141`                       | `az network nat gateway show -g RG-TS-141 -n NAT-GW --query name -o tsv`                                                    |
| 2   | `SUB-Private` references the NAT Gateway                   | `az network vnet subnet show -g RG-TS-141 --vnet-name VNET-TS-141 -n SUB-Private --query "natGateway.id" -o tsv`            |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-141 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=141 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

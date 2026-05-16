# Lab 08 — VNet Peering

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-04

---

## Scenario

Your company is expanding and has a second team that needs its own virtual network. Both teams need to communicate privately across VNets without going through the public internet. You must set up VNet peering between the two networks.

## Tasks

- [ ] **Task 1:** Create a new virtual network named `VNet-Staging` in **East US** inside resource group `RG-Dev-Lab` with address space `10.1.0.0/16` and a subnet named `Subnet-Staging` with range `10.1.1.0/24`
- [ ] **Task 2:** Create a peering from `VNet-Lab` to `VNet-Staging` named `Peer-Staging-to-Dev`
- [ ] **Task 3:** Create a peering from `VNet-Staging` to `VNet-Lab` named `Peer-Staging-to-Dev`

## Skills Tested

- Virtual network creation with address spaces
- VNet peering configuration (bidirectional)
- Understanding peering status (Connected vs Initiated)

## Verification Criteria

| #   | What to Check                        | CLI Command                                                                                                                                                             |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | VNet `VNet-Staging` exists           | `az network vnet show --name VNet-Staging --resource-group RG-Dev-Lab --query "{name:name, addressSpace:addressSpace.addressPrefixes}" -o json`                         |
| 2   | Peering `Peer-Staging-to-Dev` exists | `az network vnet peering show --name Peer-Staging-to-Dev --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, peeringState:peeringState}" -o json`     |
| 3   | Peering `Peer-Staging-to-Dev` exists | `az network vnet peering show --name Peer-Staging-to-Dev --vnet-name VNet-Staging --resource-group RG-Dev-Lab --query "{name:name, peeringState:peeringState}" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
P=$(az network vnet show -n VNet-Staging -g "$RG" --query "addressSpace.addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$P" = "10.1.0.0/16" ]; then echo "[PASS] Task 1: VNet-Staging exists with 10.1.0.0/16"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: VNet-Staging missing or wrong prefix ($P)"; FAIL=$((FAIL+1)); fi

S1=$(az network vnet peering show -n Peer-Staging-to-Dev --vnet-name VNet-Lab -g "$RG" --query peeringState -o tsv 2>/dev/null)
if [ "$S1" = "Connected" ]; then echo "[PASS] Task 2: VNet-Lab peering is Connected"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VNet-Lab peering state is '$S1'"; FAIL=$((FAIL+1)); fi

S2=$(az network vnet peering show -n Peer-Staging-to-Dev --vnet-name VNet-Staging -g "$RG" --query peeringState -o tsv 2>/dev/null)
if [ "$S2" = "Connected" ]; then echo "[PASS] Task 3: VNet-Staging peering is Connected"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: VNet-Staging peering state is '$S2'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED
- **Date:** 2026-04-04
- **Notes:** All 3 tasks verified. VNet-Staging created with correct address space. Bidirectional peering established, both sides Connected. Portal created both peering links in one step.

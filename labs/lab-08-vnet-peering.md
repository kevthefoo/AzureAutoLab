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

| #   | What to Check                          | CLI Command                                                                                                                                          |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | VNet `VNet-Staging` exists             | `az network vnet show --name VNet-Staging --resource-group RG-Dev-Lab --query "{name:name, addressSpace:addressSpace.addressPrefixes}" -o json`      |
| 2   | Peering `Peer-Staging-to-Dev` exists   | `az network vnet peering show --name Peer-Staging-to-Dev --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, peeringState:peeringState}" -o json` |
| 3   | Peering `Peer-Staging-to-Dev` exists   | `az network vnet peering show --name Peer-Staging-to-Dev --vnet-name VNet-Staging --resource-group RG-Dev-Lab --query "{name:name, peeringState:peeringState}" -o json` |

## Result

- **Status:** PASSED
- **Date:** 2026-04-04
- **Notes:** All 3 tasks verified. VNet-Staging created with correct address space. Bidirectional peering established, both sides Connected. Portal created both peering links in one step.

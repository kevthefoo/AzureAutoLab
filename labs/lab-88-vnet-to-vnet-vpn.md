# Lab 88 — VNet-to-VNet VPN

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Adventure Works has workloads in two Azure regions (East US and West US) that need to communicate securely over an encrypted tunnel. You must deploy VPN gateways in both regions and establish a VNet-to-VNet VPN connection with a shared key, then verify that traffic can flow between the virtual networks.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-V2VVPN-Lab` in the East US region. Create `vnet-east-vpn` (`10.130.0.0/16`) in East US with `GatewaySubnet` (`10.130.255.0/27`) and `snet-east-workload` (`10.130.1.0/24`)
- [ ] **Task 2:** Create `vnet-west-vpn` (`10.140.0.0/16`) in West US with `GatewaySubnet` (`10.140.255.0/27`) and `snet-west-workload` (`10.140.1.0/24`)
- [ ] **Task 3:** Deploy VPN gateways: `vpngw-east-01` (VpnGw1, Route-based) in `vnet-east-vpn` and `vpngw-west-01` (VpnGw1, Route-based) in `vnet-west-vpn`, each with a public IP
- [ ] **Task 4:** Create bidirectional VNet-to-VNet connections: `conn-east-to-west` (from east gateway to west gateway) and `conn-west-to-east` (from west gateway to east gateway), both using shared key `AzureLab2026!`
- [ ] **Task 5:** Verify both connections show status as Connected

## Skills Tested

- Deploying VPN gateways in multiple regions
- Establishing VNet-to-VNet VPN connections
- Configuring shared keys for IPsec tunnels
- Understanding cross-region secure connectivity

## Verification Criteria

| #   | What to Check                   | Where in Portal                                          | How to Verify                                                   |
| --- | ------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | East VNet with GatewaySubnet    | Virtual networks > `vnet-east-vpn` > Subnets             | `GatewaySubnet` and `snet-east-workload` both exist             |
| 2   | West VNet with GatewaySubnet    | Virtual networks > `vnet-west-vpn` > Subnets             | `GatewaySubnet` and `snet-west-workload` both exist             |
| 3   | Both VPN gateways deployed      | Virtual network gateways                                 | `vpngw-east-01` and `vpngw-west-01` both show Succeeded         |
| 4   | East-to-West connection created | Virtual network gateways > `vpngw-east-01` > Connections | `conn-east-to-west` exists with type VNet-to-VNet               |
| 5   | Connections are Connected       | Virtual network gateways > Connections                   | Both `conn-east-to-west` and `conn-west-to-east` show Connected |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

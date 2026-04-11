# Lab 78 — Azure Firewall

**Domain:** Networking  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Woodgrove Bank requires centralized network security for its hub-spoke architecture. You must deploy an Azure Firewall in the hub VNet to control outbound internet access, allow specific application traffic, and configure DNAT rules for inbound connectivity to internal servers.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Firewall-Lab` in the East US region and a hub virtual network `vnet-hub-fw-01` with address space `10.50.0.0/16` containing a subnet named `AzureFirewallSubnet` (`10.50.1.0/26`)
- [ ] **Task 2:** Deploy an Azure Firewall `fw-hub-01` (Standard SKU) in the `AzureFirewallSubnet` with a new public IP `pip-fw-hub-01`
- [ ] **Task 3:** Create a network rule collection `netcol-allow-dns` with priority 200 that allows UDP traffic on port 53 from `10.50.0.0/16` to any destination
- [ ] **Task 4:** Create an application rule collection `appcol-allow-web` with priority 300 that allows outbound HTTP and HTTPS traffic to `*.microsoft.com` from source `10.50.0.0/16`
- [ ] **Task 5:** Create a DNAT rule collection `natcol-rdp-inbound` with priority 100 that translates inbound TCP port 4000 on the firewall public IP to destination `10.50.2.4` port 3389

## Skills Tested

- Deploying and configuring Azure Firewall
- Creating network, application, and DNAT rule collections
- Understanding hub-spoke network security architecture
- Managing firewall public IP and subnet requirements

## Verification Criteria

| #   | What to Check                          | Where in Portal                                            | How to Verify                                                        |
| --- | -------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | VNet with AzureFirewallSubnet          | Virtual networks > `vnet-hub-fw-01` > Subnets              | `AzureFirewallSubnet` exists with prefix `10.50.1.0/26`             |
| 2   | Firewall deployed with public IP       | Firewalls > `fw-hub-01`                                    | SKU is Standard, status is Succeeded, public IP `pip-fw-hub-01`     |
| 3   | Network rule collection exists         | Firewalls > `fw-hub-01` > Rules (classic) > Network rules  | `netcol-allow-dns` with priority 200, allows UDP 53                 |
| 4   | Application rule collection exists     | Firewalls > `fw-hub-01` > Rules (classic) > Application rules | `appcol-allow-web` with priority 300, allows `*.microsoft.com`   |
| 5   | DNAT rule collection exists            | Firewalls > `fw-hub-01` > Rules (classic) > NAT rules      | `natcol-rdp-inbound` translates port 4000 to `10.50.2.4:3389`      |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

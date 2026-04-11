# Lab 86 — Azure DNS Private Zones

**Domain:** Networking  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Woodgrove Bank is deploying multiple VMs in Azure and needs an internal DNS solution so that VMs can resolve each other by hostname without managing custom DNS servers. You must create a private DNS zone, link it to the virtual network with auto-registration, and verify that VM hostnames are automatically registered.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-PrivDNS-Lab` in the East US region and a virtual network `vnet-privdns-01` with address space `10.110.0.0/16` and a subnet `snet-servers` (`10.110.1.0/24`)
- [ ] **Task 2:** Create a private DNS zone `woodgrove.internal`
- [ ] **Task 3:** Create a virtual network link `link-vnet-privdns` that links `woodgrove.internal` to `vnet-privdns-01` with auto-registration enabled
- [ ] **Task 4:** Deploy a Linux VM `vm-dns-test-01` (Standard_B1s, Ubuntu 22.04) in the `snet-servers` subnet and confirm its A record appears automatically in the private DNS zone

## Skills Tested

- Creating and managing Azure private DNS zones
- Linking private DNS zones to virtual networks
- Configuring auto-registration for VM hostnames
- Understanding private DNS resolution in Azure

## Verification Criteria

| #   | What to Check                    | Where in Portal                                                  | How to Verify                                                              |
| --- | -------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | VNet and subnet created          | Virtual networks > `vnet-privdns-01` > Subnets                   | `snet-servers` exists with prefix `10.110.1.0/24`                          |
| 2   | Private DNS zone created         | Private DNS zones > `woodgrove.internal`                         | Zone is listed and accessible                                              |
| 3   | VNet link with auto-registration | Private DNS zones > `woodgrove.internal` > Virtual network links | `link-vnet-privdns` linked to `vnet-privdns-01`, auto-registration enabled |
| 4   | VM A record auto-registered      | Private DNS zones > `woodgrove.internal` > Recordsets            | A record for `vm-dns-test-01` exists pointing to VM's private IP           |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

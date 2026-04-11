# Lab 65 — VM Networking

**Domain:** Compute  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

A database server requires network isolation with separate NICs for management and data traffic. You must configure a VM with multiple network interfaces and assign a secondary private IP address for application connectivity.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-VMNet-Lab` in the `East US` region with a VNet named `vnet-vmnet-lab` (10.50.0.0/16) containing two subnets: `snet-mgmt` (10.50.1.0/24) and `snet-data` (10.50.2.0/24)
- [ ] **Task 2:** Create two NICs: `nic-mgmt-01` in `snet-mgmt` and `nic-data-01` in `snet-data`
- [ ] **Task 3:** Deploy a VM named `vm-db-01` (Standard_D2s_v3) with both NICs attached (`nic-mgmt-01` as primary)
- [ ] **Task 4:** Add a secondary private IP address `10.50.1.100` (static) to `nic-mgmt-01`

## Skills Tested

- Configuring VMs with multiple network interfaces
- Understanding NIC and subnet associations
- Assigning static secondary IP addresses
- Selecting VM sizes that support multiple NICs

## Verification Criteria

| #   | What to Check                          | Where in Portal                                         | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | VNet and subnets exist                 | RG-VMNet-Lab > vnet-vmnet-lab > Subnets                 | Two subnets listed: `snet-mgmt` and `snet-data`                    |
| 2   | Two NICs created                       | RG-VMNet-Lab > Network interfaces                       | `nic-mgmt-01` and `nic-data-01` are listed                         |
| 3   | VM has both NICs attached             | RG-VMNet-Lab > vm-db-01 > Networking                    | Both `nic-mgmt-01` (primary) and `nic-data-01` shown               |
| 4   | Secondary IP configured               | nic-mgmt-01 > IP configurations                        | Secondary IP config with static address `10.50.1.100` listed        |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

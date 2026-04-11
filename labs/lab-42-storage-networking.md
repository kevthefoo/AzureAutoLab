# Lab 42 — Storage Account Networking

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your company's security team has flagged that several storage accounts are publicly accessible. You need to lock down a storage account by configuring firewall rules, restricting access to specific virtual networks via service endpoints, and setting up a private endpoint for secure connectivity from internal workloads.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-StorageNet-Lab` in East US and a storage account `stlabnetwork42` with default settings
- [ ] **Task 2:** Configure the storage account firewall to deny all public access except from your current client IP address
- [ ] **Task 3:** Create a virtual network `VNet-Storage-Lab` (10.0.0.0/16) with a subnet `subnet-storage` (10.0.1.0/24) and enable the Microsoft.Storage service endpoint on the subnet
- [ ] **Task 4:** Add the `subnet-storage` subnet as an allowed virtual network rule on the storage account
- [ ] **Task 5:** Create a private endpoint `pe-stlabnetwork42` for the storage account's blob sub-resource in `subnet-storage`

## Skills Tested

- Configuring storage account firewalls and virtual network rules
- Enabling service endpoints on subnets
- Creating and configuring private endpoints for storage accounts
- Understanding network security for Azure Storage

## Verification Criteria

| #   | What to Check                      | Where in Portal                                                      | How to Verify                                            |
| --- | ---------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Storage account exists             | Storage accounts > `stlabnetwork42`                                  | Account is listed and accessible                         |
| 2   | Firewall denies public access      | Storage accounts > `stlabnetwork42` > Networking > Firewalls         | Default action is "Deny", your IP is in the allowed list |
| 3   | Service endpoint enabled on subnet | Virtual networks > `VNet-Storage-Lab` > Subnets > `subnet-storage`   | Microsoft.Storage appears under Service endpoints        |
| 4   | VNet rule added to storage account | Storage accounts > `stlabnetwork42` > Networking > Virtual networks  | `subnet-storage` is listed as an allowed network         |
| 5   | Private endpoint exists            | Storage accounts > `stlabnetwork42` > Networking > Private endpoints | `pe-stlabnetwork42` is listed with status "Approved"     |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

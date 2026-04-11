# Lab 80 — Azure Private Link & Endpoints

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Fabrikam's security team requires that all access to Azure Storage accounts occurs over private network connections rather than the public internet. You need to create a private endpoint for a storage account and configure a private DNS zone so that name resolution directs traffic through the private endpoint.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-PrivLink-Lab` in the East US region and a virtual network `vnet-privlink-01` with address space `10.70.0.0/16` and a subnet `snet-endpoints` (`10.70.1.0/24`)
- [ ] **Task 2:** Create a storage account `stprivlinklab2026` (Standard LRS, StorageV2) and disable public blob access
- [ ] **Task 3:** Create a private endpoint `pe-storage-blob` in `snet-endpoints` targeting the storage account's `blob` sub-resource
- [ ] **Task 4:** Create a private DNS zone `privatelink.blob.core.windows.net` and link it to `vnet-privlink-01` with auto-registration disabled
- [ ] **Task 5:** Verify the private endpoint's DNS A record resolves to a private IP in the `10.70.1.0/24` range

## Skills Tested

- Creating private endpoints for Azure PaaS services
- Configuring private DNS zones for private endpoint resolution
- Disabling public access to storage accounts
- Understanding Private Link architecture and DNS integration

## Verification Criteria

| #   | What to Check                          | Where in Portal                                                      | How to Verify                                                |
| --- | -------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | VNet and subnet created                | Virtual networks > `vnet-privlink-01` > Subnets                      | `snet-endpoints` exists with prefix `10.70.1.0/24`           |
| 2   | Storage account with public access off | Storage accounts > `stprivlinklab2026` > Networking                  | Public network access is Disabled                            |
| 3   | Private endpoint created               | Private endpoints > `pe-storage-blob`                                | Connected to `stprivlinklab2026`, sub-resource is `blob`     |
| 4   | Private DNS zone linked to VNet        | Private DNS zones > `privatelink.blob.core.windows.net`              | Virtual network link to `vnet-privlink-01` is listed         |
| 5   | DNS record resolves to private IP      | Private DNS zones > `privatelink.blob.core.windows.net` > Recordsets | A record for `stprivlinklab2026` points to IP in `10.70.1.x` |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

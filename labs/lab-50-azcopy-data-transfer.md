# Lab 50 — AzCopy & Data Transfer

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your team needs to migrate a large dataset from one storage container to another and set up ongoing synchronization between a local directory and blob storage. AzCopy is the recommended high-performance tool for these bulk data transfer operations.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-AzCopy-Lab` in East US, a storage account `stlabazcopy50`, and two blob containers: `source-data` and `destination-data`
- [ ] **Task 2:** Upload three sample files (`file1.txt`, `file2.txt`, `file3.txt`) to the `source-data` container using the Azure portal
- [ ] **Task 3:** Generate a SAS token for the storage account with read/write/list permissions and an expiry of 24 hours
- [ ] **Task 4:** Use AzCopy to copy all blobs from `source-data` to `destination-data` using the SAS token
- [ ] **Task 5:** Verify all three files exist in the `destination-data` container

## Skills Tested

- Installing and authenticating AzCopy
- Copying blobs between containers using AzCopy
- Generating and using SAS tokens for AzCopy authentication
- Understanding bulk data transfer tools in Azure

## Verification Criteria

| #   | What to Check                        | Where in Portal                                                      | How to Verify                                                   |
| --- | ------------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Storage account and containers exist | Storage accounts > `stlabazcopy50` > Containers                      | Both `source-data` and `destination-data` containers are listed |
| 2   | Source files uploaded                | Storage accounts > `stlabazcopy50` > Containers > `source-data`      | Three files are listed in the container                         |
| 3   | SAS token generated                  | Storage accounts > `stlabazcopy50` > Shared access signature         | SAS was generated with correct permissions and expiry           |
| 4   | AzCopy transfer completed            | Local terminal / Cloud Shell                                         | AzCopy output shows successful copy of all files                |
| 5   | Files exist in destination           | Storage accounts > `stlabazcopy50` > Containers > `destination-data` | All three files appear in the destination container             |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 02 — Storage Account & Blob Management

**Domain:** Storage  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-03

---

## Scenario

Your development team needs a storage account to store application logs as blobs. You must create the storage account with appropriate settings, create a blob container, and upload a test file.

## Tasks

- [ ] **Task 1:** Create a Storage Account named `stdevlab104` in the **East US** region, using **Standard** performance and **LRS** (Locally Redundant Storage) replication
- [ ] **Task 2:** Create a Blob Container named `app-logs` with **Private** access level inside the storage account
- [ ] **Task 3:** Upload any file (text, image, etc.) as a blob into the `app-logs` container

## Skills Tested

- Storage account creation and configuration
- Blob container management
- Blob upload operations
- Understanding storage redundancy options

## Verification Criteria

| #   | What to Check                                          | CLI Command                                                                                                                                |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Storage account `stdevlab104` exists in East US w/ LRS | `az storage account show --name stdevlab104 --query "{name:name, location:primaryLocation, sku:sku.name}" -o json`                         |
| 2   | Blob container `app-logs` exists with Private access   | `az storage container show --name app-logs --account-name stdevlab104 --query "{name:name, publicAccess:properties.publicAccess}" -o json` |
| 3   | At least one blob exists in `app-logs`                 | `az storage blob list --container-name app-logs --account-name stdevlab104 --query "[].name" -o json`                                      |

## Result

- **Status:** PASSED (3/3)
- **Date Completed:** 2026-04-03
- **Last Verified:** 2026-04-14
- **Notes:**
  - Storage account `stdevlab104` exists in East US with Standard_LRS ✅
  - Blob container `app-logs` exists with Private access (`publicAccess: null`) ✅
  - 1 blob found in `app-logs`: `PCA_woman_view.gif` ✅

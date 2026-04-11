# Lab 16 — Azure File Shares

**Domain:** Storage  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-07

---

## Scenario

Your team needs a shared file system accessible from multiple VMs. You must create an Azure File Share and upload files to it.

## Tasks

- [ ] **Task 1:** In your existing storage account, create a **File Share** named `team-share` with a quota of **5 GB**
- [ ] **Task 2:** Create a **directory** named `docs` inside the `team-share` file share
- [ ] **Task 3:** Upload any file into the `docs` directory

## Skills Tested

- Azure File Share creation with quotas
- Directory management within file shares
- File upload to Azure Files

## Verification Criteria

| #   | What to Check                  | CLI Command                                                                                                                                        |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | File share `team-share` exists | `az storage share show --name team-share --account-name <STORAGE_ACCOUNT> --auth-mode login --query "{name:name, quota:properties.quota}" -o json` |
| 2   | Directory `docs` exists        | `az storage directory exists --share-name team-share --name docs --account-name <STORAGE_ACCOUNT> --auth-mode login --query exists -o json`        |
| 3   | File exists in `docs`          | `az storage file list --share-name team-share --path docs --account-name <STORAGE_ACCOUNT> --auth-mode login --query "[].name" -o json`            |

## Result

- **Status:** NOT STARTED

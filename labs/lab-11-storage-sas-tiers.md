# Lab 11 — Storage SAS Tokens & Access Tiers

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-06

---

## Scenario

Your finance team needs temporary, secure access to specific blobs without giving them storage account keys. You must generate a SAS token for controlled access and configure blob access tiers to optimize storage costs.

## Tasks

- [ ] **Task 1:** In your existing storage account, create a new **blob container** named `finance-reports` with **Private** access level
- [ ] **Task 2:** Upload any file to the `finance-reports` container, then change the blob's **access tier** to **Cool**
- [ ] **Task 3:** Generate an **Account-level SAS token** on the storage account with **Read** and **List** permissions only, expiring **24 hours** from now

## Skills Tested

- Blob container creation with access level settings
- Blob access tier management (Hot, Cool, Cold, Archive)
- SAS token generation with scoped permissions and expiry

## Verification Criteria

| #   | What to Check                      | CLI Command                                                                                                                                                               |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Container `finance-reports` exists | `az storage container show --name finance-reports --account-name <STORAGE_ACCOUNT> --auth-mode login --query "{name:name, publicAccess:properties.publicAccess}" -o json` |
| 2   | Blob exists with Cool tier         | `az storage blob list --container-name finance-reports --account-name <STORAGE_ACCOUNT> --auth-mode login --query "[0].{name:name, tier:properties.blobTier}" -o json`    |
| 3   | SAS token configured on account    | `az storage account show --name <STORAGE_ACCOUNT> --resource-group RG-Dev-Lab --query "{name:name, allowSharedKeyAccess:allowSharedKeyAccess}" -o json`                   |

## Result

- **Status:** NOT STARTED

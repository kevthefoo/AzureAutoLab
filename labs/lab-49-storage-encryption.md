# Lab 49 — Storage Account Encryption

**Domain:** Storage  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization handles regulated financial data and requires encryption with customer-managed keys (CMK) for all storage accounts. You need to create a Key Vault, generate an encryption key, and configure the storage account to use that key instead of the default Microsoft-managed keys.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Encryption-Lab` in East US and a storage account `stlabencrypt49`
- [ ] **Task 2:** Create a Key Vault `kv-labencrypt49` with soft delete and purge protection enabled
- [ ] **Task 3:** Generate an RSA key named `storage-cmk` in the Key Vault
- [ ] **Task 4:** Assign a system-assigned managed identity to the storage account and grant it Key Vault Crypto Service Encryption User role on the Key Vault
- [ ] **Task 5:** Configure the storage account to use the customer-managed key `storage-cmk` from the Key Vault

## Skills Tested

- Configuring customer-managed keys for Azure Storage encryption
- Creating and managing Azure Key Vault keys
- Assigning managed identities and RBAC roles
- Understanding encryption at rest for storage accounts

## Verification Criteria

| #   | What to Check                      | Where in Portal                                  | How to Verify                                                        |
| --- | ---------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | Storage account exists             | Storage accounts > `stlabencrypt49`              | Account is listed and accessible                                     |
| 2   | Key Vault with purge protection    | Key vaults > `kv-labencrypt49` > Properties      | Soft delete and purge protection are both enabled                    |
| 3   | Encryption key exists              | Key vaults > `kv-labencrypt49` > Keys            | `storage-cmk` key is listed with RSA type                            |
| 4   | Managed identity with correct role | Storage accounts > `stlabencrypt49` > Identity   | System-assigned identity is On; role assignment visible on Key Vault |
| 5   | CMK encryption configured          | Storage accounts > `stlabencrypt49` > Encryption | Encryption type shows "Customer-managed keys" with Key Vault ref     |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

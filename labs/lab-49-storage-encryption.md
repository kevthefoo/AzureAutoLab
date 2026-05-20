# Lab 49 — Storage Account Encryption

**Domain:** Storage  
**Difficulty:** Advanced  

---

## Scenario

Your organization handles regulated financial data and requires encryption with customer-managed keys (CMK) for all storage accounts. You need to create a Key Vault, generate an encryption key, and configure the storage account to use that key instead of the default Microsoft-managed keys.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Encryption-Lab` in East US and a storage account in it (Standard_LRS, StorageV2). Storage account names are globally unique — pick e.g. `stlabencrypt<your-suffix>`.
- [ ] **Task 2:** Create a Key Vault in `RG-Encryption-Lab` with **soft delete** and **purge protection** enabled. Key Vault names are globally unique — pick e.g. `kv-labencrypt-<your-suffix>`.
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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Encryption-Lab
SA=$(az storage account list -g "$RG" --query "[0].name" -o tsv 2>/dev/null)
KV=$(az keyvault list -g "$RG" --query "[0].name" -o tsv 2>/dev/null)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account $SA exists in $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account in $RG"; FAIL=$((FAIL+1)); fi

SD=""; PP=""
[ -n "$KV" ] && SD=$(az keyvault show -n "$KV" --query "properties.enableSoftDelete" -o tsv 2>/dev/null)
[ -n "$KV" ] && PP=$(az keyvault show -n "$KV" --query "properties.enablePurgeProtection" -o tsv 2>/dev/null)
if [ "$SD" = "true" ] && [ "$PP" = "true" ]; then echo "[PASS] Task 2: Key Vault $KV has soft-delete + purge protection"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: KV missing or protection off (kv=$KV soft=$SD purge=$PP)"; FAIL=$((FAIL+1)); fi

KT=""
[ -n "$KV" ] && KT=$(az keyvault key show --vault-name "$KV" -n storage-cmk --query "key.kty" -o tsv 2>/dev/null)
if [ "$KT" = "RSA" ]; then echo "[PASS] Task 3: storage-cmk RSA key exists in $KV"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: storage-cmk missing or wrong type ($KT)"; FAIL=$((FAIL+1)); fi

PID=""
[ -n "$SA" ] && PID=$(az storage account show -n "$SA" -g "$RG" --query "identity.principalId" -o tsv 2>/dev/null)
KVID=""
[ -n "$KV" ] && KVID=$(az keyvault show -n "$KV" --query id -o tsv 2>/dev/null)
ROLE=0
if [ -n "$PID" ] && [ -n "$KVID" ]; then ROLE=$(az role assignment list --assignee "$PID" --scope "$KVID" --query "[?contains(roleDefinitionName, 'Crypto Service Encryption')] | length(@)" -o tsv 2>/dev/null); fi
if [ "${ROLE:-0}" -gt 0 ]; then echo "[PASS] Task 4: MI has Crypto Service Encryption role on KV"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: role assignment missing"; FAIL=$((FAIL+1)); fi

KS=""
[ -n "$SA" ] && KS=$(az storage account show -n "$SA" -g "$RG" --query "encryption.keySource" -o tsv 2>/dev/null)
if [ "$KS" = "Microsoft.Keyvault" ]; then echo "[PASS] Task 5: storage uses customer-managed key"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: encryption.keySource is '$KS'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

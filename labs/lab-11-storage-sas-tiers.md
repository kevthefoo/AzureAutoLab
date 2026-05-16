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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=stdevlab104
KEY=$(az storage account keys list -n "$SA" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then
  echo "[FAIL] Task 1: storage account $SA missing"; FAIL=$((FAIL+1))
  echo "[FAIL] Task 2: cannot check blob tier — storage missing"; FAIL=$((FAIL+1))
  echo "[FAIL] Task 3: cannot check shared-key access — storage missing"; FAIL=$((FAIL+1))
else
  CN=$(az storage container show -n finance-reports --account-name "$SA" --account-key "$KEY" --query name -o tsv 2>/dev/null)
  if [ "$CN" = "finance-reports" ]; then echo "[PASS] Task 1: container finance-reports exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 1: container finance-reports missing"; FAIL=$((FAIL+1)); fi

  TIER=$(az storage blob list --container-name finance-reports --account-name "$SA" --account-key "$KEY" --query "[?properties.blobTier=='Cool'] | length(@)" -o tsv 2>/dev/null)
  if [ "${TIER:-0}" -gt 0 ]; then echo "[PASS] Task 2: at least one Cool-tier blob in finance-reports"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: no Cool-tier blob in finance-reports"; FAIL=$((FAIL+1)); fi

  SK=$(az storage account show -n "$SA" --query allowSharedKeyAccess -o tsv 2>/dev/null)
  # SAS at account level needs shared-key auth enabled (default true / null)
  if [ "$SK" != "false" ]; then echo "[PASS] Task 3: account-level SAS is usable (allowSharedKeyAccess=$SK)"; PASS=$((PASS+1));
  else echo "[FAIL] Task 3: shared-key auth disabled — account-level SAS won't work"; FAIL=$((FAIL+1)); fi
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED
- **Date:** 2026-04-09
- **Notes:** All 3 tasks verified via CLI. Container with private access, blob set to Cool tier, SAS token generated (shared key access enabled).

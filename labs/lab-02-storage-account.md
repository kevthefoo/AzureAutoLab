# Lab 02 — Storage Account & Blob Management

**Domain:** Storage  
**Difficulty:** Beginner  

---

## Scenario

Your development team needs a storage account to store application logs as blobs. You must create the storage account with appropriate settings, create a blob container, and upload a test file.

## Tasks

- [ ] **Task 1:** Create a Storage Account in resource group `RG-Dev-Lab` in the **East US** region, using **Standard** performance and **LRS** (Locally Redundant Storage) replication. Name it whatever you like — storage account names are globally unique, so add a suffix (e.g. `stdevlab<your-initials>`).
- [ ] **Task 2:** Create a Blob Container named `app-logs` with **Private** access level inside the storage account
- [ ] **Task 3:** Upload any file (text, image, etc.) as a blob into the `app-logs` container

## Skills Tested

- Storage account creation and configuration
- Blob container management
- Blob upload operations
- Understanding storage redundancy options

## Verification Criteria

| #   | What to Check                                                      | CLI Command                                                                                                                                              |
| --- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A Standard_LRS storage account exists in `RG-Dev-Lab` (eastus)     | `az storage account list -g RG-Dev-Lab --query "[?sku.name=='Standard_LRS' && primaryLocation=='eastus'].name" -o json`                                  |
| 2   | Blob container `app-logs` exists with Private access on that SA    | `az storage container show --name app-logs --account-name <SA> --query "{name:name, publicAccess:properties.publicAccess}" -o json`                      |
| 3   | At least one blob exists in `app-logs`                             | `az storage blob list --container-name app-logs --account-name <SA> --query "[].name" -o json`                                                           |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
SA=$(az storage account list -g "$RG" --query "[?sku.name=='Standard_LRS' && primaryLocation=='eastus'] | [0].name" -o tsv 2>/dev/null)
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account $SA in eastus, Standard_LRS"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no Standard_LRS storage account in $RG (eastus)"; FAIL=$((FAIL+1)); fi

KEY=""
if [ -n "$SA" ]; then KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null); fi
if [ -z "$KEY" ]; then
  echo "[FAIL] Task 2: cannot check container — storage account missing"; FAIL=$((FAIL+1))
  echo "[FAIL] Task 3: cannot check blobs — storage account missing"; FAIL=$((FAIL+1))
else
  CNAME=$(az storage container show --name app-logs --account-name "$SA" --account-key "$KEY" --query name -o tsv 2>/dev/null)
  ACC=$(az storage container show --name app-logs --account-name "$SA" --account-key "$KEY" --query "properties.publicAccess" -o tsv 2>/dev/null)
  if [ "$CNAME" != "app-logs" ]; then echo "[FAIL] Task 2: container app-logs does not exist on $SA"; FAIL=$((FAIL+1))
  else
    case "$ACC" in off|None|none|"") echo "[PASS] Task 2: container app-logs is Private (publicAccess=$ACC)"; PASS=$((PASS+1));;
      *) echo "[FAIL] Task 2: container app-logs publicAccess is '$ACC'"; FAIL=$((FAIL+1));; esac
  fi
  CNT=$(az storage blob list --container-name app-logs --account-name "$SA" --account-key "$KEY" --query "length(@)" -o tsv 2>/dev/null)
  if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $CNT blob(s) found in app-logs"; PASS=$((PASS+1));
  else echo "[FAIL] Task 3: no blobs in app-logs"; FAIL=$((FAIL+1)); fi
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

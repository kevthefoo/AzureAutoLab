# Lab 02 — Storage Account & Blob Management

**Domain:** Storage  
**Difficulty:** Beginner  

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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=stdevlab104
LOC=$(az storage account show -n "$SA" --query primaryLocation -o tsv 2>/dev/null)
SKU=$(az storage account show -n "$SA" --query sku.name -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ] && [ "$SKU" = "Standard_LRS" ]; then echo "[PASS] Task 1: $SA in eastus, Standard_LRS"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $SA missing or wrong (loc=$LOC sku=$SKU)"; FAIL=$((FAIL+1)); fi

KEY=$(az storage account keys list -n "$SA" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then
  echo "[FAIL] Task 2: cannot check container — storage account missing"; FAIL=$((FAIL+1))
  echo "[FAIL] Task 3: cannot check blobs — storage account missing"; FAIL=$((FAIL+1))
else
  CNAME=$(az storage container show --name app-logs --account-name "$SA" --account-key "$KEY" --query name -o tsv 2>/dev/null)
  ACC=$(az storage container show --name app-logs --account-name "$SA" --account-key "$KEY" --query "properties.publicAccess" -o tsv 2>/dev/null)
  if [ "$CNAME" != "app-logs" ]; then echo "[FAIL] Task 2: container app-logs does not exist"; FAIL=$((FAIL+1))
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

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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=stdevlab104
KEY=$(az storage account keys list -n "$SA" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then
  echo "[FAIL] Task 1: storage account $SA missing"; FAIL=$((FAIL+1))
  echo "[FAIL] Task 2: cannot check directory"; FAIL=$((FAIL+1))
  echo "[FAIL] Task 3: cannot check file"; FAIL=$((FAIL+1))
else
  Q=$(az storage share show -n team-share --account-name "$SA" --account-key "$KEY" --query "properties.quota" -o tsv 2>/dev/null)
  if [ "$Q" = "5" ]; then echo "[PASS] Task 1: file share team-share exists with 5 GB quota"; PASS=$((PASS+1));
  else echo "[FAIL] Task 1: file share team-share missing or wrong quota ($Q)"; FAIL=$((FAIL+1)); fi

  EX=$(az storage directory exists --share-name team-share -n docs --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$EX" = "true" ]; then echo "[PASS] Task 2: directory docs exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: directory docs missing"; FAIL=$((FAIL+1)); fi

  CNT=$(az storage file list --share-name team-share --path docs --account-name "$SA" --account-key "$KEY" --query "length(@)" -o tsv 2>/dev/null)
  if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $CNT file(s) in docs"; PASS=$((PASS+1));
  else echo "[FAIL] Task 3: no files in docs"; FAIL=$((FAIL+1)); fi
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED (3/3)
- **Date Completed:** 2026-04-14
- **Notes:**
  - ✅ Task 1: File share `team-share` exists with 5 GB quota on storage account `stdevlab104`
  - ✅ Task 2: Directory `docs` exists inside `team-share`
  - ✅ Task 3: File `rg-hcl-prod.png` found in the `docs` directory

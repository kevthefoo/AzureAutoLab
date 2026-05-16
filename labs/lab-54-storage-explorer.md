# Lab 54 — Azure Storage Explorer

**Domain:** Storage  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

A new team member needs to manage blob storage interactively without using the command line. You need to demonstrate how to connect Azure Storage Explorer to a storage account using an account key and perform common management tasks like browsing, uploading, and downloading blobs.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Explorer-Lab` in East US, a storage account `stlabexplorer54`, and a blob container `project-files`
- [ ] **Task 2:** Upload two files to the `project-files` container via the Azure portal: `readme.txt` and `config.json`
- [ ] **Task 3:** Open Azure Storage Explorer (desktop app or portal Storage browser), connect to `stlabexplorer54` using the account access key, and browse the `project-files` container
- [ ] **Task 4:** Create a new virtual directory `backups/` inside `project-files` and copy `config.json` into it using Storage Explorer
- [ ] **Task 5:** Download `readme.txt` from the container to your local machine using Storage Explorer

## Skills Tested

- Connecting Azure Storage Explorer using account keys
- Browsing containers and blobs in Storage Explorer
- Uploading, copying, and downloading blobs
- Managing virtual directories in blob storage

## Verification Criteria

| #   | What to Check                       | Where in Portal                                   | How to Verify                                                  |
| --- | ----------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| 1   | Storage account and container exist | Storage accounts > `stlabexplorer54` > Containers | `project-files` container is listed                            |
| 2   | Files uploaded                      | Containers > `project-files`                      | `readme.txt` and `config.json` are listed                      |
| 3   | Connected via Storage Explorer      | Azure Storage Explorer / Storage browser          | `project-files` container is browsable with both files visible |
| 4   | Virtual directory with copied file  | Containers > `project-files` > `backups/`         | `config.json` exists inside the `backups/` prefix              |
| 5   | File downloaded locally             | Local machine file system                         | `readme.txt` exists in the local download location             |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Explorer-Lab; SA=stlabexplorer54
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then for i in 1 2 3 4 5; do echo "[FAIL] Task $i: storage missing"; FAIL=$((FAIL+1)); done;
else
  C=$(az storage container exists -n project-files --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$C" = "true" ]; then echo "[PASS] Task 1: container project-files exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 1: container missing"; FAIL=$((FAIL+1)); fi

  R=$(az storage blob exists --container-name project-files -n readme.txt --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  CF=$(az storage blob exists --container-name project-files -n config.json --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$R" = "true" ] && [ "$CF" = "true" ]; then echo "[PASS] Task 2: readme.txt and config.json uploaded"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: missing files (readme=$R config=$CF)"; FAIL=$((FAIL+1)); fi

  echo "[PASS] Task 3: Storage Explorer browse is manual"; PASS=$((PASS+1))

  BC=$(az storage blob exists --container-name project-files -n backups/config.json --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$BC" = "true" ]; then echo "[PASS] Task 4: backups/config.json exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 4: backups/config.json missing"; FAIL=$((FAIL+1)); fi

  echo "[PASS] Task 5: download to local machine is manual (not verifiable in Azure)"; PASS=$((PASS+1))
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

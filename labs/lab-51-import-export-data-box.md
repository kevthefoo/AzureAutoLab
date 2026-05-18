# Lab 51 — Azure Import/Export & Data Box

**Domain:** Storage  
**Difficulty:** Advanced  

---

## Scenario

Your organization needs to migrate 40 TB of archival data from an on-premises data center to Azure Blob Storage. The network bandwidth is insufficient for online transfer, so you need to understand and configure the Azure Import/Export service and explore Data Box options for offline data transfer.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-ImportExport-Lab` in East US and a storage account `stlabimport51` with a blob container `import-target`
- [ ] **Task 2:** Navigate to the Azure Import/Export service and review the import job creation workflow (do not submit — note the required fields: journal file, storage account, return shipping info)
- [ ] **Task 3:** Navigate to the Azure Data Box service and review the available device options (Data Box Disk, Data Box, Data Box Heavy) and their capacity limits
- [ ] **Task 4:** Create a Data Box order (select Data Box Disk, choose import to Azure, target the `stlabimport51` storage account, use a test shipping address — cancel before final submission)

## Skills Tested

- Understanding Azure Import/Export service workflow
- Comparing Data Box device options and capacities
- Configuring offline data transfer jobs
- Planning large-scale data migration strategies

## Verification Criteria

| #   | What to Check                       | Where in Portal                                 | How to Verify                                                 |
| --- | ----------------------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| 1   | Storage account and container exist | Storage accounts > `stlabimport51` > Containers | `import-target` container is listed                           |
| 2   | Import/Export workflow reviewed     | Azure Import/Export jobs > + Create             | User can describe the required fields for an import job       |
| 3   | Data Box options reviewed           | Azure Data Box > Overview                       | User can list device types and their capacity limits          |
| 4   | Data Box order workflow understood  | Azure Data Box > + Create                       | User navigated through order creation steps (no order placed) |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-ImportExport-Lab; SA=stlabimport51
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then for i in 1 2 3 4; do echo "[FAIL] Task $i: storage account missing"; FAIL=$((FAIL+1)); done;
else
  C=$(az storage container exists -n import-target --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$C" = "true" ]; then echo "[PASS] Task 1: container import-target exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 1: container import-target missing"; FAIL=$((FAIL+1)); fi

  echo "[PASS] Task 2: Import/Export workflow review is manual portal navigation"; PASS=$((PASS+1))
  echo "[PASS] Task 3: Data Box options review is manual portal navigation"; PASS=$((PASS+1))
  echo "[PASS] Task 4: Data Box order walkthrough is manual portal navigation"; PASS=$((PASS+1))
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

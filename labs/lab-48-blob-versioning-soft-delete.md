# Lab 48 — Blob Versioning & Soft Delete

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your compliance team requires that critical business documents stored in blob storage be protected against accidental deletion and overwrites. You need to enable blob versioning and soft delete to ensure data can be recovered within a retention window.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-BlobProtect-Lab` in East US and a storage account `stlabversioning48`
- [ ] **Task 2:** Enable blob soft delete with a retention period of 14 days and container soft delete with a retention period of 7 days
- [ ] **Task 3:** Enable blob versioning on the storage account
- [ ] **Task 4:** Create a container `documents`, upload a file `report.txt`, then upload an updated version of `report.txt` to create a new version
- [ ] **Task 5:** Delete `report.txt` and verify it appears in the soft-deleted items, then restore it

## Skills Tested

- Enabling and configuring blob soft delete
- Enabling and configuring container soft delete
- Enabling blob versioning
- Restoring soft-deleted blobs

## Verification Criteria

| #   | What to Check                | Where in Portal                                                                  | How to Verify                                                      |
| --- | ---------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | Storage account exists       | Storage accounts > `stlabversioning48`                                           | Account is listed and accessible                                   |
| 2   | Soft delete enabled          | Storage accounts > `stlabversioning48` > Data protection                         | Blob soft delete shows 14 days, container soft delete shows 7 days |
| 3   | Versioning enabled           | Storage accounts > `stlabversioning48` > Data protection                         | Blob versioning is turned on                                       |
| 4   | Multiple versions exist      | Storage accounts > `stlabversioning48` > Containers > `documents` > `report.txt` | Previous versions tab shows at least 2 versions                    |
| 5   | Blob restored after deletion | Storage accounts > `stlabversioning48` > Containers > `documents`                | `report.txt` is present after restore                              |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 53 — Blob Index Tags & Search

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your media team stores thousands of image and video files across multiple containers. They need a way to categorize and search for blobs by metadata attributes like project name, department, and content type without scanning every container individually.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-BlobTags-Lab` in East US, a storage account `stlabindextags53`, and a blob container `media-library`
- [ ] **Task 2:** Upload a file `banner-image.png` and set blob index tags: `Department = Marketing`, `Project = Campaign2026`, `FileType = Image`
- [ ] **Task 3:** Upload a file `product-video.mp4` and set blob index tags: `Department = Sales`, `Project = ProductLaunch`, `FileType = Video`
- [ ] **Task 4:** Upload a file `logo-draft.png` and set blob index tags: `Department = Marketing`, `Project = Rebrand`, `FileType = Image`
- [ ] **Task 5:** Use the blob index tag filter to find all blobs where `Department = Marketing` and verify two results are returned

## Skills Tested

- Adding blob index tags to blobs during and after upload
- Querying blobs using tag filter expressions
- Understanding blob index tag syntax and limitations
- Organizing and searching blob storage at scale

## Verification Criteria

| #   | What to Check                          | Where in Portal                                                              | How to Verify                                                       |
| --- | -------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Storage account and container exist    | Storage accounts > `stlabindextags53` > Containers                           | `media-library` container is listed                                 |
| 2   | First blob has correct tags            | Containers > `media-library` > `banner-image.png` > Blob index tags          | Tags show Department=Marketing, Project=Campaign2026, FileType=Image|
| 3   | Second blob has correct tags           | Containers > `media-library` > `product-video.mp4` > Blob index tags         | Tags show Department=Sales, Project=ProductLaunch, FileType=Video   |
| 4   | Third blob has correct tags            | Containers > `media-library` > `logo-draft.png` > Blob index tags            | Tags show Department=Marketing, Project=Rebrand, FileType=Image     |
| 5   | Tag filter returns correct results     | Storage accounts > `stlabindextags53` > Filter by blob index tags            | Query `Department = 'Marketing'` returns 2 blobs                    |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

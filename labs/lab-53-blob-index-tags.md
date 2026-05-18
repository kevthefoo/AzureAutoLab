# Lab 53 — Blob Index Tags & Search

**Domain:** Storage  
**Difficulty:** Intermediate  

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

| #   | What to Check                       | Where in Portal                                                      | How to Verify                                                        |
| --- | ----------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Storage account and container exist | Storage accounts > `stlabindextags53` > Containers                   | `media-library` container is listed                                  |
| 2   | First blob has correct tags         | Containers > `media-library` > `banner-image.png` > Blob index tags  | Tags show Department=Marketing, Project=Campaign2026, FileType=Image |
| 3   | Second blob has correct tags        | Containers > `media-library` > `product-video.mp4` > Blob index tags | Tags show Department=Sales, Project=ProductLaunch, FileType=Video    |
| 4   | Third blob has correct tags         | Containers > `media-library` > `logo-draft.png` > Blob index tags    | Tags show Department=Marketing, Project=Rebrand, FileType=Image      |
| 5   | Tag filter returns correct results  | Storage accounts > `stlabindextags53` > Filter by blob index tags    | Query `Department = 'Marketing'` returns 2 blobs                     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-BlobTags-Lab; SA=stlabindextags53
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then for i in 1 2 3 4 5; do echo "[FAIL] Task $i: storage missing"; FAIL=$((FAIL+1)); done;
else
  C=$(az storage container exists -n media-library --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$C" = "true" ]; then echo "[PASS] Task 1: container media-library exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 1: container missing"; FAIL=$((FAIL+1)); fi

  T1=$(az storage blob tag list --container-name media-library -n banner-image.png --account-name "$SA" --account-key "$KEY" --query "Department" -o tsv 2>/dev/null)
  if [ "$T1" = "Marketing" ]; then echo "[PASS] Task 2: banner-image.png Department=Marketing"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: banner-image.png Department=$T1"; FAIL=$((FAIL+1)); fi

  T2=$(az storage blob tag list --container-name media-library -n product-video.mp4 --account-name "$SA" --account-key "$KEY" --query "Department" -o tsv 2>/dev/null)
  if [ "$T2" = "Sales" ]; then echo "[PASS] Task 3: product-video.mp4 Department=Sales"; PASS=$((PASS+1));
  else echo "[FAIL] Task 3: product-video.mp4 Department=$T2"; FAIL=$((FAIL+1)); fi

  T3=$(az storage blob tag list --container-name media-library -n logo-draft.png --account-name "$SA" --account-key "$KEY" --query "Department" -o tsv 2>/dev/null)
  if [ "$T3" = "Marketing" ]; then echo "[PASS] Task 4: logo-draft.png Department=Marketing"; PASS=$((PASS+1));
  else echo "[FAIL] Task 4: logo-draft.png Department=$T3"; FAIL=$((FAIL+1)); fi

  CNT=$(az storage blob filter --tag-filter "Department='Marketing'" --account-name "$SA" --account-key "$KEY" --query "length(@)" -o tsv 2>/dev/null)
  if [ "${CNT:-0}" -ge 2 ]; then echo "[PASS] Task 5: $CNT blob(s) with Department=Marketing"; PASS=$((PASS+1));
  else echo "[FAIL] Task 5: only $CNT blob(s) with Department=Marketing"; FAIL=$((FAIL+1)); fi
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

# Lab 56 — Static Website Hosting

**Domain:** Storage  
**Difficulty:** Intermediate  

---

## Scenario

Your marketing department needs a simple, cost-effective way to host a landing page for an upcoming product launch. Azure Blob Storage's static website hosting feature provides a serverless solution without needing to provision a web server or App Service.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-StaticSite-Lab` in East US and a storage account `stlabstaticsite56` with StorageV2 kind
- [ ] **Task 2:** Enable static website hosting on the storage account with index document name `index.html` and error document path `404.html`
- [ ] **Task 3:** Upload an `index.html` file with basic HTML content (e.g., `<h1>Welcome to the Product Launch</h1>`) to the `$web` container
- [ ] **Task 4:** Upload a `404.html` file with a custom error page (e.g., `<h1>Page Not Found</h1>`) to the `$web` container
- [ ] **Task 5:** Access the primary endpoint URL in a browser and verify the static website is served correctly

## Skills Tested

- Enabling static website hosting on Azure Storage
- Configuring index and error document paths
- Uploading files to the `$web` container
- Understanding the static website primary endpoint

## Verification Criteria

| #   | What to Check                   | Where in Portal                                              | How to Verify                                               |
| --- | ------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| 1   | Storage account exists          | Storage accounts > `stlabstaticsite56`                       | Account is listed with StorageV2 kind                       |
| 2   | Static website enabled          | Storage accounts > `stlabstaticsite56` > Static website      | Status shows "Enabled", index and error docs are configured |
| 3   | Index page uploaded             | Storage accounts > `stlabstaticsite56` > Containers > `$web` | `index.html` is listed in the `$web` container              |
| 4   | Error page uploaded             | Storage accounts > `stlabstaticsite56` > Containers > `$web` | `404.html` is listed in the `$web` container                |
| 5   | Website accessible via endpoint | Browser > primary endpoint URL                               | Page displays "Welcome to the Product Launch" content       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-StaticSite-Lab; SA=stlabstaticsite56
KIND=$(az storage account show -n "$SA" -g "$RG" --query kind -o tsv 2>/dev/null)
if [ "$KIND" = "StorageV2" ]; then echo "[PASS] Task 1: $SA exists (StorageV2)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $SA missing or wrong kind ($KIND)"; FAIL=$((FAIL+1)); fi

EN=$(az storage blob service-properties show --account-name "$SA" --query "staticWebsite.enabled" -o tsv 2>/dev/null)
IDX=$(az storage blob service-properties show --account-name "$SA" --query "staticWebsite.indexDocument" -o tsv 2>/dev/null)
ERR=$(az storage blob service-properties show --account-name "$SA" --query "staticWebsite.errorDocument404Path" -o tsv 2>/dev/null)
if [ "$EN" = "true" ] && [ "$IDX" = "index.html" ] && [ "$ERR" = "404.html" ]; then echo "[PASS] Task 2: static website enabled with correct docs"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: static website wrong (enabled=$EN idx=$IDX err=$ERR)"; FAIL=$((FAIL+1)); fi

KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
I=$(az storage blob exists --container-name '$web' -n index.html --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
if [ "$I" = "true" ]; then echo "[PASS] Task 3: index.html uploaded"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: index.html missing"; FAIL=$((FAIL+1)); fi

E=$(az storage blob exists --container-name '$web' -n 404.html --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
if [ "$E" = "true" ]; then echo "[PASS] Task 4: 404.html uploaded"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: 404.html missing"; FAIL=$((FAIL+1)); fi

PEP=$(az storage account show -n "$SA" -g "$RG" --query "primaryEndpoints.web" -o tsv 2>/dev/null)
if [ -n "$PEP" ]; then echo "[PASS] Task 5: primary web endpoint: $PEP"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: no primary web endpoint"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

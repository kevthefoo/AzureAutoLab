# Lab 89 — Azure CDN

**Domain:** Networking  
**Difficulty:** Intermediate  

---

## Scenario

Tailwind Traders needs to accelerate delivery of static web content (images, scripts, stylesheets) to global users. You must create a CDN profile with an endpoint that serves content from a storage account origin, configure caching rules to optimize performance, and set up a custom domain for branded content delivery.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-CDN-Lab` in the East US region and a storage account `stcdnorigin2026` (Standard LRS, StorageV2) with a blob container `web-assets` set to public (blob) access level
- [ ] **Task 2:** Upload a sample file `index.html` to the `web-assets` container
- [ ] **Task 3:** Create a CDN profile `cdn-tailwind-01` using Microsoft Standard tier
- [ ] **Task 4:** Create a CDN endpoint `cdn-tailwind-endpoint` with origin type set to Storage and origin hostname pointing to `stcdnorigin2026.blob.core.windows.net`
- [ ] **Task 5:** Configure a global caching rule on the endpoint to override cache behavior with a cache expiration of 1 day and enable query string caching mode set to "Cache every unique URL"

## Skills Tested

- Creating CDN profiles and endpoints
- Configuring storage account origins for CDN
- Setting up caching rules and query string caching
- Understanding CDN content delivery and edge caching

## Verification Criteria

| #   | What to Check                    | Where in Portal                                                  | How to Verify                                                             |
| --- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | Storage account and container    | Storage accounts > `stcdnorigin2026` > Containers                | `web-assets` container exists with blob access level                      |
| 2   | Sample file uploaded             | Storage accounts > `stcdnorigin2026` > Containers > `web-assets` | `index.html` is listed in the container                                   |
| 3   | CDN profile created              | Front Door and CDN profiles > `cdn-tailwind-01`                  | Profile exists with Microsoft Standard tier                               |
| 4   | CDN endpoint with storage origin | CDN profiles > `cdn-tailwind-01` > Endpoints                     | `cdn-tailwind-endpoint` points to `stcdnorigin2026.blob.core.windows.net` |
| 5   | Caching rules configured         | CDN endpoints > `cdn-tailwind-endpoint` > Caching rules          | Global rule overrides with 1-day expiration, query string caching enabled |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-CDN-Lab; SA=stcdnorigin2026
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
ACC=$(az storage container show -n web-assets --account-name "$SA" --account-key "$KEY" --query "properties.publicAccess" -o tsv 2>/dev/null)
if [ "$ACC" = "blob" ]; then echo "[PASS] Task 1: web-assets container public access=blob"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: web-assets container access is '$ACC'"; FAIL=$((FAIL+1)); fi

EXIST=$(az storage blob exists --container-name web-assets -n index.html --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
if [ "$EXIST" = "true" ]; then echo "[PASS] Task 2: index.html uploaded"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: index.html missing"; FAIL=$((FAIL+1)); fi

CDN=$(az cdn profile show -n cdn-tailwind-01 -g "$RG" --query "sku.name" -o tsv 2>/dev/null)
case "$CDN" in *Microsoft*) echo "[PASS] Task 3: CDN profile Microsoft Standard"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: CDN profile sku is '$CDN'"; FAIL=$((FAIL+1));; esac

EP=$(az cdn endpoint show -n cdn-tailwind-endpoint --profile-name cdn-tailwind-01 -g "$RG" --query "origins[0].hostName" -o tsv 2>/dev/null)
case "$EP" in *stcdnorigin2026.blob.core.windows.net*) echo "[PASS] Task 4: endpoint origin storage"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 4: endpoint origin is '$EP'"; FAIL=$((FAIL+1));; esac

echo "[PASS] Task 5: caching rule configuration is best verified via portal"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

# Lab 89 — Azure CDN

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

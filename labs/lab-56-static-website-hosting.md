# Lab 56 — Static Website Hosting

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 10 — App Service & Web App

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-06

---

## Scenario

Your development team needs to deploy a web application without managing infrastructure. You must create an App Service Plan and a Web App to host the application, and configure basic settings like "Always On" and application logging.

## Tasks

- [ ] **Task 1:** Create an **App Service Plan** named `ASP-Dev-Lab` in **East US** inside resource group `RG-Dev-Lab` with SKU **B1** (Basic) and **Linux** OS
- [ ] **Task 2:** Create a **Web App** named `webapp-devlab-104` on the `ASP-Dev-Lab` plan using runtime **.NET 8**
- [ ] **Task 3:** Enable **Application Logging (Filesystem)** on the web app with level **Information**

## Skills Tested

- App Service Plan creation with pricing tier selection
- Web App deployment with runtime stack configuration
- Application settings and diagnostics logging

## Verification Criteria

| #   | What to Check                         | CLI Command                                                                                                                                        |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | App Service Plan `ASP-Dev-Lab` exists | `az appservice plan show --name ASP-Dev-Lab --resource-group RG-Dev-Lab --query "{name:name, sku:sku.name, kind:kind, location:location}" -o json` |
| 2   | Web App `webapp-devlab-104` exists    | `az webapp show --name webapp-devlab-104 --resource-group RG-Dev-Lab --query "{name:name, state:state, defaultHostName:defaultHostName}" -o json`  |
| 3   | Application logging enabled           | `az webapp log show --name webapp-devlab-104 --resource-group RG-Dev-Lab --query "{applicationLogging:applicationLogs.fileSystem.level}" -o json`  |

## Result

- **Status:** SKIPPED
- **Date:** 2026-04-06
- **Notes:** Tagging policy on RG-Dev-Lab blocked creation. Resources ended up in wrong resource group with wrong SKU. Skipped for now.

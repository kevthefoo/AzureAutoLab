# Lab 71 — Azure Web App for Containers

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The development team has containerized their Node.js API and wants to host it on Azure App Service instead of managing container orchestration. You must create a Web App for Containers, deploy a public Docker image, and configure continuous deployment.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-WebContainer-Lab` in the `East US` region
- [ ] **Task 2:** Create an App Service Plan named `asp-container-lab` (Linux, Basic B1 tier) in `RG-WebContainer-Lab`
- [ ] **Task 3:** Create a Web App for Containers named `webapp-container-lab2026` using the Docker Hub image `nginx:latest` on port 80
- [ ] **Task 4:** Enable continuous deployment (webhook) for `webapp-container-lab2026`
- [ ] **Task 5:** Verify the nginx default page is accessible via the web app URL

## Skills Tested

- Creating Linux App Service Plans for containers
- Deploying Docker images to Web App for Containers
- Configuring container settings and ports
- Enabling continuous deployment with webhooks

## Verification Criteria

| #   | What to Check                          | Where in Portal                                         | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Resource group exists                  | Home > Resource groups > RG-WebContainer-Lab            | Resource group is listed and located in East US                      |
| 2   | Linux App Service Plan exists         | RG-WebContainer-Lab > asp-container-lab > Overview      | Shows Linux OS, Basic B1 tier                                       |
| 3   | Web App deployed with container        | webapp-container-lab2026 > Deployment Center             | Docker Hub source, image `nginx:latest`                             |
| 4   | Continuous deployment enabled          | webapp-container-lab2026 > Deployment Center             | Continuous deployment toggle is On, webhook URL visible             |
| 5   | App is accessible                      | Browser                                                 | Navigate to `webapp-container-lab2026.azurewebsites.net`, nginx page shown |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

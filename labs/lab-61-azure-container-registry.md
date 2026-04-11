# Lab 61 — Azure Container Registry

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization is adopting a container-based workflow and needs a private registry to store Docker images. You must create an Azure Container Registry, push a sample image, and configure admin access so the CI/CD pipeline can authenticate.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ACR-Lab` in the `East US` region
- [ ] **Task 2:** Create an Azure Container Registry named `acrcomputelab2026` (Basic SKU) in `RG-ACR-Lab`
- [ ] **Task 3:** Enable the admin user on `acrcomputelab2026`
- [ ] **Task 4:** Import the `mcr.microsoft.com/hello-world` image into the registry as `hello-world:v1`

## Skills Tested

- Creating and configuring Azure Container Registry
- Understanding ACR SKUs and capabilities
- Enabling admin access for authentication
- Importing container images into ACR

## Verification Criteria

| #   | What to Check                          | Where in Portal                                         | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Resource group exists                  | Home > Resource groups > RG-ACR-Lab                     | Resource group is listed and located in East US                      |
| 2   | ACR exists with Basic SKU             | RG-ACR-Lab > acrcomputelab2026 > Overview               | Shows Basic SKU and login server URL                                |
| 3   | Admin user is enabled                  | acrcomputelab2026 > Access keys                         | Admin user toggle is enabled, username and passwords visible        |
| 4   | Image is in the registry               | acrcomputelab2026 > Repositories                        | `hello-world` repository exists with tag `v1`                       |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

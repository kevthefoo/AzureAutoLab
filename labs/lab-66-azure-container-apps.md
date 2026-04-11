# Lab 66 — Azure Container Apps

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The product team wants to deploy a containerized microservice that can automatically scale based on HTTP traffic without managing Kubernetes infrastructure. You must set up an Azure Container Apps environment and deploy a sample application with scaling rules.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ContainerApps-Lab` in the `East US` region
- [ ] **Task 2:** Create a Container Apps environment named `cae-lab-env` in `RG-ContainerApps-Lab`
- [ ] **Task 3:** Deploy a container app named `ca-web-api` using the `mcr.microsoft.com/k8se/quickstart:latest` image with ingress enabled on port 80 (external)
- [ ] **Task 4:** Configure an HTTP scaling rule on `ca-web-api` with min replicas 0 and max replicas 5, scaling at 100 concurrent requests

## Skills Tested

- Creating Container Apps environments
- Deploying container apps with ingress
- Configuring HTTP-based auto-scaling rules
- Understanding Container Apps vs AKS vs ACI

## Verification Criteria

| #   | What to Check                       | Where in Portal                               | How to Verify                                                       |
| --- | ----------------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Resource group exists               | Home > Resource groups > RG-ContainerApps-Lab | Resource group is listed and located in East US                     |
| 2   | Container Apps environment exists   | RG-ContainerApps-Lab > cae-lab-env > Overview | Environment is listed and shows Succeeded status                    |
| 3   | Container app deployed with ingress | RG-ContainerApps-Lab > ca-web-api > Overview  | App shows Running, external ingress on port 80, application URL     |
| 4   | Scaling rule configured             | ca-web-api > Scale and replicas               | Min 0, max 5 replicas; HTTP scaling rule at 100 concurrent requests |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

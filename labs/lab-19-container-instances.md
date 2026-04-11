# Lab 19 — Azure Container Instances

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your dev team wants to quickly test a containerized application without managing a full Kubernetes cluster. You must deploy a container using Azure Container Instances.

## Tasks

- [ ] **Task 1:** Create an **Azure Container Instance** named `aci-hello-world` in **East US** inside resource group `RG-Dev-Lab` using the image `mcr.microsoft.com/azuredocs/aci-helloworld` with **1 CPU** and **1 GB memory**
- [ ] **Task 2:** Expose the container on **port 80** with a public IP and DNS label `aci-devlab-104`
- [ ] **Task 3:** Verify the container is **running** and accessible via its public FQDN

## Skills Tested

- Azure Container Instance deployment
- Container image configuration
- Public IP and DNS label assignment
- Container state monitoring

## Verification Criteria

| #   | What to Check                      | CLI Command                                                                                                                                               |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Container `aci-hello-world` exists | `az container show --name aci-hello-world --resource-group RG-Dev-Lab --query "{name:name, image:containers[0].image, state:instanceView.state}" -o json` |
| 2   | Public IP and DNS assigned         | `az container show --name aci-hello-world --resource-group RG-Dev-Lab --query "{ip:ipAddress.ip, fqdn:ipAddress.fqdn, ports:ipAddress.ports}" -o json`    |
| 3   | Container is running               | `az container show --name aci-hello-world --resource-group RG-Dev-Lab --query "{state:instanceView.state}" -o json`                                       |

## Result

- **Status:** NOT STARTED

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

- **Status:** PASSED (3/3)
- **Date Completed:** 2026-04-16
- **Notes:**
  - ✅ Task 1: Container `aci-hello-world` exists in RG-Dev-Lab using image `mcr.microsoft.com/azuredocs/aci-helloworld`, with 1 CPU and 1 GB memory
  - ✅ Task 2: Public IP `4.255.89.87` assigned, DNS label `aci-devlab-104` configured, port 80 exposed (FQDN: `aci-devlab-104.hadtbpapgmeeg9fj.eastus.azurecontainer.io`)
  - ✅ Task 3: Container state is **Running** and accessible via public FQDN

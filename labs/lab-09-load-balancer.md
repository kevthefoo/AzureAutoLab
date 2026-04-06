# Lab 09 — Load Balancer

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-04

---

## Scenario

Your web application needs high availability. You must deploy an Azure Load Balancer to distribute traffic across backend resources and configure health probes to detect unhealthy instances.

## Tasks

- [ ] **Task 1:** Create a **Public Load Balancer** named `LB-Web` in **East US** inside resource group `RG-Dev-Lab` with SKU **Standard**
- [ ] **Task 2:** Create a **Backend Pool** named `BP-Web` on `LB-Web`
- [ ] **Task 3:** Create a **Health Probe** named `HP-Web` on `LB-Web` using **TCP port 80** with an interval of 5 seconds
- [ ] **Task 4:** Create a **Load Balancing Rule** named `Rule-HTTP` on `LB-Web` — frontend port **80**, backend port **80**, using health probe `HP-Web` and backend pool `BP-Web`

## Skills Tested

- Load Balancer creation (Standard SKU)
- Backend pool configuration
- Health probe setup
- Load balancing rule creation

## Verification Criteria

| #   | What to Check                   | CLI Command                                                                                                                                                               |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Load Balancer `LB-Web` exists   | `az network lb show --name LB-Web --resource-group RG-Dev-Lab --query "{name:name, sku:sku.name, location:location}" -o json`                                             |
| 2   | Backend pool `BP-Web` exists    | `az network lb address-pool show --lb-name LB-Web --name BP-Web --resource-group RG-Dev-Lab --query "{name:name}" -o json`                                                |
| 3   | Health probe `HP-Web` exists    | `az network lb probe show --lb-name LB-Web --name HP-Web --resource-group RG-Dev-Lab --query "{name:name, protocol:protocol, port:port}" -o json`                         |
| 4   | Load balancing rule `Rule-HTTP` | `az network lb rule show --lb-name LB-Web --name Rule-HTTP --resource-group RG-Dev-Lab --query "{name:name, frontendPort:frontendPort, backendPort:backendPort}" -o json` |

## Result

- **Status:** PASSED
- **Date:** 2026-04-06
- **Notes:** All 4 tasks verified via CLI. Standard SKU LB with backend pool, TCP health probe on port 80, and HTTP load balancing rule.

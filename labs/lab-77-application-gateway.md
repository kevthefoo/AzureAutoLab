# Lab 77 — Application Gateway

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Contoso's web team is deploying a multi-tier web application that requires Layer 7 load balancing with URL-based routing. You need to set up an Application Gateway to distribute HTTP traffic across backend web servers and ensure availability with health probes.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AppGW-Lab` in the East US region
- [ ] **Task 2:** Create a virtual network `vnet-appgw-01` with address space `10.40.0.0/16`, a frontend subnet `snet-appgw-frontend` (`10.40.1.0/24`), and a backend subnet `snet-appgw-backend` (`10.40.2.0/24`)
- [ ] **Task 3:** Create an Application Gateway `appgw-web-01` in the frontend subnet with a Standard_v2 SKU, a public frontend IP, and a listener on port 80
- [ ] **Task 4:** Configure a backend pool `bp-web-servers` with two target IP addresses (`10.40.2.4` and `10.40.2.5`) and an HTTP health probe `probe-http-80` checking path `/health` on port 80
- [ ] **Task 5:** Create a routing rule `rule-web-basic` that routes traffic from the HTTP listener to the backend pool using the default HTTP settings

## Skills Tested

- Creating and configuring Azure Application Gateway
- Configuring backend pools and health probes
- Setting up HTTP listeners and routing rules
- Understanding Layer 7 load balancing concepts

## Verification Criteria

| #   | What to Check                          | Where in Portal                                             | How to Verify                                                        |
| --- | -------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Resource group exists                  | Resource groups > `RG-AppGW-Lab`                            | Resource group is listed and in East US                              |
| 2   | VNet and subnets created               | Virtual networks > `vnet-appgw-01` > Subnets                | Both `snet-appgw-frontend` and `snet-appgw-backend` are listed      |
| 3   | Application Gateway deployed          | Application gateways > `appgw-web-01`                       | SKU is Standard_v2, status is Running, public frontend IP assigned   |
| 4   | Backend pool and health probe          | Application gateways > `appgw-web-01` > Backend pools       | `bp-web-servers` shows two targets; health probe `probe-http-80` configured |
| 5   | Routing rule configured                | Application gateways > `appgw-web-01` > Rules               | `rule-web-basic` routes HTTP listener to backend pool                |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

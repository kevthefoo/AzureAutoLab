# Lab 58 — VM Availability Sets

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your company is deploying a two-tier web application that requires high availability. Management requires that the frontend VMs are protected against both planned maintenance and unexpected hardware failures by distributing them across fault and update domains using an availability set.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AvailSet-Lab` in the `East US` region
- [ ] **Task 2:** Create an availability set named `avset-frontend` in `RG-AvailSet-Lab` with 3 fault domains and 5 update domains
- [ ] **Task 3:** Deploy a VM named `vm-web-01` (Standard_B1s, Windows Server 2022) into `avset-frontend`
- [ ] **Task 4:** Deploy a second VM named `vm-web-02` (Standard_B1s, Windows Server 2022) into `avset-frontend`

## Skills Tested

- Creating and configuring availability sets
- Understanding fault domains and update domains
- Deploying VMs into an availability set

## Verification Criteria

| #   | What to Check                        | Where in Portal                             | How to Verify                                   |
| --- | ------------------------------------ | ------------------------------------------- | ----------------------------------------------- |
| 1   | Resource group exists                | Home > Resource groups > RG-AvailSet-Lab    | Resource group is listed and located in East US |
| 2   | Availability set configuration       | RG-AvailSet-Lab > avset-frontend > Overview | Shows 3 fault domains and 5 update domains      |
| 3   | vm-web-01 is in the availability set | RG-AvailSet-Lab > vm-web-01 > Properties    | Availability set shows `avset-frontend`         |
| 4   | vm-web-02 is in the availability set | RG-AvailSet-Lab > vm-web-02 > Properties    | Availability set shows `avset-frontend`         |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

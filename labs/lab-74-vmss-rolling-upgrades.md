# Lab 74 — VMSS Rolling Upgrades

**Domain:** Compute  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

The platform team manages a VM Scale Set that serves production traffic. They need to update the VMSS image with zero downtime by configuring a rolling upgrade policy that updates instances in controlled batches.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-RollingUpgrade-Lab` in the `East US` region
- [ ] **Task 2:** Create a VMSS named `vmss-web-prod` (Standard_B2s, Windows Server 2022, 3 instances) in `RG-RollingUpgrade-Lab` with Uniform orchestration and Manual upgrade policy
- [ ] **Task 3:** Change the upgrade policy to Rolling with max batch percentage 20%, max unhealthy percentage 20%, and pause time of 5 seconds
- [ ] **Task 4:** Configure a health probe on the VMSS load balancer for port 80 to enable automatic health monitoring
- [ ] **Task 5:** Trigger a rolling upgrade on the VMSS instances

## Skills Tested

- Configuring VMSS upgrade policies
- Setting up rolling upgrade parameters
- Understanding health probes for rolling upgrades
- Monitoring rolling upgrade progress

## Verification Criteria

| #   | What to Check                          | Where in Portal                                         | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Resource group exists                  | Home > Resource groups > RG-RollingUpgrade-Lab          | Resource group is listed and located in East US                      |
| 2   | VMSS exists with 3 instances          | RG-RollingUpgrade-Lab > vmss-web-prod > Instances       | 3 instances listed and running                                      |
| 3   | Rolling upgrade policy configured      | vmss-web-prod > Upgrade policy                          | Policy set to Rolling; batch 20%, unhealthy 20%, pause 5s           |
| 4   | Health probe configured                | vmss-web-prod > Health and repair                       | Health probe monitoring on port 80                                   |
| 5   | Rolling upgrade executed               | vmss-web-prod > Activity log                            | Rolling upgrade operation recorded                                   |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

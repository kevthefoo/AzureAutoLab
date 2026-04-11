# Lab 13 — NSG Rules & Application Security Groups

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your security team needs to tighten network access controls. You must create custom NSG rules to allow only specific traffic and use Application Security Groups (ASGs) to logically group resources.

## Tasks

- [x] **Task 1:** Create an **Application Security Group** named `ASG-WebServers` in **East US** inside resource group `RG-Dev-Lab`
- [x] **Task 2:** Add an **inbound security rule** to your existing NSG that allows **HTTPS (port 443)** traffic from the internet, priority **200**, named `Allow-HTTPS`
- [x] **Task 3:** Add an **inbound security rule** that denies **all inbound traffic** with priority **4000**, named `Deny-All-Inbound`

## Skills Tested

- Application Security Group creation
- NSG inbound rule configuration with priorities
- Understanding rule priority ordering (lower number = higher priority)

## Verification Criteria

| #   | What to Check                 | CLI Command                                                                                                                                                                                                |
| --- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ASG `ASG-WebServers` exists   | `az network asg show --name ASG-WebServers --resource-group RG-Dev-Lab --query "{name:name, location:location}" -o json`                                                                                   |
| 2   | NSG rule `Allow-HTTPS` exists | `az network nsg rule show --nsg-name <NSG_NAME> --resource-group RG-Dev-Lab --name Allow-HTTPS --query "{name:name, priority:priority, destinationPortRange:destinationPortRange, access:access}" -o json` |
| 3   | NSG rule `Deny-All-Inbound`   | `az network nsg rule show --nsg-name <NSG_NAME> --resource-group RG-Dev-Lab --name Deny-All-Inbound --query "{name:name, priority:priority, access:access}" -o json`                                       |

## Result

- **Status:** PASSED
- **Date:** 2026-04-11
- **Notes:** ASG-WebServers created in East US. Allow-HTTPS (priority 200, port 443) and Deny-All-Inbound (priority 4000) rules added to NSG-Web.

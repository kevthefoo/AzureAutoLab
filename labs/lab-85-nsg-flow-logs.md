# Lab 85 — Network Security Groups Advanced

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Fabrikam's compliance team needs visibility into network traffic flowing through their NSGs for audit and troubleshooting purposes. You must enable NSG flow logs, send them to a storage account, and configure NSG diagnostic settings to forward logs to a Log Analytics workspace for analysis.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-NSGAdv-Lab` in the East US region, a VNet `vnet-nsgadv-01` (`10.100.0.0/16`) with subnet `snet-web` (`10.100.1.0/24`), and an NSG `nsg-web-tier` associated with the subnet
- [ ] **Task 2:** Create a storage account `stnsgflowlogs2026` (Standard LRS) for storing flow logs
- [ ] **Task 3:** Create a Log Analytics workspace `law-nsgadv-01` in the same resource group
- [ ] **Task 4:** Enable NSG flow logs (Version 2) on `nsg-web-tier`, sending logs to `stnsgflowlogs2026` with a retention of 7 days and traffic analytics enabled using `law-nsgadv-01`
- [ ] **Task 5:** Configure diagnostic settings on `nsg-web-tier` to send `NetworkSecurityGroupEvent` and `NetworkSecurityGroupRuleCounter` logs to `law-nsgadv-01`

## Skills Tested

- Enabling and configuring NSG flow logs
- Setting up traffic analytics with Log Analytics
- Configuring NSG diagnostic settings
- Understanding network traffic monitoring and compliance

## Verification Criteria

| #   | What to Check                          | Where in Portal                                              | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | NSG associated with subnet             | Network security groups > `nsg-web-tier` > Subnets           | `snet-web` is listed as associated subnet                            |
| 2   | Storage account for flow logs          | Storage accounts > `stnsgflowlogs2026`                       | Account exists and is Standard LRS                                   |
| 3   | Log Analytics workspace created        | Log Analytics workspaces > `law-nsgadv-01`                   | Workspace is listed and in East US                                   |
| 4   | NSG flow logs enabled                  | Network Watcher > NSG flow logs                              | `nsg-web-tier` flow logs enabled (v2), traffic analytics on, 7-day retention |
| 5   | Diagnostic settings configured         | Network security groups > `nsg-web-tier` > Diagnostic settings | Logs sent to `law-nsgadv-01`                                       |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

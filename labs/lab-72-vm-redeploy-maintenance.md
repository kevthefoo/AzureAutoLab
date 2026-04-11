# Lab 72 — VM Redeploy & Maintenance

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

A production VM is experiencing intermittent connectivity issues that may be related to the underlying host. You must redeploy the VM to a new physical host and configure a maintenance configuration to control when future platform updates are applied.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Redeploy-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-app-01` (Standard_B2s, Windows Server 2022) in `RG-Redeploy-Lab`
- [ ] **Task 3:** Redeploy `vm-app-01` to move it to a new host node
- [ ] **Task 4:** Create a maintenance configuration named `mc-weekend-window` with a scheduled window on Saturdays at 2:00 AM (5-hour duration) and assign it to `vm-app-01`

## Skills Tested

- Redeploying VMs to new host nodes
- Understanding VM redeployment impact
- Creating maintenance configurations
- Assigning maintenance windows to VMs

## Verification Criteria

| #   | What to Check                      | Where in Portal                                       | How to Verify                                                        |
| --- | ---------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Resource group exists              | Home > Resource groups > RG-Redeploy-Lab              | Resource group is listed and located in East US                      |
| 2   | VM is running                      | RG-Redeploy-Lab > vm-app-01 > Overview                | VM status shows Running                                              |
| 3   | VM was redeployed                  | vm-app-01 > Activity log                              | Activity log shows a successful Redeploy operation                   |
| 4   | Maintenance configuration assigned | Home > Maintenance Configurations > mc-weekend-window | Shows Saturday 2:00 AM window, 5-hour duration, `vm-app-01` assigned |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

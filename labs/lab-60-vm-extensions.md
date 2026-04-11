# Lab 60 — VM Extensions

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The operations team needs to automate post-deployment configuration on newly provisioned VMs. You must install a custom script extension to configure IIS on a Windows VM and enable the diagnostics extension for monitoring.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Extensions-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-config-01` (Standard_B2s, Windows Server 2022) in `RG-Extensions-Lab`
- [ ] **Task 3:** Install the Custom Script Extension on `vm-config-01` to enable the IIS web server role
- [ ] **Task 4:** Enable the Azure Diagnostics extension on `vm-config-01` with basic performance counters

## Skills Tested

- Installing and managing VM extensions
- Using Custom Script Extension for post-deployment automation
- Configuring diagnostics extension for monitoring
- Understanding extension provisioning states

## Verification Criteria

| #   | What to Check                     | Where in Portal                             | How to Verify                                          |
| --- | --------------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| 1   | Resource group exists             | Home > Resource groups > RG-Extensions-Lab  | Resource group is listed and located in East US        |
| 2   | VM is running                     | RG-Extensions-Lab > vm-config-01 > Overview | VM status shows Running                                |
| 3   | Custom Script Extension installed | vm-config-01 > Extensions + applications    | CustomScriptExtension shows Provisioning succeeded     |
| 4   | Diagnostics extension enabled     | vm-config-01 > Extensions + applications    | IaaSDiagnostics extension shows Provisioning succeeded |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 04 — Virtual Machine Deployment

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-03

---

## Scenario

Your team needs a Linux virtual machine for testing a new application. You must deploy the VM into the existing virtual network and ensure it is properly sized and configured.

## Tasks

- [ ] **Task 1:** Create a Virtual Machine named `VM-Test-01` in the **West US** region inside resource group `RG-Dev-Lab`
    - **Image:** Ubuntu Server 24.04 LTS (or any Ubuntu)
    - **Size:** Standard_B2ps_v2
    - **Authentication:** Password
    - **Username:** `azureadmin`
- [ ] **Task 2:** Place the VM's NIC in a new or existing subnet (VNet must be in **West US**)
- [ ] **Task 3:** Ensure the VM has a **Public IP address** assigned
- [ ] **Task 4:** Add a tag to the VM: `Purpose = Testing`

## Skills Tested

- Virtual machine creation and sizing
- VM networking (VNet/subnet placement)
- Public IP assignment
- Tagging compute resources

## Verification Criteria

| #   | What to Check                                   | CLI Command                                                                                                                                                                        |
| --- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | VM `VM-Test-01` exists with correct size and OS | `az vm show --name VM-Test-01 --resource-group RG-Dev-Lab --query "{name:name, location:location, vmSize:hardwareProfile.vmSize, os:storageProfile.imageReference.offer}" -o json` |
| 2   | VM NIC is in a subnet                           | `az vm nic list --vm-name VM-Test-01 --resource-group RG-Dev-Lab -o json` then check subnet of the NIC                                                                             |
| 3   | VM has a public IP assigned                     | `az vm list-ip-addresses --name VM-Test-01 --resource-group RG-Dev-Lab --query "[].virtualMachine.network.publicIpAddresses[0].ipAddress" -o json`                                 |
| 4   | Tag `Purpose = Testing` is present              | `az vm show --name VM-Test-01 --resource-group RG-Dev-Lab --query "tags" -o json`                                                                                                  |

## Result

- **Status:** PASSED (4/4)
- **Date Completed:** 2026-04-03
- **Notes:**
  - VM-Test-01 exists in West US 2 with Standard_B2ps_v2, Ubuntu 24.04 LTS
  - NIC placed in subnet (resource group: VM-Test-01_group)
  - Public IP: 20.57.185.220
  - Tag Purpose = Testing confirmed

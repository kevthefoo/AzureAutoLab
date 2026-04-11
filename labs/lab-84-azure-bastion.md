# Lab 84 — Azure Bastion

**Domain:** Networking  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Contoso's IT security policy prohibits exposing virtual machines with public IP addresses. You need to deploy Azure Bastion so that administrators can securely connect to VMs via the Azure portal using RDP/SSH over TLS without assigning public IPs to the VMs.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Bastion-Lab` in the East US region and a virtual network `vnet-bastion-01` with address space `10.90.0.0/16`
- [ ] **Task 2:** Create two subnets: `AzureBastionSubnet` (`10.90.1.0/26`) and `snet-vms` (`10.90.2.0/24`)
- [ ] **Task 3:** Deploy an Azure Bastion host `bastion-contoso-01` (Basic SKU) in the `AzureBastionSubnet` with a new public IP `pip-bastion-01`
- [ ] **Task 4:** Create a Windows VM `vm-internal-01` in the `snet-vms` subnet with no public IP address (Standard_B1s, Windows Server 2022)
- [ ] **Task 5:** Connect to `vm-internal-01` via Bastion from the Azure portal to verify connectivity

## Skills Tested

- Deploying Azure Bastion with correct subnet naming
- Creating VMs without public IP addresses
- Connecting to VMs securely through Bastion
- Understanding Bastion subnet requirements and sizing

## Verification Criteria

| #   | What to Check                      | Where in Portal                                         | How to Verify                                         |
| --- | ---------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| 1   | VNet with both subnets             | Virtual networks > `vnet-bastion-01` > Subnets          | `AzureBastionSubnet` and `snet-vms` both exist        |
| 2   | AzureBastionSubnet correctly sized | Virtual networks > `vnet-bastion-01` > Subnets          | `AzureBastionSubnet` has prefix `10.90.1.0/26`        |
| 3   | Bastion host deployed              | Bastions > `bastion-contoso-01`                         | SKU is Basic, status is Succeeded, public IP assigned |
| 4   | VM has no public IP                | Virtual machines > `vm-internal-01` > Networking        | No public IP address assigned to the NIC              |
| 5   | Bastion connection works           | Virtual machines > `vm-internal-01` > Connect > Bastion | RDP session opens in the browser via Bastion          |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 03 — Virtual Network & Subnets

**Domain:** Networking  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-03

---

## Scenario

Your company is deploying a new application that requires network isolation. You need to create a virtual network with two subnets — one for web servers and one for backend databases.

## Tasks

- [ ] **Task 1:** Create a Virtual Network named `VNet-Lab` in the **East US** region with address space `10.0.0.0/16`
- [ ] **Task 2:** Create a subnet named `web-subnet` with address range `10.0.1.0/24`
- [ ] **Task 3:** Create a subnet named `db-subnet` with address range `10.0.2.0/24`
- [ ] **Task 4:** Create a Network Security Group named `NSG-Web` and associate it with `web-subnet`

## Skills Tested

- Virtual network creation and address space planning
- Subnet design and configuration
- Network Security Group creation and association

## Verification Criteria

| #   | What to Check                                         | CLI Command                                                                                                                     |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | VNet `VNet-Lab` exists in East US with 10.0.0.0/16    | `az network vnet show --name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, location:location, addressSpace:addressSpace.addressPrefixes}" -o json` |
| 2   | Subnet `web-subnet` exists with 10.0.1.0/24           | `az network vnet subnet show --name web-subnet --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, addressPrefix:addressPrefix}" -o json` |
| 3   | Subnet `db-subnet` exists with 10.0.2.0/24            | `az network vnet subnet show --name db-subnet --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, addressPrefix:addressPrefix}" -o json` |
| 4   | NSG `NSG-Web` is associated with `web-subnet`         | `az network vnet subnet show --name web-subnet --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{nsg:networkSecurityGroup.id}" -o json` |

## Result

- **Status:** PASSED (4/4)
- **Date Completed:** 2026-04-03
- **Notes:**
  - VNet-Lab exists in East US with address space 10.0.0.0/16
  - web-subnet exists with 10.0.1.0/24
  - db-subnet exists with 10.0.2.0/24
  - NSG-Web associated with web-subnet

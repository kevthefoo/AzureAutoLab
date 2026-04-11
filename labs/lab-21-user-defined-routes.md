# Lab 21 — User Defined Routes (UDR)

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your security team requires all outbound traffic from the development subnet to pass through a network virtual appliance (NVA) for inspection. You must create a route table with custom routes and associate it with a subnet.

## Tasks

- [ ] **Task 1:** Create a **Route Table** named `RT-Dev-Lab` in **East US** inside resource group `RG-Dev-Lab`
- [ ] **Task 2:** Add a **route** named `Route-To-NVA` to the route table — address prefix `0.0.0.0/0`, next hop type **Virtual appliance**, next hop IP `10.0.2.4`
- [ ] **Task 3:** Associate the route table `RT-Dev-Lab` with an existing subnet in `VNet-Lab`

## Skills Tested

- Route table creation
- Custom route configuration with next hop types
- Route table association with subnets
- Understanding forced tunneling concepts

## Verification Criteria

| #   | What to Check                      | CLI Command                                                                                                                                                                                                                              |
| --- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Route table `RT-Dev-Lab` exists    | `az network route-table show --name RT-Dev-Lab --resource-group RG-Dev-Lab --query "{name:name, location:location}" -o json`                                                                                                             |
| 2   | Route `Route-To-NVA` exists        | `az network route-table route show --route-table-name RT-Dev-Lab --resource-group RG-Dev-Lab --name Route-To-NVA --query "{name:name, addressPrefix:addressPrefix, nextHopType:nextHopType, nextHopIpAddress:nextHopIpAddress}" -o json` |
| 3   | Route table associated with subnet | `az network route-table show --name RT-Dev-Lab --resource-group RG-Dev-Lab --query "{subnets:subnets[].id}" -o json`                                                                                                                     |

## Result

- **Status:** NOT STARTED

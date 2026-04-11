# Lab 87 — ExpressRoute Concepts

**Domain:** Networking  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Contoso is planning a hybrid connectivity strategy and needs to understand ExpressRoute provisioning. While a physical circuit cannot be fully established in a lab, you must create the ExpressRoute circuit resource, configure peering settings, and deploy the associated virtual network gateway to demonstrate understanding of the architecture.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-ExpRoute-Lab` in the East US region and a virtual network `vnet-er-01` with address space `10.120.0.0/16` containing a `GatewaySubnet` (`10.120.255.0/27`) and a workload subnet `snet-onprem-apps` (`10.120.1.0/24`)
- [ ] **Task 2:** Create an ExpressRoute circuit `er-circuit-contoso-01` with provider Equinix, peering location Washington DC, bandwidth 50 Mbps, and Standard SKU (metered billing)
- [ ] **Task 3:** Deploy an ExpressRoute virtual network gateway `ergw-contoso-01` (SKU ErGw1AZ) in the `GatewaySubnet` with a new public IP `pip-ergw-01`
- [ ] **Task 4:** Attempt to configure Azure private peering on the circuit with primary subnet `192.168.1.0/30`, secondary subnet `192.168.1.4/30`, VLAN ID 100, and peer ASN 65001

## Skills Tested

- Creating ExpressRoute circuit resources
- Understanding ExpressRoute SKUs, providers, and peering locations
- Deploying ExpressRoute virtual network gateways
- Configuring Azure private peering parameters

## Verification Criteria

| #   | What to Check                          | Where in Portal                                              | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | VNet with GatewaySubnet                | Virtual networks > `vnet-er-01` > Subnets                    | `GatewaySubnet` exists with `10.120.255.0/27`                      |
| 2   | ExpressRoute circuit created           | ExpressRoute circuits > `er-circuit-contoso-01`              | Provider is Equinix, location Washington DC, bandwidth 50 Mbps      |
| 3   | ExpressRoute gateway deployed          | Virtual network gateways > `ergw-contoso-01`                 | Gateway type is ExpressRoute, SKU is ErGw1AZ                        |
| 4   | Private peering configured             | ExpressRoute circuits > `er-circuit-contoso-01` > Peerings   | Azure private peering shows subnets and VLAN ID 100                 |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

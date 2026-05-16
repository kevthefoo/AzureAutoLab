# Lab 37 — Subnet Delegation

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-21

---

## Scenario

Your platform team plans to run Azure Container Instances inside a dedicated subnet so the containers get private IPs and can call internal services. Configure a delegated subnet so the Container Instances service can manage the subnet on your behalf, and compare it to a non-delegated subnet in the same VNet.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Delegation-Lab` in **East US**
- [ ] **Task 2:** Create a virtual network `vnet-delegation-01` with address space `10.50.0.0/16` in `RG-Delegation-Lab`
- [ ] **Task 3:** Create a subnet `snet-containers` (`10.50.1.0/24`) inside `vnet-delegation-01` and delegate it to `Microsoft.ContainerInstance/containerGroups`
- [ ] **Task 4:** Create a second subnet `snet-apps` (`10.50.2.0/24`) in the same VNet with **no** delegation

## Skills Tested

- Creating virtual networks and subnets
- Configuring subnet delegation to Azure PaaS services
- Understanding when subnet delegation is required (ACI, SQL MI, App Service VNet integration)
- Differentiating delegated vs non-delegated subnets

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                                                                                                                                                   |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Resource group `RG-Delegation-Lab` exists    | `az group show --name RG-Delegation-Lab --query "{name:name, location:location}" -o json`                                                                                                                                                     |
| 2   | VNet exists with correct address space       | `az network vnet show --name vnet-delegation-01 --resource-group RG-Delegation-Lab --query "{name:name, addressSpace:addressSpace.addressPrefixes}" -o json`                                                                                  |
| 3   | `snet-containers` is delegated to ACI        | `az network vnet subnet show --name snet-containers --vnet-name vnet-delegation-01 --resource-group RG-Delegation-Lab --query "{name:name, prefix:addressPrefix, delegation:delegations[0].serviceName}" -o json`                             |
| 4   | `snet-apps` exists without delegation        | `az network vnet subnet show --name snet-apps --vnet-name vnet-delegation-01 --resource-group RG-Delegation-Lab --query "{name:name, prefix:addressPrefix, delegations:delegations}" -o json`                                                 |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Delegation-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

AS=$(az network vnet show -n vnet-delegation-01 -g "$RG" --query "addressSpace.addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$AS" = "10.50.0.0/16" ]; then echo "[PASS] Task 2: VNet exists with 10.50.0.0/16"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VNet missing or wrong ($AS)"; FAIL=$((FAIL+1)); fi

DEL=$(az network vnet subnet show -n snet-containers --vnet-name vnet-delegation-01 -g "$RG" --query "delegations[0].serviceName" -o tsv 2>/dev/null)
if [ "$DEL" = "Microsoft.ContainerInstance/containerGroups" ]; then echo "[PASS] Task 3: snet-containers delegated to ACI"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: snet-containers delegation is '$DEL'"; FAIL=$((FAIL+1)); fi

DCNT=$(az network vnet subnet show -n snet-apps --vnet-name vnet-delegation-01 -g "$RG" --query "length(delegations)" -o tsv 2>/dev/null)
if [ "${DCNT:-1}" = "0" ]; then echo "[PASS] Task 4: snet-apps has no delegation"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: snet-apps delegation count is $DCNT"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

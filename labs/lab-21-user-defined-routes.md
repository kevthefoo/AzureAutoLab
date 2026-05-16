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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
N=$(az network route-table show -n RT-Dev-Lab -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$N" = "RT-Dev-Lab" ]; then echo "[PASS] Task 1: RT-Dev-Lab exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: RT-Dev-Lab missing"; FAIL=$((FAIL+1)); fi

P=$(az network route-table route show --route-table-name RT-Dev-Lab -g "$RG" -n Route-To-NVA --query addressPrefix -o tsv 2>/dev/null)
HT=$(az network route-table route show --route-table-name RT-Dev-Lab -g "$RG" -n Route-To-NVA --query nextHopType -o tsv 2>/dev/null)
HIP=$(az network route-table route show --route-table-name RT-Dev-Lab -g "$RG" -n Route-To-NVA --query nextHopIpAddress -o tsv 2>/dev/null)
if [ "$P" = "0.0.0.0/0" ] && [ "$HT" = "VirtualAppliance" ] && [ "$HIP" = "10.0.2.4" ]; then
  echo "[PASS] Task 2: Route-To-NVA 0.0.0.0/0 -> 10.0.2.4 (VirtualAppliance)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: route wrong (prefix=$P hop=$HT ip=$HIP)"; FAIL=$((FAIL+1)); fi

SUB_CNT=$(az network route-table show -n RT-Dev-Lab -g "$RG" --query "length(subnets)" -o tsv 2>/dev/null)
if [ "${SUB_CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: route table associated with $SUB_CNT subnet(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: route table not associated with any subnet"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED (3/3)
- **Date Completed:** 2026-04-18
- **Notes:**
  - ✅ Task 1: Route table `RT-Dev-Lab` exists in East US under `RG-Dev-Lab`
  - ✅ Task 2: Route `Route-To-NVA` configured with prefix `0.0.0.0/0`, next hop type `VirtualAppliance`, next hop IP `10.0.2.4`
  - ✅ Task 3: Route table associated with subnet `snet-eastus-1` in VNet `vnet-eastus` (note: VNet name used was `vnet-eastus` rather than `VNet-Lab`)

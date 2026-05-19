# Lab 03 — Virtual Network & Subnets

**Domain:** Networking  
**Difficulty:** Beginner  

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

| #   | What to Check                                      | CLI Command                                                                                                                                                    |
| --- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | VNet `VNet-Lab` exists in East US with 10.0.0.0/16 | `az network vnet show --name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, location:location, addressSpace:addressSpace.addressPrefixes}" -o json` |
| 2   | Subnet `web-subnet` exists with 10.0.1.0/24        | `az network vnet subnet show --name web-subnet --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, addressPrefix:addressPrefix}" -o json`    |
| 3   | Subnet `db-subnet` exists with 10.0.2.0/24         | `az network vnet subnet show --name db-subnet --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{name:name, addressPrefix:addressPrefix}" -o json`     |
| 4   | NSG `NSG-Web` is associated with `web-subnet`      | `az network vnet subnet show --name web-subnet --vnet-name VNet-Lab --resource-group RG-Dev-Lab --query "{nsg:networkSecurityGroup.id}" -o json`               |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
LOC=$(az network vnet show -n VNet-Lab -g "$RG" --query location -o tsv 2>/dev/null)
PREF=$(az network vnet show -n VNet-Lab -g "$RG" --query "addressSpace.addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ] && [ "$PREF" = "10.0.0.0/16" ]; then echo "[PASS] Task 1: VNet-Lab in eastus, 10.0.0.0/16"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: VNet-Lab missing or wrong (loc=$LOC prefix=$PREF)"; FAIL=$((FAIL+1)); fi

W=$(az network vnet subnet show -n web-subnet --vnet-name VNet-Lab -g "$RG" --query "addressPrefix || addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$W" = "10.0.1.0/24" ]; then echo "[PASS] Task 2: web-subnet is 10.0.1.0/24"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: web-subnet prefix is '$W'"; FAIL=$((FAIL+1)); fi

D=$(az network vnet subnet show -n db-subnet --vnet-name VNet-Lab -g "$RG" --query "addressPrefix || addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$D" = "10.0.2.0/24" ]; then echo "[PASS] Task 3: db-subnet is 10.0.2.0/24"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: db-subnet prefix is '$D'"; FAIL=$((FAIL+1)); fi

NSGID=$(az network vnet subnet show -n web-subnet --vnet-name VNet-Lab -g "$RG" --query "networkSecurityGroup.id" -o tsv 2>/dev/null)
case "$NSGID" in *NSG-Web*) echo "[PASS] Task 4: NSG-Web associated with web-subnet"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 4: web-subnet NSG association is '$NSGID'"; FAIL=$((FAIL+1));; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

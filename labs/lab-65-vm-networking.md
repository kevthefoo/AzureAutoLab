# Lab 65 — VM Networking

**Domain:** Compute  
**Difficulty:** Advanced  

---

## Scenario

A database server requires network isolation with separate NICs for management and data traffic. You must configure a VM with multiple network interfaces and assign a secondary private IP address for application connectivity.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-VMNet-Lab` in the `East US` region with a VNet named `vnet-vmnet-lab` (10.50.0.0/16) containing two subnets: `snet-mgmt` (10.50.1.0/24) and `snet-data` (10.50.2.0/24)
- [ ] **Task 2:** Create two NICs: `nic-mgmt-01` in `snet-mgmt` and `nic-data-01` in `snet-data`
- [ ] **Task 3:** Deploy a VM named `vm-db-01` (Standard_D2s_v3) with both NICs attached (`nic-mgmt-01` as primary)
- [ ] **Task 4:** Add a secondary private IP address `10.50.1.100` (static) to `nic-mgmt-01`

## Skills Tested

- Configuring VMs with multiple network interfaces
- Understanding NIC and subnet associations
- Assigning static secondary IP addresses
- Selecting VM sizes that support multiple NICs

## Verification Criteria

| #   | What to Check             | Where in Portal                         | How to Verify                                                |
| --- | ------------------------- | --------------------------------------- | ------------------------------------------------------------ |
| 1   | VNet and subnets exist    | RG-VMNet-Lab > vnet-vmnet-lab > Subnets | Two subnets listed: `snet-mgmt` and `snet-data`              |
| 2   | Two NICs created          | RG-VMNet-Lab > Network interfaces       | `nic-mgmt-01` and `nic-data-01` are listed                   |
| 3   | VM has both NICs attached | RG-VMNet-Lab > vm-db-01 > Networking    | Both `nic-mgmt-01` (primary) and `nic-data-01` shown         |
| 4   | Secondary IP configured   | nic-mgmt-01 > IP configurations         | Secondary IP config with static address `10.50.1.100` listed |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-VMNet-Lab
M=$(az network vnet subnet show -n snet-mgmt --vnet-name vnet-vmnet-lab -g "$RG" --query "addressPrefix || addressPrefixes[0]" -o tsv 2>/dev/null)
D=$(az network vnet subnet show -n snet-data --vnet-name vnet-vmnet-lab -g "$RG" --query "addressPrefix || addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$M" = "10.50.1.0/24" ] && [ "$D" = "10.50.2.0/24" ]; then echo "[PASS] Task 1: both subnets exist with correct ranges"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: subnets wrong (mgmt=$M data=$D)"; FAIL=$((FAIL+1)); fi

N1=$(az network nic show -n nic-mgmt-01 -g "$RG" --query name -o tsv 2>/dev/null)
N2=$(az network nic show -n nic-data-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$N1" = "nic-mgmt-01" ] && [ "$N2" = "nic-data-01" ]; then echo "[PASS] Task 2: both NICs exist"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: NICs missing"; FAIL=$((FAIL+1)); fi

NIC_COUNT=$(az vm show -n vm-db-01 -g "$RG" --query "length(networkProfile.networkInterfaces)" -o tsv 2>/dev/null)
if [ "${NIC_COUNT:-0}" = "2" ]; then echo "[PASS] Task 3: vm-db-01 has 2 NICs"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: vm-db-01 has $NIC_COUNT NICs"; FAIL=$((FAIL+1)); fi

SEC=$(az network nic show -n nic-mgmt-01 -g "$RG" --query "ipConfigurations[?privateIPAddress=='10.50.1.100'] | length(@)" -o tsv 2>/dev/null)
if [ "${SEC:-0}" -gt 0 ]; then echo "[PASS] Task 4: secondary IP 10.50.1.100 on nic-mgmt-01"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: secondary IP 10.50.1.100 not configured"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

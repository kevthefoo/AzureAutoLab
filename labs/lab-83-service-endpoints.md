# Lab 83 — Service Endpoints

**Domain:** Networking  
**Difficulty:** Beginner  

---

## Scenario

Northwind Traders wants to restrict access to their Azure Storage account so that only resources within a specific virtual network subnet can reach it. You must enable service endpoints on the subnet and configure the storage account's firewall to accept traffic only from that subnet.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-SvcEP-Lab` in the East US region and a virtual network `vnet-svcep-01` with address space `10.80.0.0/16` and a subnet `snet-app-tier` (`10.80.1.0/24`)
- [ ] **Task 2:** Enable the `Microsoft.Storage` service endpoint on the `snet-app-tier` subnet
- [ ] **Task 3:** Create a storage account `stsvceplab2026` (Standard LRS, StorageV2) with default networking set to deny all traffic
- [ ] **Task 4:** Add a virtual network rule on the storage account to allow access from `snet-app-tier` in `vnet-svcep-01`

## Skills Tested

- Enabling service endpoints on subnets
- Configuring storage account firewall rules
- Restricting PaaS service access to specific VNets
- Understanding the difference between service endpoints and private endpoints

## Verification Criteria

| #   | What to Check                        | Where in Portal                                                | How to Verify                                             |
| --- | ------------------------------------ | -------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | VNet and subnet created              | Virtual networks > `vnet-svcep-01` > Subnets                   | `snet-app-tier` exists with prefix `10.80.1.0/24`         |
| 2   | Service endpoint enabled             | Virtual networks > `vnet-svcep-01` > Subnets > `snet-app-tier` | `Microsoft.Storage` listed under service endpoints        |
| 3   | Storage account denies public access | Storage accounts > `stsvceplab2026` > Networking               | Default action is Deny                                    |
| 4   | VNet rule allows subnet access       | Storage accounts > `stsvceplab2026` > Networking > VNet        | `snet-app-tier` from `vnet-svcep-01` is listed as allowed |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-SvcEP-Lab
P=$(az network vnet subnet show -n snet-app-tier --vnet-name vnet-svcep-01 -g "$RG" --query "addressPrefix || addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$P" = "10.80.1.0/24" ]; then echo "[PASS] Task 1: snet-app-tier 10.80.1.0/24"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: subnet missing or wrong ($P)"; FAIL=$((FAIL+1)); fi

SE=$(az network vnet subnet show -n snet-app-tier --vnet-name vnet-svcep-01 -g "$RG" --query "serviceEndpoints[?service=='Microsoft.Storage']" -o tsv 2>/dev/null)
if [ -n "$SE" ]; then echo "[PASS] Task 2: Microsoft.Storage service endpoint enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: service endpoint missing"; FAIL=$((FAIL+1)); fi

DA=$(az storage account show -n stsvceplab2026 -g "$RG" --query "networkRuleSet.defaultAction" -o tsv 2>/dev/null)
if [ "$DA" = "Deny" ]; then echo "[PASS] Task 3: storage defaultAction=Deny"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: defaultAction is '$DA'"; FAIL=$((FAIL+1)); fi

VR=$(az storage account show -n stsvceplab2026 -g "$RG" --query "length(networkRuleSet.virtualNetworkRules)" -o tsv 2>/dev/null)
if [ "${VR:-0}" -gt 0 ]; then echo "[PASS] Task 4: VNet rule added"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no VNet rule on storage"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

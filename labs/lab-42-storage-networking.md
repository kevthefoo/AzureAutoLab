# Lab 42 — Storage Account Networking

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your company's security team has flagged that several storage accounts are publicly accessible. You need to lock down a storage account by configuring firewall rules, restricting access to specific virtual networks via service endpoints, and setting up a private endpoint for secure connectivity from internal workloads.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-StorageNet-Lab` in East US and a storage account `stlabnetwork42` with default settings
- [ ] **Task 2:** Configure the storage account firewall to deny all public access except from your current client IP address
- [ ] **Task 3:** Create a virtual network `VNet-Storage-Lab` (10.0.0.0/16) with a subnet `subnet-storage` (10.0.1.0/24) and enable the Microsoft.Storage service endpoint on the subnet
- [ ] **Task 4:** Add the `subnet-storage` subnet as an allowed virtual network rule on the storage account
- [ ] **Task 5:** Create a private endpoint `pe-stlabnetwork42` for the storage account's blob sub-resource in `subnet-storage`

## Skills Tested

- Configuring storage account firewalls and virtual network rules
- Enabling service endpoints on subnets
- Creating and configuring private endpoints for storage accounts
- Understanding network security for Azure Storage

## Verification Criteria

| #   | What to Check                      | Where in Portal                                                      | How to Verify                                            |
| --- | ---------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Storage account exists             | Storage accounts > `stlabnetwork42`                                  | Account is listed and accessible                         |
| 2   | Firewall denies public access      | Storage accounts > `stlabnetwork42` > Networking > Firewalls         | Default action is "Deny", your IP is in the allowed list |
| 3   | Service endpoint enabled on subnet | Virtual networks > `VNet-Storage-Lab` > Subnets > `subnet-storage`   | Microsoft.Storage appears under Service endpoints        |
| 4   | VNet rule added to storage account | Storage accounts > `stlabnetwork42` > Networking > Virtual networks  | `subnet-storage` is listed as an allowed network         |
| 5   | Private endpoint exists            | Storage accounts > `stlabnetwork42` > Networking > Private endpoints | `pe-stlabnetwork42` is listed with status "Approved"     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-StorageNet-Lab
SA=stlabnetwork42
NAME=$(az storage account show -n "$SA" -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$NAME" = "$SA" ]; then echo "[PASS] Task 1: $SA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $SA missing"; FAIL=$((FAIL+1)); fi

DA=$(az storage account show -n "$SA" -g "$RG" --query "networkRuleSet.defaultAction" -o tsv 2>/dev/null)
IPS=$(az storage account show -n "$SA" -g "$RG" --query "length(networkRuleSet.ipRules)" -o tsv 2>/dev/null)
if [ "$DA" = "Deny" ] && [ "${IPS:-0}" -gt 0 ]; then echo "[PASS] Task 2: firewall defaultAction=Deny with IP allowlist"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: firewall wrong (default=$DA ipRules=$IPS)"; FAIL=$((FAIL+1)); fi

SE=$(az network vnet subnet show -n subnet-storage --vnet-name VNet-Storage-Lab -g "$RG" --query "serviceEndpoints[?service=='Microsoft.Storage']" -o tsv 2>/dev/null)
if [ -n "$SE" ]; then echo "[PASS] Task 3: Microsoft.Storage service endpoint on subnet-storage"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: service endpoint missing"; FAIL=$((FAIL+1)); fi

VR=$(az storage account show -n "$SA" -g "$RG" --query "length(networkRuleSet.virtualNetworkRules)" -o tsv 2>/dev/null)
if [ "${VR:-0}" -gt 0 ]; then echo "[PASS] Task 4: VNet rule added to storage account"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no VNet rule on storage account"; FAIL=$((FAIL+1)); fi

PE=$(az network private-endpoint show -n pe-stlabnetwork42 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$PE" = "pe-stlabnetwork42" ]; then echo "[PASS] Task 5: private endpoint pe-stlabnetwork42 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: private endpoint missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

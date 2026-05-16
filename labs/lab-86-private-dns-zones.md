# Lab 86 — Azure DNS Private Zones

**Domain:** Networking  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Woodgrove Bank is deploying multiple VMs in Azure and needs an internal DNS solution so that VMs can resolve each other by hostname without managing custom DNS servers. You must create a private DNS zone, link it to the virtual network with auto-registration, and verify that VM hostnames are automatically registered.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-PrivDNS-Lab` in the East US region and a virtual network `vnet-privdns-01` with address space `10.110.0.0/16` and a subnet `snet-servers` (`10.110.1.0/24`)
- [ ] **Task 2:** Create a private DNS zone `woodgrove.internal`
- [ ] **Task 3:** Create a virtual network link `link-vnet-privdns` that links `woodgrove.internal` to `vnet-privdns-01` with auto-registration enabled
- [ ] **Task 4:** Deploy a Linux VM `vm-dns-test-01` (Standard_B1s, Ubuntu 22.04) in the `snet-servers` subnet and confirm its A record appears automatically in the private DNS zone

## Skills Tested

- Creating and managing Azure private DNS zones
- Linking private DNS zones to virtual networks
- Configuring auto-registration for VM hostnames
- Understanding private DNS resolution in Azure

## Verification Criteria

| #   | What to Check                    | Where in Portal                                                  | How to Verify                                                              |
| --- | -------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | VNet and subnet created          | Virtual networks > `vnet-privdns-01` > Subnets                   | `snet-servers` exists with prefix `10.110.1.0/24`                          |
| 2   | Private DNS zone created         | Private DNS zones > `woodgrove.internal`                         | Zone is listed and accessible                                              |
| 3   | VNet link with auto-registration | Private DNS zones > `woodgrove.internal` > Virtual network links | `link-vnet-privdns` linked to `vnet-privdns-01`, auto-registration enabled |
| 4   | VM A record auto-registered      | Private DNS zones > `woodgrove.internal` > Recordsets            | A record for `vm-dns-test-01` exists pointing to VM's private IP           |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-PrivDNS-Lab
P=$(az network vnet subnet show -n snet-servers --vnet-name vnet-privdns-01 -g "$RG" --query addressPrefix -o tsv 2>/dev/null)
if [ "$P" = "10.110.1.0/24" ]; then echo "[PASS] Task 1: snet-servers 10.110.1.0/24"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: subnet missing or wrong"; FAIL=$((FAIL+1)); fi

Z=$(az network private-dns zone show -n woodgrove.internal -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$Z" = "woodgrove.internal" ]; then echo "[PASS] Task 2: private DNS zone exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: private DNS zone missing"; FAIL=$((FAIL+1)); fi

AR=$(az network private-dns link vnet show -g "$RG" -z woodgrove.internal -n link-vnet-privdns --query "registrationEnabled" -o tsv 2>/dev/null)
if [ "$AR" = "true" ]; then echo "[PASS] Task 3: VNet link with auto-registration"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: VNet link missing or auto-reg off"; FAIL=$((FAIL+1)); fi

A=$(az network private-dns record-set a list -g "$RG" -z woodgrove.internal --query "[?name=='vm-dns-test-01'] | length(@)" -o tsv 2>/dev/null)
if [ "${A:-0}" -gt 0 ]; then echo "[PASS] Task 4: vm-dns-test-01 A record auto-registered"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: vm-dns-test-01 A record missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 78 — Azure Firewall

**Domain:** Networking  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Woodgrove Bank requires centralized network security for its hub-spoke architecture. You must deploy an Azure Firewall in the hub VNet to control outbound internet access, allow specific application traffic, and configure DNAT rules for inbound connectivity to internal servers.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Firewall-Lab` in the East US region and a hub virtual network `vnet-hub-fw-01` with address space `10.50.0.0/16` containing a subnet named `AzureFirewallSubnet` (`10.50.1.0/26`)
- [ ] **Task 2:** Deploy an Azure Firewall `fw-hub-01` (Standard SKU) in the `AzureFirewallSubnet` with a new public IP `pip-fw-hub-01`
- [ ] **Task 3:** Create a network rule collection `netcol-allow-dns` with priority 200 that allows UDP traffic on port 53 from `10.50.0.0/16` to any destination
- [ ] **Task 4:** Create an application rule collection `appcol-allow-web` with priority 300 that allows outbound HTTP and HTTPS traffic to `*.microsoft.com` from source `10.50.0.0/16`
- [ ] **Task 5:** Create a DNAT rule collection `natcol-rdp-inbound` with priority 100 that translates inbound TCP port 4000 on the firewall public IP to destination `10.50.2.4` port 3389

## Skills Tested

- Deploying and configuring Azure Firewall
- Creating network, application, and DNAT rule collections
- Understanding hub-spoke network security architecture
- Managing firewall public IP and subnet requirements

## Verification Criteria

| #   | What to Check                      | Where in Portal                                               | How to Verify                                                   |
| --- | ---------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | VNet with AzureFirewallSubnet      | Virtual networks > `vnet-hub-fw-01` > Subnets                 | `AzureFirewallSubnet` exists with prefix `10.50.1.0/26`         |
| 2   | Firewall deployed with public IP   | Firewalls > `fw-hub-01`                                       | SKU is Standard, status is Succeeded, public IP `pip-fw-hub-01` |
| 3   | Network rule collection exists     | Firewalls > `fw-hub-01` > Rules (classic) > Network rules     | `netcol-allow-dns` with priority 200, allows UDP 53             |
| 4   | Application rule collection exists | Firewalls > `fw-hub-01` > Rules (classic) > Application rules | `appcol-allow-web` with priority 300, allows `*.microsoft.com`  |
| 5   | DNAT rule collection exists        | Firewalls > `fw-hub-01` > Rules (classic) > NAT rules         | `natcol-rdp-inbound` translates port 4000 to `10.50.2.4:3389`   |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Firewall-Lab
P=$(az network vnet subnet show -n AzureFirewallSubnet --vnet-name vnet-hub-fw-01 -g "$RG" --query addressPrefix -o tsv 2>/dev/null)
if [ "$P" = "10.50.1.0/26" ]; then echo "[PASS] Task 1: AzureFirewallSubnet exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: AzureFirewallSubnet wrong ($P)"; FAIL=$((FAIL+1)); fi

SKU=$(az network firewall show -n fw-hub-01 -g "$RG" --query "sku.tier" -o tsv 2>/dev/null)
if [ "$SKU" = "Standard" ]; then echo "[PASS] Task 2: fw-hub-01 Standard"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: firewall sku is '$SKU'"; FAIL=$((FAIL+1)); fi

NRC=$(az network firewall network-rule collection list -f fw-hub-01 -g "$RG" --query "[?name=='netcol-allow-dns'] | length(@)" -o tsv 2>/dev/null)
if [ "${NRC:-0}" -gt 0 ]; then echo "[PASS] Task 3: netcol-allow-dns exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: network rule collection missing"; FAIL=$((FAIL+1)); fi

ARC=$(az network firewall application-rule collection list -f fw-hub-01 -g "$RG" --query "[?name=='appcol-allow-web'] | length(@)" -o tsv 2>/dev/null)
if [ "${ARC:-0}" -gt 0 ]; then echo "[PASS] Task 4: appcol-allow-web exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: app rule collection missing"; FAIL=$((FAIL+1)); fi

NAT=$(az network firewall nat-rule collection list -f fw-hub-01 -g "$RG" --query "[?name=='natcol-rdp-inbound'] | length(@)" -o tsv 2>/dev/null)
if [ "${NAT:-0}" -gt 0 ]; then echo "[PASS] Task 5: natcol-rdp-inbound exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: NAT rule collection missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

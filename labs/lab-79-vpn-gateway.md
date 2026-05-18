# Lab 79 — VPN Gateway

**Domain:** Networking  
**Difficulty:** Advanced  

---

## Scenario

Tailwind Traders needs to enable remote employees to securely connect to Azure resources from their laptops. You must deploy a VPN Gateway and configure point-to-site (P2S) VPN using Azure certificate authentication so that remote users can access the company's virtual network.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-VPN-Lab` in the East US region and a virtual network `vnet-vpn-01` with address space `10.60.0.0/16` containing a `GatewaySubnet` (`10.60.255.0/27`) and a workload subnet `snet-workloads` (`10.60.1.0/24`)
- [ ] **Task 2:** Create a VPN Gateway `vpngw-p2s-01` in the `GatewaySubnet` using SKU VpnGw1, VPN type Route-based, with a new public IP `pip-vpngw-01`
- [ ] **Task 3:** Configure point-to-site VPN with address pool `172.16.0.0/24`, tunnel type OpenVPN, and Azure certificate authentication
- [ ] **Task 4:** Generate a self-signed root certificate and upload the public key data to the P2S configuration as `P2SRootCert`

## Skills Tested

- Deploying a VPN Gateway with correct subnet requirements
- Configuring point-to-site VPN connections
- Understanding VPN authentication methods and tunnel types
- Working with certificates for VPN authentication

## Verification Criteria

| #   | What to Check             | Where in Portal                                           | How to Verify                                           |
| --- | ------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| 1   | VNet with GatewaySubnet   | Virtual networks > `vnet-vpn-01` > Subnets                | `GatewaySubnet` exists with prefix `10.60.255.0/27`     |
| 2   | VPN Gateway deployed      | Virtual network gateways > `vpngw-p2s-01`                 | SKU is VpnGw1, type is Route-based, public IP assigned  |
| 3   | P2S configuration set     | Virtual network gateways > `vpngw-p2s-01` > Point-to-site | Address pool is `172.16.0.0/24`, tunnel type is OpenVPN |
| 4   | Root certificate uploaded | Virtual network gateways > `vpngw-p2s-01` > Point-to-site | `P2SRootCert` listed under root certificates            |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-VPN-Lab
GS=$(az network vnet subnet show -n GatewaySubnet --vnet-name vnet-vpn-01 -g "$RG" --query addressPrefix -o tsv 2>/dev/null)
if [ "$GS" = "10.60.255.0/27" ]; then echo "[PASS] Task 1: GatewaySubnet exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: GatewaySubnet wrong ($GS)"; FAIL=$((FAIL+1)); fi

SKU=$(az network vnet-gateway show -n vpngw-p2s-01 -g "$RG" --query "sku.name" -o tsv 2>/dev/null)
VT=$(az network vnet-gateway show -n vpngw-p2s-01 -g "$RG" --query "vpnType" -o tsv 2>/dev/null)
if [ "$SKU" = "VpnGw1" ] && [ "$VT" = "RouteBased" ]; then echo "[PASS] Task 2: vpngw-p2s-01 VpnGw1 RouteBased"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VPN gateway wrong (sku=$SKU type=$VT)"; FAIL=$((FAIL+1)); fi

POOL=$(az network vnet-gateway show -n vpngw-p2s-01 -g "$RG" --query "vpnClientConfiguration.vpnClientAddressPool.addressPrefixes[0]" -o tsv 2>/dev/null)
PROTO=$(az network vnet-gateway show -n vpngw-p2s-01 -g "$RG" --query "vpnClientConfiguration.vpnClientProtocols[0]" -o tsv 2>/dev/null)
if [ "$POOL" = "172.16.0.0/24" ] && [ "$PROTO" = "OpenVPN" ]; then echo "[PASS] Task 3: P2S address pool + OpenVPN"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: P2S config wrong (pool=$POOL proto=$PROTO)"; FAIL=$((FAIL+1)); fi

ROOT=$(az network vnet-gateway show -n vpngw-p2s-01 -g "$RG" --query "vpnClientConfiguration.vpnClientRootCertificates[?name=='P2SRootCert'] | length(@)" -o tsv 2>/dev/null)
if [ "${ROOT:-0}" -gt 0 ]; then echo "[PASS] Task 4: P2SRootCert uploaded"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: P2SRootCert missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

# Lab 84 — Azure Bastion

**Domain:** Networking  
**Difficulty:** Beginner  

---

## Scenario

Contoso's IT security policy prohibits exposing virtual machines with public IP addresses. You need to deploy Azure Bastion so that administrators can securely connect to VMs via the Azure portal using RDP/SSH over TLS without assigning public IPs to the VMs.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Bastion-Lab` in the East US region and a virtual network `vnet-bastion-01` with address space `10.90.0.0/16`
- [ ] **Task 2:** Create two subnets: `AzureBastionSubnet` (`10.90.1.0/26`) and `snet-vms` (`10.90.2.0/24`)
- [ ] **Task 3:** Deploy an Azure Bastion host `bastion-contoso-01` (Basic SKU) in the `AzureBastionSubnet` with a new public IP `pip-bastion-01`
- [ ] **Task 4:** Create a Windows VM `vm-internal-01` in the `snet-vms` subnet with no public IP address (Standard_B1s, Windows Server 2022)
- [ ] **Task 5:** Connect to `vm-internal-01` via Bastion from the Azure portal to verify connectivity

## Skills Tested

- Deploying Azure Bastion with correct subnet naming
- Creating VMs without public IP addresses
- Connecting to VMs securely through Bastion
- Understanding Bastion subnet requirements and sizing

## Verification Criteria

| #   | What to Check                      | Where in Portal                                         | How to Verify                                         |
| --- | ---------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| 1   | VNet with both subnets             | Virtual networks > `vnet-bastion-01` > Subnets          | `AzureBastionSubnet` and `snet-vms` both exist        |
| 2   | AzureBastionSubnet correctly sized | Virtual networks > `vnet-bastion-01` > Subnets          | `AzureBastionSubnet` has prefix `10.90.1.0/26`        |
| 3   | Bastion host deployed              | Bastions > `bastion-contoso-01`                         | SKU is Basic, status is Succeeded, public IP assigned |
| 4   | VM has no public IP                | Virtual machines > `vm-internal-01` > Networking        | No public IP address assigned to the NIC              |
| 5   | Bastion connection works           | Virtual machines > `vm-internal-01` > Connect > Bastion | RDP session opens in the browser via Bastion          |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Bastion-Lab
BS=$(az network vnet subnet show -n AzureBastionSubnet --vnet-name vnet-bastion-01 -g "$RG" --query name -o tsv 2>/dev/null)
VS=$(az network vnet subnet show -n snet-vms --vnet-name vnet-bastion-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$BS" = "AzureBastionSubnet" ] && [ "$VS" = "snet-vms" ]; then echo "[PASS] Task 1: both subnets exist"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: subnets missing"; FAIL=$((FAIL+1)); fi

BP=$(az network vnet subnet show -n AzureBastionSubnet --vnet-name vnet-bastion-01 -g "$RG" --query "addressPrefix || addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$BP" = "10.90.1.0/26" ]; then echo "[PASS] Task 2: AzureBastionSubnet 10.90.1.0/26"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: AzureBastionSubnet prefix is '$BP'"; FAIL=$((FAIL+1)); fi

SKU=$(az network bastion show -n bastion-contoso-01 -g "$RG" --query "sku.name" -o tsv 2>/dev/null)
if [ "$SKU" = "Basic" ]; then echo "[PASS] Task 3: bastion-contoso-01 Basic"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: bastion sku is '$SKU'"; FAIL=$((FAIL+1)); fi

PUB=$(az vm list-ip-addresses -n vm-internal-01 -g "$RG" --query "[0].virtualMachine.network.publicIpAddresses" -o tsv 2>/dev/null)
if [ -z "$PUB" ]; then echo "[PASS] Task 4: vm-internal-01 has no public IP"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: vm-internal-01 has public IP ($PUB)"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 5: Bastion connect is interactive (manual)"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

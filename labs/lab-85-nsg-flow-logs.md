# Lab 85 — Network Security Groups Advanced

**Domain:** Networking  
**Difficulty:** Intermediate  

---

## Scenario

Fabrikam's compliance team needs visibility into network traffic flowing through their NSGs for audit and troubleshooting purposes. You must enable NSG flow logs, send them to a storage account, and configure NSG diagnostic settings to forward logs to a Log Analytics workspace for analysis.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-NSGAdv-Lab` in the East US region, a VNet `vnet-nsgadv-01` (`10.100.0.0/16`) with subnet `snet-web` (`10.100.1.0/24`), and an NSG `nsg-web-tier` associated with the subnet
- [ ] **Task 2:** Create a storage account `stnsgflowlogs2026` (Standard LRS) for storing flow logs
- [ ] **Task 3:** Create a Log Analytics workspace `law-nsgadv-01` in the same resource group
- [ ] **Task 4:** Enable NSG flow logs (Version 2) on `nsg-web-tier`, sending logs to `stnsgflowlogs2026` with a retention of 7 days and traffic analytics enabled using `law-nsgadv-01`
- [ ] **Task 5:** Configure diagnostic settings on `nsg-web-tier` to send `NetworkSecurityGroupEvent` and `NetworkSecurityGroupRuleCounter` logs to `law-nsgadv-01`

## Skills Tested

- Enabling and configuring NSG flow logs
- Setting up traffic analytics with Log Analytics
- Configuring NSG diagnostic settings
- Understanding network traffic monitoring and compliance

## Verification Criteria

| #   | What to Check                   | Where in Portal                                                | How to Verify                                                                |
| --- | ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | NSG associated with subnet      | Network security groups > `nsg-web-tier` > Subnets             | `snet-web` is listed as associated subnet                                    |
| 2   | Storage account for flow logs   | Storage accounts > `stnsgflowlogs2026`                         | Account exists and is Standard LRS                                           |
| 3   | Log Analytics workspace created | Log Analytics workspaces > `law-nsgadv-01`                     | Workspace is listed and in East US                                           |
| 4   | NSG flow logs enabled           | Network Watcher > NSG flow logs                                | `nsg-web-tier` flow logs enabled (v2), traffic analytics on, 7-day retention |
| 5   | Diagnostic settings configured  | Network security groups > `nsg-web-tier` > Diagnostic settings | Logs sent to `law-nsgadv-01`                                                 |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-NSGAdv-Lab
SUB=$(az network vnet subnet show -n snet-web --vnet-name vnet-nsgadv-01 -g "$RG" --query "networkSecurityGroup.id" -o tsv 2>/dev/null)
case "$SUB" in *nsg-web-tier*) echo "[PASS] Task 1: nsg-web-tier associated with snet-web"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 1: NSG association wrong"; FAIL=$((FAIL+1));; esac

SA=$(az storage account show -n stnsgflowlogs2026 -g "$RG" --query "sku.name" -o tsv 2>/dev/null)
if [ "$SA" = "Standard_LRS" ]; then echo "[PASS] Task 2: stnsgflowlogs2026 Standard_LRS"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: storage sku '$SA'"; FAIL=$((FAIL+1)); fi

LA=$(az monitor log-analytics workspace show -n law-nsgadv-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$LA" = "law-nsgadv-01" ]; then echo "[PASS] Task 3: law-nsgadv-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: workspace missing"; FAIL=$((FAIL+1)); fi

FL=$(az network watcher flow-log list --location eastus --query "[?contains(targetResourceId, 'nsg-web-tier') && enabled==\`true\`] | length(@)" -o tsv 2>/dev/null)
if [ "${FL:-0}" -gt 0 ]; then echo "[PASS] Task 4: NSG flow log enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no enabled NSG flow log"; FAIL=$((FAIL+1)); fi

NSG_ID=$(az network nsg show -n nsg-web-tier -g "$RG" --query id -o tsv 2>/dev/null)
DS=0
if [ -n "$NSG_ID" ]; then DS=$(az monitor diagnostic-settings list --resource "$NSG_ID" --query "length(value)" -o tsv 2>/dev/null); fi
if [ "${DS:-0}" -gt 0 ]; then echo "[PASS] Task 5: $DS diagnostic setting(s) on nsg-web-tier"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: no diagnostic settings on nsg-web-tier"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

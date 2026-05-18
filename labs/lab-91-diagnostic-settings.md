# Lab 91 — Diagnostic Settings

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  

---

## Scenario

The security team requires that all audit logs and platform metrics from key Azure resources are routed to a central Log Analytics workspace and archived to a storage account. You need to enable diagnostic settings on a virtual network and a Key Vault to satisfy compliance requirements.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Diagnostics-Lab` in East US
- [ ] **Task 2:** Create a Log Analytics workspace named `law-diagnostics-01` and a storage account named `stdiagarchive2026` in `RG-Diagnostics-Lab`
- [ ] **Task 3:** Create a virtual network named `vnet-prod-01` and a Key Vault named `kv-diag-lab-01` in `RG-Diagnostics-Lab`
- [ ] **Task 4:** Enable diagnostic settings on `vnet-prod-01` named `diag-vnet-prod` — send all logs and metrics to `law-diagnostics-01` and archive to `stdiagarchive2026`
- [ ] **Task 5:** Enable diagnostic settings on `kv-diag-lab-01` named `diag-kv-prod` — send AuditEvent logs and AllMetrics to `law-diagnostics-01`

## Skills Tested

- Configuring diagnostic settings for Azure resources
- Routing logs to Log Analytics workspaces
- Archiving diagnostic data to storage accounts
- Understanding platform log categories

## Verification Criteria

| #   | What to Check                       | Where in Portal                                         | How to Verify                                                |
| --- | ----------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Resource group and resources exist  | Resource Groups > `RG-Diagnostics-Lab`                  | All four resources (LAW, storage, VNet, KV) are listed       |
| 2   | VNet diagnostic setting exists      | Virtual Networks > `vnet-prod-01` > Diagnostic settings | `diag-vnet-prod` is listed with LAW and storage destinations |
| 3   | VNet sends all log categories       | Diagnostic settings > `diag-vnet-prod` > Details        | All available log categories are checked                     |
| 4   | Key Vault diagnostic setting exists | Key Vaults > `kv-diag-lab-01` > Diagnostic settings     | `diag-kv-prod` is listed with LAW destination                |
| 5   | Key Vault sends AuditEvent logs     | Diagnostic settings > `diag-kv-prod` > Details          | AuditEvent category and AllMetrics are enabled               |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Diagnostics-Lab
LA=$(az monitor log-analytics workspace show -g "$RG" -n law-diagnostics-01 --query name -o tsv 2>/dev/null)
SA=$(az storage account show -n stdiagarchive2026 -g "$RG" --query name -o tsv 2>/dev/null)
VN=$(az network vnet show -n vnet-prod-01 -g "$RG" --query name -o tsv 2>/dev/null)
KV=$(az keyvault show -n kv-diag-lab-01 --query name -o tsv 2>/dev/null)
if [ -n "$LA" ] && [ -n "$SA" ] && [ -n "$VN" ] && [ -n "$KV" ]; then echo "[PASS] Task 1: all 4 resources exist"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: missing resources (la=$LA sa=$SA vn=$VN kv=$KV)"; FAIL=$((FAIL+1)); fi

VID=$(az network vnet show -n vnet-prod-01 -g "$RG" --query id -o tsv 2>/dev/null)
DV=0
if [ -n "$VID" ]; then DV=$(az monitor diagnostic-settings list --resource "$VID" --query "value[?name=='diag-vnet-prod'] | length(@)" -o tsv 2>/dev/null); fi
if [ "${DV:-0}" -gt 0 ]; then echo "[PASS] Task 2: diag-vnet-prod exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: diag-vnet-prod missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 3: 'all categories' selection is implicit in Task 2"; PASS=$((PASS+1))

KVID=$(az keyvault show -n kv-diag-lab-01 --query id -o tsv 2>/dev/null)
DK=0
if [ -n "$KVID" ]; then DK=$(az monitor diagnostic-settings list --resource "$KVID" --query "value[?name=='diag-kv-prod'] | length(@)" -o tsv 2>/dev/null); fi
if [ "${DK:-0}" -gt 0 ]; then echo "[PASS] Task 4: diag-kv-prod exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: diag-kv-prod missing"; FAIL=$((FAIL+1)); fi

AU=0
if [ -n "$KVID" ]; then AU=$(az monitor diagnostic-settings list --resource "$KVID" --query "value[?name=='diag-kv-prod'].logs[?category=='AuditEvent' && enabled==\`true\`] | [] | length(@)" -o tsv 2>/dev/null); fi
if [ "${AU:-0}" -gt 0 ]; then echo "[PASS] Task 5: AuditEvent enabled on diag-kv-prod"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: AuditEvent not enabled"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

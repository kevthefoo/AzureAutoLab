# Lab 60 — VM Extensions

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The operations team needs to automate post-deployment configuration on newly provisioned VMs. You must install a custom script extension to configure IIS on a Windows VM and enable the diagnostics extension for monitoring.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Extensions-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-config-01` (Standard_B2s, Windows Server 2022) in `RG-Extensions-Lab`
- [ ] **Task 3:** Install the Custom Script Extension on `vm-config-01` to enable the IIS web server role
- [ ] **Task 4:** Enable the Azure Diagnostics extension on `vm-config-01` with basic performance counters

## Skills Tested

- Installing and managing VM extensions
- Using Custom Script Extension for post-deployment automation
- Configuring diagnostics extension for monitoring
- Understanding extension provisioning states

## Verification Criteria

| #   | What to Check                     | Where in Portal                             | How to Verify                                          |
| --- | --------------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| 1   | Resource group exists             | Home > Resource groups > RG-Extensions-Lab  | Resource group is listed and located in East US        |
| 2   | VM is running                     | RG-Extensions-Lab > vm-config-01 > Overview | VM status shows Running                                |
| 3   | Custom Script Extension installed | vm-config-01 > Extensions + applications    | CustomScriptExtension shows Provisioning succeeded     |
| 4   | Diagnostics extension enabled     | vm-config-01 > Extensions + applications    | IaaSDiagnostics extension shows Provisioning succeeded |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Extensions-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n vm-config-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$VM" = "vm-config-01" ]; then echo "[PASS] Task 2: vm-config-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VM missing"; FAIL=$((FAIL+1)); fi

CS=$(az vm extension list --vm-name vm-config-01 -g "$RG" --query "[?contains(name, 'CustomScript')] | length(@)" -o tsv 2>/dev/null)
if [ "${CS:-0}" -gt 0 ]; then echo "[PASS] Task 3: Custom Script Extension installed"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: Custom Script Extension missing"; FAIL=$((FAIL+1)); fi

DG=$(az vm extension list --vm-name vm-config-01 -g "$RG" --query "[?contains(name, 'Diagnostics') || contains(name, 'IaaSDiagnostics')] | length(@)" -o tsv 2>/dev/null)
if [ "${DG:-0}" -gt 0 ]; then echo "[PASS] Task 4: Diagnostics extension installed"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: Diagnostics extension missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

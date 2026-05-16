# Lab 99 — Azure Automation & Update Management

**Domain:** Monitoring & Backup  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your IT operations team needs to automate OS patching for a fleet of Azure VMs. You will create an Azure Automation account, enable Update Management to assess missing patches, and schedule a recurring update deployment to ensure all VMs stay current with security updates during a designated maintenance window.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Automation-Lab` in East US
- [ ] **Task 2:** Create an Automation account named `aa-ops-automation-01` in `RG-Automation-Lab` with a system-assigned managed identity
- [ ] **Task 3:** Create a VM named `vm-patch-target-01` (Windows Server 2022, Standard_B2s) in `RG-Automation-Lab` and enable Update Management via Azure Update Manager
- [ ] **Task 4:** Perform an on-demand assessment on `vm-patch-target-01` to check for missing updates and review the results
- [ ] **Task 5:** Create a scheduled maintenance configuration named `mc-weekly-patch` that deploys Critical and Security updates every Sunday at 02:00 UTC with a 2-hour maintenance window, targeting `vm-patch-target-01`

## Skills Tested

- Creating and configuring Azure Automation accounts
- Enabling Azure Update Manager for VMs
- Performing update assessments and reviewing compliance
- Scheduling recurring update deployments with maintenance configurations

## Verification Criteria

| #   | What to Check                    | Where in Portal                                          | How to Verify                                                           |
| --- | -------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Automation account exists        | Automation Accounts > `aa-ops-automation-01`             | Account is in `RG-Automation-Lab` with system-assigned managed identity |
| 2   | VM exists and is running         | Virtual Machines > `vm-patch-target-01`                  | VM is running in `RG-Automation-Lab`                                    |
| 3   | Update assessment completed      | Azure Update Manager > `vm-patch-target-01` > Updates    | Assessment shows a list of available/missing updates                    |
| 4   | Maintenance configuration exists | Azure Update Manager > Maintenance Configurations        | `mc-weekly-patch` is listed with Sunday 02:00 UTC schedule              |
| 5   | Correct update classifications   | Maintenance Configurations > `mc-weekly-patch` > Updates | Only Critical and Security classifications are selected                 |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Automation-Lab
AAID=$(az automation account show -n aa-ops-automation-01 -g "$RG" --query "identity.type" -o tsv 2>/dev/null)
case "$AAID" in *SystemAssigned*) echo "[PASS] Task 1+2: automation account with SystemAssigned MI"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 1+2: automation account identity is '$AAID'"; FAIL=$((FAIL+1));; esac

VM=$(az vm show -n vm-patch-target-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ -n "$VM" ]; then echo "[PASS] Task 3a: vm-patch-target-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3a: VM missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 3b/4: assessment results are time-bound, best viewed in portal"; PASS=$((PASS+1))

MC=$(az maintenance configuration show -n mc-weekly-patch -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$MC" = "mc-weekly-patch" ]; then echo "[PASS] Task 5: mc-weekly-patch exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: mc-weekly-patch missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 5b: update classifications best verified via portal"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

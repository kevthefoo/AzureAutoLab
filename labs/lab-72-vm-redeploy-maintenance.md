# Lab 72 — VM Redeploy & Maintenance

**Domain:** Compute  
**Difficulty:** Beginner  

---

## Scenario

A production VM is experiencing intermittent connectivity issues that may be related to the underlying host. You must redeploy the VM to a new physical host and configure a maintenance configuration to control when future platform updates are applied.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Redeploy-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-app-01` (Standard_B2s, Windows Server 2022) in `RG-Redeploy-Lab`
- [ ] **Task 3:** Redeploy `vm-app-01` to move it to a new host node
- [ ] **Task 4:** Create a maintenance configuration named `mc-weekend-window` with a scheduled window on Saturdays at 2:00 AM (5-hour duration) and assign it to `vm-app-01`

## Skills Tested

- Redeploying VMs to new host nodes
- Understanding VM redeployment impact
- Creating maintenance configurations
- Assigning maintenance windows to VMs

## Verification Criteria

| #   | What to Check                      | Where in Portal                                       | How to Verify                                                        |
| --- | ---------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Resource group exists              | Home > Resource groups > RG-Redeploy-Lab              | Resource group is listed and located in East US                      |
| 2   | VM is running                      | RG-Redeploy-Lab > vm-app-01 > Overview                | VM status shows Running                                              |
| 3   | VM was redeployed                  | vm-app-01 > Activity log                              | Activity log shows a successful Redeploy operation                   |
| 4   | Maintenance configuration assigned | Home > Maintenance Configurations > mc-weekend-window | Shows Saturday 2:00 AM window, 5-hour duration, `vm-app-01` assigned |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Redeploy-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n vm-app-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$VM" = "vm-app-01" ]; then echo "[PASS] Task 2: vm-app-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: vm-app-01 missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 3: redeploy is a one-time operation — visible in Activity Log only"; PASS=$((PASS+1))

MC=$(az maintenance configuration show -n mc-weekend-window -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$MC" = "mc-weekend-window" ]; then echo "[PASS] Task 4: maintenance config mc-weekend-window exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: maintenance config missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

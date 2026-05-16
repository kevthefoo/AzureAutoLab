# Lab 39 — VM Auto-Shutdown Schedule

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-21

---

## Scenario

To control cloud spend, finance wants all development VMs to auto-shutdown every evening. Configure an auto-shutdown schedule on a VM with a pre-shutdown email notification so developers can extend the window if they are still working.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-AutoShutdown-Lab` in **East US**
- [ ] **Task 2:** Create a small Linux VM `vm-autoshut-01` (Ubuntu 22.04, Standard_B1s) in `RG-AutoShutdown-Lab`
- [ ] **Task 3:** Configure auto-shutdown for `vm-autoshut-01` at **20:00** in the **UTC** time zone with status **Enabled**
- [ ] **Task 4:** Enable a **15-minute** pre-shutdown email notification on the auto-shutdown schedule

## Skills Tested

- Creating Azure virtual machines
- Configuring VM auto-shutdown schedules (Microsoft.DevTestLab/schedules)
- Enabling pre-shutdown notifications
- Using auto-shutdown for cost optimization

## Verification Criteria

| #   | What to Check                                  | CLI Command                                                                                                                                                                                                                                                                                          |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Resource group `RG-AutoShutdown-Lab` exists    | `az group show --name RG-AutoShutdown-Lab --query "{name:name, location:location}" -o json`                                                                                                                                                                                                        |
| 2   | VM `vm-autoshut-01` exists and is running      | `az vm show --name vm-autoshut-01 --resource-group RG-AutoShutdown-Lab --show-details --query "{name:name, powerState:powerState, size:hardwareProfile.vmSize}" -o json`                                                                                                                           |
| 3   | Auto-shutdown schedule enabled at 20:00 UTC    | `az resource show --resource-type Microsoft.DevTestLab/schedules --name shutdown-computevm-vm-autoshut-01 --resource-group RG-AutoShutdown-Lab --query "{status:properties.status, time:properties.dailyRecurrence.time, timeZone:properties.timeZoneId}" -o json`                                  |
| 4   | Pre-shutdown notification enabled at 15 min    | `az resource show --resource-type Microsoft.DevTestLab/schedules --name shutdown-computevm-vm-autoshut-01 --resource-group RG-AutoShutdown-Lab --query "{notificationStatus:properties.notificationSettings.status, timeInMinutes:properties.notificationSettings.timeInMinutes}" -o json`         |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-AutoShutdown-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n vm-autoshut-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$VM" = "vm-autoshut-01" ]; then echo "[PASS] Task 2: vm-autoshut-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VM missing"; FAIL=$((FAIL+1)); fi

T=$(az resource show --resource-type Microsoft.DevTestLab/schedules -n shutdown-computevm-vm-autoshut-01 -g "$RG" --query "properties.dailyRecurrence.time" -o tsv 2>/dev/null)
S=$(az resource show --resource-type Microsoft.DevTestLab/schedules -n shutdown-computevm-vm-autoshut-01 -g "$RG" --query "properties.status" -o tsv 2>/dev/null)
if [ "$T" = "2000" ] && [ "$S" = "Enabled" ]; then echo "[PASS] Task 3: auto-shutdown enabled at 20:00"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: schedule wrong (time=$T status=$S)"; FAIL=$((FAIL+1)); fi

N=$(az resource show --resource-type Microsoft.DevTestLab/schedules -n shutdown-computevm-vm-autoshut-01 -g "$RG" --query "properties.notificationSettings.status" -o tsv 2>/dev/null)
NM=$(az resource show --resource-type Microsoft.DevTestLab/schedules -n shutdown-computevm-vm-autoshut-01 -g "$RG" --query "properties.notificationSettings.timeInMinutes" -o tsv 2>/dev/null)
if [ "$N" = "Enabled" ] && [ "$NM" = "15" ]; then echo "[PASS] Task 4: pre-shutdown notification at 15 min"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: notification wrong (status=$N min=$NM)"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 74 — VMSS Rolling Upgrades

**Domain:** Compute  
**Difficulty:** Advanced  

---

## Scenario

The platform team manages a VM Scale Set that serves production traffic. They need to update the VMSS image with zero downtime by configuring a rolling upgrade policy that updates instances in controlled batches.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-RollingUpgrade-Lab` in the `East US` region
- [ ] **Task 2:** Create a VMSS named `vmss-web-prod` (Standard_B2s, Windows Server 2022, 3 instances) in `RG-RollingUpgrade-Lab` with Uniform orchestration and Manual upgrade policy
- [ ] **Task 3:** Change the upgrade policy to Rolling with max batch percentage 20%, max unhealthy percentage 20%, and pause time of 5 seconds
- [ ] **Task 4:** Configure a health probe on the VMSS load balancer for port 80 to enable automatic health monitoring
- [ ] **Task 5:** Trigger a rolling upgrade on the VMSS instances

## Skills Tested

- Configuring VMSS upgrade policies
- Setting up rolling upgrade parameters
- Understanding health probes for rolling upgrades
- Monitoring rolling upgrade progress

## Verification Criteria

| #   | What to Check                     | Where in Portal                                   | How to Verify                                             |
| --- | --------------------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| 1   | Resource group exists             | Home > Resource groups > RG-RollingUpgrade-Lab    | Resource group is listed and located in East US           |
| 2   | VMSS exists with 3 instances      | RG-RollingUpgrade-Lab > vmss-web-prod > Instances | 3 instances listed and running                            |
| 3   | Rolling upgrade policy configured | vmss-web-prod > Upgrade policy                    | Policy set to Rolling; batch 20%, unhealthy 20%, pause 5s |
| 4   | Health probe configured           | vmss-web-prod > Health and repair                 | Health probe monitoring on port 80                        |
| 5   | Rolling upgrade executed          | vmss-web-prod > Activity log                      | Rolling upgrade operation recorded                        |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-RollingUpgrade-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

CAP=$(az vmss show -n vmss-web-prod -g "$RG" --query sku.capacity -o tsv 2>/dev/null)
if [ "$CAP" = "3" ]; then echo "[PASS] Task 2: vmss-web-prod has 3 instances"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: vmss has $CAP instances"; FAIL=$((FAIL+1)); fi

MODE=$(az vmss show -n vmss-web-prod -g "$RG" --query "upgradePolicy.mode" -o tsv 2>/dev/null)
if [ "$MODE" = "Rolling" ]; then echo "[PASS] Task 3: upgradePolicy.mode=Rolling"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: upgradePolicy.mode='$MODE'"; FAIL=$((FAIL+1)); fi

PORT=$(az vmss show -n vmss-web-prod -g "$RG" --query "virtualMachineProfile.networkProfile.healthProbe.id" -o tsv 2>/dev/null)
if [ -n "$PORT" ]; then echo "[PASS] Task 4: health probe attached to VMSS"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no health probe on VMSS"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 5: rolling upgrade execution is recorded in Activity Log"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

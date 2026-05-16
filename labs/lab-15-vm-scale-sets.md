# Lab 15 — VM Scale Sets

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your web application is experiencing variable traffic. You need to deploy a VM Scale Set that can automatically scale the number of instances based on demand.

## Tasks

- [x] **Task 1:** Create a **VM Scale Set** named `VMSS-Web` in **East US** inside resource group `RG-Dev-Lab` with **2** initial instances, using **Standard_B1s** size and **Ubuntu** image
- [x] **Task 2:** Configure **autoscale** on `VMSS-Web` — scale out to **4** instances when CPU > **75%**, scale in to **2** instances when CPU < **25%**
- [x] **Task 3:** Add a **tag** `Role=WebTier` to the scale set

## Skills Tested

- VM Scale Set creation and sizing
- Autoscale rules based on metrics
- Scale set tagging

## Verification Criteria

| #   | What to Check              | CLI Command                                                                                                                              |
| --- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | VMSS `VMSS-Web` exists     | `az vmss show --name VMSS-Web --resource-group RG-Dev-Lab --query "{name:name, sku:sku, location:location}" -o json`                     |
| 2   | Autoscale setting exists   | `az monitor autoscale list --resource-group RG-Dev-Lab --query "[].{name:name, enabled:enabled, profiles:profiles[0].capacity}" -o json` |
| 3   | Tag `Role=WebTier` present | `az vmss show --name VMSS-Web --resource-group RG-Dev-Lab --query "{tags:tags}" -o json`                                                 |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
LOC=$(az vmss show -n VMSS-Web -g "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: VMSS-Web exists in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: VMSS-Web missing or wrong loc ($LOC)"; FAIL=$((FAIL+1)); fi

CNT=$(az monitor autoscale list -g "$RG" --query "length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: $CNT autoscale setting(s) in $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no autoscale settings in $RG"; FAIL=$((FAIL+1)); fi

TAG=$(az vmss show -n VMSS-Web -g "$RG" --query "tags.Role" -o tsv 2>/dev/null)
if [ "$TAG" = "WebTier" ]; then echo "[PASS] Task 3: tag Role=WebTier on VMSS-Web"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: tag Role is '$TAG' (expected WebTier)"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED
- **Date:** 2026-04-11
- **Notes:** VMSS-Web created with 2 instances in East US. Autoscale configured: max 4 at 75% CPU, min 2 at 25% CPU. Tag Role=WebTier applied. Used Standard_L2aos_v4 SKU (B1s unavailable).

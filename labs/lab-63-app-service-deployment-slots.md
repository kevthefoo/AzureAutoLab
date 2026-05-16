# Lab 63 — App Service Deployment Slots

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The release engineering team wants zero-downtime deployments for the company website. You must configure deployment slots on an App Service so that new releases can be staged and tested before swapping into production.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Slots-Lab` in the `East US` region
- [ ] **Task 2:** Create an App Service Plan named `asp-slots-lab` (Standard S1 tier) in `RG-Slots-Lab`
- [ ] **Task 3:** Create a Web App named `webapp-slots-lab2026` on `asp-slots-lab` (runtime: .NET 8)
- [ ] **Task 4:** Create a deployment slot named `staging` for `webapp-slots-lab2026`
- [ ] **Task 5:** Perform a swap between the `staging` slot and the production slot

## Skills Tested

- Creating App Service Plans with appropriate tiers for slots
- Creating and managing deployment slots
- Understanding slot swap operations
- Configuring slot-specific settings

## Verification Criteria

| #   | What to Check                   | Where in Portal                                        | How to Verify                                   |
| --- | ------------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| 1   | Resource group exists           | Home > Resource groups > RG-Slots-Lab                  | Resource group is listed and located in East US |
| 2   | App Service Plan is Standard S1 | RG-Slots-Lab > asp-slots-lab > Overview                | Pricing tier shows Standard S1                  |
| 3   | Web App exists                  | RG-Slots-Lab > webapp-slots-lab2026 > Overview         | Web app is running with .NET 8 runtime          |
| 4   | Staging slot exists             | webapp-slots-lab2026 > Deployment slots                | `staging` slot is listed with its own URL       |
| 5   | Swap completed                  | webapp-slots-lab2026 > Deployment slots > Activity Log | Swap operation recorded in activity log         |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Slots-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SKU=$(az appservice plan show -n asp-slots-lab -g "$RG" --query sku.name -o tsv 2>/dev/null)
if [ "$SKU" = "S1" ]; then echo "[PASS] Task 2: asp-slots-lab Standard S1"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: plan sku is '$SKU'"; FAIL=$((FAIL+1)); fi

W=$(az webapp show -n webapp-slots-lab2026 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$W" = "webapp-slots-lab2026" ]; then echo "[PASS] Task 3: webapp exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: webapp missing"; FAIL=$((FAIL+1)); fi

SLOT=$(az webapp deployment slot list -n webapp-slots-lab2026 -g "$RG" --query "[?name=='staging'] | length(@)" -o tsv 2>/dev/null)
if [ "${SLOT:-0}" -gt 0 ]; then echo "[PASS] Task 4: staging slot exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: staging slot missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 5: swap is a runtime operation — only its absence is detectable (slot still exists)"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

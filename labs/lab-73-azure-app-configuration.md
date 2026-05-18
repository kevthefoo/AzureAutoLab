# Lab 73 — Azure App Configuration

**Domain:** Compute  
**Difficulty:** Intermediate  

---

## Scenario

The platform engineering team wants to centralize application settings and feature flags so that configuration changes can be made without redeploying code. You must create an App Configuration store, add key-value pairs, and set up a feature flag for a beta feature.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AppConfig-Lab` in the `East US` region
- [ ] **Task 2:** Create an App Configuration store named `appconfig-lab2026` (Free tier) in `RG-AppConfig-Lab`
- [ ] **Task 3:** Add the following key-value pairs: `App:Settings:Theme` = `dark`, `App:Settings:MaxItems` = `50`, `App:Settings:Region` = `eastus`
- [ ] **Task 4:** Create a feature flag named `BetaDashboard` with the enabled state set to Off
- [ ] **Task 5:** Add a label `production` to the key `App:Settings:Theme` with value `light`

## Skills Tested

- Creating and configuring App Configuration stores
- Managing key-value pairs with labels
- Creating and managing feature flags
- Understanding configuration hierarchy and labels

## Verification Criteria

| #   | What to Check                  | Where in Portal                                                 | How to Verify                                                  |
| --- | ------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------- |
| 1   | Resource group exists          | Home > Resource groups > RG-AppConfig-Lab                       | Resource group is listed and located in East US                |
| 2   | App Configuration store exists | RG-AppConfig-Lab > appconfig-lab2026 > Overview                 | Store is listed with Free tier                                 |
| 3   | Key-value pairs exist          | appconfig-lab2026 > Configuration explorer                      | Three keys listed with correct values                          |
| 4   | Feature flag exists            | appconfig-lab2026 > Feature manager                             | `BetaDashboard` flag listed, state is Off                      |
| 5   | Labeled key exists             | appconfig-lab2026 > Configuration explorer (filter: production) | `App:Settings:Theme` with label `production` has value `light` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-AppConfig-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SKU=$(az appconfig show -n appconfig-lab2026 -g "$RG" --query sku.name -o tsv 2>/dev/null)
if [ "$SKU" = "Free" ]; then echo "[PASS] Task 2: appconfig-lab2026 (Free)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: appconfig sku is '$SKU'"; FAIL=$((FAIL+1)); fi

CNT=$(az appconfig kv list -n appconfig-lab2026 --query "[?starts_with(key, 'App:Settings:')] | length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -ge 3 ]; then echo "[PASS] Task 3: $CNT App:Settings:* key(s) present"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: only $CNT App:Settings:* key(s)"; FAIL=$((FAIL+1)); fi

FF=$(az appconfig feature list -n appconfig-lab2026 --query "[?name=='BetaDashboard'] | length(@)" -o tsv 2>/dev/null)
if [ "${FF:-0}" -gt 0 ]; then echo "[PASS] Task 4: BetaDashboard feature flag exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: BetaDashboard missing"; FAIL=$((FAIL+1)); fi

PROD=$(az appconfig kv list -n appconfig-lab2026 --label production --query "[?key=='App:Settings:Theme'].value | [0]" -o tsv 2>/dev/null)
if [ "$PROD" = "light" ]; then echo "[PASS] Task 5: production-labeled Theme=light"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: production-labeled Theme is '$PROD'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

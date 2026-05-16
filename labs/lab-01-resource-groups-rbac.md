# Lab 01 — Resource Groups & RBAC

**Domain:** Identity & Governance  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-03

---

## Scenario

Your company needs a new resource group for the development team. You must also ensure a specific user has the right level of access.

## Tasks

- [ ] **Task 1:** Create a Resource Group named `RG-Dev-Lab` in the **East US** region
- [ ] **Task 2:** Add a tag to the resource group: `Environment = Development`
- [ ] **Task 3:** Assign the **Reader** role to the resource group for any user or group in your directory

## Skills Tested

- Resource group creation
- Tagging resources
- Azure RBAC role assignments

## Verification Criteria

| #   | What to Check                                 | Where in Portal                                      | How to Verify                                             |
| --- | --------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| 1   | Resource group `RG-Dev-Lab` exists in East US | Portal > Resource Groups                             | Find `RG-Dev-Lab` in the list, confirm Location = East US |
| 2   | Tag `Environment = Development` is present    | RG-Dev-Lab > Tags                                    | Check tag key `Environment` with value `Development`      |
| 3   | Reader role assignment exists                 | RG-Dev-Lab > Access Control (IAM) > Role assignments | Find at least one entry with Role = Reader                |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
NAME=$(az group show -n RG-Dev-Lab --query name -o tsv 2>/dev/null)
LOC=$(az group show -n RG-Dev-Lab --query location -o tsv 2>/dev/null)
if [ "$NAME" = "RG-Dev-Lab" ] && [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: RG-Dev-Lab exists in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: RG-Dev-Lab missing or wrong region (name=$NAME loc=$LOC)"; FAIL=$((FAIL+1)); fi

TAG=$(az group show -n RG-Dev-Lab --query "tags.Environment" -o tsv 2>/dev/null)
if [ "$TAG" = "Development" ]; then echo "[PASS] Task 2: tag Environment=Development"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: tag Environment is '$TAG' (expected Development)"; FAIL=$((FAIL+1)); fi

CNT=$(az role assignment list --resource-group RG-Dev-Lab --query "[?roleDefinitionName=='Reader'] | length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $CNT Reader role assignment(s) on RG-Dev-Lab"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no Reader role assignment on RG-Dev-Lab"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED (3/3)
- **Date Completed:** 2026-04-14
- **Notes:**
  - ✅ Task 1: `RG-Dev-Lab` exists in `eastus`, provisioningState = Succeeded
  - ✅ Task 2: Tag `Environment = Development` confirmed present
  - ✅ Task 3: Reader role assigned to `kevthebug_gmail.com#EXT#@kevthebuggmail.onmicrosoft.com` (type: User)

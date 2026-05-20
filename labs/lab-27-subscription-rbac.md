# Lab 27 — Subscription-Level RBAC

**Domain:** Identity & Governance  
**Difficulty:** Beginner  

---

## Scenario

A new team lead needs Contributor access across all resources in the subscription. You must assign the role at the subscription level and verify that the permissions correctly inherit down to existing resource groups.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-InheritTest-Lab` in the **East US** region
- [ ] **Task 2:** Assign the **Contributor** role to a user at the subscription scope
- [ ] **Task 3:** Verify the role assignment is inherited at the `RG-InheritTest-Lab` resource group level
- [ ] **Task 4:** Confirm the inheritance type shows as "Inherited" in the resource group's IAM blade

## Skills Tested

- Assigning RBAC roles at subscription scope
- Understanding role inheritance across scopes
- Differentiating direct vs inherited role assignments
- Navigating IAM blades at different scope levels

## Verification Criteria

| #   | What to Check                                   | Where in Portal                                              | How to Verify                                                |
| --- | ----------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1   | Resource group `RG-InheritTest-Lab` exists      | Portal > Resource Groups                                     | Find `RG-InheritTest-Lab` in the list                        |
| 2   | Contributor role assigned at subscription scope | Subscription > Access Control (IAM) > Role assignments       | Find the user with Role = Contributor                        |
| 3   | Role is inherited at resource group level       | RG-InheritTest-Lab > Access Control (IAM) > Role assignments | Find the same user with Role = Contributor                   |
| 4   | Assignment shows as Inherited                   | RG-InheritTest-Lab > Access Control (IAM) > Role assignments | Confirm the Scope column shows the subscription (not the RG) |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-InheritTest-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SUB=$(az account show --query id -o tsv)
SUB_C=$(az role assignment list --scope "/subscriptions/$SUB" --query "[?roleDefinitionName=='Contributor'] | length(@)" -o tsv 2>/dev/null)
if [ "${SUB_C:-0}" -gt 0 ]; then echo "[PASS] Task 2: $SUB_C Contributor assignment(s) at subscription scope"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no Contributor assignment at subscription scope"; FAIL=$((FAIL+1)); fi

INH_C=$(az role assignment list --resource-group "$RG" --include-inherited --query "[?roleDefinitionName=='Contributor'] | length(@)" -o tsv 2>/dev/null)
if [ "${INH_C:-0}" -gt 0 ]; then echo "[PASS] Task 3: Contributor visible at RG via inheritance"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: Contributor not visible at RG"; FAIL=$((FAIL+1)); fi

DIR_C=$(az role assignment list --resource-group "$RG" --include-inherited --query "[?roleDefinitionName=='Contributor' && scope=='/subscriptions/$SUB'] | length(@)" -o tsv 2>/dev/null)
if [ "${DIR_C:-0}" -gt 0 ]; then echo "[PASS] Task 4: Contributor scope is subscription (Inherited)"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: Contributor not scoped at subscription level"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

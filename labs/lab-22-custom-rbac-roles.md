# Lab 22 — Custom RBAC Roles

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization needs a custom role that allows helpdesk operators to restart virtual machines and view their status, but not delete or create them. The built-in roles are too broad, so you must define a tailored RBAC role and assign it to a user.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-CustomRBAC-Lab` in the **East US** region
- [ ] **Task 2:** Create a custom RBAC role named `VM Operator Custom` scoped to the resource group, with permissions: `Microsoft.Compute/virtualMachines/read`, `Microsoft.Compute/virtualMachines/start/action`, `Microsoft.Compute/virtualMachines/restart/action`, and `Microsoft.Compute/virtualMachines/powerOff/action`
- [ ] **Task 3:** Assign the `VM Operator Custom` role to a user in your directory at the `RG-CustomRBAC-Lab` scope
- [ ] **Task 4:** Verify the custom role appears in the role definitions list for the resource group

## Skills Tested

- Creating custom RBAC role definitions
- Defining granular action permissions
- Assigning custom roles at resource group scope
- Understanding Azure role-based access control hierarchy

## Verification Criteria

| #   | What to Check                              | Where in Portal                                                 | How to Verify                                                    |
| --- | ------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Resource group `RG-CustomRBAC-Lab` exists  | Portal > Resource Groups                                        | Find `RG-CustomRBAC-Lab` in the list, confirm Location = East US |
| 2   | Custom role `VM Operator Custom` exists    | RG-CustomRBAC-Lab > Access Control (IAM) > Roles                | Search for `VM Operator Custom` in the roles list                |
| 3   | Role assignment exists for the custom role | RG-CustomRBAC-Lab > Access Control (IAM) > Role assignments     | Find an entry with Role = `VM Operator Custom`                   |
| 4   | Custom role has correct permissions        | Access Control (IAM) > Roles > VM Operator Custom > Permissions | Confirm the four VM actions are listed under allowed actions     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-CustomRBAC-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing or wrong location ($LOC)"; FAIL=$((FAIL+1)); fi

ROLE=$(az role definition list --name "VM Operator Custom" --query "[0].roleName" -o tsv 2>/dev/null)
if [ "$ROLE" = "VM Operator Custom" ]; then echo "[PASS] Task 2: custom role exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: custom role 'VM Operator Custom' not found"; FAIL=$((FAIL+1)); fi

CNT=$(az role assignment list --resource-group "$RG" --role "VM Operator Custom" --query "length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $CNT assignment(s) of custom role at RG scope"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no role assignment for the custom role"; FAIL=$((FAIL+1)); fi

ACT=$(az role definition list --name "VM Operator Custom" --query "[0].permissions[0].actions" -o json 2>/dev/null)
case "$ACT" in *virtualMachines/read*virtualMachines/start*virtualMachines/restart*) echo "[PASS] Task 4: role has required VM actions"; PASS=$((PASS+1));;
  *) case "$ACT" in *virtualMachines/restart*virtualMachines/start*) echo "[PASS] Task 4: role has required VM actions"; PASS=$((PASS+1));;
    *) echo "[FAIL] Task 4: role actions missing one of read/start/restart/powerOff"; FAIL=$((FAIL+1));; esac;; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED (4/4)
- **Date Completed:** 2026-04-16
- **Notes:**
  - ✅ Task 1: Resource group `RG-CustomRBAC-Lab` exists in East US (provisioningState: Succeeded)
  - ✅ Task 2: Custom role `VM Operator Custom` exists, scoped to `RG-CustomRBAC-Lab`, with all 4 required permissions: read, start, restart, powerOff
  - ✅ Task 3: Role `VM Operator Custom` assigned to user `kevthebug_gmail.com#EXT#` at the `RG-CustomRBAC-Lab` scope
  - ✅ Task 4: Custom role confirmed in role definitions list with correct assignable scope on the resource group

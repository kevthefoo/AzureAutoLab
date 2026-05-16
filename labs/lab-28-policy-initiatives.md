# Lab 28 — Azure Policy Initiatives

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your compliance team requires multiple tagging policies to be enforced together. Rather than assigning individual policies, you need to create a policy initiative (policy set) that bundles tagging requirements and assign it to a resource group for centralized compliance monitoring.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-PolicyInit-Lab` in the **East US** region
- [ ] **Task 2:** Create a custom policy initiative named `Initiative-RequiredTags` containing two built-in policies: "Require a tag on resources" for tag `Environment` and "Require a tag on resources" for tag `CostCenter`
- [ ] **Task 3:** Assign the `Initiative-RequiredTags` initiative to the `RG-PolicyInit-Lab` resource group

## Skills Tested

- Creating custom policy initiatives (policy sets)
- Bundling multiple policies into an initiative
- Assigning initiatives at resource group scope

## Verification Criteria

| #   | What to Check                                | Where in Portal               | How to Verify                                        |
| --- | -------------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| 1   | Resource group `RG-PolicyInit-Lab` exists    | Portal > Resource Groups      | Find `RG-PolicyInit-Lab` in the list                 |
| 2   | Initiative `Initiative-RequiredTags` exists  | Portal > Policy > Definitions | Search for `Initiative-RequiredTags` in definitions  |
| 3   | Initiative is assigned to the resource group | Portal > Policy > Assignments | Find assignment scoped to `RG-PolicyInit-Lab`        |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-PolicyInit-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

INIT_ID=$(az policy set-definition list --query "[?displayName=='Initiative-RequiredTags' || name=='Initiative-RequiredTags'].id | [0]" -o tsv 2>/dev/null)
if [ -n "$INIT_ID" ]; then echo "[PASS] Task 2: Initiative-RequiredTags definition exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: Initiative-RequiredTags definition missing"; FAIL=$((FAIL+1)); fi

ACNT=$(az policy assignment list -g "$RG" --query "length(@)" -o tsv 2>/dev/null)
if [ "${ACNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $ACNT policy assignment(s) on $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no policy assignment on $RG"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED (3/3)
- **Date Completed:** 2026-04-25
- **Notes:**
  - ✅ Task 1: Resource group `RG-PolicyInit-Lab` exists in East US (provisioningState: Succeeded)
  - ✅ Task 2: Custom initiative `Initiative-RequiredTags` exists (policyType: Custom, id: `46b66f527c814436ac965ac2`)
  - ✅ Task 3: Initiative assigned to `RG-PolicyInit-Lab` scope (assignment id: `c782331812404747955acc31`, policyDefinitionId references the correct initiative)

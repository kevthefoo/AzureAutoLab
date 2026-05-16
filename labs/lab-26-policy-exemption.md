# Lab 26 — Azure Policy Exemption

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-21

---

## Scenario

Your compliance team requires all resources to carry a `CostCenter` tag, but a legacy storage account is temporarily exempt pending refactoring. Assign a tag-audit policy to the resource group, then create a formal policy exemption for the legacy resource so it does not show as non-compliant.

> **Note:** The built-in **"Require a tag on resources"** policy has effect **Audit** — it flags missing tags as non-compliant but does **not** block resource creation. That's why you can create an un-tagged storage account in Task 3 and then formally exempt it in Task 4.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Policy-Exempt-Lab` in **East US** with tag `CostCenter = Finance-001`
- [ ] **Task 2:** Assign the built-in **Audit** policy **"Require a tag on resources"** to `RG-Policy-Exempt-Lab` with assignment name `require-costcenter-tag` and the `tagName` parameter set to `CostCenter`
- [ ] **Task 3:** Create a storage account `stpolexempt<suffix>` in `RG-Policy-Exempt-Lab` (Standard_LRS, StorageV2) **without** a `CostCenter` tag — this is intentional so the policy flags it as non-compliant
- [ ] **Task 4:** Create a policy exemption named `exempt-legacy-storage` at the storage account scope with category `Waiver`, exempting it from the `require-costcenter-tag` assignment

## Skills Tested

- Assigning built-in Azure Policies with parameters
- Creating policy exemptions at resource scope
- Understanding exemption categories (Waiver vs Mitigated)
- Scoping governance controls around individual resources

## Verification Criteria

| #   | What to Check                                    | CLI Command                                                                                                                                                                                                                                         |
| --- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Resource group `RG-Policy-Exempt-Lab` exists     | `az group show --name RG-Policy-Exempt-Lab --query "{name:name, location:location, tags:tags}" -o json`                                                                                                                                             |
| 2   | Policy assignment `require-costcenter-tag` exists | `az policy assignment show --name require-costcenter-tag --resource-group RG-Policy-Exempt-Lab --query "{name:name, displayName:displayName, parameters:parameters}" -o json`                                                                       |
| 3   | Storage account exists in the RG                 | `az storage account list --resource-group RG-Policy-Exempt-Lab --query "[].{name:name, tags:tags}" -o json`                                                                                                                                         |
| 4   | Policy exemption `exempt-legacy-storage` exists  | `az policy exemption show --name exempt-legacy-storage --scope /subscriptions/<SUB_ID>/resourceGroups/RG-Policy-Exempt-Lab/providers/Microsoft.Storage/storageAccounts/<STORAGE_NAME> --query "{name:name, category:exemptionCategory, assignment:policyAssignmentId}" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Policy-Exempt-Lab
CC=$(az group show -n "$RG" --query "tags.CostCenter" -o tsv 2>/dev/null)
if [ "$CC" = "Finance-001" ]; then echo "[PASS] Task 1: $RG has CostCenter=Finance-001"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing or wrong tag (CostCenter=$CC)"; FAIL=$((FAIL+1)); fi

NAME=$(az policy assignment show -n require-costcenter-tag -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$NAME" = "require-costcenter-tag" ]; then echo "[PASS] Task 2: policy assignment require-costcenter-tag exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: policy assignment require-costcenter-tag missing"; FAIL=$((FAIL+1)); fi

SA=$(az storage account list -g "$RG" --query "[0].name" -o tsv 2>/dev/null)
if [ -n "$SA" ]; then echo "[PASS] Task 3: storage account $SA exists in $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no storage account in $RG"; FAIL=$((FAIL+1)); fi

if [ -n "$SA" ]; then
  SCOPE="$(az storage account show -n "$SA" -g "$RG" --query id -o tsv 2>/dev/null)"
  EX=$(az policy exemption show -n exempt-legacy-storage --scope "$SCOPE" --query name -o tsv 2>/dev/null)
  if [ "$EX" = "exempt-legacy-storage" ]; then echo "[PASS] Task 4: policy exemption exists at storage scope"; PASS=$((PASS+1));
  else echo "[FAIL] Task 4: policy exemption missing"; FAIL=$((FAIL+1)); fi
else
  echo "[FAIL] Task 4: cannot check exemption — storage missing"; FAIL=$((FAIL+1))
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED (4/4)
- **Date Completed:** 2026-04-23
- **Notes:**
  - ✅ Task 1: Resource group `RG-Policy-Exempt-Lab` exists in East US with tag `CostCenter: Finance-001`
  - ✅ Task 2: Policy assignment `require-costcenter-tag` exists with `tagName=CostCenter` parameter correctly set
  - ✅ Task 3: Storage account `stpolexempt` exists in `RG-Policy-Exempt-Lab` with no `CostCenter` tag (correctly untagged, flagged by policy)
  - ✅ Task 4: Policy exemption `exempt-legacy-storage` exists at storage account scope with category `Waiver`, linked to `require-costcenter-tag` assignment

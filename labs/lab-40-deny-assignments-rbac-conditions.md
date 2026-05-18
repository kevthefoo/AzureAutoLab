# Lab 40 — Deny Assignments & RBAC Conditions

**Domain:** Identity & Governance  
**Difficulty:** Advanced  

---

## Scenario

Your security team wants to restrict a Contributor from managing certain storage blob containers even though they have broad resource access. You must use RBAC conditions (ABAC) to add attribute-based restrictions to a role assignment, limiting blob access based on container name.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-RBACCondition-Lab` in **East US**
- [ ] **Task 2:** Create a storage account named `strbaccondlab` in `RG-RBACCondition-Lab` with two blob containers: `public-data` and `confidential-data`
- [ ] **Task 3:** Assign the **Storage Blob Data Contributor** role to a user scoped to `strbaccondlab`, with an RBAC condition that restricts access to only the `public-data` container (condition: container name equals `public-data`)
- [ ] **Task 4:** Verify the role assignment shows a condition in the IAM blade

## Skills Tested

- Understanding Azure ABAC (Attribute-Based Access Control)
- Adding conditions to RBAC role assignments
- Working with storage blob container-level conditions
- Differentiating deny assignments from RBAC conditions

## Verification Criteria

| #   | What to Check                                  | Where in Portal                                         | How to Verify                                                         |
| --- | ---------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | Resource group `RG-RBACCondition-Lab` exists   | Portal > Resource Groups                                | Find `RG-RBACCondition-Lab` in the list                               |
| 2   | Storage account with two containers exists     | strbaccondlab > Containers                              | Confirm `public-data` and `confidential-data` containers exist        |
| 3   | Conditional role assignment exists             | strbaccondlab > Access Control (IAM) > Role assignments | Find the user with Storage Blob Data Contributor + Condition column   |
| 4   | Condition restricts to `public-data` container | Role assignment > Condition tab                         | Confirm the condition expression references container = `public-data` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-RBACCondition-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SA=strbaccondlab
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then echo "[FAIL] Task 2: storage account $SA missing"; FAIL=$((FAIL+1));
else
  PD=$(az storage container show -n public-data --account-name "$SA" --account-key "$KEY" --query name -o tsv 2>/dev/null)
  CD=$(az storage container show -n confidential-data --account-name "$SA" --account-key "$KEY" --query name -o tsv 2>/dev/null)
  if [ "$PD" = "public-data" ] && [ "$CD" = "confidential-data" ]; then echo "[PASS] Task 2: both containers exist"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: containers missing (public-data=$PD confidential-data=$CD)"; FAIL=$((FAIL+1)); fi
fi

SCOPE=$(az storage account show -n "$SA" -g "$RG" --query id -o tsv 2>/dev/null)
CCNT=0
if [ -n "$SCOPE" ]; then CCNT=$(az role assignment list --scope "$SCOPE" --query "[?roleDefinitionName=='Storage Blob Data Contributor' && condition != null] | length(@)" -o tsv 2>/dev/null); fi
if [ "${CCNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: conditional Storage Blob Data Contributor assignment exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no conditional Storage Blob Data Contributor assignment"; FAIL=$((FAIL+1)); fi

CTXT=$(az role assignment list --scope "$SCOPE" --query "[?roleDefinitionName=='Storage Blob Data Contributor'].condition | [0]" -o tsv 2>/dev/null)
case "$CTXT" in *public-data*) echo "[PASS] Task 4: condition references public-data"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 4: no condition referencing public-data"; FAIL=$((FAIL+1));; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

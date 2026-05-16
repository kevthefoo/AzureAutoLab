# Lab 34 — Tag Inheritance Policy & Remediation

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-21

---

## Scenario

Every resource in a given resource group should automatically inherit the resource group's `Environment` tag. Assign the built-in policy that modifies missing tags, then trigger a remediation task so existing non-compliant resources are brought into compliance.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-TagInherit-Lab` in **East US** with tag `Environment = Production`
- [ ] **Task 2:** Create a storage account `sttaginh<suffix>` in `RG-TagInherit-Lab` with no tags on the account
- [ ] **Task 3:** Assign the built-in policy **"Inherit a tag from the resource group if missing"** to `RG-TagInherit-Lab` for tag name `Environment`, assignment name `inherit-environment-tag`, with a **system-assigned managed identity** enabled for remediation
- [ ] **Task 4:** Create a remediation task for the `inherit-environment-tag` assignment and verify the storage account ends up with `Environment = Production`

## Skills Tested

- Assigning Azure Policies with the Modify effect
- Configuring managed identity for policy remediation
- Creating and executing policy remediation tasks
- Verifying tag inheritance and compliance state

## Verification Criteria

| #   | What to Check                                        | CLI Command                                                                                                                                                                              |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | RG has `Environment = Production` tag                | `az group show --name RG-TagInherit-Lab --query "{name:name, tags:tags}" -o json`                                                                                                        |
| 2   | Storage account exists in the RG                     | `az storage account list --resource-group RG-TagInherit-Lab --query "[].{name:name, tags:tags}" -o json`                                                                                 |
| 3   | Policy assignment has system-assigned identity       | `az policy assignment show --name inherit-environment-tag --resource-group RG-TagInherit-Lab --query "{name:name, identity:identity.type, displayName:displayName}" -o json`             |
| 4   | Storage account now has `Environment = Production` tag | `az storage account show --name <STORAGE_NAME> --resource-group RG-TagInherit-Lab --query "{name:name, tags:tags}" -o json`                                                            |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-TagInherit-Lab
E=$(az group show -n "$RG" --query "tags.Environment" -o tsv 2>/dev/null)
if [ "$E" = "Production" ]; then echo "[PASS] Task 1: $RG has Environment=Production"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG Environment tag is '$E'"; FAIL=$((FAIL+1)); fi

SA=$(az storage account list -g "$RG" --query "[0].name" -o tsv 2>/dev/null)
if [ -n "$SA" ]; then echo "[PASS] Task 2: storage account $SA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no storage account in $RG"; FAIL=$((FAIL+1)); fi

IT=$(az policy assignment show -n inherit-environment-tag -g "$RG" --query "identity.type" -o tsv 2>/dev/null)
case "$IT" in *SystemAssigned*) echo "[PASS] Task 3: policy assignment has system-assigned identity"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: policy assignment identity is '$IT'"; FAIL=$((FAIL+1));; esac

if [ -n "$SA" ]; then
  ET=$(az storage account show -n "$SA" -g "$RG" --query "tags.Environment" -o tsv 2>/dev/null)
  if [ "$ET" = "Production" ]; then echo "[PASS] Task 4: $SA inherited Environment=Production"; PASS=$((PASS+1));
  else echo "[FAIL] Task 4: $SA Environment tag is '$ET'"; FAIL=$((FAIL+1)); fi
else
  echo "[FAIL] Task 4: cannot check tag — storage missing"; FAIL=$((FAIL+1))
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

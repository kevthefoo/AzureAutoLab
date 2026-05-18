# Lab 30 — Resource Tags & Cost Management

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  

---

## Scenario

Finance needs to track cloud spending by department. You must apply a tag inheritance policy so that resource groups automatically pass their tags to child resources, and set up a cost alert that triggers when spending for a specific tag value exceeds a threshold.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-CostTags-Lab` in **East US** with tags `Department = Marketing` and `Project = Campaign2026`
- [ ] **Task 2:** Assign the built-in policy "Inherit a tag from the resource group" for the tag `Department` to the `RG-CostTags-Lab` resource group
- [ ] **Task 3:** Create a storage account named `stcosttagslab` inside `RG-CostTags-Lab` and verify the `Department` tag is inherited
- [ ] **Task 4:** Navigate to Cost Management and create a budget named `Budget-Marketing` for $50 with an alert at 80% threshold

## Skills Tested

- Applying and managing resource tags
- Using built-in tag inheritance policies
- Creating budgets in Cost Management
- Configuring cost alert thresholds

## Verification Criteria

| #   | What to Check                                              | Where in Portal               | How to Verify                                                 |
| --- | ---------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| 1   | RG has tags `Department=Marketing`, `Project=Campaign2026` | RG-CostTags-Lab > Tags        | Confirm both tags are present with correct values             |
| 2   | Tag inheritance policy is assigned                         | Portal > Policy > Assignments | Find "Inherit a tag from the resource group" scoped to the RG |
| 3   | Storage account has inherited `Department` tag             | stcosttagslab > Tags          | Confirm `Department = Marketing` tag is present               |
| 4   | Budget `Budget-Marketing` exists with 80% alert            | Cost Management > Budgets     | Find budget with $50 amount and 80% alert threshold           |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-CostTags-Lab
D=$(az group show -n "$RG" --query "tags.Department" -o tsv 2>/dev/null)
P=$(az group show -n "$RG" --query "tags.Project" -o tsv 2>/dev/null)
if [ "$D" = "Marketing" ] && [ "$P" = "Campaign2026" ]; then echo "[PASS] Task 1: tags Department=Marketing, Project=Campaign2026"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: tags wrong (Dept=$D Proj=$P)"; FAIL=$((FAIL+1)); fi

PCNT=$(az policy assignment list -g "$RG" --query "[?contains(displayName, 'Inherit')] | length(@)" -o tsv 2>/dev/null)
if [ "${PCNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: tag inheritance policy assigned to $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no tag inheritance policy on $RG"; FAIL=$((FAIL+1)); fi

SD=$(az storage account show -n stcosttagslab -g "$RG" --query "tags.Department" -o tsv 2>/dev/null)
if [ "$SD" = "Marketing" ]; then echo "[PASS] Task 3: stcosttagslab inherited Department=Marketing"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: stcosttagslab Department tag is '$SD'"; FAIL=$((FAIL+1)); fi

BNAME=$(az consumption budget list --query "[?name=='Budget-Marketing'].name | [0]" -o tsv 2>/dev/null)
if [ "$BNAME" = "Budget-Marketing" ]; then echo "[PASS] Task 4: Budget-Marketing exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: Budget-Marketing missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

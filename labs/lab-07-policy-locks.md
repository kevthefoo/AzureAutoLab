# Lab 07 — Azure Policy & Resource Locks

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  

---

## Scenario

Your compliance team requires that all resources in the development environment are tagged properly and that critical resources cannot be accidentally deleted. You must enforce tagging via Azure Policy and protect key resources with locks.

## Tasks

- [ ] **Task 1:** Assign the built-in policy **"Require a tag and its value on resources"** to resource group `RG-Dev-Lab`. Set the tag name to `CostCenter` and the tag value to `Dev-001`
- [ ] **Task 2:** Create a **Read-Only lock** named `Lock-LAW` on the Log Analytics workspace `LAW-Dev-Lab` to prevent modifications
- [ ] **Task 3:** Create a **Delete lock** named `Lock-RG` on the resource group `RG-Dev-Lab` to prevent accidental deletion

## Skills Tested

- Azure Policy assignment with parameters
- Understanding policy effects (Deny, Audit, etc.)
- Resource lock types (ReadOnly vs Delete)
- Applying locks at different scopes (resource vs resource group)

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                                                                   |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Policy assignment exists on `RG-Dev-Lab`   | `az policy assignment list --resource-group RG-Dev-Lab --query "[?contains(displayName,'tag')].{name:name, displayName:displayName, enforcement:enforcementMode}" -o json`    |
| 2   | Read-Only lock on `LAW-Dev-Lab`            | `az lock list --resource-group RG-Dev-Lab --resource-name LAW-Dev-Lab --resource-type Microsoft.OperationalInsights/workspaces --query "[].{name:name, level:level}" -o json` |
| 3   | Delete lock on resource group `RG-Dev-Lab` | `az lock list --resource-group RG-Dev-Lab --query "[?level=='CanNotDelete'].{name:name, level:level}" -o json`                                                                |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
SCOPE=$(az group show -n "$RG" --query id -o tsv 2>/dev/null)
PCNT=0
if [ -n "$SCOPE" ]; then PCNT=$(az policy assignment list --scope "$SCOPE" --query "[?contains(displayName, 'tag') || contains(displayName, 'Tag')] | length(@)" -o tsv 2>/dev/null); fi
if [ "${PCNT:-0}" -gt 0 ]; then echo "[PASS] Task 1: tag policy assignment exists on $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no tag policy assignment on $RG"; FAIL=$((FAIL+1)); fi

ROCNT=$(az lock list -g "$RG" --resource-name LAW-Dev-Lab --resource-type Microsoft.OperationalInsights/workspaces --query "[?level=='ReadOnly'] | length(@)" -o tsv 2>/dev/null)
if [ "${ROCNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: ReadOnly lock on LAW-Dev-Lab"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no ReadOnly lock on LAW-Dev-Lab"; FAIL=$((FAIL+1)); fi

DLCNT=$(az lock list -g "$RG" --query "[?level=='CanNotDelete'] | length(@)" -o tsv 2>/dev/null)
if [ "${DLCNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: CanNotDelete lock on $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no CanNotDelete lock in $RG"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

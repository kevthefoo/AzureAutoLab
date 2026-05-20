# Lab 23 — Management Groups

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  

---

## Scenario

Your company is expanding and needs a management group hierarchy to organize subscriptions by department. You must create a structure that separates production and development environments for governance purposes.

## Tasks

- [ ] **Task 1:** Create a management group named `MG-CorpIT` under the Tenant Root Group
- [ ] **Task 2:** Create a child management group named `MG-CorpIT-Production` under `MG-CorpIT`
- [ ] **Task 3:** Create a child management group named `MG-CorpIT-Development` under `MG-CorpIT`
- [ ] **Task 4:** Move your current subscription into the `MG-CorpIT-Development` management group

## Skills Tested

- Creating management group hierarchies
- Organizing subscriptions with management groups
- Moving subscriptions between management groups
- Understanding governance inheritance through management groups

## Verification Criteria

| #   | What to Check                                     | Where in Portal                                    | How to Verify                                             |
| --- | ------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| 1   | Management group `MG-CorpIT` exists               | Portal > Management Groups                         | Find `MG-CorpIT` in the hierarchy tree                    |
| 2   | `MG-CorpIT-Production` is a child of `MG-CorpIT`  | Portal > Management Groups > MG-CorpIT             | Confirm `MG-CorpIT-Production` appears as a child group   |
| 3   | `MG-CorpIT-Development` is a child of `MG-CorpIT` | Portal > Management Groups > MG-CorpIT             | Confirm `MG-CorpIT-Development` appears as a child group  |
| 4   | Subscription is under `MG-CorpIT-Development`     | Portal > Management Groups > MG-CorpIT-Development | Confirm your subscription appears listed under this group |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
MG=$(az account management-group show -n MG-CorpIT --query name -o tsv 2>/dev/null)
if [ "$MG" = "MG-CorpIT" ]; then echo "[PASS] Task 1: MG-CorpIT exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: MG-CorpIT missing"; FAIL=$((FAIL+1)); fi

PARENT_P=$(az account management-group show -n MG-CorpIT-Production --query "details.parent.name" -o tsv 2>/dev/null)
if [ "$PARENT_P" = "MG-CorpIT" ]; then echo "[PASS] Task 2: MG-CorpIT-Production parent is MG-CorpIT"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: MG-CorpIT-Production parent is '$PARENT_P'"; FAIL=$((FAIL+1)); fi

PARENT_D=$(az account management-group show -n MG-CorpIT-Development --query "details.parent.name" -o tsv 2>/dev/null)
if [ "$PARENT_D" = "MG-CorpIT" ]; then echo "[PASS] Task 3: MG-CorpIT-Development parent is MG-CorpIT"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: MG-CorpIT-Development parent is '$PARENT_D'"; FAIL=$((FAIL+1)); fi

SUB=$(az account show --query id -o tsv)
COUNT=$(az account management-group show -n MG-CorpIT-Development --expand --query "children[?name=='$SUB' || name=='\"$SUB\"'] | length(@)" -o tsv 2>/dev/null)
if [ "${COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 4: current subscription is under MG-CorpIT-Development"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: current subscription not under MG-CorpIT-Development"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

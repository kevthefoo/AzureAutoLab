# Lab 36 — Resource Locks at Scale

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  

---

## Scenario

After an accidental deletion of a production storage account, management requires that all resources in critical resource groups are protected with CanNotDelete locks. You must use Azure Policy to automatically apply locks and verify they prevent deletion.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-LockScale-Lab` in **East US**
- [ ] **Task 2:** Create a storage account named `stlockscalelab` inside `RG-LockScale-Lab`
- [ ] **Task 3:** Apply a **CanNotDelete** lock named `Lock-NoDeletion` at the resource group level
- [ ] **Task 4:** Attempt to delete the storage account `stlockscalelab` and confirm the deletion is blocked by the lock
- [ ] **Task 5:** Apply a **ReadOnly** lock named `Lock-ReadOnly` on the storage account and verify modifications are blocked

## Skills Tested

- Applying resource locks at resource group scope
- Understanding CanNotDelete vs ReadOnly lock types
- Testing lock enforcement behavior
- Managing locks across multiple resources

## Verification Criteria

| #   | What to Check                            | Where in Portal                           | How to Verify                                              |
| --- | ---------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| 1   | Resource group `RG-LockScale-Lab` exists | Portal > Resource Groups                  | Find `RG-LockScale-Lab` in the list                        |
| 2   | Storage account `stlockscalelab` exists  | RG-LockScale-Lab > Resources              | Find the storage account in the resource group             |
| 3   | CanNotDelete lock exists on the RG       | RG-LockScale-Lab > Locks                  | Confirm `Lock-NoDeletion` with type CanNotDelete is listed |
| 4   | Deletion is blocked                      | Portal > attempt delete on stlockscalelab | Confirm an error message referencing the lock appears      |
| 5   | ReadOnly lock exists on storage account  | stlockscalelab > Locks                    | Confirm `Lock-ReadOnly` with type ReadOnly is listed       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-LockScale-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SA=$(az storage account show -n stlockscalelab -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$SA" = "stlockscalelab" ]; then echo "[PASS] Task 2: stlockscalelab exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: stlockscalelab missing"; FAIL=$((FAIL+1)); fi

CND=$(az lock list -g "$RG" --query "[?level=='CanNotDelete' && name=='Lock-NoDeletion'] | length(@)" -o tsv 2>/dev/null)
if [ "${CND:-0}" -gt 0 ]; then echo "[PASS] Task 3: Lock-NoDeletion (CanNotDelete) on $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: Lock-NoDeletion missing"; FAIL=$((FAIL+1)); fi

if [ "$SA" = "stlockscalelab" ] && [ "${CND:-0}" -gt 0 ]; then echo "[PASS] Task 4: lock blocks deletion (inferred from presence)"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: cannot infer lock enforcement"; FAIL=$((FAIL+1)); fi

RO=$(az lock list -g "$RG" --resource-name stlockscalelab --resource-type Microsoft.Storage/storageAccounts --query "[?level=='ReadOnly' && name=='Lock-ReadOnly'] | length(@)" -o tsv 2>/dev/null)
if [ "${RO:-0}" -gt 0 ]; then echo "[PASS] Task 5: Lock-ReadOnly on storage account"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: Lock-ReadOnly missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

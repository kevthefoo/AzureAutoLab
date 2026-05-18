# Lab 35 — Azure AD B2B Guest Users

**Domain:** Identity & Governance  
**Difficulty:** Beginner  

---

## Scenario

Your company is collaborating with an external consulting firm and needs to grant their project manager access to a specific resource group. You must invite the external user as a B2B guest and assign them an appropriate role scoped to the project resources only.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ExternalCollab-Lab` in **East US** with a tag `Partner = Contoso`
- [ ] **Task 2:** Invite an external guest user to your Entra ID tenant (use any external email address)
- [ ] **Task 3:** Assign the **Reader** role to the guest user scoped to `RG-ExternalCollab-Lab`
- [ ] **Task 4:** Verify the guest user appears in Entra ID with User Type = Guest

## Skills Tested

- Inviting external B2B guest users to Entra ID
- Understanding guest user vs member user types
- Assigning RBAC roles to guest users
- Managing external collaboration settings

## Verification Criteria

| #   | What to Check                                 | Where in Portal                                                 | How to Verify                            |
| --- | --------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| 1   | Resource group `RG-ExternalCollab-Lab` exists | Portal > Resource Groups                                        | Find the RG with tag `Partner = Contoso` |
| 2   | Guest user exists in directory                | Entra ID > Users                                                | Find the user, confirm User type = Guest |
| 3   | Reader role assigned to guest at RG scope     | RG-ExternalCollab-Lab > Access Control (IAM) > Role assignments | Find the guest user with Role = Reader   |
| 4   | Guest user type is correct                    | Entra ID > Users > [guest user] > Profile                       | Confirm User type field shows Guest      |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-ExternalCollab-Lab
P=$(az group show -n "$RG" --query "tags.Partner" -o tsv 2>/dev/null)
if [ "$P" = "Contoso" ]; then echo "[PASS] Task 1: $RG tag Partner=Contoso"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG tag Partner is '$P'"; FAIL=$((FAIL+1)); fi

GUEST_COUNT=$(az ad user list --filter "userType eq 'Guest'" --query "length(@)" -o tsv 2>/dev/null)
if [ "${GUEST_COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: $GUEST_COUNT guest user(s) in directory"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no guest users in directory"; FAIL=$((FAIL+1)); fi

READER=$(az role assignment list --resource-group "$RG" --query "[?roleDefinitionName=='Reader'] | length(@)" -o tsv 2>/dev/null)
if [ "${READER:-0}" -gt 0 ]; then echo "[PASS] Task 3: Reader assigned at $RG scope"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no Reader assignment at $RG"; FAIL=$((FAIL+1)); fi

# Task 4 = same check, "guest user type is correct"
if [ "${GUEST_COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 4: at least one user with userType=Guest"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no Guest users in tenant"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

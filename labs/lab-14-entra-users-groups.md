# Lab 14 — Microsoft Entra ID Users & Groups

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  

---

## Scenario

A new developer is joining the team. You must create their user account in Microsoft Entra ID, add them to a security group, and assign the group a role on the development resource group.

## Tasks

- [x] **Task 1:** Create a **security group** named `SG-Developers` in Microsoft Entra ID with description "Development team members"
- [x] **Task 2:** Create a new **user** named `dev-user-01` with display name `Dev User 01` (any temporary password)
- [x] **Task 3:** Add `dev-user-01` as a **member** of the `SG-Developers` group

## Skills Tested

- Microsoft Entra ID group creation
- User account provisioning
- Group membership management

## Verification Criteria

| #   | What to Check                | CLI Command                                                                                                                               |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Group `SG-Developers` exists | `az ad group show --group SG-Developers --query "{displayName:displayName, description:description}" -o json`                             |
| 2   | User `dev-user-01` exists    | `az ad user list --filter "startsWith(mailNickname,'dev-user-01')" --query "[].{displayName:displayName, upn:userPrincipalName}" -o json` |
| 3   | User is member of group      | `az ad group member check --group SG-Developers --member-id <USER_OBJECT_ID> --query value -o json`                                       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
GID=$(az ad group show --group SG-Developers --query id -o tsv 2>/dev/null)
if [ -n "$GID" ]; then echo "[PASS] Task 1: SG-Developers group exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: SG-Developers group missing"; FAIL=$((FAIL+1)); fi

UID=$(az ad user list --filter "startsWith(mailNickname,'dev-user-01')" --query "[0].id" -o tsv 2>/dev/null)
if [ -n "$UID" ]; then echo "[PASS] Task 2: user dev-user-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: user dev-user-01 missing"; FAIL=$((FAIL+1)); fi

if [ -n "$GID" ] && [ -n "$UID" ]; then
  IS_MEMBER=$(az ad group member check --group SG-Developers --member-id "$UID" --query value -o tsv 2>/dev/null)
  if [ "$IS_MEMBER" = "true" ]; then echo "[PASS] Task 3: dev-user-01 is a member of SG-Developers"; PASS=$((PASS+1));
  else echo "[FAIL] Task 3: dev-user-01 is not a member of SG-Developers"; FAIL=$((FAIL+1)); fi
else
  echo "[FAIL] Task 3: cannot check membership — user or group missing"; FAIL=$((FAIL+1))
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

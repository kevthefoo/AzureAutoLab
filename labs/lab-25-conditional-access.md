# Lab 25 — Entra ID Groups & App Registrations

**Domain:** Identity & Governance  
**Difficulty:** Advanced  

---

## Scenario

Your security team needs identity resources set up for a new internal tool: two security groups (one for admins, one for the dev team), an app registration for the tool itself, and a service principal so the app can authenticate.

## Tasks

- [ ] **Task 1:** Create a security group named `SG-Security-Admins` in Entra ID and add yourself as a member
- [ ] **Task 2:** Create another security group named `SG-Dev-Team` in Entra ID (no members required)
- [ ] **Task 3:** Create an **App Registration** named `app-identity-lab` with a **Web** redirect URI of `https://localhost:5000/callback`
- [ ] **Task 4:** Create a **Service Principal** from the `app-identity-lab` app registration

## Skills Tested

- Entra ID security group management
- Adding members to groups
- Creating app registrations with redirect URIs
- Creating service principals for applications

## Verification Criteria

| #   | What to Check                                             | CLI Command                                                                                                                    |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Security group `SG-Security-Admins` exists with ≥1 member | `az ad group show --group SG-Security-Admins --query "{name:displayName, id:id}" -o json` and `az ad group member list --group SG-Security-Admins --query "length(@)" -o tsv` |
| 2   | Security group `SG-Dev-Team` exists                       | `az ad group show --group SG-Dev-Team --query "{name:displayName, id:id}" -o json`                                             |
| 3   | App registration `app-identity-lab` exists with Web redirect URI | `az ad app list --display-name app-identity-lab --query "[0].{name:displayName, webRedirects:web.redirectUris}" -o json`       |
| 4   | Service principal for `app-identity-lab` exists           | `az ad sp list --display-name app-identity-lab --query "[0].{name:displayName, appId:appId}" -o json`                          |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
GID=$(az ad group show --group SG-Security-Admins --query id -o tsv 2>/dev/null)
MEM=0
if [ -n "$GID" ]; then MEM=$(az ad group member list --group SG-Security-Admins --query "length(@)" -o tsv 2>/dev/null); fi
if [ -n "$GID" ] && [ "${MEM:-0}" -ge 1 ]; then echo "[PASS] Task 1: SG-Security-Admins exists with $MEM member(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: SG-Security-Admins missing or empty"; FAIL=$((FAIL+1)); fi

GID2=$(az ad group show --group SG-Dev-Team --query id -o tsv 2>/dev/null)
if [ -n "$GID2" ]; then echo "[PASS] Task 2: SG-Dev-Team exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: SG-Dev-Team missing"; FAIL=$((FAIL+1)); fi

URI=$(az ad app list --display-name app-identity-lab --query "[0].web.redirectUris" -o tsv 2>/dev/null)
case "$URI" in *localhost:5000/callback*) echo "[PASS] Task 3: app-identity-lab has redirect URI"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: redirect URI is '$URI'"; FAIL=$((FAIL+1));; esac

SP=$(az ad sp list --display-name app-identity-lab --query "[0].appId" -o tsv 2>/dev/null)
if [ -n "$SP" ]; then echo "[PASS] Task 4: SP for app-identity-lab exists ($SP)"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no SP for app-identity-lab"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

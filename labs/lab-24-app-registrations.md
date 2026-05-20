# Lab 24 — Azure AD App Registrations

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  

---

## Scenario

The development team needs an application registered in Entra ID to authenticate against Microsoft Graph API. You must register the app, configure the necessary API permissions, and generate a client secret for server-side authentication.

## Tasks

- [ ] **Task 1:** Register a new application in Entra ID named `App-GraphReader-Lab`
- [ ] **Task 2:** Configure API permissions: add Microsoft Graph > Application permission `User.Read.All` and grant admin consent
- [ ] **Task 3:** Create a client secret named `lab-secret` with an expiration of 6 months
- [ ] **Task 4:** Record the Application (client) ID and Directory (tenant) ID from the app overview

## Skills Tested

- Registering applications in Entra ID
- Configuring API permissions and admin consent
- Creating and managing client secrets
- Understanding application identity concepts

## Verification Criteria

| #   | What to Check                                 | Where in Portal                              | How to Verify                                           |
| --- | --------------------------------------------- | -------------------------------------------- | ------------------------------------------------------- |
| 1   | App `App-GraphReader-Lab` is registered       | Entra ID > App registrations                 | Find `App-GraphReader-Lab` in the list                  |
| 2   | `User.Read.All` permission with admin consent | App-GraphReader-Lab > API permissions        | Confirm `User.Read.All` is listed with Status = Granted |
| 3   | Client secret `lab-secret` exists             | App-GraphReader-Lab > Certificates & secrets | Confirm secret with description `lab-secret` exists     |
| 4   | Application ID and Tenant ID are visible      | App-GraphReader-Lab > Overview               | Confirm both IDs are displayed on the overview page     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
APPID=$(az ad app list --display-name "App-GraphReader-Lab" --query "[0].appId" -o tsv 2>/dev/null)
if [ -n "$APPID" ]; then echo "[PASS] Task 1: App-GraphReader-Lab is registered ($APPID)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: App-GraphReader-Lab not registered"; FAIL=$((FAIL+1)); fi

# User.Read.All app role id
GRAPH_ID="00000003-0000-0000-c000-000000000000"
PERM_COUNT=0
if [ -n "$APPID" ]; then
  PERM_COUNT=$(az ad app show --id "$APPID" --query "requiredResourceAccess[?resourceAppId=='$GRAPH_ID'] | [].resourceAccess[?id=='df021288-bdef-4463-88db-98f22de89214'] | [] | length(@)" -o tsv 2>/dev/null)
fi
if [ "${PERM_COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: User.Read.All permission configured"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: User.Read.All permission not configured"; FAIL=$((FAIL+1)); fi

SCNT=0
if [ -n "$APPID" ]; then SCNT=$(az ad app credential list --id "$APPID" --query "length(@)" -o tsv 2>/dev/null); fi
if [ "${SCNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: app has $SCNT credential(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: app has no credentials"; FAIL=$((FAIL+1)); fi

TID=$(az account show --query tenantId -o tsv 2>/dev/null)
if [ -n "$APPID" ] && [ -n "$TID" ]; then echo "[PASS] Task 4: AppId=$APPID TenantId=$TID"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: missing AppId or TenantId"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

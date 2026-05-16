# Lab 31 — Service Principal Client Secret & RBAC

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-21

---

## Scenario

Your CI/CD pipeline needs programmatic access to deploy Azure resources into a dedicated resource group. Create a service principal, add a client secret as a credential, and grant it the Contributor role scoped only to that resource group.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-CICD-Lab` in **East US**
- [ ] **Task 2:** Create an app registration named `app-cicd-pipeline` and its service principal (no redirect URI required)
- [ ] **Task 3:** Add a client secret on `app-cicd-pipeline` with description `pipeline-secret` and a 1-year expiration
- [ ] **Task 4:** Assign the built-in **Contributor** role to the `app-cicd-pipeline` service principal at the `RG-CICD-Lab` scope

## Skills Tested

- Creating app registrations and service principals
- Generating client secret credentials for service principals
- Managing role assignments scoped to a resource group
- Understanding service principal authentication for automation

## Verification Criteria

| #   | What to Check                                    | CLI Command                                                                                                                                                                  |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Resource group `RG-CICD-Lab` exists              | `az group show --name RG-CICD-Lab --query "{name:name, location:location}" -o json`                                                                                          |
| 2   | App registration and service principal exist     | `az ad sp list --display-name app-cicd-pipeline --query "[0].{name:displayName, appId:appId}" -o json`                                                                       |
| 3   | Client secret `pipeline-secret` exists           | `az ad app credential list --id <APP_ID> --query "[?displayName=='pipeline-secret'].{displayName:displayName, endDateTime:endDateTime}" -o json`                             |
| 4   | Contributor role assigned at `RG-CICD-Lab` scope | `az role assignment list --assignee <APP_ID> --resource-group RG-CICD-Lab --query "[?roleDefinitionName=='Contributor'].{role:roleDefinitionName, scope:scope}" -o json`     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
LOC=$(az group show -n RG-CICD-Lab --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: RG-CICD-Lab exists in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: RG-CICD-Lab missing"; FAIL=$((FAIL+1)); fi

APPID=$(az ad sp list --display-name app-cicd-pipeline --query "[0].appId" -o tsv 2>/dev/null)
if [ -n "$APPID" ]; then echo "[PASS] Task 2: app-cicd-pipeline SP exists ($APPID)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: app-cicd-pipeline SP missing"; FAIL=$((FAIL+1)); fi

SECRET=0
if [ -n "$APPID" ]; then SECRET=$(az ad app credential list --id "$APPID" --query "[?displayName=='pipeline-secret'] | length(@)" -o tsv 2>/dev/null); fi
if [ "${SECRET:-0}" -gt 0 ]; then echo "[PASS] Task 3: client secret pipeline-secret exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: client secret pipeline-secret missing"; FAIL=$((FAIL+1)); fi

ROLE=0
if [ -n "$APPID" ]; then ROLE=$(az role assignment list --assignee "$APPID" --resource-group RG-CICD-Lab --query "[?roleDefinitionName=='Contributor'] | length(@)" -o tsv 2>/dev/null); fi
if [ "${ROLE:-0}" -gt 0 ]; then echo "[PASS] Task 4: Contributor scoped to RG-CICD-Lab"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no Contributor assignment at RG-CICD-Lab"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

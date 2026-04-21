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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

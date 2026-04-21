# Lab 34 — Tag Inheritance Policy & Remediation

**Domain:** Identity & Governance  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-21

---

## Scenario

Every resource in a given resource group should automatically inherit the resource group's `Environment` tag. Assign the built-in policy that modifies missing tags, then trigger a remediation task so existing non-compliant resources are brought into compliance.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-TagInherit-Lab` in **East US** with tag `Environment = Production`
- [ ] **Task 2:** Create a storage account `sttaginh<suffix>` in `RG-TagInherit-Lab` with no tags on the account
- [ ] **Task 3:** Assign the built-in policy **"Inherit a tag from the resource group if missing"** to `RG-TagInherit-Lab` for tag name `Environment`, assignment name `inherit-environment-tag`, with a **system-assigned managed identity** enabled for remediation
- [ ] **Task 4:** Create a remediation task for the `inherit-environment-tag` assignment and verify the storage account ends up with `Environment = Production`

## Skills Tested

- Assigning Azure Policies with the Modify effect
- Configuring managed identity for policy remediation
- Creating and executing policy remediation tasks
- Verifying tag inheritance and compliance state

## Verification Criteria

| #   | What to Check                                        | CLI Command                                                                                                                                                                              |
| --- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | RG has `Environment = Production` tag                | `az group show --name RG-TagInherit-Lab --query "{name:name, tags:tags}" -o json`                                                                                                        |
| 2   | Storage account exists in the RG                     | `az storage account list --resource-group RG-TagInherit-Lab --query "[].{name:name, tags:tags}" -o json`                                                                                 |
| 3   | Policy assignment has system-assigned identity       | `az policy assignment show --name inherit-environment-tag --resource-group RG-TagInherit-Lab --query "{name:name, identity:identity.type, displayName:displayName}" -o json`             |
| 4   | Storage account now has `Environment = Production` tag | `az storage account show --name <STORAGE_NAME> --resource-group RG-TagInherit-Lab --query "{name:name, tags:tags}" -o json`                                                            |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

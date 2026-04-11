# Lab 52 — Storage Access Policies

**Domain:** Storage  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Your application team distributes SAS tokens to partner companies for accessing shared blob containers. Management wants the ability to revoke access at any time without regenerating storage keys. You need to implement stored access policies that control SAS token permissions and can be modified or deleted to instantly revoke access.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-AccessPolicy-Lab` in East US, a storage account `stlabpolicy52`, and a blob container `partner-data`
- [ ] **Task 2:** Create a stored access policy named `partner-read-policy` on the `partner-data` container with Read and List permissions, expiring in 30 days
- [ ] **Task 3:** Generate a service SAS token for the `partner-data` container that is associated with `partner-read-policy`
- [ ] **Task 4:** Create a second stored access policy named `partner-write-policy` with Read, Write, and List permissions, expiring in 7 days
- [ ] **Task 5:** Delete the `partner-read-policy` to revoke all SAS tokens associated with it

## Skills Tested

- Creating stored access policies on blob containers
- Generating SAS tokens linked to stored access policies
- Revoking SAS tokens by modifying or deleting access policies
- Understanding the relationship between policies and SAS tokens

## Verification Criteria

| #   | What to Check                          | Where in Portal                                                              | How to Verify                                                       |
| --- | -------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Storage account and container exist    | Storage accounts > `stlabpolicy52` > Containers                              | `partner-data` container is listed                                  |
| 2   | Read policy created                    | Storage accounts > `stlabpolicy52` > Containers > `partner-data` > Access policy | `partner-read-policy` is listed with Read, List permissions     |
| 3   | SAS token linked to policy             | Generated SAS token string                                                   | SAS token references the stored access policy identifier            |
| 4   | Write policy created                   | Storage accounts > `stlabpolicy52` > Containers > `partner-data` > Access policy | `partner-write-policy` is listed with Read, Write, List perms   |
| 5   | Read policy deleted (access revoked)   | Storage accounts > `stlabpolicy52` > Containers > `partner-data` > Access policy | `partner-read-policy` is no longer listed                       |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

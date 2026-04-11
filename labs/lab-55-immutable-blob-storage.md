# Lab 55 — Immutable Blob Storage

**Domain:** Storage  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your legal department requires that certain financial records be stored in a tamper-proof, non-erasable format to comply with SEC Rule 17a-4 and FINRA regulations. You need to configure immutable blob storage with both legal hold and time-based retention policies to prevent modification or deletion during the required retention period.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Immutable-Lab` in East US, a storage account `stlabimmutable55`, and a blob container `compliance-records`
- [ ] **Task 2:** Upload a file `financial-report-2025.pdf` to the `compliance-records` container
- [ ] **Task 3:** Apply a legal hold with tag `SEC-Investigation-2026` to the `compliance-records` container
- [ ] **Task 4:** Create a time-based retention policy on the `compliance-records` container with a retention interval of 365 days (do not lock the policy)
- [ ] **Task 5:** Attempt to delete `financial-report-2025.pdf` and verify the deletion is blocked by the immutability policy

## Skills Tested

- Configuring legal hold policies on blob containers
- Creating time-based retention policies
- Understanding WORM (Write Once, Read Many) storage
- Testing immutability enforcement on blob operations

## Verification Criteria

| #   | What to Check                       | Where in Portal                                                          | How to Verify                                                    |
| --- | ----------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | Storage account and container exist | Storage accounts > `stlabimmutable55` > Containers                       | `compliance-records` container is listed                         |
| 2   | File uploaded                       | Containers > `compliance-records`                                        | `financial-report-2025.pdf` is listed                            |
| 3   | Legal hold applied                  | Containers > `compliance-records` > Access policy > Legal hold           | Legal hold tag `SEC-Investigation-2026` is active                |
| 4   | Time-based retention policy set     | Containers > `compliance-records` > Access policy > Time-based retention | Retention period shows 365 days, policy is unlocked              |
| 5   | Deletion blocked                    | Containers > `compliance-records` > attempt delete on blob               | Error message indicates blob is protected by immutability policy |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

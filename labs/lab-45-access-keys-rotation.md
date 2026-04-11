# Lab 45 — Storage Account Access Keys & Rotation

**Domain:** Storage  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

A recent security audit revealed that your team has not rotated storage account access keys in over a year. You need to implement key rotation best practices, configure a key expiration reminder policy, and verify that applications can continue to function after key rotation.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-KeyRotation-Lab` in East US and a storage account `stlabkeyrotate45`
- [ ] **Task 2:** Note the current value of key1, then regenerate access key1 for the storage account
- [ ] **Task 3:** Verify the connection string has updated by viewing the new key1 value under Access keys
- [ ] **Task 4:** Configure a key expiration policy on the storage account with a reminder period of 90 days

## Skills Tested

- Viewing and regenerating storage account access keys
- Understanding connection string updates after key rotation
- Configuring key expiration policies
- Implementing access key security best practices

## Verification Criteria

| #   | What to Check                        | Where in Portal                                     | How to Verify                                                 |
| --- | ------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Storage account exists               | Storage accounts > `stlabkeyrotate45`               | Account is listed and accessible                              |
| 2   | Key1 has been regenerated            | Storage accounts > `stlabkeyrotate45` > Access keys | Key1 value differs from original (rotation timestamp updated) |
| 3   | Connection string reflects new key   | Storage accounts > `stlabkeyrotate45` > Access keys | Connection string contains the new key1 value                 |
| 4   | Key expiration policy set to 90 days | Storage accounts > `stlabkeyrotate45` > Access keys | Key expiration policy shows 90-day reminder period            |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

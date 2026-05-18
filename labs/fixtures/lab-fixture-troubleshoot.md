# Lab 999 — Fixture Troubleshoot

**Domain:** Networking
**Difficulty:** Beginner
**Date Assigned:** 2026-05-13

## Scenario

Test fixture lab.

## Tasks

- [ ] **Task 1:** Diagnose the issue

## Setup

```bash
az group create -n RG-TS-999 -l eastus --tags AutoLabId=999
echo "setup complete"
```

## Skills Tested

- NSG diagnosis

## Verification Criteria

| #   | What to Check | CLI Command                  |
| --- | ------------- | ---------------------------- |
| 1   | RG exists     | `az group show -n RG-TS-999` |

## Cleanup

```bash
az group delete -n RG-TS-999 --yes --no-wait
az resource list --tag AutoLabId=999 --query "[].id" -o tsv | xargs -r -n1 az resource delete --ids
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 122 — Troubleshoot Azure File Share Quota Too Small

**Domain:** Storage
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

The CAD team's shared file system `cad-shared` (in `RG-TS-122`) keeps refusing writes with "There is not enough space on the disk." The share quota was set to **5 GiB** when first provisioned. Increase the quota to **500 GiB** so the team can keep working.

## Tasks

- [ ] **Task 1:** Locate the file share `cad-shared` and read its current quota
- [ ] **Task 2:** Increase the quota to **500 GiB**
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-122; TAG="AutoLabId=122"
SA="stautolab122$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv)
az storage share create --name cad-shared --account-name "$SA" --account-key "$KEY" --quota 5 >/dev/null
echo "Setup complete. Share cad-shared quota=5 GiB."
```

## Skills Tested

- Reading and updating Azure Files share quota via portal File shares blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                                                                       |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab storage account still exists           | `az storage account list --query "[?tags.AutoLabId=='122'].name" -o tsv`                                                                                                           |
| 2   | File share `cad-shared` quota ≥ 500        | `sa=$(az storage account list --query "[?tags.AutoLabId=='122'].name" -o tsv); key=$(az storage account keys list -n "$sa" -g RG-TS-122 --query "[0].value" -o tsv); az storage share show --name cad-shared --account-name "$sa" --account-key "$key" --query "properties.quota" -o tsv` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-122 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=122 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

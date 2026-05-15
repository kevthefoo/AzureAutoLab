# Lab 129 — Troubleshoot ACR Admin User Enabled

**Domain:** Compute
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

Security review of `acrts129<random>` (in `RG-TS-129`) flagged the **admin user** as enabled. Admin user credentials are shared and can't be tracked per-identity. Disable admin user; teams should authenticate to the registry with their Entra identity instead.

## Tasks

- [ ] **Task 1:** Check the ACR's `adminUserEnabled` property
- [ ] **Task 2:** Disable the admin user
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-129; TAG="AutoLabId=129"
ACR="acrts129$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.ContainerRegistry --wait
az acr create -n "$ACR" -g "$RG" -l "$LOC" --sku Basic --admin-enabled true --tags "$TAG" >/dev/null
echo "Setup complete. ACR $ACR has admin-enabled=true."
```

## Skills Tested

- Reading `adminUserEnabled` on an ACR
- Toggling via portal Access keys blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                              |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | Lab ACR still exists                       | `az acr list -g RG-TS-129 --query "[?tags.AutoLabId=='129'].name" -o tsv`                 |
| 2   | `adminUserEnabled` is `false`              | `az acr list -g RG-TS-129 --query "[?tags.AutoLabId=='129'].adminUserEnabled" -o tsv`     |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-129 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=129 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

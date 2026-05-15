# Lab 130 — Troubleshoot ACR Anonymous Pull Enabled

**Domain:** Compute
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A new Container Registry `acrts130<random>` in `RG-TS-130` was created with **anonymous pull** turned on. Security says anyone on the internet can pull internal images. Disable anonymous pull so callers must authenticate.

> Note: anonymous pull is available only on Standard and Premium ACR SKUs. This lab uses Standard (~$0.83/day) — clean up promptly.

## Tasks

- [ ] **Task 1:** Inspect the ACR's `anonymousPullEnabled` property
- [ ] **Task 2:** Disable anonymous pull
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-130; TAG="AutoLabId=130"
ACR="acrts130$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.ContainerRegistry --wait
az acr create -n "$ACR" -g "$RG" -l "$LOC" --sku Standard --tags "$TAG" >/dev/null
az acr update -n "$ACR" -g "$RG" --anonymous-pull-enabled true >/dev/null
echo "Setup complete. ACR $ACR has anonymousPullEnabled=true."
```

## Skills Tested

- Reading `anonymousPullEnabled` on an ACR
- Updating via portal Properties blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                  |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 1   | Lab ACR still exists                       | `az acr list -g RG-TS-130 --query "[?tags.AutoLabId=='130'].name" -o tsv`                     |
| 2   | `anonymousPullEnabled` is `false`          | `az acr list -g RG-TS-130 --query "[?tags.AutoLabId=='130'].anonymousPullEnabled" -o tsv`     |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-130 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=130 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

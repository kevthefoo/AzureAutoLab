# Lab 139 — Troubleshoot Public IP Idle Timeout Too Low

**Domain:** Networking
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

Long-lived VPN sessions on `PIP-VPN` in `RG-TS-139` keep dropping after a few minutes. The PIP's **idle timeout** is set to the minimum (4 minutes), but the team needs at least 15 minutes for their workload. Bump the timeout.

## Tasks

- [ ] **Task 1:** Inspect the PIP's `idleTimeoutInMinutes`
- [ ] **Task 2:** Update idle timeout to **15 minutes** (or higher, up to 30)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-139; TAG="AutoLabId=139"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network public-ip create -g "$RG" -n PIP-VPN --sku Standard --allocation-method Static \
  --idle-timeout 4 --tags "$TAG" >/dev/null
echo "Setup complete. PIP-VPN idleTimeoutInMinutes=4."
```

## Skills Tested

- Reading `idleTimeoutInMinutes`
- Updating via portal Configuration blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| 1   | `PIP-VPN` still exists in `RG-TS-139`      | `az network public-ip show -g RG-TS-139 -n PIP-VPN --query name -o tsv`                     |
| 2   | `idleTimeoutInMinutes` is ≥ 15             | `az network public-ip show -g RG-TS-139 -n PIP-VPN --query idleTimeoutInMinutes -o tsv`     |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-139 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=139 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

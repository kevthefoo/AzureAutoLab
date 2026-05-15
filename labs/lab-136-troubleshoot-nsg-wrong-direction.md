# Lab 136 — Troubleshoot NSG Rule Wrong Direction

**Domain:** Networking
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

A developer added an `Allow-SSH` rule to `NSG-Linux` in `RG-TS-136`, but SSH (port 22) still doesn't work. On inspection, the rule was created as **Outbound** instead of **Inbound**. Fix the direction.

## Tasks

- [ ] **Task 1:** Check the direction of the `Allow-SSH` rule
- [ ] **Task 2:** Delete the bad rule and recreate it as **Inbound** (or update direction)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-136; TAG="AutoLabId=136"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network nsg create -g "$RG" -n NSG-Linux --tags "$TAG" >/dev/null
az network nsg rule create -g "$RG" --nsg-name NSG-Linux -n Allow-SSH \
  --priority 200 --access Allow --protocol Tcp --destination-port-ranges 22 \
  --direction Outbound >/dev/null
echo "Setup complete. Allow-SSH is Outbound instead of Inbound."
```

## Skills Tested

- Reading NSG rule `direction` property
- Updating direction via portal or recreating the rule

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                          |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | NSG-Linux still has an Allow-SSH-style rule for port 22 | `az network nsg rule list -g RG-TS-136 --nsg-name NSG-Linux --query "[?destinationPortRange=='22']" -o json` |
| 2   | A rule for port 22 has direction `Inbound` | `az network nsg rule list -g RG-TS-136 --nsg-name NSG-Linux --query "[?destinationPortRange=='22' && direction=='Inbound']" -o json` |

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-136 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=136 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

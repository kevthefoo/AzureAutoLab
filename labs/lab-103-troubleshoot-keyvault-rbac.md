# Lab 103 — Troubleshoot Key Vault Permission Denied

**Domain:** Identity & Governance
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

A new Key Vault was provisioned in `RG-TS-103` for the app team. The owner
(you) is trying to list secrets in the portal and getting "The user, group or
application does not have secrets list permission." The vault is configured
with **RBAC** authorization (not access policies). Diagnose why creating the
vault didn't grant you access, then assign yourself the **least-privileged
RBAC role** that lets you list and read secret values.

## Tasks

- [ ] **Task 1:** Identify why vault creation didn't grant you secret access (RBAC vs. access policies; missing role assignment)
- [ ] **Task 2:** Assign yourself a built-in role on the vault that grants secret read access (e.g. **Key Vault Secrets User**), at the scope of the vault — not subscription or RG
- [ ] **Task 3:** Document the misconfiguration and your fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-103
TAG="AutoLabId=103"
KV="kvautolab103$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

# Ensure the Key Vault provider is registered on the subscription
az provider register --namespace Microsoft.KeyVault --wait

az keyvault create -n "$KV" -g "$RG" -l "$LOC" \
  --enable-rbac-authorization true \
  --tags "$TAG" >/dev/null

echo "Key Vault created: $KV (RBAC mode, no role assignments for current user)"
```

## Skills Tested

- Distinguishing RBAC vs. access-policy authorization on Key Vault
- Identifying that vault creators receive no data-plane role automatically
- Choosing the correct least-privileged built-in role (Key Vault Secrets User)
- Assigning RBAC at the right scope

## Verification Criteria

| #   | What to Check                                                       | CLI Command                                                                                                                                  |
| --- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A Key Vault tagged `AutoLabId=103` exists in RBAC mode              | `az keyvault list --query "[?tags.AutoLabId=='103'].{name:name, rbac:properties.enableRbacAuthorization}" -o json`                            |
| 2   | The vault still has RBAC authorization enabled (no policy fallback) | `az keyvault list --query "[?tags.AutoLabId=='103'].properties.enableRbacAuthorization" -o tsv`                                              |
| 3   | A Key Vault role assignment exists on the vault for current user    | `vid=$(az keyvault list --query "[?tags.AutoLabId=='103'].id" -o tsv); az role assignment list --scope "$vid" --query "[?contains(roleDefinitionName, 'Key Vault')]" -o json` |

A correct fix retains `enableRbacAuthorization == true` AND adds at least one Key Vault role assignment scoped to the vault.

## Cleanup

```bash
set -euo pipefail

# Key Vaults have soft-delete on by default — purge after RG delete
KV=$(az keyvault list --query "[?tags.AutoLabId=='103'].name" -o tsv)

az group delete -n RG-TS-103 --yes --no-wait || true

if [ -n "$KV" ]; then
  # Wait briefly so the vault registers as soft-deleted, then purge
  sleep 5
  az keyvault purge -n "$KV" --no-wait || true
fi

ids=$(az resource list --tag AutoLabId=103 --query "[].id" -o tsv)
if [ -n "$ids" ]; then
  echo "$ids" | xargs -r -n1 az resource delete --ids
fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

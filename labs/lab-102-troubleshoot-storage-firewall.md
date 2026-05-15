# Lab 102 — Troubleshoot Storage Account Firewall

**Domain:** Storage
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

The data team can't read blobs from a newly provisioned storage account in
`RG-TS-102`. Even Storage Explorer fails with `AuthorizationFailure` or
network errors. They suspect the network configuration. You've been asked to
diagnose the storage firewall and restore access for trusted Azure services.
Do **not** simply open the storage account to the entire internet — keep
default-action `Deny` and instead allow Azure trusted services (the team only
needs Logic Apps and Azure Monitor to reach it).

## Tasks

- [ ] **Task 1:** Identify why public clients are being refused (firewall default action, bypass list, IP rules)
- [ ] **Task 2:** Update the storage account so Azure trusted services can bypass the firewall, while default-action remains `Deny`
- [ ] **Task 3:** Document the original misconfiguration and your fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-102
TAG="AutoLabId=102"
SA="stautolab102$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

az storage account create -n "$SA" -g "$RG" -l "$LOC" \
  --sku Standard_LRS --kind StorageV2 \
  --public-network-access Enabled \
  --default-action Deny --bypass None \
  --tags "$TAG" >/dev/null

echo "Storage account created: $SA"
echo "Firewall: default-action=Deny, bypass=None, no IP rules"
```

## Skills Tested

- Reading storage account network ACLs (`az storage account show --query networkRuleSet`)
- Understanding the difference between `defaultAction`, `bypass`, and `ipRules`
- Configuring trusted-services bypass without opening the firewall to all

## Verification Criteria

| #   | What to Check                                       | CLI Command                                                                                                                                              |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A storage account tagged `AutoLabId=102` exists      | `az storage account list --query "[?tags.AutoLabId=='102'].{name:name, rg:resourceGroup}" -o json`                                                       |
| 2   | Firewall still defaults to Deny (not opened wide)   | `az storage account list --query "[?tags.AutoLabId=='102'].networkRuleSet.defaultAction" -o tsv`                                                          |
| 3   | Trusted Azure services are now allowed to bypass    | `az storage account list --query "[?tags.AutoLabId=='102'].networkRuleSet.bypass" -o tsv`                                                                 |

A correct fix sets `defaultAction == "Deny"` AND `bypass` includes `AzureServices`.

## Cleanup

```bash
set -euo pipefail

az group delete -n RG-TS-102 --yes --no-wait || true

ids=$(az resource list --tag AutoLabId=102 --query "[].id" -o tsv)
if [ -n "$ids" ]; then
  echo "$ids" | xargs -r -n1 az resource delete --ids
fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

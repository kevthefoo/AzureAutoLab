# Lab 101 — Troubleshoot Broken RDP

**Domain:** Networking
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-13

---

## Scenario

The DevOps team reports they cannot RDP into a recently deployed Windows VM
(`VM-Web01`) in resource group `RG-TS-101`. You've been asked to investigate
and restore RDP access. There is a deliberate misconfiguration somewhere in
the resource group — find it and fix it without disabling other security
controls.

## Tasks

- [ ] **Task 1:** Identify the root cause of the RDP failure (NSG rules, VM state, etc.)
- [ ] **Task 2:** Restore RDP (port 3389) access from your current public IP only
- [ ] **Task 3:** Document the misconfiguration and your fix in the Result section

## Setup

```bash
set -euo pipefail

LOC=eastus
RG=RG-TS-101
TAG="AutoLabId=101"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

az network vnet create -g "$RG" -n VNET-TS-101 \
  --address-prefixes 10.101.0.0/16 \
  --subnet-name SUB-Web --subnet-prefixes 10.101.1.0/24 \
  --tags "$TAG" >/dev/null

az network nsg create -g "$RG" -n NSG-Web --tags "$TAG" >/dev/null
az network nsg rule create -g "$RG" --nsg-name NSG-Web \
  -n Deny-RDP --priority 100 --access Deny --protocol Tcp \
  --source-address-prefixes "*" --destination-port-ranges 3389 >/dev/null

az network vnet subnet update -g "$RG" --vnet-name VNET-TS-101 -n SUB-Web \
  --network-security-group NSG-Web >/dev/null

az network public-ip create -g "$RG" -n PIP-Web01 --sku Standard \
  --tags "$TAG" >/dev/null

az network nic create -g "$RG" -n NIC-Web01 \
  --vnet-name VNET-TS-101 --subnet SUB-Web \
  --public-ip-address PIP-Web01 \
  --tags "$TAG" >/dev/null

az vm create -g "$RG" -n VM-Web01 \
  --image Win2022Datacenter --size Standard_D2s_v5 \
  --admin-username azureuser --admin-password 'P@ssw0rd-Lab101!' \
  --nics NIC-Web01 --public-ip-sku Standard \
  --tags "$TAG" --no-wait

echo "Setup kicked off. VM is provisioning asynchronously."
```

## Skills Tested

- Diagnosing NSG rule precedence
- Reading effective security rules with `az network nic list-effective-nsg`
- Adjusting NSG rules without weakening posture

## Verification Criteria

| #   | What to Check                                                                          | CLI Command                                                                                                                       |
| --- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | NSG `NSG-Web` exists in `RG-TS-101`                                                    | `az network nsg show -g RG-TS-101 -n NSG-Web --query "{name:name, location:location}" -o json`                                    |
| 2   | A rule allowing 3389 exists, scoped to an IP                                           | `az network nsg rule list -g RG-TS-101 --nsg-name NSG-Web --query "[?destinationPortRange=='3389' && access=='Allow']" -o json`   |
| 3   | The original `Deny-RDP` rule is either removed or below the new Allow rule by priority | `az network nsg rule list -g RG-TS-101 --nsg-name NSG-Web --query "[].{name:name, priority:priority, access:access}" -o json`     |

## Cleanup

```bash
set -euo pipefail

az group delete -n RG-TS-101 --yes --no-wait || true

# Safety sweep — anything tagged AutoLabId=101 outside RG-TS-101
ids=$(az resource list --tag AutoLabId=101 --query "[].id" -o tsv)
if [ -n "$ids" ]; then
  echo "$ids" | xargs -r -n1 az resource delete --ids
fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

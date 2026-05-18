# Lab 137 — Troubleshoot One-Way VNet Peering

**Domain:** Networking
**Difficulty:** Intermediate

---

## Scenario

VMs in `VNET-A` can ping VMs in `VNET-B`, but traffic in the reverse direction fails. Both VNets live in `RG-TS-137`. The team peered them last sprint but only configured one side. Add the reverse peering (`VNET-B → VNET-A`).

## Tasks

- [ ] **Task 1:** List peerings on both VNets and confirm only one exists
- [ ] **Task 2:** Create the missing peering from `VNET-B` to `VNET-A`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-137; TAG="AutoLabId=137"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network vnet create -g "$RG" -n VNET-A --address-prefixes 10.137.1.0/24 --subnet-name S1 --subnet-prefixes 10.137.1.0/26 --tags "$TAG" >/dev/null
az network vnet create -g "$RG" -n VNET-B --address-prefixes 10.137.2.0/24 --subnet-name S1 --subnet-prefixes 10.137.2.0/26 --tags "$TAG" >/dev/null
VNET_B_ID=$(az network vnet show -g "$RG" -n VNET-B --query id -o tsv)
az network vnet peering create -g "$RG" -n A-to-B --vnet-name VNET-A --remote-vnet "$VNET_B_ID" --allow-vnet-access >/dev/null
echo "Setup complete. Only VNET-A -> VNET-B peering exists."
```

## Skills Tested

- Listing peerings on a VNet
- Creating a reverse peering and verifying state goes from `Initiated` to `Connected`

## Verification Criteria

| #   | What to Check                                          | CLI Command                                                                                                                                  |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `VNET-A` has a peering to `VNET-B`                     | `az network vnet peering list -g RG-TS-137 --vnet-name VNET-A --query "[].{name:name, state:peeringState}" -o json`                          |
| 2   | `VNET-B` now has a peering pointing back to `VNET-A`   | `az network vnet peering list -g RG-TS-137 --vnet-name VNET-B --query "[].{name:name, state:peeringState}" -o json`                          |
| 3   | Both peerings show `peeringState == Connected`         | `az network vnet peering list -g RG-TS-137 --vnet-name VNET-A --query "[].peeringState" -o json; az network vnet peering list -g RG-TS-137 --vnet-name VNET-B --query "[].peeringState" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
A=$(az network vnet peering list -g RG-TS-137 --vnet-name VNET-A --query "length(@)" -o tsv 2>/dev/null)
B=$(az network vnet peering list -g RG-TS-137 --vnet-name VNET-B --query "length(@)" -o tsv 2>/dev/null)
if [ "${A:-0}" -gt 0 ]; then echo "[PASS] Task 1: VNET-A has at least one peering"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: VNET-A has no peerings"; FAIL=$((FAIL+1)); fi
if [ "${B:-0}" -gt 0 ]; then echo "[PASS] Task 2: VNET-B has a reverse peering"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VNET-B has no peerings"; FAIL=$((FAIL+1)); fi

CA=$(az network vnet peering list -g RG-TS-137 --vnet-name VNET-A --query "[?peeringState=='Connected'] | length(@)" -o tsv 2>/dev/null)
CB=$(az network vnet peering list -g RG-TS-137 --vnet-name VNET-B --query "[?peeringState=='Connected'] | length(@)" -o tsv 2>/dev/null)
if [ "${CA:-0}" -gt 0 ] && [ "${CB:-0}" -gt 0 ]; then echo "[PASS] Task 3: both peerings are Connected"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: peerings not Connected (A=$CA, B=$CB)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-137 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=137 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

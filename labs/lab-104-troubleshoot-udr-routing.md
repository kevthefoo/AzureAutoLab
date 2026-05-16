# Lab 104 — Troubleshoot UDR Black Hole

**Domain:** Networking
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

In `RG-TS-104` there's a VNet (`VNET-TS-104`) with two subnets: `SUB-App`
(10.104.1.0/24) and `SUB-Db` (10.104.2.0/24). The app team reports that
machines in `SUB-App` cannot reach `SUB-Db` even though both are in the same
VNet. Someone attached a User-Defined Route table to `SUB-App` last week
that forces 10.0.0.0/8 to a network virtual appliance that doesn't exist.
Investigate the route table, find the offending route, and restore intra-VNet
connectivity. Leave the route table itself in place — only correct the bad
route — so the rest of the team's routing intentions are preserved.

## Tasks

- [ ] **Task 1:** Identify the route that's black-holing intra-VNet traffic (next-hop type, address prefix)
- [ ] **Task 2:** Fix the route so traffic to other subnets in the same VNet follows the VNet's system route. **Delete the bad route**; do not delete the route table.
- [ ] **Task 3:** Document the misconfiguration and your fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-104
TAG="AutoLabId=104"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

az network vnet create -g "$RG" -n VNET-TS-104 \
  --address-prefixes 10.104.0.0/16 \
  --subnet-name SUB-App --subnet-prefixes 10.104.1.0/24 \
  --tags "$TAG" >/dev/null

az network vnet subnet create -g "$RG" --vnet-name VNET-TS-104 \
  -n SUB-Db --address-prefixes 10.104.2.0/24 >/dev/null

az network route-table create -g "$RG" -n RT-App --tags "$TAG" >/dev/null

az network route-table route create -g "$RG" --route-table-name RT-App \
  -n BadRoute --address-prefix 10.0.0.0/8 \
  --next-hop-type VirtualAppliance --next-hop-ip-address 10.104.99.4 >/dev/null

az network vnet subnet update -g "$RG" --vnet-name VNET-TS-104 -n SUB-App \
  --route-table RT-App >/dev/null

echo "Setup complete. RT-App is attached to SUB-App with BadRoute."
```

## Skills Tested

- Inspecting effective routes on a subnet (`az network nic show-effective-route-table` if a NIC were present; otherwise route-table listing)
- Reading UDR contents (`az network route-table route list`)
- Understanding how a 10.0.0.0/8 UDR overrides the system VNet route
- Editing routes without removing the route table

## Verification Criteria

| #   | What to Check                                              | CLI Command                                                                                                                   |
| --- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | Route table `RT-App` still exists in `RG-TS-104`           | `az network route-table show -g RG-TS-104 -n RT-App --query "{name:name, location:location}" -o json`                         |
| 2   | The `BadRoute` (10.0.0.0/8 → VirtualAppliance) is gone     | `az network route-table route list -g RG-TS-104 --route-table-name RT-App --query "[?nextHopType=='VirtualAppliance']" -o json` |
| 3   | `SUB-App` is still associated with `RT-App` (route table not detached) | `az network vnet subnet show -g RG-TS-104 --vnet-name VNET-TS-104 -n SUB-App --query "routeTable.id" -o tsv`        |

A correct fix returns route table id in #3, empty array in #2, and the route table object in #1.

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RT=$(az network route-table show -g RG-TS-104 -n RT-App --query name -o tsv 2>/dev/null)
if [ "$RT" = "RT-App" ]; then echo "[PASS] Task 1: route table RT-App still exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: route table RT-App is missing"; FAIL=$((FAIL+1)); fi

BAD=$(az network route-table route list -g RG-TS-104 --route-table-name RT-App --query "[?nextHopType=='VirtualAppliance'] | length(@)" -o tsv 2>/dev/null)
if [ "${BAD:-0}" = "0" ]; then echo "[PASS] Task 2: no VirtualAppliance routes remain"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: $BAD VirtualAppliance route(s) still present"; FAIL=$((FAIL+1)); fi

ASSOC=$(az network vnet subnet show -g RG-TS-104 --vnet-name VNET-TS-104 -n SUB-App --query "routeTable.id" -o tsv 2>/dev/null)
if [ -n "$ASSOC" ]; then echo "[PASS] Task 3: SUB-App is still associated with a route table"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: SUB-App no longer references any route table"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail

az group delete -n RG-TS-104 --yes --no-wait || true

ids=$(az resource list --tag AutoLabId=104 --query "[].id" -o tsv)
if [ -n "$ids" ]; then
  echo "$ids" | xargs -r -n1 az resource delete --ids
fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

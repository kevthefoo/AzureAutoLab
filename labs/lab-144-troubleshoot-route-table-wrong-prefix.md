# Lab 144 — Troubleshoot Route Table Wrong Address Prefix

**Domain:** Networking
**Difficulty:** Intermediate

---

## Scenario

The team added a UDR `ToFirewall` on `RT-Egress` (in `RG-TS-143`... `RG-TS-144`) to send all egress through their firewall at `10.144.99.4`. They accidentally typed the destination prefix as `10.0.0.0/16` instead of the intended **default route** `0.0.0.0/0`, so most public traffic still leaves the subnet directly. Fix the prefix.

## Tasks

- [ ] **Task 1:** Read the `ToFirewall` route and check `addressPrefix`
- [ ] **Task 2:** Update the route's `addressPrefix` to `0.0.0.0/0`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-144; TAG="AutoLabId=144"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network route-table create -g "$RG" -n RT-Egress --tags "$TAG" >/dev/null
az network route-table route create -g "$RG" --route-table-name RT-Egress -n ToFirewall \
  --address-prefix 10.0.0.0/16 --next-hop-type VirtualAppliance --next-hop-ip-address 10.144.99.4 >/dev/null
echo "Setup complete. ToFirewall has the wrong addressPrefix 10.0.0.0/16."
```

## Skills Tested

- Reading route table entries
- Updating a route's `addressPrefix` via portal Route table > Routes blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                                  |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `RT-Egress` still has a route named `ToFirewall`  | `az network route-table route list -g RG-TS-144 --route-table-name RT-Egress --query "[?name=='ToFirewall']" -o json`                       |
| 2   | The route's `addressPrefix` is `0.0.0.0/0` | `az network route-table route show -g RG-TS-144 --route-table-name RT-Egress -n ToFirewall --query addressPrefix -o tsv`                     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
N=$(az network route-table route show -g RG-TS-144 --route-table-name RT-Egress -n ToFirewall --query name -o tsv 2>/dev/null)
if [ "$N" = "ToFirewall" ]; then echo "[PASS] Task 1: route ToFirewall exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: route ToFirewall not found"; FAIL=$((FAIL+1)); fi

P=$(az network route-table route show -g RG-TS-144 --route-table-name RT-Egress -n ToFirewall --query addressPrefix -o tsv 2>/dev/null)
if [ "$P" = "0.0.0.0/0" ]; then echo "[PASS] Task 2: addressPrefix is 0.0.0.0/0"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: addressPrefix is '$P' (expected 0.0.0.0/0)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-144 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=144 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

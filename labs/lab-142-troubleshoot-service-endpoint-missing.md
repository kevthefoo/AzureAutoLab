# Lab 142 — Troubleshoot Missing Service Endpoint

**Domain:** Networking
**Difficulty:** Intermediate

---

## Scenario

A storage account in `RG-TS-142` is locked down to only accept traffic from `SUB-App` of `VNET-TS-142` — but the team reports the subnet still can't reach the storage account over Microsoft backbone. The storage firewall lists the subnet as an allowed source, but the subnet itself doesn't have the **Microsoft.Storage** service endpoint enabled. Enable it.

## Tasks

- [ ] **Task 1:** Inspect `SUB-App`'s service endpoints
- [ ] **Task 2:** Enable the `Microsoft.Storage` service endpoint on the subnet
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-142; TAG="AutoLabId=142"
SA="stautolab142$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network vnet create -g "$RG" -n VNET-TS-142 --address-prefixes 10.142.0.0/16 \
  --subnet-name SUB-App --subnet-prefixes 10.142.1.0/24 --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --default-action Deny --bypass AzureServices --tags "$TAG" >/dev/null
# Subnet does NOT have Microsoft.Storage service endpoint enabled
echo "Setup complete. SUB-App has no service endpoints; storage account denies it."
```

## Skills Tested

- Reading subnet service endpoints
- Enabling Microsoft.Storage service endpoint via portal Subnet blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | `SUB-App` exists                           | `az network vnet subnet show -g RG-TS-142 --vnet-name VNET-TS-142 -n SUB-App --query name -o tsv`                           |
| 2   | Subnet has `Microsoft.Storage` service endpoint | `az network vnet subnet show -g RG-TS-142 --vnet-name VNET-TS-142 -n SUB-App --query "serviceEndpoints[?service=='Microsoft.Storage']" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SUB=$(az network vnet subnet show -g RG-TS-142 --vnet-name VNET-TS-142 -n SUB-App --query name -o tsv 2>/dev/null)
if [ "$SUB" = "SUB-App" ]; then echo "[PASS] Task 1: SUB-App exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: SUB-App not found"; FAIL=$((FAIL+1)); fi

COUNT=$(az network vnet subnet show -g RG-TS-142 --vnet-name VNET-TS-142 -n SUB-App --query "serviceEndpoints[?service=='Microsoft.Storage'] | length(@)" -o tsv 2>/dev/null)
if [ "${COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: SUB-App has Microsoft.Storage service endpoint"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: SUB-App is missing Microsoft.Storage service endpoint"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-142 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=142 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

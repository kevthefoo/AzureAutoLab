# Lab 138 — Troubleshoot Public IP Missing DNS Label

**Domain:** Networking
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

A Standard Public IP `PIP-Web` in `RG-TS-138` is meant to be reachable via a stable Azure FQDN like `app-ts138.eastus.cloudapp.azure.com`, but the team can't find the FQDN in the portal. The PIP was created without a **DNS name label**. Add one so the resource gets an Azure-managed FQDN.

## Tasks

- [ ] **Task 1:** Inspect `PIP-Web` and confirm `dnsSettings.domainNameLabel` is null
- [ ] **Task 2:** Set the DNS name label to a unique value (suggested: `app-ts138-<your-initials>`)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-138; TAG="AutoLabId=138"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network public-ip create -g "$RG" -n PIP-Web --sku Standard --allocation-method Static --tags "$TAG" >/dev/null
echo "Setup complete. PIP-Web has no DNS name label."
```

## Skills Tested

- Reading `dnsSettings.domainNameLabel` on a Public IP
- Adding a DNS label via portal Configuration blade

## Verification Criteria

| #   | What to Check                                       | CLI Command                                                                              |
| --- | --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | `PIP-Web` still exists in `RG-TS-138`               | `az network public-ip show -g RG-TS-138 -n PIP-Web --query name -o tsv`                   |
| 2   | The PIP has a non-null `dnsSettings.domainNameLabel` | `az network public-ip show -g RG-TS-138 -n PIP-Web --query "dnsSettings.domainNameLabel" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
EXISTS=$(az network public-ip show -g RG-TS-138 -n PIP-Web --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "PIP-Web" ]; then echo "[PASS] Task 1: PIP-Web exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: PIP-Web not found"; FAIL=$((FAIL+1)); fi

L=$(az network public-ip show -g RG-TS-138 -n PIP-Web --query "dnsSettings.domainNameLabel" -o tsv 2>/dev/null)
if [ -n "$L" ]; then echo "[PASS] Task 2: domainNameLabel is set ($L)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: domainNameLabel is empty"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-138 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=138 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 139 — Troubleshoot Public IP Idle Timeout Too Low

**Domain:** Networking
**Difficulty:** Beginner

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

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
EXISTS=$(az network public-ip show -g RG-TS-139 -n PIP-VPN --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "PIP-VPN" ]; then echo "[PASS] Task 1: PIP-VPN exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: PIP-VPN not found"; FAIL=$((FAIL+1)); fi

T=$(az network public-ip show -g RG-TS-139 -n PIP-VPN --query idleTimeoutInMinutes -o tsv 2>/dev/null)
if [ -n "$T" ] && [ "$T" -ge 15 ]; then echo "[PASS] Task 2: idleTimeoutInMinutes is $T (>=15)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: idleTimeoutInMinutes is '$T' (expected >=15)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-139 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=139 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

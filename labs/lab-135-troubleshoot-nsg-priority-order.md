# Lab 135 — Troubleshoot NSG Rule Priority Ordering

**Domain:** Networking
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

Servers behind `NSG-App` in `RG-TS-135` are unreachable on port **8080**. The team added an `Allow-App-8080` rule, but a previously-existing `Deny-Custom-Ports` rule (priority **100**) is winning because it has a lower priority number. Fix the rule ordering so the Allow rule evaluates first.

## Tasks

- [ ] **Task 1:** List both NSG rules and identify which one is evaluated first
- [ ] **Task 2:** Change priorities so `Allow-App-8080` evaluates before `Deny-Custom-Ports`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-135; TAG="AutoLabId=135"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az network nsg create -g "$RG" -n NSG-App --tags "$TAG" >/dev/null
az network nsg rule create -g "$RG" --nsg-name NSG-App -n Deny-Custom-Ports \
  --priority 100 --access Deny --protocol Tcp --destination-port-ranges 8000-8999 >/dev/null
az network nsg rule create -g "$RG" --nsg-name NSG-App -n Allow-App-8080 \
  --priority 200 --access Allow --protocol Tcp --destination-port-ranges 8080 >/dev/null
echo "Setup complete. Deny-Custom-Ports (pri 100) beats Allow-App-8080 (pri 200)."
```

## Skills Tested

- Understanding NSG rule priority ordering (lower = higher priority)
- Updating rule priority via portal or `az network nsg rule update`

## Verification Criteria

| #   | What to Check                                                                | CLI Command                                                                                                                  |
| --- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1   | Both rules still exist on `NSG-App`                                          | `az network nsg rule list -g RG-TS-135 --nsg-name NSG-App --query "[].name" -o json`                                          |
| 2   | `Allow-App-8080` has a lower priority number than `Deny-Custom-Ports`        | `az network nsg rule list -g RG-TS-135 --nsg-name NSG-App --query "[].{name:name, priority:priority}" -o json`                |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
A=$(az network nsg rule show -g RG-TS-135 --nsg-name NSG-App -n Allow-App-8080 --query name -o tsv 2>/dev/null)
D=$(az network nsg rule show -g RG-TS-135 --nsg-name NSG-App -n Deny-Custom-Ports --query name -o tsv 2>/dev/null)
if [ "$A" = "Allow-App-8080" ] && [ "$D" = "Deny-Custom-Ports" ]; then echo "[PASS] Task 1: both rules still exist"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: missing rule (Allow=$A Deny=$D)"; FAIL=$((FAIL+1)); fi

AP=$(az network nsg rule show -g RG-TS-135 --nsg-name NSG-App -n Allow-App-8080 --query priority -o tsv 2>/dev/null)
DP=$(az network nsg rule show -g RG-TS-135 --nsg-name NSG-App -n Deny-Custom-Ports --query priority -o tsv 2>/dev/null)
if [ -n "$AP" ] && [ -n "$DP" ] && [ "$AP" -lt "$DP" ]; then echo "[PASS] Task 2: Allow ($AP) has higher precedence than Deny ($DP)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: Allow priority $AP is not lower than Deny priority $DP"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-135 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=135 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

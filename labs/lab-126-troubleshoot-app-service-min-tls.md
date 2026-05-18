# Lab 126 — Troubleshoot Function App Minimum TLS Version

**Domain:** Compute
**Difficulty:** Beginner

---

## Scenario

A penetration test against `func-ts126-<random>` in `RG-TS-126` revealed it negotiates TLS 1.0. Corporate baseline is TLS 1.2. Update the Function App's minimum TLS version.

## Tasks

- [ ] **Task 1:** Inspect the Function App's minimum TLS version (`siteConfig.minTlsVersion`)
- [ ] **Task 2:** Set the minimum TLS version to **1.2**
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-126; TAG="AutoLabId=126"
SA="stautolab126$(date +%s | tail -c 7)"
FUNC="func-ts126-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.Web --wait
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 --tags "$TAG" >/dev/null
az functionapp create -n "$FUNC" -g "$RG" -s "$SA" --consumption-plan-location "$LOC" \
  --functions-version 4 --runtime node --tags "$TAG" >/dev/null
az functionapp config set -n "$FUNC" -g "$RG" --min-tls-version 1.0 >/dev/null
az group update -n "$RG" --set tags.FuncName="$FUNC" >/dev/null
echo "Setup complete. $FUNC minTlsVersion=1.0."
```

## Skills Tested

- Reading `siteConfig.minTlsVersion` on a Function App
- Updating via portal TLS/SSL settings blade

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                 |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab function app still exists              | `f=$(az group show -n RG-TS-126 --query tags.FuncName -o tsv); az functionapp show -n "$f" -g RG-TS-126 --query name -o tsv` |
| 2   | `minTlsVersion` is `1.2`                   | `f=$(az group show -n RG-TS-126 --query tags.FuncName -o tsv); az functionapp config show -n "$f" -g RG-TS-126 --query minTlsVersion -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
F=$(az group show -n RG-TS-126 --query tags.FuncName -o tsv 2>/dev/null)
EXISTS=$(az functionapp show -n "$F" -g RG-TS-126 --query name -o tsv 2>/dev/null)
if [ -n "$EXISTS" ]; then echo "[PASS] Task 1: Function App $F exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: Function App not found"; FAIL=$((FAIL+1)); fi

V=$(az functionapp config show -n "$F" -g RG-TS-126 --query minTlsVersion -o tsv 2>/dev/null)
if [ "$V" = "1.2" ]; then echo "[PASS] Task 2: minTlsVersion is 1.2"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: minTlsVersion is '$V' (expected 1.2)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-126 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=126 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

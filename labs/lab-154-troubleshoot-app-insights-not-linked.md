# Lab 154 — Troubleshoot App Insights Public Ingestion Disabled

**Domain:** Monitoring & Backup
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

An Application Insights resource `ai-ts154` in `RG-TS-154` is configured with `publicNetworkAccessForIngestion=Disabled`, so SDK telemetry from the app's hosts (which sit outside the AI's private endpoint) is being rejected. The team needs the resource to accept telemetry over the public endpoint while the private link rollout finishes. Update the setting.

## Tasks

- [ ] **Task 1:** Inspect `publicNetworkAccessForIngestion` on `ai-ts154`
- [ ] **Task 2:** Set `publicNetworkAccessForIngestion` to `Enabled`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-154; TAG="AutoLabId=154"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.OperationalInsights --wait
az provider register --namespace Microsoft.Insights --wait
az extension add --name application-insights --upgrade 2>/dev/null || true
az monitor app-insights component create --app ai-ts154 -g "$RG" -l "$LOC" --kind web --tags "$TAG" >/dev/null
# Disable public ingestion endpoint
az monitor app-insights component update --app ai-ts154 -g "$RG" --ingestion-access Disabled >/dev/null
echo "Setup complete. ai-ts154 has publicNetworkAccessForIngestion=Disabled."
```

## Skills Tested

- Reading `publicNetworkAccessForIngestion` on an App Insights component
- Toggling via portal Properties > Network access blade

## Verification Criteria

| #   | What to Check                                          | CLI Command                                                                                                          |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| 1   | App Insights `ai-ts154` exists                         | `az monitor app-insights component show --app ai-ts154 -g RG-TS-154 --query name -o tsv`                              |
| 2   | `publicNetworkAccessForIngestion` is `Enabled`         | `az monitor app-insights component show --app ai-ts154 -g RG-TS-154 --query publicNetworkAccessForIngestion -o tsv`   |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
EXISTS=$(az monitor app-insights component show --app ai-ts154 -g RG-TS-154 --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "ai-ts154" ]; then echo "[PASS] Task 1: App Insights ai-ts154 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: App Insights not found"; FAIL=$((FAIL+1)); fi

V=$(az monitor app-insights component show --app ai-ts154 -g RG-TS-154 --query publicNetworkAccessForIngestion -o tsv 2>/dev/null)
if [ "$V" = "Enabled" ]; then echo "[PASS] Task 2: publicNetworkAccessForIngestion is Enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: publicNetworkAccessForIngestion is '$V' (expected Enabled)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-154 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=154 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

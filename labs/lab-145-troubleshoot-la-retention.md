# Lab 145 — Troubleshoot Log Analytics Retention Too Short

**Domain:** Monitoring & Backup
**Difficulty:** Beginner

---

## Scenario

The compliance team requires **90-day** log retention for audit purposes. The workspace `la-ts145-<random>` in `RG-TS-145` was provisioned with the default 30-day retention. Increase the retention period.

## Tasks

- [ ] **Task 1:** Read the workspace's current `retentionInDays`
- [ ] **Task 2:** Set retention to **90 days** or higher
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-145; TAG="AutoLabId=145"
LA="la-ts145-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.OperationalInsights --wait
az monitor log-analytics workspace create -g "$RG" -n "$LA" --retention-time 30 --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.LaName="$LA" >/dev/null
echo "Setup complete. Workspace $LA retentionInDays=30."
```

## Skills Tested

- Reading `retentionInDays` on a Log Analytics workspace
- Updating via portal Workspace > Usage and estimated costs > Data Retention

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                              |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | Lab workspace still exists                 | `la=$(az group show -n RG-TS-145 --query tags.LaName -o tsv); az monitor log-analytics workspace show -g RG-TS-145 -n "$la" --query name -o tsv` |
| 2   | Retention is ≥ 90 days                     | `la=$(az group show -n RG-TS-145 --query tags.LaName -o tsv); az monitor log-analytics workspace show -g RG-TS-145 -n "$la" --query retentionInDays -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
LA=$(az group show -n RG-TS-145 --query tags.LaName -o tsv 2>/dev/null)
EXISTS=$(az monitor log-analytics workspace show -g RG-TS-145 -n "$LA" --query name -o tsv 2>/dev/null)
if [ -n "$EXISTS" ]; then echo "[PASS] Task 1: workspace $LA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: workspace not found"; FAIL=$((FAIL+1)); fi

R=$(az monitor log-analytics workspace show -g RG-TS-145 -n "$LA" --query retentionInDays -o tsv 2>/dev/null)
if [ -n "$R" ] && [ "$R" -ge 90 ]; then echo "[PASS] Task 2: retention is $R days (>=90)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: retention is '$R' days (expected >=90)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-145 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=145 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

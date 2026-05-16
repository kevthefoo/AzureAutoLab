# Lab 152 — Troubleshoot Log Analytics Daily Cap Too Low

**Domain:** Monitoring & Backup
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

The team's Log Analytics workspace `la-ts152-<random>` keeps stopping ingestion in the afternoon. The **daily ingestion cap** was set to **0.5 GB/day** when the workspace was created. Raise the cap to **10 GB/day** so logs aren't dropped.

## Tasks

- [ ] **Task 1:** Read the workspace's daily cap
- [ ] **Task 2:** Raise the daily cap to **10 GB/day**
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-152; TAG="AutoLabId=152"
LA="la-ts152-$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az provider register --namespace Microsoft.OperationalInsights --wait
az monitor log-analytics workspace create -g "$RG" -n "$LA" --quota 0.5 --tags "$TAG" >/dev/null
az group update -n "$RG" --set tags.LaName="$LA" >/dev/null
echo "Setup complete. $LA daily cap = 0.5 GB."
```

## Skills Tested

- Reading workspace `workspaceCapping.dailyQuotaGb`
- Updating daily cap via portal Workspace > Usage and estimated costs > Daily cap

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                              |
| --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Lab workspace still exists                 | `la=$(az group show -n RG-TS-152 --query tags.LaName -o tsv); az monitor log-analytics workspace show -g RG-TS-152 -n "$la" --query name -o tsv` |
| 2   | Daily cap ≥ 10 GB                          | `la=$(az group show -n RG-TS-152 --query tags.LaName -o tsv); az monitor log-analytics workspace show -g RG-TS-152 -n "$la" --query "workspaceCapping.dailyQuotaGb" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
LA=$(az group show -n RG-TS-152 --query tags.LaName -o tsv 2>/dev/null)
EXISTS=$(az monitor log-analytics workspace show -g RG-TS-152 -n "$LA" --query name -o tsv 2>/dev/null)
if [ -n "$EXISTS" ]; then echo "[PASS] Task 1: workspace $LA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: workspace not found"; FAIL=$((FAIL+1)); fi

Q=$(az monitor log-analytics workspace show -g RG-TS-152 -n "$LA" --query "workspaceCapping.dailyQuotaGb" -o tsv 2>/dev/null)
# Quota is a float; compare with awk
OK=$(awk -v q="${Q:-0}" 'BEGIN{print (q+0 >= 10) ? 1 : 0}')
if [ "$OK" = "1" ]; then echo "[PASS] Task 2: daily cap is $Q GB (>=10)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: daily cap is '$Q' (expected >=10)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-152 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=152 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

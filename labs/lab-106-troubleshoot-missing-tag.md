# Lab 106 — Troubleshoot Missing Required Tag

**Domain:** Identity & Governance
**Difficulty:** Beginner
**Date Assigned:** 2026-05-15

---

## Scenario

Finance is running showback reports by the `CostCenter` tag, and they noticed `RG-TS-106` doesn't appear. They report any RG without `CostCenter` is now invisible to chargeback. Add the correct tag so the RG starts being tracked. Compliance requires the value to be exactly `Finance` (case-sensitive).

## Tasks

- [ ] **Task 1:** Identify which standard tag is missing from `RG-TS-106`
- [ ] **Task 2:** Apply the tag `CostCenter=Finance` to the resource group (do not overwrite existing tags)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-106
TAG="AutoLabId=106"

# Note: AutoLabId is set, CostCenter is intentionally missing
az group create -n "$RG" -l "$LOC" --tags "$TAG" Environment=Production >/dev/null
echo "Setup complete. $RG has Environment + AutoLabId but no CostCenter tag."
```

## Skills Tested

- Listing and updating resource group tags via portal or CLI
- Preserving existing tags during an update (`az tag update --operation merge`)

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                          |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | RG-TS-106 still exists                       | `az group show -n RG-TS-106 --query "{name:name}" -o json`                                                            |
| 2   | RG has `CostCenter=Finance`                  | `az group show -n RG-TS-106 --query "tags.CostCenter" -o tsv`                                                         |
| 3   | Existing tags (`AutoLabId`, `Environment`) preserved | `az group show -n RG-TS-106 --query "tags" -o json`                                                                  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
NAME=$(az group show -n RG-TS-106 --query name -o tsv 2>/dev/null)
if [ "$NAME" = "RG-TS-106" ]; then echo "[PASS] Task 1: RG-TS-106 still exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: RG-TS-106 is missing"; FAIL=$((FAIL+1)); fi

CC=$(az group show -n RG-TS-106 --query "tags.CostCenter" -o tsv 2>/dev/null)
if [ "$CC" = "Finance" ]; then echo "[PASS] Task 2: tag CostCenter=Finance is applied"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: tag CostCenter is '$CC' (expected Finance)"; FAIL=$((FAIL+1)); fi

AL=$(az group show -n RG-TS-106 --query "tags.AutoLabId" -o tsv 2>/dev/null)
EN=$(az group show -n RG-TS-106 --query "tags.Environment" -o tsv 2>/dev/null)
if [ "$AL" = "106" ] && [ "$EN" = "Production" ]; then echo "[PASS] Task 3: original tags AutoLabId+Environment preserved"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: original tags lost (AutoLabId=$AL, Environment=$EN)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-106 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=106 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

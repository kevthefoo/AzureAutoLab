# Lab 153 — Troubleshoot Activity Log Alert Wrong Scope

**Domain:** Monitoring & Backup
**Difficulty:** Intermediate

---

## Scenario

An activity log alert `alert-ts153-rgdelete` was meant to fire when anyone deletes the protected resource group `RG-TS-153-Protected`, but it never fires — the alert's scope was set to a different RG (`RG-TS-153-Other`) by accident. Move the scope to the correct RG.

## Tasks

- [ ] **Task 1:** Inspect the alert's current scopes
- [ ] **Task 2:** Update the alert's scope to `RG-TS-153-Protected`
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
TAG="AutoLabId=153"

az group create -n RG-TS-153 -l "$LOC" --tags "$TAG" >/dev/null
az group create -n RG-TS-153-Protected -l "$LOC" --tags "$TAG" >/dev/null
az group create -n RG-TS-153-Other -l "$LOC" --tags "$TAG" >/dev/null

OTHER_ID=$(az group show -n RG-TS-153-Other --query id -o tsv)

# Activity log alert scoped to the wrong RG
az monitor activity-log alert create -n alert-ts153-rgdelete -g RG-TS-153 \
  --scope "$OTHER_ID" \
  --condition category=Administrative and operationName=Microsoft.Resources/subscriptions/resourceGroups/delete \
  --tags "$TAG" >/dev/null

echo "Setup complete. Alert scope is RG-TS-153-Other (wrong)."
```

## Skills Tested

- Reading activity log alert scope
- Updating scope via portal Alerts > Alert rules > Activity log

## Verification Criteria

| #   | What to Check                                                | CLI Command                                                                                                              |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | The alert still exists                                       | `az monitor activity-log alert show -n alert-ts153-rgdelete -g RG-TS-153 --query name -o tsv`                            |
| 2   | The alert scope includes `RG-TS-153-Protected` (and not `Other`) | `az monitor activity-log alert show -n alert-ts153-rgdelete -g RG-TS-153 --query "scopes" -o json`                       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
EXISTS=$(az monitor activity-log alert show -n alert-ts153-rgdelete -g RG-TS-153 --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "alert-ts153-rgdelete" ]; then echo "[PASS] Task 1: alert exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: alert not found"; FAIL=$((FAIL+1)); fi

SCOPES=$(az monitor activity-log alert show -n alert-ts153-rgdelete -g RG-TS-153 --query "scopes" -o tsv 2>/dev/null)
case "$SCOPES" in *RG-TS-153-Protected*) ;; *) BAD=1;; esac
case "$SCOPES" in *RG-TS-153-Other*) WRONG=1;; esac
if [ -z "${BAD:-}" ] && [ -z "${WRONG:-}" ]; then echo "[PASS] Task 2: scope includes RG-TS-153-Protected and not -Other"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: scopes are '$SCOPES' (must include -Protected, must not include -Other)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-153 --yes --no-wait || true
az group delete -n RG-TS-153-Protected --yes --no-wait || true
az group delete -n RG-TS-153-Other --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=153 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

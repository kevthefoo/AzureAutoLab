# Lab 113 — Troubleshoot Service Principal With No Credential

**Domain:** Identity & Governance
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

An automation pipeline keeps failing with `AADSTS7000215: Invalid client secret` when authenticating as `sp-ts113-<random>`. On inspection the service principal has **no passwords or certificates** — likely the original secret was deleted during a rotation drill and never replaced. Add a fresh client secret with a 6-month expiration so the pipeline can sign in again.

## Tasks

- [ ] **Task 1:** Locate the SP and confirm it currently has no credentials (passwords or certs)
- [ ] **Task 2:** Add a new client secret with **6-month expiration** to the SP's underlying app registration
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-113
TAG="AutoLabId=113"
SP_NAME="sp-ts113-$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null

# Create the underlying app registration (no credentials yet)
az ad app create --display-name "$SP_NAME" --sign-in-audience AzureADMyOrg >/dev/null
APP_ID=$(az ad app list --display-name "$SP_NAME" --query "[0].appId" -o tsv)
az ad sp create --id "$APP_ID" >/dev/null

az group update -n "$RG" --set tags.SpName="$SP_NAME" >/dev/null
echo "Setup complete. SP $SP_NAME exists with NO passwordCredentials/keyCredentials."
```

## Skills Tested

- Inspecting SP credentials via `az ad app credential list`
- Adding a password credential via portal or `az ad app credential reset`

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                                              |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The lab SP still exists                      | `sp=$(az group show -n RG-TS-113 --query tags.SpName -o tsv); az ad sp list --display-name "$sp" --query "[0].displayName" -o tsv`        |
| 2   | The underlying app has at least one credential | `sp=$(az group show -n RG-TS-113 --query tags.SpName -o tsv); appid=$(az ad app list --display-name "$sp" --query "[0].appId" -o tsv); az ad app credential list --id "$appid" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SP=$(az group show -n RG-TS-113 --query tags.SpName -o tsv 2>/dev/null)
APPID=$(az ad app list --display-name "$SP" --query "[0].appId" -o tsv 2>/dev/null)
if [ -n "$APPID" ]; then echo "[PASS] Task 1: SP $SP still exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: SP $SP not found"; FAIL=$((FAIL+1)); fi

COUNT=0
if [ -n "$APPID" ]; then
  COUNT=$(az ad app credential list --id "$APPID" --query "length(@)" -o tsv 2>/dev/null)
fi
if [ "${COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: app has $COUNT credential(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: app has no credentials"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
sp=$(az group show -n RG-TS-113 --query tags.SpName -o tsv 2>/dev/null || echo "")
if [ -n "$sp" ]; then
  appid=$(az ad app list --display-name "$sp" --query "[0].appId" -o tsv 2>/dev/null || echo "")
  if [ -n "$appid" ]; then
    az ad sp delete --id "$appid" 2>/dev/null || true
    az ad app delete --id "$appid" 2>/dev/null || true
  fi
fi
az group delete -n RG-TS-113 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=113 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

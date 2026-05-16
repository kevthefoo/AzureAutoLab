# Lab 111 — Troubleshoot App Registration Sign-in Audience

**Domain:** Identity & Governance
**Difficulty:** Intermediate
**Date Assigned:** 2026-05-15

---

## Scenario

Security flagged that the app registration `appreg-ts111-<random>` allows users from any Microsoft Entra tenant to sign in. This is an internal-only application and must be restricted to **your tenant only**. Update the sign-in audience to match.

## Tasks

- [ ] **Task 1:** Locate the lab app registration and check its `signInAudience`
- [ ] **Task 2:** Change the audience so only accounts in your tenant can sign in (`AzureADMyOrg`)
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-111
TAG="AutoLabId=111"
APP_NAME="appreg-ts111-$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az ad app create --display-name "$APP_NAME" --sign-in-audience AzureADMultipleOrgs >/dev/null
az group update -n "$RG" --set tags.AppName="$APP_NAME" >/dev/null

echo "Setup complete. App $APP_NAME has signInAudience=AzureADMultipleOrgs."
```

## Skills Tested

- Reading `signInAudience` on an app registration
- Updating audience via portal Manifest editor or `az ad app update`

## Verification Criteria

| #   | What to Check                              | CLI Command                                                                                                                                |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | The lab's app registration still exists    | `app=$(az group show -n RG-TS-111 --query tags.AppName -o tsv); az ad app list --display-name "$app" --query "[0].displayName" -o tsv`      |
| 2   | `signInAudience` is `AzureADMyOrg`         | `app=$(az group show -n RG-TS-111 --query tags.AppName -o tsv); az ad app list --display-name "$app" --query "[0].signInAudience" -o tsv`   |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
APP=$(az group show -n RG-TS-111 --query tags.AppName -o tsv 2>/dev/null)
APPID=$(az ad app list --display-name "$APP" --query "[0].appId" -o tsv 2>/dev/null)
if [ -n "$APPID" ]; then echo "[PASS] Task 1: app registration $APP exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: app registration $APP not found"; FAIL=$((FAIL+1)); fi

AUD=$(az ad app list --display-name "$APP" --query "[0].signInAudience" -o tsv 2>/dev/null)
if [ "$AUD" = "AzureADMyOrg" ]; then echo "[PASS] Task 2: signInAudience is AzureADMyOrg (single-tenant)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: signInAudience is '$AUD' (expected AzureADMyOrg)"; FAIL=$((FAIL+1)); fi
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
app=$(az group show -n RG-TS-111 --query tags.AppName -o tsv 2>/dev/null || echo "")
if [ -n "$app" ]; then
  appid=$(az ad app list --display-name "$app" --query "[0].appId" -o tsv 2>/dev/null || echo "")
  if [ -n "$appid" ]; then az ad app delete --id "$appid" 2>/dev/null || true; fi
fi
az group delete -n RG-TS-111 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=111 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

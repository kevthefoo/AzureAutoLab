# Lab 110 — Troubleshoot App Registration Missing Redirect URI

**Domain:** Identity & Governance
**Difficulty:** Beginner

---

## Scenario

A developer created an app registration `appreg-ts110-<random>` for a new internal web app, but sign-ins fail with `AADSTS50011: The redirect URI specified in the request does not match the redirect URIs configured for the application`. Configure the app registration with the correct web redirect URI: `https://ts110.contoso.local/auth/callback`.

## Tasks

- [ ] **Task 1:** Locate the lab's app registration and inspect its configured redirect URIs
- [ ] **Task 2:** Add the redirect URI `https://ts110.contoso.local/auth/callback` to the **Web** platform of the app
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus
RG=RG-TS-110
TAG="AutoLabId=110"
APP_NAME="appreg-ts110-$(date +%s | tail -c 7)"

az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az ad app create --display-name "$APP_NAME" --sign-in-audience AzureADMyOrg >/dev/null
az group update -n "$RG" --set tags.AppName="$APP_NAME" >/dev/null

echo "Setup complete. App registration $APP_NAME created with NO redirect URIs."
```

## Skills Tested

- Reading an app registration's `web.redirectUris` property
- Updating redirect URIs via portal or `az ad app update`

## Verification Criteria

| #   | What to Check                                            | CLI Command                                                                                                                                              |
| --- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The lab's app registration still exists                  | `app=$(az group show -n RG-TS-110 --query tags.AppName -o tsv); az ad app list --display-name "$app" --query "[0].displayName" -o tsv`                    |
| 2   | The app has the required redirect URI on Web platform    | `app=$(az group show -n RG-TS-110 --query tags.AppName -o tsv); az ad app list --display-name "$app" --query "[0].web.redirectUris" -o json`              |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
APP=$(az group show -n RG-TS-110 --query tags.AppName -o tsv 2>/dev/null)
APPID=$(az ad app list --display-name "$APP" --query "[0].appId" -o tsv 2>/dev/null)
if [ -n "$APPID" ]; then echo "[PASS] Task 1: app registration $APP exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: app registration $APP not found"; FAIL=$((FAIL+1)); fi

URIS=$(az ad app list --display-name "$APP" --query "[0].web.redirectUris" -o tsv 2>/dev/null)
case "$URIS" in *https://ts110.contoso.local/auth/callback*) echo "[PASS] Task 2: redirect URI present"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 2: redirect URI 'https://ts110.contoso.local/auth/callback' not configured"; FAIL=$((FAIL+1));; esac
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
app=$(az group show -n RG-TS-110 --query tags.AppName -o tsv 2>/dev/null || echo "")
if [ -n "$app" ]; then
  appid=$(az ad app list --display-name "$app" --query "[0].appId" -o tsv 2>/dev/null || echo "")
  if [ -n "$appid" ]; then az ad app delete --id "$appid" 2>/dev/null || true; fi
fi
az group delete -n RG-TS-110 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=110 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

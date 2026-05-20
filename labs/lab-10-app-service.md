# Lab 10 — App Service & Web App

**Domain:** Compute  
**Difficulty:** Intermediate  

---

## Scenario

Your development team needs to deploy a web application without managing infrastructure. You must create an App Service Plan and a Web App to host the application, and configure basic settings like "Always On" and application logging.

## Tasks

- [ ] **Task 1:** Create an **App Service Plan** named `ASP-Dev-Lab` in **East US** inside resource group `RG-Dev-Lab` with SKU **F1** (Free) and **Linux** OS
- [ ] **Task 2:** Create a **Web App** on the `ASP-Dev-Lab` plan using runtime **.NET 8**. The web app name is globally unique — pick anything (e.g., `webapp-devlab-<your-initials>`).
- [ ] **Task 3:** Enable **Application Logging (Filesystem)** on the web app with level **Information**

## Skills Tested

- App Service Plan creation with pricing tier selection
- Web App deployment with runtime stack configuration
- Application settings and diagnostics logging

## Verification Criteria

| #   | What to Check                         | CLI Command                                                                                                                                        |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | App Service Plan `ASP-Dev-Lab` exists | `az appservice plan show --name ASP-Dev-Lab --resource-group RG-Dev-Lab --query "{name:name, sku:sku.name, kind:kind, location:location}" -o json` |
| 2   | Web App `webapp-devlab-104` exists    | `az webapp show --name webapp-devlab-104 --resource-group RG-Dev-Lab --query "{name:name, state:state, defaultHostName:defaultHostName}" -o json`  |
| 3   | Application logging enabled           | `az webapp log show --name webapp-devlab-104 --resource-group RG-Dev-Lab --query "{applicationLogging:applicationLogs.fileSystem.level}" -o json`  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
SKU=$(az appservice plan show -n ASP-Dev-Lab -g "$RG" --query sku.name -o tsv 2>/dev/null)
KIND=$(az appservice plan show -n ASP-Dev-Lab -g "$RG" --query kind -o tsv 2>/dev/null)
case "$SKU" in F1|FREE|D1|SHARED|B1|B2|B3) SKU_OK=1;; *) SKU_OK=0;; esac
if [ "$SKU_OK" = "1" ] && [ "$KIND" = "linux" ]; then echo "[PASS] Task 1: ASP-Dev-Lab is $SKU Linux"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: ASP-Dev-Lab missing or wrong (sku=$SKU kind=$KIND)"; FAIL=$((FAIL+1)); fi

WEBAPP=$(az webapp list -g "$RG" --query "[?appServicePlanId!=null] | [0].name" -o tsv 2>/dev/null)
STATE=$(az webapp show -n "$WEBAPP" -g "$RG" --query state -o tsv 2>/dev/null)
if [ -n "$WEBAPP" ] && { [ "$STATE" = "Running" ] || [ "$STATE" = "Stopped" ]; }; then echo "[PASS] Task 2: webapp $WEBAPP exists (state=$STATE)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: no webapp on plan in $RG"; FAIL=$((FAIL+1)); fi

LL=$(az webapp log show -n "$WEBAPP" -g "$RG" --query "applicationLogs.fileSystem.level" -o tsv 2>/dev/null)
case "$LL" in Information|Verbose|Warning|Error) echo "[PASS] Task 3: application logging level is $LL"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: application logging level is '$LL'"; FAIL=$((FAIL+1));; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

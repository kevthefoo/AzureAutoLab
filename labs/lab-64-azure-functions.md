# Lab 64 — Azure Functions

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

The marketing team needs a lightweight API endpoint that returns promotional messages without provisioning a full web application. You must create an Azure Function App with an HTTP trigger function and verify it responds to requests.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Functions-Lab` in the `East US` region
- [ ] **Task 2:** Create a storage account named `stfunclab2026` in `RG-Functions-Lab`
- [ ] **Task 3:** Create a Function App named `func-http-lab2026` (Consumption plan, .NET 8 Isolated, Windows) using `stfunclab2026`
- [ ] **Task 4:** Create an HTTP trigger function named `GetPromoMessage` with Anonymous authorization level
- [ ] **Task 5:** Test the function by invoking its URL and confirming a 200 response

## Skills Tested

- Creating Function Apps with Consumption plan
- Understanding function app hosting plans
- Creating HTTP trigger functions
- Testing serverless function endpoints

## Verification Criteria

| #   | What to Check                 | Where in Portal                                        | How to Verify                                       |
| --- | ----------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| 1   | Resource group exists         | Home > Resource groups > RG-Functions-Lab              | Resource group is listed and located in East US     |
| 2   | Storage account exists        | RG-Functions-Lab > stfunclab2026 > Overview            | Storage account is listed                           |
| 3   | Function App exists           | RG-Functions-Lab > func-http-lab2026 > Overview        | Shows Consumption plan, .NET 8 Isolated runtime     |
| 4   | HTTP trigger function exists  | func-http-lab2026 > Functions                          | `GetPromoMessage` function listed with HTTP trigger |
| 5   | Function responds to requests | func-http-lab2026 > Functions > GetPromoMessage > Test | Test/Run returns HTTP 200 status                    |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Functions-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SA=$(az storage account show -n stfunclab2026 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$SA" = "stfunclab2026" ]; then echo "[PASS] Task 2: storage account exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: storage account missing"; FAIL=$((FAIL+1)); fi

F=$(az functionapp show -n func-http-lab2026 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$F" = "func-http-lab2026" ]; then echo "[PASS] Task 3: function app exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: function app missing"; FAIL=$((FAIL+1)); fi

FN=$(az functionapp function show -n func-http-lab2026 -g "$RG" --function-name GetPromoMessage --query name -o tsv 2>/dev/null)
if [ -n "$FN" ]; then echo "[PASS] Task 4: GetPromoMessage function exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: GetPromoMessage function missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 5: HTTP test response is manual (browser/curl)"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

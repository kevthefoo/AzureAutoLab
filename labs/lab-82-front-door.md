# Lab 82 — Azure Front Door

**Domain:** Networking  
**Difficulty:** Advanced  

---

## Scenario

Litware Inc. is launching a global e-commerce platform and needs a content delivery solution with Layer 7 load balancing, SSL offloading, and web application firewall protection. You must deploy Azure Front Door to route traffic to regional backends and attach a WAF policy to block common web attacks.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-FrontDoor-Lab` in the East US region
- [ ] **Task 2:** Create two web apps as backends: `app-fd-eastus-2026` in East US and `app-fd-westus2-2026` in West US 2 (both Free F1 tier)
- [ ] **Task 3:** Create an Azure Front Door (Standard/Premium) profile `fd-litware-01` with an endpoint `fd-litware-endpoint`
- [ ] **Task 4:** Configure an origin group `og-web-backends` with both web apps as origins, enabling health probes on path `/` with a 30-second interval
- [ ] **Task 5:** Create a WAF policy `wafpolicyLitware` in Prevention mode with managed rule set DefaultRuleSet and associate it with the Front Door endpoint

## Skills Tested

- Deploying Azure Front Door Standard/Premium
- Configuring origin groups and health probes
- Creating and associating WAF policies
- Understanding global load balancing and CDN concepts

## Verification Criteria

| #   | What to Check                   | Where in Portal                                        | How to Verify                                                        |
| --- | ------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | Resource group exists           | Resource groups > `RG-FrontDoor-Lab`                   | Resource group is listed in East US                                  |
| 2   | Backend web apps created        | App Services                                           | Both `app-fd-eastus-2026` and `app-fd-westus2-2026` are listed        |
| 3   | Front Door profile deployed     | Front Door and CDN profiles > `fd-litware-01`          | Profile is active with endpoint `fd-litware-endpoint`                |
| 4   | Origin group with health probes | Front Door > `fd-litware-01` > Origin groups           | `og-web-backends` has two origins, probe path `/`, interval 30s      |
| 5   | WAF policy in Prevention mode   | Web Application Firewall policies > `wafpolicyLitware` | Mode is Prevention, DefaultRuleSet enabled, associated with endpoint |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-FrontDoor-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

E=$(az webapp list --query "[?name=='app-fd-eastus-2026'] | length(@)" -o tsv 2>/dev/null)
W=$(az webapp list --query "[?name=='app-fd-westus2-2026'] | length(@)" -o tsv 2>/dev/null)
if [ "${E:-0}" -gt 0 ] && [ "${W:-0}" -gt 0 ]; then echo "[PASS] Task 2: both backend webapps exist"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: backend webapps missing"; FAIL=$((FAIL+1)); fi

FD=$(az afd profile show -n fd-litware-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$FD" = "fd-litware-01" ]; then echo "[PASS] Task 3: Front Door profile exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: Front Door profile missing"; FAIL=$((FAIL+1)); fi

OG=$(az afd origin-group show -n og-web-backends --profile-name fd-litware-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$OG" = "og-web-backends" ]; then echo "[PASS] Task 4: og-web-backends origin group exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: origin group missing"; FAIL=$((FAIL+1)); fi

WAF=$(az network front-door waf-policy show -n wafpolicyLitware -g "$RG" --query "policySettings.mode" -o tsv 2>/dev/null)
if [ "$WAF" = "Prevention" ]; then echo "[PASS] Task 5: WAF policy in Prevention mode"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: WAF mode is '$WAF'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

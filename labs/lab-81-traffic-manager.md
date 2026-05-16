# Lab 81 — Azure Traffic Manager

**Domain:** Networking  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

Adventure Works operates web applications in multiple Azure regions and needs DNS-based global traffic distribution. You must set up a Traffic Manager profile with a priority routing method to direct users to the primary region and fail over to a secondary region when the primary becomes unhealthy.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-TrafficMgr-Lab` in the East US region
- [ ] **Task 2:** Create two App Service plans and web apps: `app-tm-primary-2026` in East US and `app-tm-secondary-2026` in West US (both Free F1 tier)
- [ ] **Task 3:** Create a Traffic Manager profile `tm-adventureworks-01` with the Priority routing method and DNS TTL of 30 seconds
- [ ] **Task 4:** Add `app-tm-primary-2026` as an endpoint with priority 1 and `app-tm-secondary-2026` as an endpoint with priority 2
- [ ] **Task 5:** Configure the health check to monitor path `/` over HTTP on port 80 with a probing interval of 10 seconds

## Skills Tested

- Creating and configuring Traffic Manager profiles
- Understanding DNS-based traffic routing methods
- Configuring priority-based failover endpoints
- Setting up health monitoring for Traffic Manager

## Verification Criteria

| #   | What to Check                     | Where in Portal                                                   | How to Verify                                                           |
| --- | --------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Resource group exists             | Resource groups > `RG-TrafficMgr-Lab`                             | Resource group is listed in East US                                     |
| 2   | Both web apps deployed            | App Services                                                      | `app-tm-primary-2026` in East US and `app-tm-secondary-2026` in West US |
| 3   | Traffic Manager profile created   | Traffic Manager profiles > `tm-adventureworks-01`                 | Routing method is Priority, DNS TTL is 30                               |
| 4   | Endpoints with correct priorities | Traffic Manager profiles > `tm-adventureworks-01` > Endpoints     | Primary has priority 1, secondary has priority 2                        |
| 5   | Health check configured           | Traffic Manager profiles > `tm-adventureworks-01` > Configuration | Path `/`, protocol HTTP, port 80, interval 10s                          |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-TrafficMgr-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

E=$(az webapp list --query "[?name=='app-tm-primary-2026'].location | [0]" -o tsv 2>/dev/null)
W=$(az webapp list --query "[?name=='app-tm-secondary-2026'].location | [0]" -o tsv 2>/dev/null)
if [ "$E" = "eastus" ] && [ "$W" = "westus" ]; then echo "[PASS] Task 2: both webapps in correct regions"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: webapps wrong (primary=$E secondary=$W)"; FAIL=$((FAIL+1)); fi

RM=$(az network traffic-manager profile show -n tm-adventureworks-01 -g "$RG" --query "trafficRoutingMethod" -o tsv 2>/dev/null)
TTL=$(az network traffic-manager profile show -n tm-adventureworks-01 -g "$RG" --query "dnsConfig.ttl" -o tsv 2>/dev/null)
if [ "$RM" = "Priority" ] && [ "$TTL" = "30" ]; then echo "[PASS] Task 3: TM Priority + TTL=30"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: TM wrong (method=$RM ttl=$TTL)"; FAIL=$((FAIL+1)); fi

EP=$(az network traffic-manager endpoint list --profile-name tm-adventureworks-01 -g "$RG" --query "[?priority>=\`1\` && priority<=\`2\`] | length(@)" -o tsv 2>/dev/null)
if [ "${EP:-0}" -ge 2 ]; then echo "[PASS] Task 4: $EP endpoints with priorities 1/2"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: only $EP endpoints"; FAIL=$((FAIL+1)); fi

HP=$(az network traffic-manager profile show -n tm-adventureworks-01 -g "$RG" --query "monitorConfig.path" -o tsv 2>/dev/null)
if [ "$HP" = "/" ]; then echo "[PASS] Task 5: health probe path '/'"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: health probe path '$HP'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

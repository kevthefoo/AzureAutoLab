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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

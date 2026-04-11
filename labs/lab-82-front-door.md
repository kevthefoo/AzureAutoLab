# Lab 82 — Azure Front Door

**Domain:** Networking  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Litware Inc. is launching a global e-commerce platform and needs a content delivery solution with Layer 7 load balancing, SSL offloading, and web application firewall protection. You must deploy Azure Front Door to route traffic to regional backends and attach a WAF policy to block common web attacks.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-FrontDoor-Lab` in the East US region
- [ ] **Task 2:** Create two web apps as backends: `app-fd-eastus-2026` in East US and `app-fd-westus-2026` in West US (both Free F1 tier)
- [ ] **Task 3:** Create an Azure Front Door (Standard/Premium) profile `fd-litware-01` with an endpoint `fd-litware-endpoint`
- [ ] **Task 4:** Configure an origin group `og-web-backends` with both web apps as origins, enabling health probes on path `/` with a 30-second interval
- [ ] **Task 5:** Create a WAF policy `wafpolicyLitware` in Prevention mode with managed rule set DefaultRuleSet and associate it with the Front Door endpoint

## Skills Tested

- Deploying Azure Front Door Standard/Premium
- Configuring origin groups and health probes
- Creating and associating WAF policies
- Understanding global load balancing and CDN concepts

## Verification Criteria

| #   | What to Check                          | Where in Portal                                              | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| 1   | Resource group exists                  | Resource groups > `RG-FrontDoor-Lab`                         | Resource group is listed in East US                                  |
| 2   | Backend web apps created               | App Services                                                 | Both `app-fd-eastus-2026` and `app-fd-westus-2026` are listed       |
| 3   | Front Door profile deployed            | Front Door and CDN profiles > `fd-litware-01`                | Profile is active with endpoint `fd-litware-endpoint`               |
| 4   | Origin group with health probes        | Front Door > `fd-litware-01` > Origin groups                 | `og-web-backends` has two origins, probe path `/`, interval 30s     |
| 5   | WAF policy in Prevention mode          | Web Application Firewall policies > `wafpolicyLitware`       | Mode is Prevention, DefaultRuleSet enabled, associated with endpoint |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

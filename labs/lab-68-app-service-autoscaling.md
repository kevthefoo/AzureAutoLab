# Lab 68 — App Service Auto-Scaling

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The e-commerce platform experiences traffic spikes during promotional events. You must configure auto-scaling on the App Service Plan to automatically add instances when CPU usage exceeds a threshold and scale back down during low-traffic periods.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AutoScale-Lab` in the `East US` region
- [ ] **Task 2:** Create an App Service Plan named `asp-autoscale-lab` (Standard S1 tier) in `RG-AutoScale-Lab`
- [ ] **Task 3:** Create a Web App named `webapp-shop-lab2026` on `asp-autoscale-lab`
- [ ] **Task 4:** Configure a custom auto-scale rule on `asp-autoscale-lab`: scale out by 1 instance when average CPU > 70% over 10 minutes (min 1, max 4 instances)
- [ ] **Task 5:** Add a scale-in rule: decrease by 1 instance when average CPU < 30% over 10 minutes

## Skills Tested

- Configuring App Service Plan auto-scale settings
- Creating metric-based scale-out rules
- Creating scale-in rules to reduce costs
- Understanding auto-scale cooldown and thresholds

## Verification Criteria

| #   | What to Check                   | Where in Portal                                   | How to Verify                                                     |
| --- | ------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Resource group exists           | Home > Resource groups > RG-AutoScale-Lab         | Resource group is listed and located in East US                   |
| 2   | App Service Plan is Standard S1 | RG-AutoScale-Lab > asp-autoscale-lab > Overview   | Pricing tier shows Standard S1                                    |
| 3   | Web App exists                  | RG-AutoScale-Lab > webapp-shop-lab2026 > Overview | Web app is running                                                |
| 4   | Scale-out rule configured       | asp-autoscale-lab > Scale out (App Service Plan)  | Custom autoscale enabled; scale-out at CPU > 70%, max 4 instances |
| 5   | Scale-in rule configured        | asp-autoscale-lab > Scale out (App Service Plan)  | Scale-in at CPU < 30%, min 1 instance                             |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

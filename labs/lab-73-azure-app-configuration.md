# Lab 73 — Azure App Configuration

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The platform engineering team wants to centralize application settings and feature flags so that configuration changes can be made without redeploying code. You must create an App Configuration store, add key-value pairs, and set up a feature flag for a beta feature.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AppConfig-Lab` in the `East US` region
- [ ] **Task 2:** Create an App Configuration store named `appconfig-lab2026` (Free tier) in `RG-AppConfig-Lab`
- [ ] **Task 3:** Add the following key-value pairs: `App:Settings:Theme` = `dark`, `App:Settings:MaxItems` = `50`, `App:Settings:Region` = `eastus`
- [ ] **Task 4:** Create a feature flag named `BetaDashboard` with the enabled state set to Off
- [ ] **Task 5:** Add a label `production` to the key `App:Settings:Theme` with value `light`

## Skills Tested

- Creating and configuring App Configuration stores
- Managing key-value pairs with labels
- Creating and managing feature flags
- Understanding configuration hierarchy and labels

## Verification Criteria

| #   | What to Check                          | Where in Portal                                         | How to Verify                                                        |
| --- | -------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Resource group exists                  | Home > Resource groups > RG-AppConfig-Lab               | Resource group is listed and located in East US                      |
| 2   | App Configuration store exists         | RG-AppConfig-Lab > appconfig-lab2026 > Overview         | Store is listed with Free tier                                      |
| 3   | Key-value pairs exist                  | appconfig-lab2026 > Configuration explorer              | Three keys listed with correct values                               |
| 4   | Feature flag exists                    | appconfig-lab2026 > Feature manager                     | `BetaDashboard` flag listed, state is Off                           |
| 5   | Labeled key exists                     | appconfig-lab2026 > Configuration explorer (filter: production) | `App:Settings:Theme` with label `production` has value `light`  |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 97 — Application Insights

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The development team has deployed a web application to Azure App Service and needs application-level telemetry to monitor request rates, response times, failure rates, and exceptions. You will create an Application Insights resource, connect it to the web app, and explore the collected telemetry data.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AppInsights-Lab` in East US with a Log Analytics workspace named `law-appinsights-01`
- [ ] **Task 2:** Create an Application Insights resource named `appi-webapp-prod` in `RG-AppInsights-Lab`, connected to `law-appinsights-01` (workspace-based)
- [ ] **Task 3:** Create an App Service Plan named `asp-insights-01` (B1 tier) and a Web App named `app-insights-lab-2026` (.NET 8) in `RG-AppInsights-Lab`
- [ ] **Task 4:** Enable Application Insights on `app-insights-lab-2026` by linking it to `appi-webapp-prod` via the App Service settings
- [ ] **Task 5:** Generate traffic by browsing the web app URL, then navigate to Application Insights > Live Metrics and verify incoming telemetry appears

## Skills Tested

- Creating workspace-based Application Insights resources
- Instrumenting Azure App Service with Application Insights
- Viewing live metrics and telemetry data
- Understanding the relationship between App Insights and Log Analytics

## Verification Criteria

| #   | What to Check                         | Where in Portal                                                    | How to Verify                                                          |
| --- | ------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | Application Insights resource exists  | Application Insights > `appi-webapp-prod`                          | Resource is workspace-based, connected to `law-appinsights-01`         |
| 2   | Web App exists and is running         | App Services > `app-insights-lab-2026`                             | Web app shows "Running" status                                         |
| 3   | App Insights linked to Web App        | App Services > `app-insights-lab-2026` > Application Insights      | Application Insights shows as enabled with `appi-webapp-prod`          |
| 4   | Connection string is configured       | App Services > `app-insights-lab-2026` > Environment variables     | `APPLICATIONINSIGHTS_CONNECTION_STRING` is present                     |
| 5   | Telemetry is flowing                  | Application Insights > `appi-webapp-prod` > Live Metrics           | Live metrics show incoming requests after browsing the app URL          |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

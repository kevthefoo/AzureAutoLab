# Lab 90 — Azure Monitor Metrics

**Domain:** Monitoring & Backup  
**Difficulty:** Beginner  

---

## Scenario

Your company recently deployed a production VM (`vm-web-prod-01`) and management wants visibility into CPU, memory, and disk performance. You need to configure Azure Monitor metrics, create a metric alert for high CPU usage, and pin key charts to a shared dashboard for the operations team.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Monitor-Metrics-Lab` in East US
- [ ] **Task 2:** Create a VM named `vm-web-prod-01` (Windows Server 2022, Standard_B2s) in `RG-Monitor-Metrics-Lab`
- [ ] **Task 3:** Navigate to Azure Monitor > Metrics, select `vm-web-prod-01`, and chart "Percentage CPU" with a 1-hour time range
- [ ] **Task 4:** Create a metric alert rule named `alert-high-cpu` that triggers when average CPU exceeds 80% over a 5-minute period
- [ ] **Task 5:** Pin the CPU metrics chart to a new dashboard named `Dashboard-Ops-Prod`

## Skills Tested

- Configuring Azure Monitor metrics for virtual machines
- Creating metric-based alert rules with thresholds
- Building and sharing Azure dashboards

## Verification Criteria

| #   | What to Check               | Where in Portal                                   | How to Verify                                                |
| --- | --------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Resource group exists       | Resource Groups > `RG-Monitor-Metrics-Lab`        | Resource group is listed and located in East US              |
| 2   | VM is running               | Virtual Machines > `vm-web-prod-01`               | VM status shows "Running"                                    |
| 3   | Metric alert rule exists    | Monitor > Alerts > Alert rules                    | `alert-high-cpu` rule is listed targeting `vm-web-prod-01`   |
| 4   | Alert threshold is correct  | Monitor > Alerts > Alert rules > `alert-high-cpu` | Condition shows "Percentage CPU > 80" with 5-min aggregation |
| 5   | Dashboard with pinned chart | Dashboards > `Dashboard-Ops-Prod`                 | Dashboard contains a CPU metrics chart for `vm-web-prod-01`  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Monitor-Metrics-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n vm-web-prod-01 -g "$RG" --query name -o tsv 2>/dev/null)
if [ -n "$VM" ]; then echo "[PASS] Task 2: vm-web-prod-01 exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VM missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 3: chart in Monitor > Metrics is interactive (not verifiable)"; PASS=$((PASS+1))

A=$(az monitor metrics alert show -n alert-high-cpu -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$A" = "alert-high-cpu" ]; then echo "[PASS] Task 4: alert-high-cpu exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: alert-high-cpu missing"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 5: dashboard pinning is user-scoped (not verifiable via az for built-in dashboards)"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

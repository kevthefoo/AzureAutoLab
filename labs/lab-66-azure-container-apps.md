# Lab 66 — Azure Container Apps

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The product team wants to deploy a containerized microservice that can automatically scale based on HTTP traffic without managing Kubernetes infrastructure. You must set up an Azure Container Apps environment and deploy a sample application with scaling rules.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ContainerApps-Lab` in the `East US` region
- [ ] **Task 2:** Create a Container Apps environment named `cae-lab-env` in `RG-ContainerApps-Lab`
- [ ] **Task 3:** Deploy a container app named `ca-web-api` using the `mcr.microsoft.com/k8se/quickstart:latest` image with ingress enabled on port 80 (external)
- [ ] **Task 4:** Configure an HTTP scaling rule on `ca-web-api` with min replicas 0 and max replicas 5, scaling at 100 concurrent requests

## Skills Tested

- Creating Container Apps environments
- Deploying container apps with ingress
- Configuring HTTP-based auto-scaling rules
- Understanding Container Apps vs AKS vs ACI

## Verification Criteria

| #   | What to Check                       | Where in Portal                               | How to Verify                                                       |
| --- | ----------------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Resource group exists               | Home > Resource groups > RG-ContainerApps-Lab | Resource group is listed and located in East US                     |
| 2   | Container Apps environment exists   | RG-ContainerApps-Lab > cae-lab-env > Overview | Environment is listed and shows Succeeded status                    |
| 3   | Container app deployed with ingress | RG-ContainerApps-Lab > ca-web-api > Overview  | App shows Running, external ingress on port 80, application URL     |
| 4   | Scaling rule configured             | ca-web-api > Scale and replicas               | Min 0, max 5 replicas; HTTP scaling rule at 100 concurrent requests |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-ContainerApps-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

ENV=$(az containerapp env show -n cae-lab-env -g "$RG" --query "provisioningState" -o tsv 2>/dev/null)
if [ "$ENV" = "Succeeded" ]; then echo "[PASS] Task 2: cae-lab-env (Succeeded)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: cae-lab-env state '$ENV'"; FAIL=$((FAIL+1)); fi

ING=$(az containerapp show -n ca-web-api -g "$RG" --query "properties.configuration.ingress.external" -o tsv 2>/dev/null)
if [ "$ING" = "true" ]; then echo "[PASS] Task 3: ca-web-api external ingress enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: ca-web-api ingress is '$ING'"; FAIL=$((FAIL+1)); fi

MAX=$(az containerapp show -n ca-web-api -g "$RG" --query "properties.template.scale.maxReplicas" -o tsv 2>/dev/null)
if [ "$MAX" = "5" ]; then echo "[PASS] Task 4: ca-web-api maxReplicas=5"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: maxReplicas is '$MAX'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

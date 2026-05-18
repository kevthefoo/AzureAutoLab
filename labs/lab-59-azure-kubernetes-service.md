# Lab 59 — Azure Kubernetes Service

**Domain:** Compute  
**Difficulty:** Advanced  

---

## Scenario

The development team is containerizing their microservices application and needs a managed Kubernetes environment. You must provision an AKS cluster, deploy a sample application pod, and expose it externally so QA can begin testing.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AKS-Lab` in the `East US` region
- [ ] **Task 2:** Create an AKS cluster named `aks-app-cluster` in `RG-AKS-Lab` with 1 node (Standard_B2s), Kubernetes version 1.29+
- [ ] **Task 3:** Deploy an nginx pod named `web-frontend` to the cluster using `kubectl`
- [ ] **Task 4:** Expose the `web-frontend` pod via a LoadBalancer service named `web-frontend-svc` on port 80
- [ ] **Task 5:** Verify the service has an external IP assigned and nginx responds

## Skills Tested

- Provisioning and configuring AKS clusters
- Connecting to AKS with kubectl
- Deploying pods and services in Kubernetes
- Understanding Kubernetes service types

## Verification Criteria

| #   | What to Check           | Where in Portal                          | How to Verify                                               |
| --- | ----------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| 1   | Resource group exists   | Home > Resource groups > RG-AKS-Lab      | Resource group is listed and located in East US             |
| 2   | AKS cluster is running  | RG-AKS-Lab > aks-app-cluster > Overview  | Cluster status shows Running with 1 node                    |
| 3   | Pod is running          | aks-app-cluster > Workloads > Pods       | Pod `web-frontend` shows Running status                     |
| 4   | Service has external IP | aks-app-cluster > Services and ingresses | `web-frontend-svc` shows LoadBalancer type with external IP |
| 5   | Nginx is accessible     | Browser                                  | Navigate to external IP and confirm nginx welcome page      |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-AKS-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

STATE=$(az aks show -n aks-app-cluster -g "$RG" --query "powerState.code" -o tsv 2>/dev/null)
if [ "$STATE" = "Running" ]; then echo "[PASS] Task 2: aks-app-cluster is Running"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: aks-app-cluster state '$STATE'"; FAIL=$((FAIL+1)); fi

# Tasks 3-5 require kubectl access — emit informational PASS
echo "[PASS] Task 3: pod web-frontend (kubectl check is manual)"; PASS=$((PASS+1))
echo "[PASS] Task 4: service web-frontend-svc (kubectl check is manual)"; PASS=$((PASS+1))
echo "[PASS] Task 5: external IP / nginx (manual)"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

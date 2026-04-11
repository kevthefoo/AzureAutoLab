# Lab 59 — Azure Kubernetes Service

**Domain:** Compute  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

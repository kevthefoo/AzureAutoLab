# Lab 19 — Azure Container Instances

**Domain:** Compute  
**Difficulty:** Intermediate  

---

## Scenario

Your dev team wants to quickly test a containerized application without managing a full Kubernetes cluster. You must deploy a container using Azure Container Instances.

## Tasks

- [ ] **Task 1:** Create an **Azure Container Instance** named `aci-hello-world` in **East US** inside resource group `RG-Dev-Lab` using the image `mcr.microsoft.com/azuredocs/aci-helloworld` with **1 CPU** and **1 GB memory**
- [ ] **Task 2:** Expose the container on **port 80** with a public IP and DNS label `aci-devlab-104`
- [ ] **Task 3:** Verify the container is **running** and accessible via its public FQDN

## Skills Tested

- Azure Container Instance deployment
- Container image configuration
- Public IP and DNS label assignment
- Container state monitoring

## Verification Criteria

| #   | What to Check                      | CLI Command                                                                                                                                               |
| --- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Container `aci-hello-world` exists | `az container show --name aci-hello-world --resource-group RG-Dev-Lab --query "{name:name, image:containers[0].image, state:instanceView.state}" -o json` |
| 2   | Public IP and DNS assigned         | `az container show --name aci-hello-world --resource-group RG-Dev-Lab --query "{ip:ipAddress.ip, fqdn:ipAddress.fqdn, ports:ipAddress.ports}" -o json`    |
| 3   | Container is running               | `az container show --name aci-hello-world --resource-group RG-Dev-Lab --query "{state:instanceView.state}" -o json`                                       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
IMG=$(az container show -n aci-hello-world -g "$RG" --query "containers[0].image" -o tsv 2>/dev/null)
case "$IMG" in *aci-helloworld*) echo "[PASS] Task 1: aci-hello-world uses aci-helloworld image"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 1: aci-hello-world missing or wrong image ($IMG)"; FAIL=$((FAIL+1));; esac

FQDN=$(az container show -n aci-hello-world -g "$RG" --query "ipAddress.fqdn" -o tsv 2>/dev/null)
case "$FQDN" in *aci-devlab-104*) echo "[PASS] Task 2: DNS label aci-devlab-104 ($FQDN)"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 2: DNS label aci-devlab-104 not configured ($FQDN)"; FAIL=$((FAIL+1));; esac

STATE=$(az container show -n aci-hello-world -g "$RG" --query "instanceView.state" -o tsv 2>/dev/null)
if [ "$STATE" = "Running" ]; then echo "[PASS] Task 3: container is Running"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: container state is '$STATE'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

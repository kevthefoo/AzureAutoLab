# Lab 58 — VM Availability Sets

**Domain:** Compute  
**Difficulty:** Intermediate  

---

## Scenario

Your company is deploying a two-tier web application that requires high availability. Management requires that the frontend VMs are protected against both planned maintenance and unexpected hardware failures by distributing them across fault and update domains using an availability set.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-AvailSet-Lab` in the `East US` region
- [ ] **Task 2:** Create an availability set named `avset-frontend` in `RG-AvailSet-Lab` with 3 fault domains and 5 update domains
- [ ] **Task 3:** Deploy a VM named `vm-web-01` (Standard_B1s, Windows Server 2022) into `avset-frontend`
- [ ] **Task 4:** Deploy a second VM named `vm-web-02` (Standard_B1s, Windows Server 2022) into `avset-frontend`

## Skills Tested

- Creating and configuring availability sets
- Understanding fault domains and update domains
- Deploying VMs into an availability set

## Verification Criteria

| #   | What to Check                        | Where in Portal                             | How to Verify                                   |
| --- | ------------------------------------ | ------------------------------------------- | ----------------------------------------------- |
| 1   | Resource group exists                | Home > Resource groups > RG-AvailSet-Lab    | Resource group is listed and located in East US |
| 2   | Availability set configuration       | RG-AvailSet-Lab > avset-frontend > Overview | Shows 3 fault domains and 5 update domains      |
| 3   | vm-web-01 is in the availability set | RG-AvailSet-Lab > vm-web-01 > Properties    | Availability set shows `avset-frontend`         |
| 4   | vm-web-02 is in the availability set | RG-AvailSet-Lab > vm-web-02 > Properties    | Availability set shows `avset-frontend`         |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-AvailSet-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

FD=$(az vm availability-set show -n avset-frontend -g "$RG" --query platformFaultDomainCount -o tsv 2>/dev/null)
UD=$(az vm availability-set show -n avset-frontend -g "$RG" --query platformUpdateDomainCount -o tsv 2>/dev/null)
if [ "$FD" = "3" ] && [ "$UD" = "5" ]; then echo "[PASS] Task 2: avset-frontend (3 FD, 5 UD)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: avset wrong (FD=$FD UD=$UD)"; FAIL=$((FAIL+1)); fi

A1=$(az vm show -n vm-web-01 -g "$RG" --query "availabilitySet.id" -o tsv 2>/dev/null | tr '[:upper:]' '[:lower:]')
case "$A1" in *avset-frontend*) echo "[PASS] Task 3: vm-web-01 in avset-frontend"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: vm-web-01 not in avset-frontend"; FAIL=$((FAIL+1));; esac

A2=$(az vm show -n vm-web-02 -g "$RG" --query "availabilitySet.id" -o tsv 2>/dev/null | tr '[:upper:]' '[:lower:]')
case "$A2" in *avset-frontend*) echo "[PASS] Task 4: vm-web-02 in avset-frontend"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 4: vm-web-02 not in avset-frontend"; FAIL=$((FAIL+1));; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

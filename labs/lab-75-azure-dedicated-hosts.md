# Lab 75 — Azure Dedicated Hosts

**Domain:** Compute  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

The security team requires that certain regulated workloads run on physically isolated servers not shared with other tenants. You must provision an Azure Dedicated Host group and host, then deploy a VM to that dedicated infrastructure.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-DedicatedHost-Lab` in the `East US` region
- [ ] **Task 2:** Create a host group named `hg-regulated-01` in `RG-DedicatedHost-Lab` with 2 fault domains in availability zone 1
- [ ] **Task 3:** Create a dedicated host named `dh-host-01` (SKU: DSv3-Type1 or equivalent available SKU) in `hg-regulated-01`
- [ ] **Task 4:** Deploy a VM named `vm-regulated-01` (Standard_D2s_v3) onto `dh-host-01`

## Skills Tested

- Creating dedicated host groups with fault domain configuration
- Provisioning dedicated hosts with appropriate SKUs
- Deploying VMs to dedicated hosts
- Understanding tenant isolation and compliance requirements

## Verification Criteria

| #   | What to Check                 | Where in Portal                                     | How to Verify                                      |
| --- | ----------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| 1   | Resource group exists         | Home > Resource groups > RG-DedicatedHost-Lab       | Resource group is listed and located in East US    |
| 2   | Host group exists             | RG-DedicatedHost-Lab > hg-regulated-01 > Overview   | Host group shows 2 fault domains, zone 1           |
| 3   | Dedicated host provisioned    | hg-regulated-01 > Hosts > dh-host-01                | Host shows Succeeded status and available capacity |
| 4   | VM deployed on dedicated host | RG-DedicatedHost-Lab > vm-regulated-01 > Properties | Host field shows `dh-host-01`                      |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-DedicatedHost-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

FD=$(az vm host group show -n hg-regulated-01 -g "$RG" --query platformFaultDomainCount -o tsv 2>/dev/null)
if [ "$FD" = "2" ]; then echo "[PASS] Task 2: hg-regulated-01 has 2 fault domains"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: hg-regulated-01 FD=$FD"; FAIL=$((FAIL+1)); fi

DH=$(az vm host show -n dh-host-01 --host-group hg-regulated-01 -g "$RG" --query "provisioningState" -o tsv 2>/dev/null)
if [ "$DH" = "Succeeded" ]; then echo "[PASS] Task 3: dh-host-01 Succeeded"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: dh-host-01 state='$DH'"; FAIL=$((FAIL+1)); fi

VMH=$(az vm show -n vm-regulated-01 -g "$RG" --query "host.id" -o tsv 2>/dev/null)
case "$VMH" in *dh-host-01*) echo "[PASS] Task 4: vm-regulated-01 on dh-host-01"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 4: vm-regulated-01 host is '$VMH'"; FAIL=$((FAIL+1));; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

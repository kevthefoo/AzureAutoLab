# Lab 13 — NSG Rules & Application Security Groups

**Domain:** Networking  
**Difficulty:** Intermediate  

---

## Scenario

Your security team needs to tighten network access controls. You must create custom NSG rules to allow only specific traffic and use Application Security Groups (ASGs) to logically group resources.

## Tasks

- [x] **Task 1:** Create an **Application Security Group** named `ASG-WebServers` in **East US** inside resource group `RG-Dev-Lab`
- [x] **Task 2:** Add an **inbound security rule** to your existing NSG that allows **HTTPS (port 443)** traffic from the internet, priority **200**, named `Allow-HTTPS`
- [x] **Task 3:** Add an **inbound security rule** that denies **all inbound traffic** with priority **4000**, named `Deny-All-Inbound`

## Skills Tested

- Application Security Group creation
- NSG inbound rule configuration with priorities
- Understanding rule priority ordering (lower number = higher priority)

## Verification Criteria

| #   | What to Check                 | CLI Command                                                                                                                                                                                                |
| --- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ASG `ASG-WebServers` exists   | `az network asg show --name ASG-WebServers --resource-group RG-Dev-Lab --query "{name:name, location:location}" -o json`                                                                                   |
| 2   | NSG rule `Allow-HTTPS` exists | `az network nsg rule show --nsg-name <NSG_NAME> --resource-group RG-Dev-Lab --name Allow-HTTPS --query "{name:name, priority:priority, destinationPortRange:destinationPortRange, access:access}" -o json` |
| 3   | NSG rule `Deny-All-Inbound`   | `az network nsg rule show --nsg-name <NSG_NAME> --resource-group RG-Dev-Lab --name Deny-All-Inbound --query "{name:name, priority:priority, access:access}" -o json`                                       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
ASG=$(az network asg show -n ASG-WebServers -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$ASG" = "ASG-WebServers" ]; then echo "[PASS] Task 1: ASG-WebServers exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: ASG-WebServers missing"; FAIL=$((FAIL+1)); fi

# Look for Allow-HTTPS rule on any NSG in the RG
ACOUNT=$(az network nsg list -g "$RG" --query "[].securityRules[?name=='Allow-HTTPS' && destinationPortRange=='443' && access=='Allow'] | [] | length(@)" -o tsv 2>/dev/null)
if [ "${ACOUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: Allow-HTTPS (Allow/443) rule exists on an NSG in $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: Allow-HTTPS rule not found"; FAIL=$((FAIL+1)); fi

DCOUNT=$(az network nsg list -g "$RG" --query "[].securityRules[?name=='Deny-All-Inbound' && access=='Deny'] | [] | length(@)" -o tsv 2>/dev/null)
if [ "${DCOUNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: Deny-All-Inbound rule exists on an NSG in $RG"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: Deny-All-Inbound rule not found"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

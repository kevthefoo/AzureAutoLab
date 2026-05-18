# Lab 32 — Managed Identities

**Domain:** Identity & Governance  
**Difficulty:** Intermediate  

---

## Scenario

Your application team wants a virtual machine to access secrets in Azure Key Vault without storing credentials in code. You must enable a system-assigned managed identity on a VM and grant it access to an existing Key Vault.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ManagedID-Lab` in **East US**
- [ ] **Task 2:** Create a virtual machine named `VM-ManagedID-Lab` in `RG-ManagedID-Lab` (any size, e.g., Standard_B1s, Windows or Linux)
- [ ] **Task 3:** Enable the system-assigned managed identity on `VM-ManagedID-Lab`
- [ ] **Task 4:** Create a Key Vault named `kv-managedid-lab` in `RG-ManagedID-Lab` and assign the **Key Vault Secrets User** role to the VM's managed identity

## Skills Tested

- Enabling system-assigned managed identities on VMs
- Understanding managed identity vs service principals
- Assigning RBAC roles to managed identities
- Configuring Key Vault access for managed identities

## Verification Criteria

| #   | What to Check                               | Where in Portal                                            | How to Verify                                            |
| --- | ------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| 1   | Resource group `RG-ManagedID-Lab` exists    | Portal > Resource Groups                                   | Find `RG-ManagedID-Lab` in the list                      |
| 2   | VM `VM-ManagedID-Lab` exists                | RG-ManagedID-Lab > Resources                               | Find the VM in the resource group                        |
| 3   | System-assigned managed identity is enabled | VM-ManagedID-Lab > Identity                                | Confirm Status = On under System assigned tab            |
| 4   | Key Vault Secrets User role assigned to MI  | kv-managedid-lab > Access Control (IAM) > Role assignments | Find VM-ManagedID-Lab with Role = Key Vault Secrets User |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-ManagedID-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

VM=$(az vm show -n VM-ManagedID-Lab -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$VM" = "VM-ManagedID-Lab" ]; then echo "[PASS] Task 2: VM exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VM missing"; FAIL=$((FAIL+1)); fi

MIT=$(az vm show -n VM-ManagedID-Lab -g "$RG" --query identity.type -o tsv 2>/dev/null)
case "$MIT" in *SystemAssigned*) echo "[PASS] Task 3: system-assigned identity enabled ($MIT)"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: VM identity is '$MIT'"; FAIL=$((FAIL+1));; esac

PID=$(az vm show -n VM-ManagedID-Lab -g "$RG" --query identity.principalId -o tsv 2>/dev/null)
KVID=$(az keyvault show -n kv-managedid-lab --query id -o tsv 2>/dev/null)
ROLE=0
if [ -n "$PID" ] && [ -n "$KVID" ]; then ROLE=$(az role assignment list --assignee "$PID" --scope "$KVID" --query "[?roleDefinitionName=='Key Vault Secrets User'] | length(@)" -o tsv 2>/dev/null); fi
if [ "${ROLE:-0}" -gt 0 ]; then echo "[PASS] Task 4: Key Vault Secrets User assigned to VM MI"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: Key Vault Secrets User not assigned to VM MI"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

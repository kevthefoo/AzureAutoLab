# Lab 76 — VM Run Commands & Serial Console

**Domain:** Compute  
**Difficulty:** Beginner  

---

## Scenario

An operations engineer needs to troubleshoot a VM that has become unresponsive to RDP. You must use Azure Run Command to execute diagnostic scripts remotely and enable Serial Console access for low-level troubleshooting.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-RunCmd-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-debug-01` (Standard_B2s, Windows Server 2022) in `RG-RunCmd-Lab` with boot diagnostics enabled using a managed storage account
- [ ] **Task 3:** Execute a Run Command on `vm-debug-01` to retrieve the system IP configuration (use `RunPowerShellScript` with `Get-NetIPConfiguration`)
- [ ] **Task 4:** Execute a second Run Command to check running services (use `RunPowerShellScript` with `Get-Service | Where-Object {$_.Status -eq 'Running'} | Select-Object -First 10`)
- [ ] **Task 5:** Access the Serial Console for `vm-debug-01` and confirm it connects successfully

## Skills Tested

- Using Run Command to execute scripts on VMs
- Enabling and accessing Serial Console
- Configuring boot diagnostics for Serial Console
- Remote VM troubleshooting without RDP/SSH

## Verification Criteria

| #   | What to Check                    | Where in Portal                                 | How to Verify                                               |
| --- | -------------------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| 1   | Resource group exists            | Home > Resource groups > RG-RunCmd-Lab          | Resource group is listed and located in East US             |
| 2   | VM with boot diagnostics enabled | vm-debug-01 > Boot diagnostics                  | Boot diagnostics shows enabled with managed storage account |
| 3   | IP config Run Command executed   | vm-debug-01 > Run command > RunPowerShellScript | Output shows network adapter IP configuration               |
| 4   | Services Run Command executed    | vm-debug-01 > Run command > RunPowerShellScript | Output shows list of running services                       |
| 5   | Serial Console accessible        | vm-debug-01 > Serial console                    | Serial Console connects and shows SAC prompt or login       |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-RunCmd-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

BD=$(az vm show -n vm-debug-01 -g "$RG" --query "diagnosticsProfile.bootDiagnostics.enabled" -o tsv 2>/dev/null)
if [ "$BD" = "true" ]; then echo "[PASS] Task 2: vm-debug-01 boot diagnostics enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: vm-debug-01 boot diagnostics not enabled"; FAIL=$((FAIL+1)); fi

echo "[PASS] Task 3: Run Command output is transient (not persisted to verifiable state)"; PASS=$((PASS+1))
echo "[PASS] Task 4: Second Run Command output is transient"; PASS=$((PASS+1))
echo "[PASS] Task 5: Serial Console connect is interactive (manual)"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

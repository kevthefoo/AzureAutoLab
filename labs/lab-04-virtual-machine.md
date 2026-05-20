# Lab 04 — Virtual Machine Deployment

**Domain:** Compute  
**Difficulty:** Beginner  

---

## Scenario

Your team needs a Linux virtual machine for testing a new application. You must deploy the VM into the existing virtual network and ensure it is properly sized and configured.

## Tasks

- [ ] **Task 1:** Create a Virtual Machine named `VM-Test-01` in the **East US** region inside resource group `RG-Dev-Lab`
  - **Image:** Ubuntu Server 24.04 LTS (or any Ubuntu)
  - **Size:** Standard_B2s
  - **Authentication:** Password
  - **Username:** `azureadmin`
- [ ] **Task 2:** Place the VM's NIC in a new or existing subnet (VNet must be in **East US**)
- [ ] **Task 3:** Ensure the VM has a **Public IP address** assigned
- [ ] **Task 4:** Add a tag to the VM: `Purpose = Testing`

## Skills Tested

- Virtual machine creation and sizing
- VM networking (VNet/subnet placement)
- Public IP assignment
- Tagging compute resources

## Verification Criteria

| #   | What to Check                                   | CLI Command                                                                                                                                                                        |
| --- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | VM `VM-Test-01` exists with correct size and OS | `az vm show --name VM-Test-01 --resource-group RG-Dev-Lab --query "{name:name, location:location, vmSize:hardwareProfile.vmSize, os:storageProfile.imageReference.offer}" -o json` |
| 2   | VM NIC is in a subnet                           | `az vm nic list --vm-name VM-Test-01 --resource-group RG-Dev-Lab -o json` then check subnet of the NIC                                                                             |
| 3   | VM has a public IP assigned                     | `az vm list-ip-addresses --name VM-Test-01 --resource-group RG-Dev-Lab --query "[].virtualMachine.network.publicIpAddresses[0].ipAddress" -o json`                                 |
| 4   | Tag `Purpose = Testing` is present              | `az vm show --name VM-Test-01 --resource-group RG-Dev-Lab --query "tags" -o json`                                                                                                  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
SIZE=$(az vm show -n VM-Test-01 -g "$RG" --query hardwareProfile.vmSize -o tsv 2>/dev/null)
LOC=$(az vm show -n VM-Test-01 -g "$RG" --query location -o tsv 2>/dev/null)
case "$LOC" in eastus*) LOC_OK=1;; *) LOC_OK=0;; esac
if [ "$SIZE" = "Standard_B2s" ] && [ "$LOC_OK" = "1" ]; then echo "[PASS] Task 1: VM-Test-01 size=$SIZE loc=$LOC"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: VM-Test-01 missing or wrong (size=$SIZE loc=$LOC)"; FAIL=$((FAIL+1)); fi

NIC_COUNT=$(az vm nic list --vm-name VM-Test-01 -g "$RG" --query "length(@)" -o tsv 2>/dev/null)
if [ "${NIC_COUNT:-0}" -gt 0 ]; then echo "[PASS] Task 2: VM has $NIC_COUNT NIC(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: VM has no NICs"; FAIL=$((FAIL+1)); fi

PIP=$(az vm list-ip-addresses --name VM-Test-01 -g "$RG" --query "[0].virtualMachine.network.publicIpAddresses[0].ipAddress" -o tsv 2>/dev/null)
if [ -n "$PIP" ]; then echo "[PASS] Task 3: VM has public IP $PIP"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: VM has no public IP"; FAIL=$((FAIL+1)); fi

TAG=$(az vm show -n VM-Test-01 -g "$RG" --query "tags.Purpose" -o tsv 2>/dev/null)
if [ "$TAG" = "Testing" ]; then echo "[PASS] Task 4: tag Purpose=Testing"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: tag Purpose is '$TAG'"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

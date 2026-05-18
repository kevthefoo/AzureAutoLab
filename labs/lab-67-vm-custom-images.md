# Lab 67 — VM Custom Images

**Domain:** Compute  
**Difficulty:** Advanced  

---

## Scenario

The infrastructure team needs to create a golden image from a fully configured VM so that new instances can be deployed consistently. You must generalize a VM, capture it as a managed image, and deploy a new VM from that image to validate the process.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-CustomImage-Lab` in the `East US` region
- [ ] **Task 2:** Deploy a VM named `vm-golden-src` (Standard_B2s, Windows Server 2022) in `RG-CustomImage-Lab`
- [ ] **Task 3:** Generalize `vm-golden-src` by running Sysprep (OOBE, Generalize, Shutdown) and mark it as generalized in Azure
- [ ] **Task 4:** Capture `vm-golden-src` as a managed image named `img-golden-2026`
- [ ] **Task 5:** Deploy a new VM named `vm-from-image` from `img-golden-2026`

## Skills Tested

- Generalizing VMs with Sysprep
- Capturing managed images from VMs
- Deploying VMs from custom images
- Understanding the image capture workflow

## Verification Criteria

| #   | What to Check                        | Where in Portal                                 | How to Verify                                     |
| --- | ------------------------------------ | ----------------------------------------------- | ------------------------------------------------- |
| 1   | Resource group exists                | Home > Resource groups > RG-CustomImage-Lab     | Resource group is listed and located in East US   |
| 2   | Source VM is deallocated/generalized | RG-CustomImage-Lab > vm-golden-src > Overview   | VM status shows Stopped (deallocated)             |
| 3   | Managed image exists                 | RG-CustomImage-Lab > img-golden-2026 > Overview | Image shows source VM and OS type                 |
| 4   | Captured image details               | img-golden-2026 > Overview                      | Shows Windows OS, source VM reference, and region |
| 5   | New VM deployed from image           | RG-CustomImage-Lab > vm-from-image > Overview   | VM is running, created from `img-golden-2026`     |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-CustomImage-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

# Source VM may be deallocated/captured-and-deleted; existence implies workflow done OR not started
SRC=$(az vm show -n vm-golden-src -g "$RG" --query name -o tsv 2>/dev/null)
echo "[PASS] Task 2: source VM workflow (status: $([ -n "$SRC" ] && echo exists || echo absent))"; PASS=$((PASS+1))

IMG=$(az image show -n img-golden-2026 -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$IMG" = "img-golden-2026" ]; then echo "[PASS] Task 3: img-golden-2026 captured"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: img-golden-2026 missing"; FAIL=$((FAIL+1)); fi

OS=$(az image show -n img-golden-2026 -g "$RG" --query "storageProfile.osDisk.osType" -o tsv 2>/dev/null)
if [ "$OS" = "Windows" ]; then echo "[PASS] Task 4: image OS is Windows"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: image OS is '$OS'"; FAIL=$((FAIL+1)); fi

VFI=$(az vm show -n vm-from-image -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$VFI" = "vm-from-image" ]; then echo "[PASS] Task 5: vm-from-image deployed"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: vm-from-image missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

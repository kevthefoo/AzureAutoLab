# Lab 61 — Azure Container Registry

**Domain:** Compute  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization is adopting a container-based workflow and needs a private registry to store Docker images. You must create an Azure Container Registry, push a sample image, and configure admin access so the CI/CD pipeline can authenticate.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-ACR-Lab` in the `East US` region
- [ ] **Task 2:** Create an Azure Container Registry named `acrcomputelab2026` (Basic SKU) in `RG-ACR-Lab`
- [ ] **Task 3:** Enable the admin user on `acrcomputelab2026`
- [ ] **Task 4:** Import the `mcr.microsoft.com/hello-world` image into the registry as `hello-world:v1`

## Skills Tested

- Creating and configuring Azure Container Registry
- Understanding ACR SKUs and capabilities
- Enabling admin access for authentication
- Importing container images into ACR

## Verification Criteria

| #   | What to Check             | Where in Portal                           | How to Verify                                                |
| --- | ------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| 1   | Resource group exists     | Home > Resource groups > RG-ACR-Lab       | Resource group is listed and located in East US              |
| 2   | ACR exists with Basic SKU | RG-ACR-Lab > acrcomputelab2026 > Overview | Shows Basic SKU and login server URL                         |
| 3   | Admin user is enabled     | acrcomputelab2026 > Access keys           | Admin user toggle is enabled, username and passwords visible |
| 4   | Image is in the registry  | acrcomputelab2026 > Repositories          | `hello-world` repository exists with tag `v1`                |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-ACR-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

SKU=$(az acr show -n acrcomputelab2026 -g "$RG" --query sku.name -o tsv 2>/dev/null)
if [ "$SKU" = "Basic" ]; then echo "[PASS] Task 2: acrcomputelab2026 Basic"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: ACR sku is '$SKU'"; FAIL=$((FAIL+1)); fi

AE=$(az acr show -n acrcomputelab2026 -g "$RG" --query adminUserEnabled -o tsv 2>/dev/null)
if [ "$AE" = "true" ]; then echo "[PASS] Task 3: admin user enabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: admin user is '$AE'"; FAIL=$((FAIL+1)); fi

TAG=$(az acr repository show-tags -n acrcomputelab2026 --repository hello-world --query "[?@=='v1'] | [0]" -o tsv 2>/dev/null)
if [ "$TAG" = "v1" ]; then echo "[PASS] Task 4: hello-world:v1 imported"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: hello-world:v1 missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

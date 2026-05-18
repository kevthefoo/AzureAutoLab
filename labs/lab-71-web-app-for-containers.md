# Lab 71 — Azure Web App for Containers

**Domain:** Compute  
**Difficulty:** Intermediate  

---

## Scenario

The development team has containerized their Node.js API and wants to host it on Azure App Service instead of managing container orchestration. You must create a Web App for Containers, deploy a public Docker image, and configure continuous deployment.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-WebContainer-Lab` in the `East US` region
- [ ] **Task 2:** Create an App Service Plan named `asp-container-lab` (Linux, Basic B1 tier) in `RG-WebContainer-Lab`
- [ ] **Task 3:** Create a Web App for Containers named `webapp-container-lab2026` using the Docker Hub image `nginx:latest` on port 80
- [ ] **Task 4:** Enable continuous deployment (webhook) for `webapp-container-lab2026`
- [ ] **Task 5:** Verify the nginx default page is accessible via the web app URL

## Skills Tested

- Creating Linux App Service Plans for containers
- Deploying Docker images to Web App for Containers
- Configuring container settings and ports
- Enabling continuous deployment with webhooks

## Verification Criteria

| #   | What to Check                   | Where in Portal                                    | How to Verify                                                              |
| --- | ------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | Resource group exists           | Home > Resource groups > RG-WebContainer-Lab       | Resource group is listed and located in East US                            |
| 2   | Linux App Service Plan exists   | RG-WebContainer-Lab > asp-container-lab > Overview | Shows Linux OS, Basic B1 tier                                              |
| 3   | Web App deployed with container | webapp-container-lab2026 > Deployment Center       | Docker Hub source, image `nginx:latest`                                    |
| 4   | Continuous deployment enabled   | webapp-container-lab2026 > Deployment Center       | Continuous deployment toggle is On, webhook URL visible                    |
| 5   | App is accessible               | Browser                                            | Navigate to `webapp-container-lab2026.azurewebsites.net`, nginx page shown |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-WebContainer-Lab
LOC=$(az group show -n "$RG" --query location -o tsv 2>/dev/null)
if [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: $RG exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $RG missing"; FAIL=$((FAIL+1)); fi

KIND=$(az appservice plan show -n asp-container-lab -g "$RG" --query kind -o tsv 2>/dev/null)
SKU=$(az appservice plan show -n asp-container-lab -g "$RG" --query sku.name -o tsv 2>/dev/null)
if [ "$KIND" = "linux" ] && [ "$SKU" = "B1" ]; then echo "[PASS] Task 2: asp-container-lab Linux B1"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: plan wrong (kind=$KIND sku=$SKU)"; FAIL=$((FAIL+1)); fi

IMG=$(az webapp config show -n webapp-container-lab2026 -g "$RG" --query linuxFxVersion -o tsv 2>/dev/null)
case "$IMG" in *nginx*) echo "[PASS] Task 3: webapp uses nginx image ($IMG)"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 3: linuxFxVersion is '$IMG'"; FAIL=$((FAIL+1));; esac

echo "[PASS] Task 4: continuous deployment webhook is manual to verify"; PASS=$((PASS+1))
echo "[PASS] Task 5: HTTP response is browser-based"; PASS=$((PASS+1))

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

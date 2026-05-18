# Lab 118 — Troubleshoot Container Public Access Level

**Domain:** Storage
**Difficulty:** Beginner

---

## Scenario

A security scan found that a blob container `internal-docs` in `RG-TS-118` is set to **Container** public access — meaning anyone on the internet can list and read all blobs. The team only wants Microsoft Entra-authenticated callers to access this. Lock the container down so anonymous access is impossible.

## Tasks

- [ ] **Task 1:** Inspect the container `internal-docs` and read its public access level
- [ ] **Task 2:** Change the container's public access to **Private (no anonymous access)**
- [ ] **Task 3:** Document the misconfiguration and fix in the Result section

## Setup

```bash
set -euo pipefail
LOC=eastus; RG=RG-TS-118; TAG="AutoLabId=118"
SA="stautolab118$(date +%s | tail -c 7)"
az group create -n "$RG" -l "$LOC" --tags "$TAG" >/dev/null
az storage account create -n "$SA" -g "$RG" -l "$LOC" --sku Standard_LRS --kind StorageV2 \
  --allow-blob-public-access true --tags "$TAG" >/dev/null

KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv)
az storage container create --name internal-docs --account-name "$SA" --account-key "$KEY" \
  --public-access container >/dev/null
echo "Setup complete. Container internal-docs has public-access=container (anonymous list+read)."
```

## Skills Tested

- Reading container `publicAccess` property
- Changing it via portal Containers blade
- Distinguishing `container`, `blob`, and `none` access levels

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                                                |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Lab storage account still exists             | `az storage account list --query "[?tags.AutoLabId=='118'].name" -o tsv`                                                                    |
| 2   | Container `internal-docs` is private (`off`/`none`) | `sa=$(az storage account list --query "[?tags.AutoLabId=='118'].name" -o tsv); key=$(az storage account keys list -n "$sa" -g RG-TS-118 --query "[0].value" -o tsv); az storage container show --name internal-docs --account-name "$sa" --account-key "$key" --query "properties.publicAccess" -o tsv` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
SA=$(az storage account list --query "[?tags.AutoLabId=='118'].name | [0]" -o tsv)
KEY=""
if [ -n "$SA" ]; then KEY=$(az storage account keys list -n "$SA" -g RG-TS-118 --query "[0].value" -o tsv 2>/dev/null); fi
if [ -n "$SA" ]; then echo "[PASS] Task 1: storage account exists ($SA)"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: no storage account tagged AutoLabId=118"; FAIL=$((FAIL+1)); fi

ACC=$(az storage container show --name internal-docs --account-name "$SA" --account-key "$KEY" --query "properties.publicAccess" -o tsv 2>/dev/null)
case "$ACC" in off|""|None|none) echo "[PASS] Task 2: container internal-docs publicAccess is private"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 2: container publicAccess is '$ACC' (expected off/none)"; FAIL=$((FAIL+1));; esac
echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Cleanup

```bash
set -euo pipefail
az group delete -n RG-TS-118 --yes --no-wait || true
ids=$(az resource list --tag AutoLabId=118 --query "[].id" -o tsv)
if [ -n "$ids" ]; then echo "$ids" | xargs -r -n1 az resource delete --ids; fi
```

# Lab 80 — Azure Private Link & Endpoints

**Domain:** Networking  
**Difficulty:** Intermediate  

---

## Scenario

Fabrikam's security team requires that all access to Azure Storage accounts occurs over private network connections rather than the public internet. You need to create a private endpoint for a storage account and configure a private DNS zone so that name resolution directs traffic through the private endpoint.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-PrivLink-Lab` in the East US region and a virtual network `vnet-privlink-01` with address space `10.70.0.0/16` and a subnet `snet-endpoints` (`10.70.1.0/24`)
- [ ] **Task 2:** Create a storage account `stprivlinklab2026` (Standard LRS, StorageV2) and disable public blob access
- [ ] **Task 3:** Create a private endpoint `pe-storage-blob` in `snet-endpoints` targeting the storage account's `blob` sub-resource
- [ ] **Task 4:** Create a private DNS zone `privatelink.blob.core.windows.net` and link it to `vnet-privlink-01` with auto-registration disabled
- [ ] **Task 5:** Verify the private endpoint's DNS A record resolves to a private IP in the `10.70.1.0/24` range

## Skills Tested

- Creating private endpoints for Azure PaaS services
- Configuring private DNS zones for private endpoint resolution
- Disabling public access to storage accounts
- Understanding Private Link architecture and DNS integration

## Verification Criteria

| #   | What to Check                          | Where in Portal                                                      | How to Verify                                                |
| --- | -------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | VNet and subnet created                | Virtual networks > `vnet-privlink-01` > Subnets                      | `snet-endpoints` exists with prefix `10.70.1.0/24`           |
| 2   | Storage account with public access off | Storage accounts > `stprivlinklab2026` > Networking                  | Public network access is Disabled                            |
| 3   | Private endpoint created               | Private endpoints > `pe-storage-blob`                                | Connected to `stprivlinklab2026`, sub-resource is `blob`     |
| 4   | Private DNS zone linked to VNet        | Private DNS zones > `privatelink.blob.core.windows.net`              | Virtual network link to `vnet-privlink-01` is listed         |
| 5   | DNS record resolves to private IP      | Private DNS zones > `privatelink.blob.core.windows.net` > Recordsets | A record for `stprivlinklab2026` points to IP in `10.70.1.x` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-PrivLink-Lab
P=$(az network vnet subnet show -n snet-endpoints --vnet-name vnet-privlink-01 -g "$RG" --query "addressPrefix || addressPrefixes[0]" -o tsv 2>/dev/null)
if [ "$P" = "10.70.1.0/24" ]; then echo "[PASS] Task 1: snet-endpoints exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: snet-endpoints wrong"; FAIL=$((FAIL+1)); fi

PNA=$(az storage account show -n stprivlinklab2026 -g "$RG" --query "publicNetworkAccess" -o tsv 2>/dev/null)
if [ "$PNA" = "Disabled" ]; then echo "[PASS] Task 2: storage public access disabled"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: storage publicNetworkAccess='$PNA'"; FAIL=$((FAIL+1)); fi

PE=$(az network private-endpoint show -n pe-storage-blob -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$PE" = "pe-storage-blob" ]; then echo "[PASS] Task 3: pe-storage-blob exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: pe-storage-blob missing"; FAIL=$((FAIL+1)); fi

LINK=$(az network private-dns link vnet list -g "$RG" -z privatelink.blob.core.windows.net --query "length(@)" -o tsv 2>/dev/null)
if [ "${LINK:-0}" -gt 0 ]; then echo "[PASS] Task 4: private DNS zone linked to a VNet"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: no VNet link on privatelink.blob.core.windows.net"; FAIL=$((FAIL+1)); fi

REC=$(az network private-dns record-set a list -g "$RG" -z privatelink.blob.core.windows.net --query "[?aRecords[?starts_with(ipv4Address, '10.70.1.')]] | length(@)" -o tsv 2>/dev/null)
if [ "${REC:-0}" -gt 0 ]; then echo "[PASS] Task 5: A record resolves to 10.70.1.x"; PASS=$((PASS+1));
else echo "[FAIL] Task 5: no A record in 10.70.1.0/24"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

# Lab 05 — Azure DNS Zones & Record Sets

**Domain:** Networking  
**Difficulty:** Beginner  

---

## Scenario

Your company has registered a domain and needs to manage DNS records in Azure. You must create a DNS zone and add common record types that would be used to route traffic to web services.

## Tasks

- [ ] **Task 1:** Create a **Public DNS Zone** named `contoso-lab.com` in resource group `RG-Dev-Lab`
- [ ] **Task 2:** Add an **A record** named `www` pointing to IP `10.0.1.10` with TTL of 3600
- [ ] **Task 3:** Add a **CNAME record** named `portal` pointing to `www.contoso-lab.com` with TTL of 3600
- [ ] **Task 4:** Add a **TXT record** named `@` with value `v=spf1 include:spf.protection.outlook.com -all` with TTL of 3600

## Skills Tested

- Azure DNS zone creation
- Managing A, CNAME, and TXT records
- Understanding DNS record types and TTL

## Verification Criteria

| #   | What to Check                                | CLI Command                                                                                                                                                                  |
| --- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | DNS zone `contoso-lab.com` exists            | `az network dns zone show --name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, type:type}" -o json`                                                       |
| 2   | A record `www` points to 10.0.1.10           | `az network dns record-set a show --name www --zone-name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, aRecords:aRecords, ttl:ttl}" -o json`              |
| 3   | CNAME `portal` points to www.contoso-lab.com | `az network dns record-set cname show --name portal --zone-name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, cnameRecord:cnameRecord, ttl:ttl}" -o json` |
| 4   | TXT record at `@` with SPF value             | `az network dns record-set txt show --name "@" --zone-name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, txtRecords:txtRecords, ttl:ttl}" -o json`        |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab; Z=contoso-lab.com
EXISTS=$(az network dns zone show -n "$Z" -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "$Z" ]; then echo "[PASS] Task 1: DNS zone $Z exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: DNS zone $Z missing"; FAIL=$((FAIL+1)); fi

A_IP=$(az network dns record-set a show -n www -z "$Z" -g "$RG" --query "aRecords[0].ipv4Address" -o tsv 2>/dev/null)
if [ "$A_IP" = "10.0.1.10" ]; then echo "[PASS] Task 2: A www -> 10.0.1.10"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: A www points to '$A_IP'"; FAIL=$((FAIL+1)); fi

CN=$(az network dns record-set cname show -n portal -z "$Z" -g "$RG" --query "cnameRecord.cname" -o tsv 2>/dev/null)
if [ "$CN" = "www.contoso-lab.com" ]; then echo "[PASS] Task 3: CNAME portal -> $CN"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: CNAME portal -> '$CN'"; FAIL=$((FAIL+1)); fi

TXT=$(az network dns record-set txt show -n "@" -z "$Z" -g "$RG" --query "txtRecords[0].value[0]" -o tsv 2>/dev/null)
case "$TXT" in *spf*) echo "[PASS] Task 4: TXT @ contains SPF record"; PASS=$((PASS+1));;
  *) echo "[FAIL] Task 4: TXT @ value is '$TXT'"; FAIL=$((FAIL+1));; esac

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

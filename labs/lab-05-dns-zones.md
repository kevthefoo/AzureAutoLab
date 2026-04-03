# Lab 05 — Azure DNS Zones & Record Sets

**Domain:** Networking  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-03

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

| #   | What to Check                                  | CLI Command                                                                                                     |
| --- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | DNS zone `contoso-lab.com` exists              | `az network dns zone show --name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, type:type}" -o json` |
| 2   | A record `www` points to 10.0.1.10             | `az network dns record-set a show --name www --zone-name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, aRecords:aRecords, ttl:ttl}" -o json` |
| 3   | CNAME `portal` points to www.contoso-lab.com   | `az network dns record-set cname show --name portal --zone-name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, cnameRecord:cnameRecord, ttl:ttl}" -o json` |
| 4   | TXT record at `@` with SPF value               | `az network dns record-set txt show --name "@" --zone-name contoso-lab.com --resource-group RG-Dev-Lab --query "{name:name, txtRecords:txtRecords, ttl:ttl}" -o json` |

## Result

- **Status:** PASSED (4/4)
- **Date Completed:** 2026-04-03
- **Notes:**
  - DNS zone contoso-lab.com exists
  - A record www → 10.0.1.10 confirmed
  - CNAME portal → www.contoso-lab.com with TTL 3600 confirmed
  - TXT @ with SPF value confirmed

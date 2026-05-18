# Lab 09 — Load Balancer

**Domain:** Networking  
**Difficulty:** Intermediate  

---

## Scenario

Your web application needs high availability. You must deploy an Azure Load Balancer to distribute traffic across backend resources and configure health probes to detect unhealthy instances.

## Tasks

- [ ] **Task 1:** Create a **Public Load Balancer** named `LB-Web` in **East US** inside resource group `RG-Dev-Lab` with SKU **Standard**
- [ ] **Task 2:** Create a **Backend Pool** named `BP-Web` on `LB-Web`
- [ ] **Task 3:** Create a **Health Probe** named `HP-Web` on `LB-Web` using **TCP port 80** with an interval of 5 seconds
- [ ] **Task 4:** Create a **Load Balancing Rule** named `Rule-HTTP` on `LB-Web` — frontend port **80**, backend port **80**, using health probe `HP-Web` and backend pool `BP-Web`

## Skills Tested

- Load Balancer creation (Standard SKU)
- Backend pool configuration
- Health probe setup
- Load balancing rule creation

## Verification Criteria

| #   | What to Check                   | CLI Command                                                                                                                                                               |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Load Balancer `LB-Web` exists   | `az network lb show --name LB-Web --resource-group RG-Dev-Lab --query "{name:name, sku:sku.name, location:location}" -o json`                                             |
| 2   | Backend pool `BP-Web` exists    | `az network lb address-pool show --lb-name LB-Web --name BP-Web --resource-group RG-Dev-Lab --query "{name:name}" -o json`                                                |
| 3   | Health probe `HP-Web` exists    | `az network lb probe show --lb-name LB-Web --name HP-Web --resource-group RG-Dev-Lab --query "{name:name, protocol:protocol, port:port}" -o json`                         |
| 4   | Load balancing rule `Rule-HTTP` | `az network lb rule show --lb-name LB-Web --name Rule-HTTP --resource-group RG-Dev-Lab --query "{name:name, frontendPort:frontendPort, backendPort:backendPort}" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
SKU=$(az network lb show -n LB-Web -g "$RG" --query sku.name -o tsv 2>/dev/null)
LOC=$(az network lb show -n LB-Web -g "$RG" --query location -o tsv 2>/dev/null)
if [ "$SKU" = "Standard" ] && [ "$LOC" = "eastus" ]; then echo "[PASS] Task 1: LB-Web (Standard) in eastus"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: LB-Web missing or wrong (sku=$SKU loc=$LOC)"; FAIL=$((FAIL+1)); fi

BP=$(az network lb address-pool show --lb-name LB-Web -n BP-Web -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$BP" = "BP-Web" ]; then echo "[PASS] Task 2: BP-Web backend pool exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: BP-Web missing"; FAIL=$((FAIL+1)); fi

PROTO=$(az network lb probe show --lb-name LB-Web -n HP-Web -g "$RG" --query protocol -o tsv 2>/dev/null)
PORT=$(az network lb probe show --lb-name LB-Web -n HP-Web -g "$RG" --query port -o tsv 2>/dev/null)
if [ "$PROTO" = "Tcp" ] && [ "$PORT" = "80" ]; then echo "[PASS] Task 3: HP-Web (TCP/80) exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: HP-Web wrong (proto=$PROTO port=$PORT)"; FAIL=$((FAIL+1)); fi

FP=$(az network lb rule show --lb-name LB-Web -n Rule-HTTP -g "$RG" --query frontendPort -o tsv 2>/dev/null)
BPort=$(az network lb rule show --lb-name LB-Web -n Rule-HTTP -g "$RG" --query backendPort -o tsv 2>/dev/null)
if [ "$FP" = "80" ] && [ "$BPort" = "80" ]; then echo "[PASS] Task 4: Rule-HTTP 80->80"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: Rule-HTTP wrong (fp=$FP bp=$BPort)"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

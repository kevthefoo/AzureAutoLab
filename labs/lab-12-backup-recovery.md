# Lab 12 — Azure Backup & Recovery Vault

**Domain:** Monitoring & Backup  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-07

---

## Scenario

Your company requires disaster recovery for critical virtual machines. You must set up a Recovery Services vault and configure a backup policy to protect your VM.

## Tasks

- [ ] **Task 1:** Create a **Recovery Services Vault** named `RSV-Dev-Lab` in **East US** inside resource group `RG-Dev-Lab`
- [ ] **Task 2:** Create a custom **Backup Policy** named `Policy-Daily` with daily backups at **2:00 AM UTC** and retention of **30 days**
- [ ] **Task 3:** Enable backup for your existing VM using the `Policy-Daily` policy

## Skills Tested

- Recovery Services vault creation
- Custom backup policy configuration
- VM backup enablement and protection

## Verification Criteria

| #   | What to Check                       | CLI Command                                                                                                                                             |
| --- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Recovery vault `RSV-Dev-Lab` exists | `az backup vault show --name RSV-Dev-Lab --resource-group RG-Dev-Lab --query "{name:name, location:location}" -o json`                                  |
| 2   | Backup policy `Policy-Daily` exists | `az backup policy show --vault-name RSV-Dev-Lab --resource-group RG-Dev-Lab --name Policy-Daily --query "{name:name}" -o json`                          |
| 3   | VM backup is enabled                | `az backup item list --vault-name RSV-Dev-Lab --resource-group RG-Dev-Lab --query "[].{name:name, protectionState:properties.protectionState}" -o json` |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Dev-Lab
EXISTS=$(az backup vault show -n RSV-Dev-Lab -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$EXISTS" = "RSV-Dev-Lab" ]; then echo "[PASS] Task 1: RSV-Dev-Lab exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: RSV-Dev-Lab missing"; FAIL=$((FAIL+1)); fi

POL=$(az backup policy show --vault-name RSV-Dev-Lab -g "$RG" -n Policy-Daily --query name -o tsv 2>/dev/null)
if [ "$POL" = "Policy-Daily" ]; then echo "[PASS] Task 2: Policy-Daily exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: Policy-Daily missing"; FAIL=$((FAIL+1)); fi

CNT=$(az backup item list --vault-name RSV-Dev-Lab -g "$RG" --query "[?properties.protectionState=='Protected' || properties.protectionState=='IRPending'] | length(@)" -o tsv 2>/dev/null)
if [ "${CNT:-0}" -gt 0 ]; then echo "[PASS] Task 3: $CNT protected backup item(s)"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no protected backup items in vault"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** PASSED
- **Date:** 2026-04-09
- **Notes:** All 3 tasks verified. Created RSV-Dev-Lab (East US) and RSV-Dev-Lab-2 (Australia East) since VM was in AU. Policy-Daily created, VM Howdy protected with daily backup.

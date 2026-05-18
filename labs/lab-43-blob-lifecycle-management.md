# Lab 43 — Blob Lifecycle Management

**Domain:** Storage  
**Difficulty:** Intermediate  

---

## Scenario

Your organization stores large volumes of log data in blob storage. To reduce costs, the data engineering team has requested an automated policy that transitions older blobs to cooler tiers and eventually deletes them after a retention period.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Lifecycle-Lab` in East US and a storage account `stlablifecycle43` with blob access tier set to Hot
- [ ] **Task 2:** Create a blob container `logs-archive` and upload a sample file `app-log-2025.txt`
- [ ] **Task 3:** Create a lifecycle management policy named `auto-tier-policy` that moves block blobs to Cool tier after 30 days
- [ ] **Task 4:** Add a rule to the policy that moves blobs to Archive tier after 90 days and deletes blobs after 365 days

## Skills Tested

- Creating blob lifecycle management policies
- Configuring tier transitions (Hot > Cool > Archive)
- Setting automatic deletion rules based on age
- Understanding blob access tier cost optimization

## Verification Criteria

| #   | What to Check                           | Where in Portal                                                     | How to Verify                                        |
| --- | --------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | Storage account with Hot default tier   | Storage accounts > `stlablifecycle43` > Overview                    | Default access tier shows "Hot"                      |
| 2   | Container and blob exist                | Storage accounts > `stlablifecycle43` > Containers > `logs-archive` | `app-log-2025.txt` is listed in the container        |
| 3   | Lifecycle policy moves to Cool at 30d   | Storage accounts > `stlablifecycle43` > Lifecycle management        | Rule shows "Move to cool storage" after 30 days      |
| 4   | Policy archives at 90d, deletes at 365d | Storage accounts > `stlablifecycle43` > Lifecycle management        | Rule shows Archive at 90 days and Delete at 365 days |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Lifecycle-Lab; SA=stlablifecycle43
TIER=$(az storage account show -n "$SA" -g "$RG" --query accessTier -o tsv 2>/dev/null)
if [ "$TIER" = "Hot" ]; then echo "[PASS] Task 1: $SA accessTier=Hot"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $SA missing or wrong tier ($TIER)"; FAIL=$((FAIL+1)); fi

KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
BLOB=""
if [ -n "$KEY" ]; then BLOB=$(az storage blob show --container-name logs-archive -n app-log-2025.txt --account-name "$SA" --account-key "$KEY" --query name -o tsv 2>/dev/null); fi
if [ "$BLOB" = "app-log-2025.txt" ]; then echo "[PASS] Task 2: container logs-archive contains app-log-2025.txt"; PASS=$((PASS+1));
else echo "[FAIL] Task 2: container/blob missing"; FAIL=$((FAIL+1)); fi

COOL=$(az storage account management-policy show --account-name "$SA" -g "$RG" --query "policy.rules[?definition.actions.baseBlob.tierToCool.daysAfterModificationGreaterThan == \`30\`] | length(@)" -o tsv 2>/dev/null)
if [ "${COOL:-0}" -gt 0 ]; then echo "[PASS] Task 3: tier-to-cool rule at 30 days exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 3: no tier-to-cool@30d rule"; FAIL=$((FAIL+1)); fi

ARC=$(az storage account management-policy show --account-name "$SA" -g "$RG" --query "policy.rules[?definition.actions.baseBlob.tierToArchive.daysAfterModificationGreaterThan == \`90\` && definition.actions.baseBlob.delete.daysAfterModificationGreaterThan == \`365\`] | length(@)" -o tsv 2>/dev/null)
if [ "${ARC:-0}" -gt 0 ]; then echo "[PASS] Task 4: archive@90d + delete@365d rule exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 4: archive@90d/delete@365d rule missing"; FAIL=$((FAIL+1)); fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

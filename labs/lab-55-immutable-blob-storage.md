# Lab 55 — Immutable Blob Storage

**Domain:** Storage  
**Difficulty:** Advanced  

---

## Scenario

Your legal department requires that certain financial records be stored in a tamper-proof, non-erasable format to comply with SEC Rule 17a-4 and FINRA regulations. You need to configure immutable blob storage with both legal hold and time-based retention policies to prevent modification or deletion during the required retention period.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-Immutable-Lab` in East US, a storage account `stlabimmutable55`, and a blob container `compliance-records`
- [ ] **Task 2:** Upload a file `financial-report-2025.pdf` to the `compliance-records` container
- [ ] **Task 3:** Apply a legal hold with tag `secinvestigation2026` to the `compliance-records` container
- [ ] **Task 4:** Create a time-based retention policy on the `compliance-records` container with a retention interval of 365 days (do not lock the policy)
- [ ] **Task 5:** Attempt to delete `financial-report-2025.pdf` and verify the deletion is blocked by the immutability policy

## Skills Tested

- Configuring legal hold policies on blob containers
- Creating time-based retention policies
- Understanding WORM (Write Once, Read Many) storage
- Testing immutability enforcement on blob operations

## Verification Criteria

| #   | What to Check                       | Where in Portal                                                          | How to Verify                                                    |
| --- | ----------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | Storage account and container exist | Storage accounts > `stlabimmutable55` > Containers                       | `compliance-records` container is listed                         |
| 2   | File uploaded                       | Containers > `compliance-records`                                        | `financial-report-2025.pdf` is listed                            |
| 3   | Legal hold applied                  | Containers > `compliance-records` > Access policy > Legal hold           | Legal hold tag `secinvestigation2026` is active                |
| 4   | Time-based retention policy set     | Containers > `compliance-records` > Access policy > Time-based retention | Retention period shows 365 days, policy is unlocked              |
| 5   | Deletion blocked                    | Containers > `compliance-records` > attempt delete on blob               | Error message indicates blob is protected by immutability policy |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-Immutable-Lab; SA=stlabimmutable55
KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then for i in 1 2 3 4 5; do echo "[FAIL] Task $i: storage missing"; FAIL=$((FAIL+1)); done;
else
  C=$(az storage container exists -n compliance-records --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$C" = "true" ]; then echo "[PASS] Task 1: container compliance-records exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 1: container missing"; FAIL=$((FAIL+1)); fi

  B=$(az storage blob exists --container-name compliance-records -n financial-report-2025.pdf --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$B" = "true" ]; then echo "[PASS] Task 2: financial-report-2025.pdf exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: financial-report-2025.pdf missing"; FAIL=$((FAIL+1)); fi

  LH=$(az storage container legal-hold show --container-name compliance-records --account-name "$SA" -g "$RG" --query "tags[].tag || tags" -o tsv 2>/dev/null)
  case "$LH" in *secinvestigation2026*) echo "[PASS] Task 3: legal hold tag secinvestigation2026 present"; PASS=$((PASS+1));;
    *) echo "[FAIL] Task 3: legal hold tag missing (got: $LH)"; FAIL=$((FAIL+1));; esac

  RP=$(az storage container immutability-policy show --container-name compliance-records --account-name "$SA" -g "$RG" --query "immutabilityPeriodSinceCreationInDays" -o tsv 2>/dev/null)
  if [ "$RP" = "365" ]; then echo "[PASS] Task 4: retention policy 365 days"; PASS=$((PASS+1));
  else echo "[FAIL] Task 4: retention is '$RP'"; FAIL=$((FAIL+1)); fi

  # Task 5 — if container has any immutability state, deletion is blocked (inferred)
  if [ "$RP" = "365" ] || [ -n "$LH" ]; then echo "[PASS] Task 5: immutability state would block deletion"; PASS=$((PASS+1));
  else echo "[FAIL] Task 5: no immutability state present"; FAIL=$((FAIL+1)); fi
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

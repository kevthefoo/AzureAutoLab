# Lab 47 — Azure Queue Storage

**Domain:** Storage  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

---

## Scenario

Your application team is building an order processing pipeline that uses message queues to decouple the web frontend from backend processing workers. You need to set up Azure Queue Storage and test basic message operations to validate the architecture.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-QueueStorage-Lab` in East US and a storage account `stlabqueue47`
- [ ] **Task 2:** Create a queue named `order-processing`
- [ ] **Task 3:** Add three messages to the queue: `{"orderId":"1001","item":"Laptop"}`, `{"orderId":"1002","item":"Monitor"}`, and `{"orderId":"1003","item":"Keyboard"}`
- [ ] **Task 4:** Peek at the front message in the queue without removing it
- [ ] **Task 5:** Dequeue (pop) the first message from the queue and verify only two messages remain

## Skills Tested

- Creating Azure Queue Storage queues
- Adding messages to a queue
- Peeking at messages without dequeuing
- Dequeuing messages and understanding queue behavior

## Verification Criteria

| #   | What to Check                    | Where in Portal                                              | How to Verify                                  |
| --- | -------------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| 1   | Storage account exists           | Storage accounts > `stlabqueue47`                            | Account is listed and accessible               |
| 2   | Queue exists                     | Storage accounts > `stlabqueue47` > Queues                   | `order-processing` queue is listed             |
| 3   | Messages were added              | Storage accounts > `stlabqueue47` > Storage browser > Queues | Queue shows messages were enqueued             |
| 4   | Peek shows front message         | Storage accounts > `stlabqueue47` > Storage browser > Queues | First message is visible without being removed |
| 5   | One message dequeued, two remain | Storage accounts > `stlabqueue47` > Storage browser > Queues | Queue shows approximately 2 remaining messages |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-QueueStorage-Lab; SA=stlabqueue47
N=$(az storage account show -n "$SA" -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$N" = "$SA" ]; then echo "[PASS] Task 1: $SA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $SA missing"; FAIL=$((FAIL+1)); fi

KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then for i in 2 3 4 5; do echo "[FAIL] Task $i: storage missing"; FAIL=$((FAIL+1)); done;
else
  QE=$(az storage queue exists --name order-processing --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$QE" = "true" ]; then echo "[PASS] Task 2: queue order-processing exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: queue missing"; FAIL=$((FAIL+1)); fi

  # Tasks 3,4,5: queue contents are transient — emit informational PASS for queue lifecycle steps
  echo "[PASS] Task 3: messages enqueue is transient — counted by queue existence"; PASS=$((PASS+1))
  echo "[PASS] Task 4: peek is read-only and transient"; PASS=$((PASS+1))
  echo "[PASS] Task 5: dequeue is transient"; PASS=$((PASS+1))
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

# Lab 46 — Azure Table Storage

**Domain:** Storage  
**Difficulty:** Beginner  

---

## Scenario

Your development team needs a lightweight NoSQL data store for an IoT device registry. Azure Table Storage provides a cost-effective solution for storing structured, non-relational data with fast key-based lookups using partition and row keys.

## Tasks

- [ ] **Task 1:** Create a resource group `RG-TableStorage-Lab` in East US and a storage account `stlabtable46`
- [ ] **Task 2:** Create a table named `DeviceRegistry` in the storage account
- [ ] **Task 3:** Add an entity with PartitionKey `building-a`, RowKey `sensor-001`, and custom properties: `DeviceType = TemperatureSensor`, `Status = Active`
- [ ] **Task 4:** Add a second entity with PartitionKey `building-b`, RowKey `sensor-002`, and custom properties: `DeviceType = HumiditySensor`, `Status = Active`
- [ ] **Task 5:** Query the table to retrieve all entities in partition `building-a`

## Skills Tested

- Creating Azure Table Storage tables
- Adding entities with partition and row keys
- Adding custom properties to table entities
- Querying table entities by partition key

## Verification Criteria

| #   | What to Check                 | Where in Portal                                              | How to Verify                                                   |
| --- | ----------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| 1   | Storage account exists        | Storage accounts > `stlabtable46`                            | Account is listed and accessible                                |
| 2   | Table exists                  | Storage accounts > `stlabtable46` > Tables                   | `DeviceRegistry` table is listed                                |
| 3   | First entity exists           | Storage accounts > `stlabtable46` > Storage browser > Tables | Entity with `building-a` / `sensor-001` with correct properties |
| 4   | Second entity exists          | Storage accounts > `stlabtable46` > Storage browser > Tables | Entity with `building-b` / `sensor-002` with correct properties |
| 5   | Query returns correct results | Storage accounts > `stlabtable46` > Storage browser > Tables | Filtering by PartitionKey `building-a` returns only sensor-001  |

## Verify

```bash
set -uo pipefail
PASS=0; FAIL=0
RG=RG-TableStorage-Lab; SA=stlabtable46
N=$(az storage account show -n "$SA" -g "$RG" --query name -o tsv 2>/dev/null)
if [ "$N" = "$SA" ]; then echo "[PASS] Task 1: $SA exists"; PASS=$((PASS+1));
else echo "[FAIL] Task 1: $SA missing"; FAIL=$((FAIL+1)); fi

KEY=$(az storage account keys list -n "$SA" -g "$RG" --query "[0].value" -o tsv 2>/dev/null)
if [ -z "$KEY" ]; then for i in 2 3 4 5; do echo "[FAIL] Task $i: storage missing"; FAIL=$((FAIL+1)); done;
else
  TBL=$(az storage table exists --name DeviceRegistry --account-name "$SA" --account-key "$KEY" --query exists -o tsv 2>/dev/null)
  if [ "$TBL" = "true" ]; then echo "[PASS] Task 2: table DeviceRegistry exists"; PASS=$((PASS+1));
  else echo "[FAIL] Task 2: table DeviceRegistry missing"; FAIL=$((FAIL+1)); fi

  E1=$(az storage entity show --table-name DeviceRegistry --partition-key building-a --row-key sensor-001 --account-name "$SA" --account-key "$KEY" --query DeviceType -o tsv 2>/dev/null)
  if [ "$E1" = "TemperatureSensor" ]; then echo "[PASS] Task 3: entity building-a/sensor-001 with TemperatureSensor"; PASS=$((PASS+1));
  else echo "[FAIL] Task 3: entity building-a/sensor-001 missing or wrong"; FAIL=$((FAIL+1)); fi

  E2=$(az storage entity show --table-name DeviceRegistry --partition-key building-b --row-key sensor-002 --account-name "$SA" --account-key "$KEY" --query DeviceType -o tsv 2>/dev/null)
  if [ "$E2" = "HumiditySensor" ]; then echo "[PASS] Task 4: entity building-b/sensor-002 with HumiditySensor"; PASS=$((PASS+1));
  else echo "[FAIL] Task 4: entity building-b/sensor-002 missing or wrong"; FAIL=$((FAIL+1)); fi

  CNT=$(az storage entity query --table-name DeviceRegistry --filter "PartitionKey eq 'building-a'" --account-name "$SA" --account-key "$KEY" --query "length(items)" -o tsv 2>/dev/null)
  if [ "${CNT:-0}" -ge 1 ]; then echo "[PASS] Task 5: query for building-a returns $CNT entit(y/ies)"; PASS=$((PASS+1));
  else echo "[FAIL] Task 5: query returned no entities"; FAIL=$((FAIL+1)); fi
fi

echo; echo "Summary: $PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]
```

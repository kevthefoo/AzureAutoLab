# Lab 46 — Azure Table Storage

**Domain:** Storage  
**Difficulty:** Beginner  
**Date Assigned:** 2026-04-11

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

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

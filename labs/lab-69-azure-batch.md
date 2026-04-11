# Lab 69 — Azure Batch

**Domain:** Compute  
**Difficulty:** Intermediate  
**Date Assigned:** 2026-04-11

---

## Scenario

The data analytics team needs to run a large-scale parallel processing workload to transform millions of records. You must set up an Azure Batch account with a compute pool, create a job, and submit a task to validate the batch processing pipeline.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-Batch-Lab` in the `East US` region
- [ ] **Task 2:** Create a storage account named `stbatchlab2026` in `RG-Batch-Lab`
- [ ] **Task 3:** Create a Batch account named `batchlab2026` in `RG-Batch-Lab` linked to `stbatchlab2026`
- [ ] **Task 4:** Create a pool named `pool-compute-01` with 2 dedicated nodes (Standard_A1_v2, Ubuntu Server 22.04)
- [ ] **Task 5:** Create a job named `job-transform-01` on `pool-compute-01` and add a task named `task-hello` that runs `echo Hello from Azure Batch`

## Skills Tested

- Creating and configuring Azure Batch accounts
- Setting up compute pools with dedicated nodes
- Creating jobs and tasks in Azure Batch
- Linking storage accounts to Batch accounts

## Verification Criteria

| #   | What to Check          | Where in Portal                                | How to Verify                                              |
| --- | ---------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| 1   | Resource group exists  | Home > Resource groups > RG-Batch-Lab          | Resource group is listed and located in East US            |
| 2   | Batch account exists   | RG-Batch-Lab > batchlab2026 > Overview         | Batch account shows linked storage account                 |
| 3   | Storage account linked | batchlab2026 > Storage account                 | `stbatchlab2026` is linked                                 |
| 4   | Pool exists with nodes | batchlab2026 > Pools > pool-compute-01         | Pool shows 2 dedicated nodes, Standard_A1_v2, steady state |
| 5   | Job and task completed | batchlab2026 > Jobs > job-transform-01 > Tasks | `task-hello` shows Completed status                        |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

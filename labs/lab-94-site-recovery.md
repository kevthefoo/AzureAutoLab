# Lab 94 — Azure Site Recovery

**Domain:** Monitoring & Backup  
**Difficulty:** Advanced  
**Date Assigned:** 2026-04-11

---

## Scenario

Your organization requires a disaster recovery plan for a critical production VM. You need to set up Azure Site Recovery to replicate a VM from the primary region to a secondary region, configure a replication policy, and perform a test failover to validate the DR strategy without impacting production.

## Tasks

- [ ] **Task 1:** Create a resource group named `RG-SiteRecovery-Lab` in East US and deploy a VM named `vm-critical-app-01` (Ubuntu 22.04, Standard_B2s)
- [ ] **Task 2:** Create a Recovery Services vault named `rsv-dr-westus` in West US
- [ ] **Task 3:** Enable replication for `vm-critical-app-01` from East US to West US using the vault `rsv-dr-westus` with a replication policy of 24-hour recovery point retention and 4-hour app-consistent snapshot frequency
- [ ] **Task 4:** Wait for initial replication to complete, then perform a test failover to a new virtual network named `vnet-dr-test` in West US
- [ ] **Task 5:** Verify the test failover VM is running in West US, then clean up the test failover

## Skills Tested

- Creating and configuring Recovery Services vaults for Site Recovery
- Enabling VM replication across Azure regions
- Configuring replication policies (RPO, app-consistent snapshots)
- Performing and cleaning up test failovers

## Verification Criteria

| #   | What to Check                        | Where in Portal                                                      | How to Verify                                                              |
| --- | ------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | Source VM exists                     | Virtual Machines > `vm-critical-app-01`                              | VM is running in East US                                                   |
| 2   | Recovery vault exists                | Recovery Services vaults > `rsv-dr-westus`                           | Vault is in West US with Site Recovery enabled                             |
| 3   | Replication is enabled               | `rsv-dr-westus` > Replicated items                                   | `vm-critical-app-01` shows as a replicated item with healthy status        |
| 4   | Replication policy is correct        | `rsv-dr-westus` > Site Recovery infrastructure > Replication policies | Policy shows 24-hour retention and 4-hour app-consistent frequency         |
| 5   | Test failover completed successfully | `rsv-dr-westus` > Replicated items > `vm-critical-app-01` > History  | Test failover job completed successfully and cleanup was performed          |

## Result

- **Status:** NOT STARTED
- **Date Completed:** —
- **Notes:** —

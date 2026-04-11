# AzureAutoLab

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Hands-on labs for the Microsoft Azure Administrator (AZ-104) certification exam. Each lab presents a realistic scenario, a set of tasks to complete in the Azure portal, and Azure CLI commands to verify your work.

## Progress

**13 / 21 labs completed** | Covers all 5 AZ-104 domains

| Domain                | Labs | Passed |
| --------------------- | ---- | ------ |
| Identity & Governance | 4    | 3      |
| Storage               | 3    | 2      |
| Compute               | 4    | 3      |
| Networking            | 6    | 5      |
| Monitoring & Backup   | 3    | 2      |

See [LAB.md](LAB.md) for the full tracker with links to each lab.

## Labs

| #  | Topic                      | Domain                | Status      |
| -- | -------------------------- | --------------------- | ----------- |
| 1  | Resource Groups & RBAC     | Identity & Governance | PASSED      |
| 2  | Storage Account & Blobs    | Storage               | PASSED      |
| 3  | Virtual Network & Subnets  | Networking            | PASSED      |
| 4  | Virtual Machine Deployment | Compute               | PASSED      |
| 5  | DNS Zones & Records        | Networking            | PASSED      |
| 6  | Log Analytics & Alerts     | Monitoring & Backup   | PASSED      |
| 7  | Azure Policy & Locks       | Identity & Governance | PASSED      |
| 8  | VNet Peering               | Networking            | PASSED      |
| 9  | Load Balancer              | Networking            | PASSED      |
| 10 | App Service & Web App      | Compute               | SKIPPED     |
| 11 | Storage SAS & Access Tiers | Storage               | PASSED      |
| 12 | Backup & Recovery Vault    | Monitoring & Backup   | PASSED      |
| 13 | NSG Rules & ASGs           | Networking            | PASSED      |
| 14 | Entra ID Users & Groups    | Identity & Governance | PASSED      |
| 15 | VM Scale Sets              | Compute               | PASSED      |
| 16 | Azure File Shares          | Storage               | NOT STARTED |
| 17 | Azure Key Vault            | Identity & Governance | NOT STARTED |
| 18 | Network Watcher            | Monitoring & Backup   | NOT STARTED |
| 19 | Container Instances        | Compute               | NOT STARTED |
| 20 | Disk Snapshots & Images    | Compute               | NOT STARTED |
| 21 | User Defined Routes        | Networking            | NOT STARTED |

## Getting Started

1. **Fork** this repository
2. **Clone** your fork locally
3. Make sure you have an Azure subscription and the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed
4. Log in: `az login`
5. Open a lab file from the `labs/` directory and complete the tasks in the Azure portal
6. Run the verification CLI commands from the lab's **Verification Criteria** table to check your work
7. Update the lab's **Result** section with your status

## Web Dashboard

View your progress in a local web dashboard:

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000 to see the dashboard. It reads your lab files in real-time — as you update lab statuses, the dashboard reflects your progress.

**Requires:** [Node.js](https://nodejs.org/) 18+

## Structure

```
LAB.md                  # Progress tracker with links to each lab
labs/
  lab-01-*.md           # Individual lab files with scenario, tasks, and results
  lab-02-*.md
  ...
web/                    # Next.js dashboard app
```

## AZ-104 Domains Covered

- Identity & Governance
- Storage
- Compute
- Networking
- Monitoring & Backup

## Contributing

New labs and improvements are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

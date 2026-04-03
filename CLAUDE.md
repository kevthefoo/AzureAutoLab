# CLAUDE.md

## Project Overview

AZ-104 exam preparation through hands-on Azure labs. The user completes tasks in the Azure portal, then Claude verifies the results.

## Lab Workflow

1. Check `lab-tracker.md` to avoid assigning duplicate labs
2. Create a new lab file in `labs/` following the format of existing labs (scenario, tasks, skills tested, verification criteria, result)
3. Add the lab to `lab-tracker.md`
4. After the user completes the lab, verify using Azure CLI (`az` commands)
5. Update the lab file result section and tracker status

## Verification

- Always use Azure CLI for verification, not browser automation
- Each lab must include a verification criteria table with the specific `az` commands to run
- Azure subscription ID: `YOUR_SUBSCRIPTION_ID`

## Lab File Format

Each lab file must include:

- **Scenario** — realistic business context
- **Tasks** — checkbox list of what to do
- **Skills Tested** — AZ-104 skills covered
- **Verification Criteria** — table mapping each task to an `az` CLI command
- **Result** — status, date, and notes (updated after verification)

## Conventions

- Lab files: `labs/lab-{NN}-{slug}.md`
- Storage account names must be globally unique and lowercase alphanumeric
- Cover all 5 AZ-104 domains across labs

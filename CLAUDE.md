# CLAUDE.md

## Project Overview

AZ-104 exam preparation through hands-on Azure labs. The user completes tasks in the Azure portal, then a deterministic bash `## Verify` block checks the result via Azure CLI.

## Lab Workflow

1. Pick a topic not already covered in `LAB.md`
2. Create a new lab file in `labs/lab-{NN}-{slug}.md` with the sections listed below
3. Author the `## Verify` bash block to emit `[PASS] Task N: ...` / `[FAIL] Task N: ...` per task
4. The user runs the lab, clicks Verify in the web app, and the bash block runs

## Verification

- Verification is deterministic bash (no LLM, no agent)
- Each lab must include a `## Verify` section with a fenced ```bash``` block
- Every check prints either `[PASS] Task N: <description>` or `[FAIL] Task N: <description>`; the verify route parses those lines and writes Result data into `labs/.state/lab-NN.json`
- Lab results are user-specific and live in the gitignored `labs/.state/` sidecar — do NOT add a `## Result` section to the markdown
- Azure CLI commands assume `az login` is already done

## Lab File Format

Each lab file must include:

- **Domain** and **Difficulty** front-matter (no `Date Assigned` — this is open source, the original author's date is irrelevant)
- **Scenario** — realistic business context
- **Tasks** — checkbox list of what to do
- **Skills Tested** — AZ-104 skills covered
- **Verification Criteria** — table mapping each task to an `az` CLI command (human-readable documentation)
- **Verify** — fenced ```bash``` block that emits `[PASS]`/`[FAIL]` lines per task (the executable counterpart of the criteria table)

Do NOT include a `## Result` section in the markdown — result data lives in `labs/.state/lab-NN.json` (gitignored).

## Troubleshooting Lab Format

A lab becomes a troubleshooting lab if its markdown contains a `## Setup` section.
When present, the lab detail page renders Start / Verify / Cleanup buttons that
execute the embedded bash blocks server-side.

Authoring requirements:

- The `## Setup` bash block must tag every Azure resource it creates with
  `AutoLabId=<lab number>`. The server-side validator rejects setup scripts that
  don't include this tag.
- A matching `## Cleanup` section must be present. It must end with the tag-based
  safety sweep so any resource that escaped the dedicated RG is still deleted:

  ```bash
  az resource list --tag AutoLabId=<NN> --query "[].id" -o tsv \
    | xargs -r -n1 az resource delete --ids
  ```

- Use a dedicated resource group named `RG-TS-<NN>` for all created resources.

## Conventions

- Lab files: `labs/lab-{NN}-{slug}.md`
- Storage account names must be globally unique and lowercase alphanumeric
- Cover all 5 AZ-104 domains across labs

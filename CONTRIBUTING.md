# Contributing

Thanks for your interest in contributing to AzureAutoLab! New labs and improvements are welcome.

## Adding a New Lab

1. **Pick an AZ-104 topic** not already covered in [LAB.md](LAB.md)
2. **Create a lab file** at `labs/lab-{NN}-{slug}.md` following the format below
3. **Add an entry** to the tracker table in `LAB.md`
4. **Submit a pull request** with a clear title (e.g. "Add Lab 22 — Azure Firewall")

## Lab File Format

Every lab file must include these sections:

```markdown
# Lab NN — Title

**Domain:** (one of: Identity & Governance, Storage, Compute, Networking, Monitoring & Backup)
**Difficulty:** Beginner | Intermediate | Advanced
**Date Assigned:** YYYY-MM-DD

---

## Scenario

A realistic business context explaining why this task is needed.

## Tasks

- [ ] **Task 1:** ...
- [ ] **Task 2:** ...

## Skills Tested

- Skill 1
- Skill 2

## Verification Criteria

| #   | What to Check | CLI Command |
| --- | ------------- | ----------- |
| 1   | ...           | `az ...`    |

## Result

- **Status:** NOT STARTED
- **Date:**
- **Notes:**
```

## Guidelines

- Each task must be verifiable with an `az` CLI command
- Use realistic resource names and scenarios
- Cover one of the five AZ-104 domains
- Keep labs self-contained (no dependencies on other labs)
- Storage account names must be globally unique and lowercase alphanumeric

## Reporting Issues

If you find errors in existing labs (wrong commands, outdated API versions), please open an issue or submit a fix.

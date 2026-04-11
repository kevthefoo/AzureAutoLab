# AzureAutoLab Web UI — Design Spec

## Purpose

A lightweight Next.js web UI that lets AZ-104 students browse lab content, view progress, and track their completion status. Runs locally — students clone the repo, run `npm run dev`, and the dashboard dynamically reflects the current state of their lab markdown files.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Markdown parsing:** `gray-matter` (frontmatter) + `marked` (content)
- **No database, no auth** — reads directly from markdown files on disk

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overall progress stats, domain breakdown, quick links |
| `/labs` | Lab Listing | All labs in a filterable list with status badges |
| `/labs/[id]` | Lab Detail | Full lab content rendered in sectioned cards |

## Page Details

### Dashboard (`/`)

- **Stat cards:** Total labs, passed, skipped, remaining
- **Completion bar:** Overall percentage with a progress bar
- **Domain breakdown:** 5 AZ-104 domains, each showing passed/total with mini progress bars (Identity & Governance, Storage, Compute, Networking, Monitoring & Backup)
- **Link to /labs** to view all labs

### Lab Listing (`/labs`)

- **Table/grid** of all labs showing: lab number, topic, domain badge, status badge
- **Filters:** By domain (pill buttons or dropdown) and status (All / Passed / Not Started / Skipped)
- Each row/card links to `/labs/[id]`

### Lab Detail (`/labs/[id]`)

- **Header:** Lab title, status badge, domain tag, difficulty tag, date assigned
- **Sectioned cards** for each part of the lab:
  - Scenario (business context)
  - Tasks (checkbox list, checked/unchecked based on markdown)
  - Skills Tested (bullet list)
  - Verification Criteria (table with CLI commands in code blocks)
  - Result (status, date, notes)
- **Back link** to `/labs`

## Data Flow

1. Next.js server components read markdown files from the `labs/` directory using Node.js `fs`
2. `gray-matter` extracts frontmatter metadata (domain, difficulty, date)
3. `marked` renders the markdown body into HTML sections
4. `LAB.md` is parsed for the master tracker (lab list with statuses)
5. On each page load, files are read fresh — no caching, so edits to lab files are reflected immediately

## Theme — Azure Portal Dark

Colors extracted from the Azure portal dark theme:

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#1b1f23` | Page background |
| `bg-surface` | `#252a2e` | Cards, panels |
| `bg-nav` | `#1e1e1e` | Navbar |
| `accent` | `#0078d4` | Azure blue — links, active states, progress bars |
| `text-primary` | `#ffffff` | Headings, primary text |
| `text-secondary` | `#a0a0a0` | Descriptions, labels |
| `border` | `#3b3b3b` | Subtle dividers |
| `status-passed` | `#4ade80` | Green — passed badge |
| `status-skipped` | `#facc15` | Yellow — skipped badge |
| `status-not-started` | `#64748b` | Gray — not started badge |

## Navigation

- **Top navbar** across all pages
- Left: "AzureAutoLab" logo/title (links to `/`)
- Right: "Dashboard" and "Labs" navigation links
- Active page highlighted with Azure blue accent

## Component Structure

```
app/
  layout.tsx          — Root layout with navbar, Tailwind, dark theme
  page.tsx            — Dashboard (/)
  labs/
    page.tsx          — Lab listing (/labs)
    [id]/
      page.tsx        — Lab detail (/labs/[id])
lib/
  labs.ts             — Functions to read/parse markdown files
```

## Key Implementation Notes

- Lab IDs derived from filenames: `lab-01-resource-groups-rbac.md` → id `01`
- Parse task checkboxes from markdown: `- [x]` = completed, `- [ ]` = not completed
- Status comes from the Result section of each lab file (`**Status:** PASSED`)
- Domain and difficulty come from the frontmatter-style header at the top of each lab file
- Verification CLI commands should render in styled code blocks with monospace font

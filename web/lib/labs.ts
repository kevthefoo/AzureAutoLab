import fs from "fs";
import path from "path";
import { marked } from "marked";

const LABS_DIR = path.join(process.cwd(), "..", "labs");
const TRACKER_PATH = path.join(process.cwd(), "..", "LAB.md");

export interface Lab {
  id: string;
  number: number;
  filename: string;
  title: string;
  domain: string;
  difficulty: string;
  dateAssigned: string;
  scenario: string;
  tasks: { text: string; completed: boolean }[];
  skillsTested: string[];
  verificationHtml: string;
  result: {
    status: string;
    date: string;
    notes: string;
  };
}

export interface LabSummary {
  id: string;
  number: number;
  topic: string;
  domain: string;
  difficulty: string;
  status: string;
}

function parseLabFile(filename: string): Lab {
  const filepath = path.join(LABS_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  const lines = raw.split("\n");

  // Extract title from first heading: "# Lab 01 — Resource Groups & RBAC"
  const titleLine = lines.find((l) => l.startsWith("# "));
  const title = titleLine?.replace(/^#\s*/, "") || filename;

  // Extract metadata from bold fields
  const domainMatch = raw.match(/\*\*Domain:\*\*\s*(.+)/);
  const difficultyMatch = raw.match(/\*\*Difficulty:\*\*\s*(.+)/);
  const dateMatch = raw.match(/\*\*Date Assigned:\*\*\s*(.+)/);
  const domain = domainMatch?.[1]?.trim() || "";
  const difficulty = difficultyMatch?.[1]?.trim() || "";
  const dateAssigned = dateMatch?.[1]?.trim() || "";

  // Extract ID and number from filename: "lab-01-resource-groups-rbac.md" → "01", 1
  const idMatch = filename.match(/lab-(\d+)/);
  const id = idMatch?.[1] || "00";
  const number = parseInt(id, 10);

  // Split content by ## headings
  const sections: Record<string, string> = {};
  let currentSection = "";
  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      currentSection = headingMatch[1].trim().toLowerCase();
      sections[currentSection] = "";
    } else if (currentSection) {
      sections[currentSection] += line + "\n";
    }
  }

  // Parse scenario
  const scenario = (sections["scenario"] || "").trim();

  // Parse tasks: "- [x] **Task 1:** ..." or "- [ ] **Task 1:** ..."
  const tasks: { text: string; completed: boolean }[] = [];
  const taskLines = (sections["tasks"] || "").split("\n");
  for (const tl of taskLines) {
    const taskMatch = tl.match(/^- \[(x| )\]\s*(.+)/);
    if (taskMatch) {
      tasks.push({
        completed: taskMatch[1] === "x",
        text: taskMatch[2].trim(),
      });
    }
  }

  // Parse skills tested
  const skillsTested: string[] = [];
  const skillLines = (sections["skills tested"] || "").split("\n");
  for (const sl of skillLines) {
    const skillMatch = sl.match(/^- (.+)/);
    if (skillMatch) {
      skillsTested.push(skillMatch[1].trim());
    }
  }

  // Parse verification criteria as HTML table
  const verificationMd = sections["verification criteria"] || "";
  const verificationHtml = marked.parse(verificationMd, {
    async: false,
  }) as string;

  // Parse result section
  const resultSection = sections["result"] || "";
  const statusMatch = resultSection.match(/\*\*Status:\*\*\s*(.+)/);
  const dateCompletedMatch = resultSection.match(
    /\*\*Date(?:\s+Completed)?:\*\*\s*(.+)/,
  );
  const notesMatch = resultSection.match(/\*\*Notes:\*\*\s*([\s\S]*)/);
  const result = {
    status: statusMatch?.[1]?.trim() || "NOT STARTED",
    date: dateCompletedMatch?.[1]?.trim() || "",
    notes: notesMatch?.[1]?.trim() || "",
  };

  return {
    id,
    number,
    filename,
    title,
    domain,
    difficulty,
    dateAssigned,
    scenario,
    tasks,
    skillsTested,
    verificationHtml,
    result,
  };
}

export function getAllLabs(): Lab[] {
  const files = fs
    .readdirSync(LABS_DIR)
    .filter((f) => f.startsWith("lab-") && f.endsWith(".md"))
    .sort();
  return files.map(parseLabFile);
}

export function getLabById(id: string): Lab | undefined {
  const paddedId = id.padStart(2, "0");
  const files = fs.readdirSync(LABS_DIR);
  const file = files.find((f) => f.match(new RegExp(`^lab-${paddedId}-`)));
  if (!file) return undefined;
  return parseLabFile(file);
}

export function getLabSummaries(): LabSummary[] {
  const labs = getAllLabs();
  return labs.map((lab) => ({
    id: lab.id,
    number: lab.number,
    topic: lab.title.replace(/^Lab \d+\s*[—–-]\s*/, ""),
    domain: lab.domain,
    difficulty: lab.difficulty,
    status: lab.result.status,
  }));
}

export interface DomainStats {
  domain: string;
  total: number;
  passed: number;
}

export function getDomainStats(): DomainStats[] {
  const labs = getAllLabs();
  const domainMap = new Map<string, { total: number; passed: number }>();
  for (const lab of labs) {
    const existing = domainMap.get(lab.domain) || { total: 0, passed: 0 };
    existing.total++;
    if (lab.result.status.startsWith("PASSED")) existing.passed++;
    domainMap.set(lab.domain, existing);
  }
  return Array.from(domainMap.entries()).map(([domain, stats]) => ({
    domain,
    ...stats,
  }));
}

export function getOverallStats() {
  const labs = getAllLabs();
  const total = labs.length;
  const passed = labs.filter((l) =>
    l.result.status.startsWith("PASSED"),
  ).length;
  const skipped = labs.filter((l) =>
    l.result.status.startsWith("SKIPPED"),
  ).length;
  const remaining = total - passed - skipped;
  const percentage = Math.round((passed / total) * 100);
  return { total, passed, skipped, remaining, percentage };
}

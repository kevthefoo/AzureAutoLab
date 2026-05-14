export function extractBashBlock(
  markdown: string,
  sectionTitle: string,
): string | null {
  const lines = markdown.split("\n");
  let inSection = false;
  let inBashBlock = false;
  const collected: string[] = [];

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (inSection) return null;
      inSection = heading[1].trim() === sectionTitle;
      continue;
    }

    if (!inSection) continue;

    if (!inBashBlock) {
      if (line.trim() === "```bash") {
        inBashBlock = true;
      }
      continue;
    }

    if (line.trim() === "```") {
      return collected.join("\n").trim();
    }

    collected.push(line);
  }

  return null;
}

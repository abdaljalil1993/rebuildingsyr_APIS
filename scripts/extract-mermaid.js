const fs = require("fs");
const path = require("path");

function sanitizeName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getNearestHeading(content, matchIndex) {
  const before = content.slice(0, matchIndex);
  const lines = before.split(/\r?\n/);

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i].trim();
    const headingMatch = line.match(/^#{2,6}\s+(.+)$/);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }

  return "diagram";
}

function main() {
  const inputPath = process.argv[2];
  const outputDir = process.argv[3] || "docs/diagram-src";

  if (!inputPath) {
    console.error("Usage: node scripts/extract-mermaid.js <input-markdown> [output-dir]");
    process.exit(1);
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(inputPath, "utf8");
  const regex = /```mermaid\s*([\s\S]*?)```/g;

  fs.mkdirSync(outputDir, { recursive: true });

  const existing = fs.readdirSync(outputDir).filter((file) => file.endsWith(".mmd"));
  for (const file of existing) {
    fs.unlinkSync(path.join(outputDir, file));
  }

  let match;
  let index = 0;
  const manifest = [];

  while ((match = regex.exec(content)) !== null) {
    index += 1;
    const body = (match[1] || "").trim();
    const heading = getNearestHeading(content, match.index);
    const slug = sanitizeName(heading || `diagram-${index}`) || `diagram-${index}`;
    const fileName = `${String(index).padStart(2, "0")}-${slug}.mmd`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, `${body}\n`, "utf8");

    manifest.push({
      index,
      heading,
      fileName
    });
  }

  const manifestPath = path.join(outputDir, "manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`Extracted ${index} Mermaid diagrams to ${outputDir}`);
  console.log(`Manifest: ${manifestPath}`);
}

main();

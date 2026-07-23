const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function resolveMmdcPath() {
  const windowsCandidate = path.join("node_modules", ".bin", "mmdc.cmd");
  const unixCandidate = path.join("node_modules", ".bin", "mmdc");

  if (fs.existsSync(windowsCandidate)) {
    return windowsCandidate;
  }

  if (fs.existsSync(unixCandidate)) {
    return unixCandidate;
  }

  return null;
}

function main() {
  const inputDir = process.argv[2] || "docs/diagram-src";
  const outputDir = process.argv[3] || "docs/diagram-images";
  const format = (process.argv[4] || "png").toLowerCase();

  if (!["png", "svg"].includes(format)) {
    console.error("Format must be either 'png' or 'svg'.");
    process.exit(1);
  }

  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`);
    process.exit(1);
  }

  const mmdcPath = resolveMmdcPath();
  if (!mmdcPath) {
    console.error("Mermaid CLI is not installed. Run: npm install -D @mermaid-js/mermaid-cli");
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith(".mmd"))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.error(`No .mmd files found in ${inputDir}.`);
    process.exit(1);
  }

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.mmd$/i, `.${format}`));

    const cmd = `"${mmdcPath}" -i "${inputPath}" -o "${outputPath}"`;
    execSync(cmd, { stdio: "inherit", shell: true });
  }

  console.log(`Exported ${files.length} diagrams to ${outputDir} as ${format.toUpperCase()}.`);
}

main();

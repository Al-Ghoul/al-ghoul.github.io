import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Error: No tag slug provided.\nUsage: npm run new-tag -- <slug>");
  process.exit(1);
}

const slug = args[0];
const targetDir = "./src/data/tags/";
const fullPath = path.join(targetDir, `${slug}.md`);

if (fs.existsSync(fullPath)) {
  console.error(`❌ Error: File ${fullPath} already exists.`);
  process.exit(1);
}

const content = `---
name: "${slug}"
description: ""
---
`;

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(fullPath, content.trim() + "\n");
console.log(`✅ Tag created at: ${fullPath}`);

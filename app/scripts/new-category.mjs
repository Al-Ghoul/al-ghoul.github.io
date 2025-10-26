import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Error: No category slug provided.\nUsage: npm run new-category -- <slug>");
  process.exit(1);
}

const slug = args[0];
const targetDir = "./src/data/categories/";
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
console.log(`✅ Category created at: ${fullPath}`);

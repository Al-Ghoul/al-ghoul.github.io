import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("❌ Error: Missing arguments.\nUsage: npm run new-series -- <slug> <lang>");
  process.exit(1);
}

const slug = args[0];
const lang = args[1].toLowerCase();

if (!["en", "ar"].includes(lang)) {
  console.error("❌ Error: Invalid language. Use 'en' or 'ar'.");
  process.exit(1);
}

const targetDir = "./src/data/series/";
const fullPath = path.join(targetDir, `${slug}.md`);

if (fs.existsSync(fullPath)) {
  console.error(`❌ Error: File ${fullPath} already exists.`);
  process.exit(1);
}

const content = `---
name: "${slug}"
description: ""
lang: "${lang}"
---
`;

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(fullPath, content.trim() + "\n");
console.log(`✅ Series created at: ${fullPath}`);

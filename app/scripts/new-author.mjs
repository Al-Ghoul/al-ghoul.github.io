import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Error: No author slug provided.\nUsage: npm run new-author -- <slug>");
  process.exit(1);
}

const slug = args[0];
const targetDir = "./src/data/authors/";
const fullPath = path.join(targetDir, `${slug}.md`);

if (fs.existsSync(fullPath)) {
  console.error(`❌ Error: File ${fullPath} already exists.`);
  process.exit(1);
}

const content = `---
name:
  en: "${slug}"
  ar: "${slug}"
bio:
  en: ""
  ar: ""
avatar: ""
website: ""
socials:
  twitter: ""
  github: ""
  linkedin: ""
  youtube: ""
  facebook: ""
  instagram: ""
---
`;

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(fullPath, content.trim() + "\n");
console.log(`✅ Author created at: ${fullPath}`);

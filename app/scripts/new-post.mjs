import fs from "fs";
import path from "path";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(`❌ Error: No filename argument provided.
Usage: npm run new-post -- <filename>`);
  process.exit(1);
}

let fileName = args[0];
const fileExtensionRegex = /\.(md|mdx)$/i;

// Default to .mdx (matches your loader)
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".mdx";
}

const targetDir = "./src/data/posts/";
const fullPath = path.join(targetDir, fileName);

// Prevent overwriting existing posts
if (fs.existsSync(fullPath)) {
  console.error(`❌ Error: File ${fullPath} already exists.`);
  process.exit(1);
}

// Schema-aligned front matter
const content = `---
title: "${path.basename(fileName, path.extname(fileName))}"
author: "abdulrahman"              # reference("authors")
publishedAt: ${getDate()}
updatedAt:
description: ""
coverImage: ""
lang: "ar"                         # or "en"
category: "general"                # reference("categories")
tags: []                           # array of reference("tags")
series:                            # reference("series")
seriesIndex:
relatedPosts: []                   # array of reference("posts")
draft: false
---
`;

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(fullPath, content.trim() + "\n");

console.log(`✅ Post created at: ${fullPath}`);

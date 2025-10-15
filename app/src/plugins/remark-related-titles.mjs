import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function remarkRelatedTitles() {
  return function transformer(_tree, file) {
    const frontmatter = file.data.astro?.frontmatter;
    if (!frontmatter?.relatedPosts?.length) return;

    const postsDir = path.resolve('./src/data/posts');
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    // Build a map: fileName (without extension) -> title
    const postMap = {};
    files.forEach(f => {
      const content = fs.readFileSync(path.join(postsDir, f), 'utf-8');
      const { data } = matter(content);

      const id = f.replace(/\.(md|mdx)$/, '');
      const title = data.title ?? id;

      postMap[id] = title;
    });

    // Replace relatedPosts strings with objects {id, title}
    frontmatter.relatedPosts = frontmatter.relatedPosts.map(id => ({
      id,
      title: postMap[id] ?? id
    }));
  };
}

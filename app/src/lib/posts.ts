import { getCollection } from "astro:content";
import { remark } from "remark";
import strip from "strip-markdown";

export async function getTagCounts() {
  const posts = await getCollection("posts");
  const map = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (!tag?.id) continue;
      const key = tag.id.toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return Array.from(map.entries()).map(([id, count]) => ({
    id,
    count,
  }));
}

export async function getCategoryCounts() {
  const posts = await getCollection("posts");
  const map = new Map<string, number>();

  for (const post of posts) {
    const category = post.data.category;
    if (!category?.id) continue;
    const key = category.id.toLowerCase();
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([id, count]) => ({
    id,
    count,
  }));
}

export type Tags = Awaited<ReturnType<typeof getTagCounts>>;
export type Categories = Awaited<ReturnType<typeof getCategoryCounts>>;

export async function generateExcerptFromMarkdown(markdown: string, maxLength = 160) {
  const text = String((await remark().use(strip).process(markdown))).replace(/\s+/g, " ").trim();
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

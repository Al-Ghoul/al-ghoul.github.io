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

export async function getPrevNextForPost(slug: string, locale = "ar") {
  const posts = await getCollection("posts")
    .then(p => p.filter(p => !p.data.draft))
    .then(p => p.filter(p => p.data.lang === locale));
  const post = posts.find(p => p.id === slug);
  if (!post) return { prevPost: null, nextPost: null };

  // Series navigation 
  if (post.data.series) {
    const seriesPosts = posts
      .filter(p => p.data.series === post.data.series && !p.data.draft)
      .sort((a, b) => (a.data.seriesIndex ?? 0) - (b.data.seriesIndex ?? 0));

    const index = seriesPosts.findIndex(p => p.id === slug);
    const prevPost = index > 0 ? seriesPosts[index - 1] : null;
    const nextPost = index < seriesPosts.length - 1 ? seriesPosts[index + 1] : null;

    return { prevPost, nextPost };
  }

  // Fallback chronological navigation
  const sortedPosts = posts
    .filter(p => !p.data.draft)
    .sort((a, b) => new Date(a.data.publishedAt).getTime() - new Date(b.data.publishedAt).getTime());

  const currentIndex = sortedPosts.findIndex(p => p.id === slug);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  return { prevPost, nextPost };
}

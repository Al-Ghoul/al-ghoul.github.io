import { getCollection } from "astro:content";
import { remark } from "remark";
import strip from "strip-markdown";

export async function getTagCounts(locale = "ar") {
  const posts = await getCollection("posts")
    .then(p => p.filter(p => !p.data.draft))
    .then(p => p.filter(p => p.data.lang === locale));
  const tagsCollection = await getCollection("tags");
  const map = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (!tag?.id) continue;
      const key = tag.id.toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return Array.from(map.entries()).map(([id, count]) => {
    const tagData = tagsCollection.find(t => t.id.toLowerCase() === id);
    return {
      id,
      count,
      name: tagData?.data.name
    };
  });
}

export async function getCategoryCounts(locale = "ar") {
  const posts = await getCollection("posts")
    .then(p => p.filter(p => !p.data.draft))
    .then(p => p.filter(p => p.data.lang === locale));
  const categoriesCollection = await getCollection("categories");
  const map = new Map<string, number>();

  for (const post of posts) {
    const category = post.data.category;
    if (!category?.id) continue;
    const key = category.id.toLowerCase();
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([id, count]) => {
    const categoryData = categoriesCollection.find(c => c.id.toLowerCase() === id);
    return {
      id,
      count,
      name: categoryData?.data.name
    };
  });
}

export async function getSeriesCounts(locale = "ar") {
  const posts = await getCollection("posts")
    .then(p => p.filter(p => !p.data.draft))
    .then(p => p.filter(p => p.data.lang === locale));
  const seriesCollection = await getCollection("series");
  const map = new Map<string, number>();

  for (const post of posts) {
    const series = post.data.series;
    if (!series?.id) continue;
    const key = series.id.toLowerCase();
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  
  return Array.from(map.entries()).map(([id, count]) => {
    const seriesData = seriesCollection.find(s => s.id.toLowerCase() === id);
    return {
      id,
      count,
      name: seriesData?.data.name
    };
  });
}

export type Tags = Awaited<ReturnType<typeof getTagCounts>>;
export type Categories = Awaited<ReturnType<typeof getCategoryCounts>>;
export type Series = Awaited<ReturnType<typeof getSeriesCounts>>;

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

export type SearchablePost = {
  url: string;
  title: string;
  description: string;
  content: string | undefined;
  lang: string;
  tags: string[];
};


export async function getSearchablePosts(): Promise<SearchablePost[]> {
  const posts = await getCollection('posts');

  return posts
    .filter(post => !post.data.draft)
    .map(post => ({
      url: `${post.data.lang == "en" ? "/en" : ""}/posts/${post.id}`, // adjust if needed
      title: post.data.title,
      description: post.data.description,
      content: post.body,
      lang: post.data.lang,
      tags: post.data.tags.map(t => t.id), // if using references
    }));
}

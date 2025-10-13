import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/posts" }),
  schema: z.object({
    title: z.string(),
    author: reference("authors"),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    description: z.string(),
    coverImage: z.string(),
    lang: z.enum(["en", "ar"]),
    category: reference("categories"),
    tags: z.array(reference("tags")),
    series: z.string().optional(),         // series name
    seriesIndex: z.number().optional(),    // position in series
    relatedPosts: z.array(reference("posts")),
    draft: z.boolean(),
  })
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/authors" }),
  schema: z.object({
    name: z.string(),
  })
});

const tags = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/tags" }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    color: z.string().optional(),     // e.g., “#ff9900”
    slug: z.string().optional(),      // fallback if you want pretty URLs
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/categories" }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    slug: z.string().optional(),
  }),
});

export const collections = { posts, authors, tags, categories };

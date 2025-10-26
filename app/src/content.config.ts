import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const LANGUAGES = ["en", "ar"] as const;

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/posts" }),
  schema: z.object({
    title: z.string(),
    author: reference("authors"),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    description: z.string(),
    coverImage: z.string(),
    lang: z.enum(LANGUAGES),
    category: reference("categories"),
    tags: z.array(reference("tags")),
    series: reference("series").optional(),
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
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/categories" }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/series" }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    lang: z.enum(LANGUAGES),
  }),
});

export const collections = { posts, authors, tags, categories, series };

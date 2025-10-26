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
    name: z.object({
      en: z.string(),
      ar: z.string(),
    }),
    bio: z.object({
      en: z.string().optional(),
      ar: z.string().optional(),
    }),
    avatar: z.string().optional(),
    website: z.string().url().optional(),
    socials: z
      .object({
        twitter: z.string().url().optional(),
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        youtube: z.string().url().optional(),
        facebook: z.string().url().optional(),
        instagram: z.string().url().optional(),
      })
      .partial()
      .optional(),
  }),
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

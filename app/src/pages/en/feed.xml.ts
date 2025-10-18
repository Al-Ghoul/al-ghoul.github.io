import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET() {
  const posts = (await getCollection("posts"))
    .filter((post) => !post.data.draft)
    .filter((post) => post.data.lang == "en");

  return rss({
    title: "Abdulrahman AlGhoul's Blog",
    description: "A developer's blog that's meant to be creative, inspirational, educational, and to list my portfolio projects.",
    site: "https://al-ghoul.github.io/en",
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `en/posts/${post.id}`,
      pubDate: post.data.publishedAt,
      content: post.body,
    })),
    stylesheet: "/rss/pretty-feed-v3.xsl",
    customData: "<language>en</language>",
  });
}

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET() {
  const posts = (await getCollection("posts"))
    .filter((post) => !post.data.draft)
    .filter((post) => post.data.lang == "ar");

  return rss({
    title: "مدونة عبد الرحمن الاغول",
    description: "مدونة للمطورين تهدف إلى أن تكون إبداعية، ملهمة و تعليمية، بالإضافة إلى إدراج مشاريعي.",
    site: "https://al-ghoul.github.io",
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `posts/${post.id}`,
      pubDate: post.data.publishedAt,
      content: post.body,
    })),
    stylesheet: "/rss/ar-pretty-feed-v3.xsl",
    customData: "<language>ar</language>",
  });
}

import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { remark } from "remark";
import strip from "strip-markdown";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: false },
    date: { type: "date", required: true },
    description: { type: "string" },
    cover: { type: "string" },
    draft: { type: "boolean", default: false },
    lang: { type: "string", default: "en" },
    category: { type: "string" },
    tags: { type: "list", of: { type: "string" }, default: [] },
    series: { type: "string", required: false },         // series name
    seriesIndex: { type: "number", required: false },    // position in series
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/posts/${doc._raw.flattenedPath}`,
    },
    excerpt: {
      type: "string",
      resolve: async (doc) => {
        const raw = doc.body.raw
        const processed = await remark().use(strip).process(raw)
        const text = String(processed).replace(/\s+/g, " ").trim()
        return text.length > 160 ? text.slice(0, 160) + "…" : text
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "content/posts",
  documentTypes: [Post],
});

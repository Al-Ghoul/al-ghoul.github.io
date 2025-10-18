import { toString } from "mdast-util-to-string";
import strip from "strip-markdown";
import { remark } from "remark";

/**
 * Remark plugin that generates a short excerpt from Markdown content
 * and adds it to frontmatter as `excerpt`.
 */
export function remarkExcerpt() {
  return async function(tree, { data }) {
    const maxLength = 160;
    const raw = toString(tree);

    const processed = await remark().use(strip).process(raw);
    const text = String(processed).replace(/\s+/g, " ").trim();

    // Generate excerpt
    const excerpt =
      text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

    if (!data.astro.frontmatter.excerpt) {
      data.astro.frontmatter.excerpt = excerpt;
    }
  };
}

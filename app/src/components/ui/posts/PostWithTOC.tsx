import type { CollectionEntry } from "astro:content";
import PostContent from "./PostContent";
import TableOfContents, { type MarkdownHeading } from "./TableOfContents";
import RelatedPostsSidebar from "./RelatedPostsSidebar";

interface Props {
  post: CollectionEntry<"posts"> & { frontmatter: Record<string, any> };
  headings: MarkdownHeading[];
  locale?: "en" | "ar";
  children?: React.ReactNode;
  author: CollectionEntry<"authors">;
  prevPost: CollectionEntry<"posts"> | null;
  nextPost: CollectionEntry<"posts"> | null;
}

export default function PostWithTOC({
  post,
  headings,
  locale = "ar",
  children,
  author,
  prevPost,
  nextPost,
}: Props) {
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <aside className="hidden xl:block sticky top-24 shrink-0 w-64 self-start">
        <TableOfContents
          headings={headings}
          lang={post.data.lang}
          className="p-2 bg-white/90 dark:bg-black/90 rounded-md border border-amber-600"
        />
        <RelatedPostsSidebar locale={locale} className="mt-4" posts={post.frontmatter.relatedPosts} />
      </aside>

      <PostContent post={post} author={author} locale={locale} prevPost={prevPost} nextPost={nextPost}>
        {children}
      </PostContent>
    </div>
  );
}

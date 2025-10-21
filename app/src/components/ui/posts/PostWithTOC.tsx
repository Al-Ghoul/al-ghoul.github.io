import type { CollectionEntry } from "astro:content";
import PostContent from "./PostContent";
import TableOfContents, { type MarkdownHeading } from "./TableOfContents";
import RelatedPostsSidebar from "./RelatedPostsSidebar";

interface Props {
  post: CollectionEntry<"posts"> & { frontmatter: Record<string, any> };
  headings: MarkdownHeading[],
  locale?: string,
  children?: React.ReactNode
  prevPost: CollectionEntry<"posts"> | null;
  nextPost: CollectionEntry<"posts"> | null;
}

export default function PostWithTOC({
  post,
  headings,
  locale = "ar",
  children,
  prevPost,
  nextPost,
}: Props) {
  return (
    <>
      <aside className="hidden xl:block sticky top-24 shrink-0 w-64 self-start">
        <TableOfContents
          headings={headings}
          lang={post.data.lang}
          className="p-2 bg-white/90 dark:bg-black/90 rounded-md border border-amber-600"
        />
        <RelatedPostsSidebar locale={locale} className="mt-4" posts={post.frontmatter.relatedPosts} />
      </aside>

      <PostContent post={post} locale={locale} prevPost={prevPost} nextPost={nextPost}>
        {children}
      </PostContent>
    </>
  );
}

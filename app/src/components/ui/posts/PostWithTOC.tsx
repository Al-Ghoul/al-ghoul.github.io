import type { CollectionEntry } from "astro:content";
import PostContent from "./PostContent";
import TableOfContents, { type MarkdownHeading } from "./TableOfContents";

interface Props {
  post: CollectionEntry<"posts">;
  headings: MarkdownHeading[],
  locale?: string,
  children?: React.ReactNode
}

export default function PostWithTOC({ post, headings, locale = "ar", children }: Props) {
  return (
    <>
      <aside className="hidden xl:block sticky top-24 shrink-0 w-64 self-start">
        <TableOfContents
          headings={headings}
          lang={post.data.lang}
          className="p-2 bg-white/10 dark:bg-black/10 rounded-md border border-amber-600"
        />
      </aside>

      <PostContent post={post} locale={locale}>
        {children}
      </PostContent>
    </>
  );
}

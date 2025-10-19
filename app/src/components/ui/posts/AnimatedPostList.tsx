
import { motion } from "motion/react";
import { PostCard } from "./PostCard";
import type { CollectionEntry } from "astro:content";

export default function AnimatedPostList({
  locale = "ar",
  postsWithExcerpts
}: {
  postsWithExcerpts: Array<CollectionEntry<"posts"> & { excerpt: string }>;
  locale?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {postsWithExcerpts.map((post, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.15,
            type: "spring",
            stiffness: 120,
            damping: 16,
          }}
        >
          <PostCard post={post} locale={locale} />
        </motion.div>
      ))}
    </div>
  );
}


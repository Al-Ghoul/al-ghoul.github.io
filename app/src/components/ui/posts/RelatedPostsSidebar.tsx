import { cn } from "@lib/utils";
import { motion } from "motion/react";

export interface RelatedPost {
  id: string;
  title: string;
}

export interface RelatedPostsSidebarProps {
  posts: RelatedPost[];
  locale?: string;
  className?: string;
}

export default function RelatedPostsSidebar({ posts, locale = "ar", className }: RelatedPostsSidebarProps) {
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  if (!posts.length) return null;

  return (
    <motion.nav
      dir={TEXT_DIRECTION}
      className={cn("p-4 bg-white/90 dark:bg-black/90 rounded-md border border-amber-600", className)}
      initial={{
        transform: "translate3d(0, 80px, 0) scale(0.9) skewY(5deg)",
        opacity: 0
      }}
      animate={{
        transform: "translate3d(0, 0, 0) scale(1) skewY(0deg)",
        opacity: 1
      }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <h3 className="mb-2 font-semibold text-lg">{locale == "ar" ? "مقالات ذات صلة" : "Related Posts"}</h3>
      <ul className="space-y-1">
        {posts.map((post, idx) => (
          <motion.li
            key={post.id}
            className={cn("", locale === "ar" ? "mr-4" : "ml-4")}
            initial={{ transform: "translate3d(0, 40px, 0)", opacity: 0 }}
            animate={{ transform: "translate3d(0, 0, 0)", opacity: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              layout
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <a
                href={`${locale == "en" ? "/en" : ""}/posts/${post.id}`}
                className="relative block px-1 py-0.5 rounded hover:scale-105 hover:-translate-x-2 transition duration-200"
              >
                {post.title}
                <motion.span
                  layoutId={`highlight-${post.id}`}
                  className="absolute inset-0 rounded bg-black/10 dark:bg-white/10 -z-1"
                />
              </a>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}

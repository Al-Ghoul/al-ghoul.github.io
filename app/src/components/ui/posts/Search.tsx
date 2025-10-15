import { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import { IconSearch } from "@tabler/icons-react";
import { motion } from "motion/react";
import type { SearchablePost } from "@lib/posts";

export default function Search({ isOpen, setIsOpen, searchablePosts }: SearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = new Fuse(searchablePosts, {
    keys: ["title", "description", "tags", "content"],
    threshold: 0.3, 
  });

  const filtered: SearchablePost[] = query ? fuse.search(query).map(r => r.item) : [];

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <motion.div
      animate={{ width: isOpen ? "220px" : "28px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative"
    >
      {isOpen ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="p-2 w-full rounded-md focus:border"
          />
          {query && (
            filtered.length > 0 ? (
              <div className="absolute left-0 mt-1 w-full bg-white dark:bg-black/80 rounded border-2 z-50">
                {filtered.map((post) => (
                  <article key={post.url} className="p-2" dir={post.lang === "ar" ? "rtl" : "ltr"}>
                    <h2 className="font-medium">
                      <a href={post.url}>{post.title}</a>
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {post.description}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="absolute left-0 mt-1 w-full p-2 text-sm text-neutral-500 bg-white dark:bg-black/80 rounded border-2 z-50">
                No results found.
              </p>
            )
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <IconSearch className="w-5 h-5 text-black dark:text-white" />
        </button>
      )}
    </motion.div>
  );
}

interface SearchProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchablePosts: SearchablePost[];
}


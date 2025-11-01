import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export interface MarkdownHeading {
  depth: number;
  text: string;
  slug: string;
}

export interface TOCProps {
  headings: MarkdownHeading[];
  lang: string;
  className?: string;
}

export default function TableOfContents({ headings, lang = "en", className }: TOCProps) {
  const tocRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const minDepth = headings.length ? Math.min(...headings.map(h => h.depth)) : 1;

  useEffect(() => {
    const headingElements = headings
      .map(h => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[];

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px", threshold: 0 }
    );

    headingElements.forEach(el => observer.observe(el));

    return () => headingElements.forEach(el => observer.unobserve(el));
  }, [headings]);

  const isRTL = lang === "ar";

  return (
    <motion.nav
      ref={tocRef}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${className ?? ""} text-sm`}
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
      <ul className="space-y-1">
        {headings.map((heading, idx) => (
          <motion.li
            key={`${heading.slug}-${idx}`}
            className={`${isRTL
              ? `mr-${(heading.depth - minDepth) * 4}`
              : `ml-${(heading.depth - minDepth) * 4}`
              }`}
            initial={{ transform: "translate3d(0, 40px, 0)", opacity: 0 }}
            animate={{ transform: "translate3d(0, 0, 0)", opacity: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <a
                onClick={handleClick(heading.slug)}
                href={`#${heading.slug}`}
                className={`relative block px-1 py-0.5 rounded ${activeSlug === heading.slug
                  ? "font-bold text-background"
                  : "hover:scale-105 hover:-translate-x-10 transition duration-200 text-background dark:text-foreground"
                  }`}
              >
                {heading.text}

                {activeSlug === heading.slug && (
                  <motion.span
                    layoutId="highlight"
                    className="absolute inset-0 rounded bg-black/50 dark:bg-white/50 -z-1"
                  />
                )}
              </a>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}

const handleClick = (slug: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  const el = document.getElementById(slug);
  if (el) {
    const yOffset = -90;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });

    const newUrl = `${window.location.pathname}#${slug}`;
    window.history.pushState(null, "", newUrl);
  }
};

import type { CollectionEntry } from "astro:content";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function Timeline({
  data,
  description,
  locale = "ar",
}: {
  data: CollectionEntry<"posts">[];
  description?: string;
  locale?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll();
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      className="w-full bg-white:/50 dark:bg-black/50 font-sans md:px-10 border rounded-md"
      ref={containerRef}
      initial={{
        x: 100,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{ x: 50 }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10" dir={TEXT_DIRECTION}>
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          {locale == "ar" ? "جدول زمني" : "Timeline"}
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          {description ? description : locale == "ar" ? "هنا يمكن جدول زمني لرحلتي." : "Here's a timeline of my journey."}
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20" dir={TEXT_DIRECTION}>
        {data.map((post, index) => (
          <div
            key={index}
            className="flex pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 rtl:right-2 rtl:md:right-2 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 rtl:md:pr-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                {locale == "ar" ?
                  format(post.data.publishedAt, "d، LLLL yyyy", { locale: ar })
                  :
                  format(post.data.publishedAt, "LLLL d, yyyy")}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {locale == "ar" ?
                  format(post.data.publishedAt, "d، LLLL yyyy", { locale: ar })
                  :
                  format(post.data.publishedAt, "LLLL d, yyyy")}
              </h3>
              {
                <article className="flex flex-col gap-y-2" >
                  <h2 className="text-xl font-semibold">
                    <a href={`${post.data.lang == "en" ? "/en" : ""}/posts/${post.id}`}>{post.data.title}</a>
                  </h2>
                  <p className="text-sm text-muted-foreground">{post.data.description}</p>
                  <a href={`${post.data.lang == "en" ? "/en" : ""}/posts/${post.id}`} className="text-primary hover:underline">
                    {locale == "ar" ? "قراءة المزيد ←" : "Read more →"}
                  </a>
                </article>
              }
            </div>
          </div>
        ))}

        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 rtl:md:right-7 rtl:right-7 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-yellow-200 dark:via-yellow-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{ height: fillHeight }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-yellow-500 via-orange-500 to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
};

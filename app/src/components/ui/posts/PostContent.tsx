import { cn } from "@lib/utils";
import {
  motion,
} from "motion/react";
import { format } from 'date-fns'
import type { CollectionEntry } from "astro:content";
import { ar } from "date-fns/locale";

interface PostContentProps {
  post: CollectionEntry<"posts">;
  className?: string;
  locale: string;
  children?: React.ReactNode;
  prevPost: CollectionEntry<"posts"> | null;
  nextPost: CollectionEntry<"posts"> | null;
}

export default function PostContent({
  post,
  className,
  locale = "ar",
  children,
  prevPost,
  nextPost
}: PostContentProps) {
  const TEXT_DIRECTION = post.data.lang === "ar" ? "rtl" : "ltr";

  return (
    <motion.article
      className={cn(
        "prose prose-zinc prose-invert font-jetbrains [font-variant-ligatures:none] p-4 max-w-4xl py-8 bg-white/5 dark:bg-black/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg border mdx-content custom-md",
        className
      )}
      initial={{
        y: 50,
        opacity: 0,
        transform: "translate3d(0, 80px, 0) scale(0.9) skewY(-5deg)",
      }}
      animate={{
        y: -55,
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1) skewY(0deg)",
      }}
      exit={{ y: 50 }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="mb-8 text-center">
        <time dateTime={post.data.publishedAt.toDateString()} className="block text-xs text-muted-foreground" dir={TEXT_DIRECTION}>
          {locale == "ar" ?
            format(post.data.publishedAt, "d, LLLL yyyy", { locale: ar })
            :
            format(post.data.publishedAt, "LLLL d, yyyy")}
        </time>

        <h1 className="text-3xl font-bold mt-1" dir={TEXT_DIRECTION}>{post.data.title}</h1>

        {post.data.tags?.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {post.data.tags.map(({ id }) => (
              <span
                key={id}
                className="px-2 py-0.5 rounded-full bg-secondary/30 font-medium text-xs"
              >
                #{id}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          {post.data.category ? (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-xs">
              {post.data.category.id}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          {/* @ts-ignore */}
          <span dir={TEXT_DIRECTION}>{i18nMinutes(post.frontmatter.minutes, locale)}</span> |
          {/* @ts-ignore */}
          <span>{post.frontmatter.words} {locale == "ar" ? "عدد الكلمات" : "words"}</span>
        </div>
      </div>


      <div dir={post.data.lang === "ar" ? "rtl" : "ltr"} lang={post.data.lang}>
        {children}
      </div>

      <div className="mt-12">
        {prevPost && <a className="float-left" href={prevPost.id}>← {prevPost.data.title}</a>}
        {nextPost && <a className="float-right" href={nextPost.id}>{nextPost.data.title} →</a>}
      </div>
    </motion.article>
  )
}

function i18nMinutes(count: number, locale: string = "en"): string {
  const n = Math.floor(Number(count) || 0);
  const formattedNumber = new Intl.NumberFormat(locale).format(n);

  const pr = new Intl.PluralRules(locale);
  const category = pr.select(n) as Intl.LDMLPluralRule;

  type PluralCategory = Intl.LDMLPluralRule;
  type LocaleMessages = Record<PluralCategory | "other", string>;

  const messages: Record<string, LocaleMessages> & { _default: LocaleMessages } = {
    // @ts-ignore
    en: { one: "minute", other: "minutes" },
    ar: {
      zero: "دقيقة",
      one: "دقيقة",
      two: "دقيقتان",
      few: "دقائق",
      many: "دقيقة",
      other: "دقيقة"
    },
    // @ts-ignore
    _default: { one: "minute", other: "minutes" }
  };

  const localeMsgs =
    messages[locale] || messages[locale.split("-")[0]] || messages._default;
  const label = localeMsgs[category] ?? localeMsgs.other ?? localeMsgs.one;

  // Arabic special handling: omit number for 0–2
  if (locale.startsWith("ar")) {
    if (n === 0) return "لا دقائق";     // “no minutes”
    if (n === 1) return label;           // “دقيقة”
    if (n === 2) return label;           // “دقيقتين”
    return `${formattedNumber} ${label}`; // “٣ دقائق”
  }

  return `${formattedNumber} ${label}`;
}

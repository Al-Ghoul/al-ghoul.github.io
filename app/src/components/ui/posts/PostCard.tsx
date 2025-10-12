import { format } from "date-fns";
import { CardContainer, CardBody, CardItem } from "../3d-card";
import { ar } from "date-fns/locale";
import type { CollectionEntry } from "astro:content";

export function PostCard(props: { post: CollectionEntry<"posts"> & { excerpt: string }; } & {
  locale: string;
  READ_MORE_TEXT: string;
}) {
  const { locale, post, READ_MORE_TEXT } = props;
  const TEXT_DIRECTION = post.data.lang === "ar" ? "rtl" : "ltr";

  return (
    <CardContainer className="inter-var">
      <CardBody
        className="
          relative group/card
          h-full
          bg-gray-50 dark:bg-black/30 
          dark:border-white/30 border border-black/[0.1]
          w-full xl:w-[50rem] rounded-xl p-6
          transition-transform duration-300
          [transform-style:preserve-3d]
        "
      >
        {/* Title */}
        <CardItem
          translateZ="50"
          className="text-2xl font-bold text-neutral-800 dark:text-white"
          dir={TEXT_DIRECTION}
        >
          <a href={`${locale == "en" ? "/en" : ""}/posts/${post.id}`} className="hover:underline">
            {post.data.title}
          </a>
        </CardItem>

        {/* Date */}
        <CardItem
          as="time"
          translateZ="40"
          className="block text-xs text-neutral-500 dark:text-neutral-400 mt-1"
          dir={TEXT_DIRECTION}
        >
          {locale == "ar" ?
            format(post.data.publishedAt, "d, LLLL yyyy", { locale: ar })
            :
            format(post.data.publishedAt, "LLLL d, yyyy")}
        </CardItem>

        <CardItem
          as="p"
          translateZ="60"
          dir={TEXT_DIRECTION}
          className="text-neutral-600 dark:text-neutral-300 text-sm mt-4"
        >
          {post.excerpt}
        </CardItem>

        <CardItem
          translateZ={60}
          as="div"
          className="mt-6 flex justify-start"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <a
            href={`${locale == "en" ? "/en" : ""}/posts/${post.id}`}
            className="
              inline-block px-4 py-2 
              text-sm font-medium 
              text-white bg-black 
              dark:bg-white dark:text-black 
              rounded-xl 
              transition-transform 
              hover:scale-105 
              shadow-md hover:shadow-lg
            "
          >
            {READ_MORE_TEXT}
          </a>
        </CardItem>

        {/* Cover Image */}
        {post.data.coverImage ? (
          <CardItem translateZ="80" className="w-full mt-6">
            <div className="relative w-full h-56 overflow-hidden rounded-xl">
              <img
                src={post.data.coverImage}
                alt={post.data.title}
                className="object-cover rounded-xl group-hover/card:scale-105 transition-transform duration-500"
              />
            </div>
          </CardItem>
        ) : null}
      </CardBody>
    </CardContainer>
  );
}

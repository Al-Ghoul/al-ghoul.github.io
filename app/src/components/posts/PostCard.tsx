"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Post } from "contentlayer/generated";
import { ar } from "date-fns/locale";
import { useI18nContext } from "@/i18n/i18n-react";

export function PostCard(post: Post) {
  const { locale, LL } = useI18nContext();
  const TEXT_DIRECTION = post.lang === "ar" ? "rtl" : "ltr";

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
          <Link href={post.url} className="hover:underline">
            {post.title}
          </Link>
        </CardItem>

        {/* Date */}
        <CardItem
          as="time"
          translateZ="40"
          className="block text-xs text-neutral-500 dark:text-neutral-400 mt-1"
          dir={TEXT_DIRECTION}
        >
          {format(parseISO(post.date), "LLLL d, yyyy", { locale: locale === "ar" ? ar : undefined })}
        </CardItem>

        {/* Excerpt */}
        {post.excerpt ? (
          <CardItem
            as="p"
            translateZ="60"
            dir={TEXT_DIRECTION}
            className="text-neutral-600 dark:text-neutral-300 text-sm mt-4"
          >
            {post.excerpt}
          </CardItem>
        ) : null}

        {/* Read More Button — moved before the image */}
        <CardItem
          translateZ={60}
          as="div"
          className="mt-6 flex justify-start"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <Link
            href={post.url}
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
            {LL.READ_MORE()}
          </Link>
        </CardItem>

        {/* Cover Image */}
        {post.cover ? (
          <CardItem translateZ="80" className="w-full mt-6">
            <div className="relative w-full h-56 overflow-hidden rounded-xl">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="object-cover rounded-xl group-hover/card:scale-105 transition-transform duration-500"
              />
            </div>
          </CardItem>
        ) : null}
      </CardBody>
    </CardContainer>
  );
}

"use client";
import { PostCard } from "@/components/posts/PostCard";
import SwarmScene from "@/components/SwarmScene";
import { useI18nContext } from "@/i18n/i18n-react";
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns'

export default function Home() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  const { locale, LL } = useI18nContext();
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  return (
    <main className="h-screen">
      <div className="fixed inset-0 -z-10">
        <SwarmScene />
      </div>

      <section className="flex flex-col md:flex-row container justify-center p-4 md:p-8 mx-auto mt-30 md:mt-20 gap-8">
        {/* Main content */}
        <div>
          <h1 className="text-3xl font-bold mb-6" dir={TEXT_DIRECTION}>{LL.BLOG_POSTS()}</h1>
          <div className="space-y-4">
            {posts.slice(0, 2).map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

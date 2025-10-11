import PostsSection from "@/components/posts/PostsSection";
import SwarmScene from "@/components/SwarmScene";
import type { Locales } from "@/i18n/i18n-types";
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns'
import { redirect, RedirectType } from "next/navigation";

export async function generateStaticParams() {
  return ["en", "ar"].map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  if (!isLocale(locale)) {
    redirect("/ar", RedirectType.push)
  }

  return (
    <main className="h-screen">
      <div className="fixed inset-0 -z-10">
        <SwarmScene />
      </div>

      <PostsSection posts={posts} />
    </main>
  );
}

function isLocale(locale: string): locale is Locales {
  return ["ar", "en"].includes(locale);
}

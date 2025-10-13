import { EvervaultCard } from "@components/ui/evervault-card";
import type { Tags, Categories } from "@lib/posts";

export function Sidebar({
  categories,
  tags,
  locale = "ar"
}: {
  categories: Categories;
  tags: Tags;
  locale?: string;
}) {
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  return (
    <aside className="w-64 shrink-0 space-y-8 md:mt-16 mx-auto md:mx-0">
      <EvervaultCard className="rounded-3xl p-0">
        <div className="bg-white/40 dark:bg-black/40 border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-4 relative z-20 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white" dir={TEXT_DIRECTION}>{locale == "ar" ? "الأقسام" : "Categories"}</h2>
          <ul className="space-y-1">
            {categories.map(({ id, count }) => (
              <li key={id} className="flex justify-between">
                <a
                  href={`/categories/${id}/page/1`}
                  className="hover:underline text-neutral-700 dark:text-neutral-200"
                >
                  {id}
                </a>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </EvervaultCard>

      <EvervaultCard className="rounded-3xl p-0">
        <div className="bg-white/40 dark:bg-black/40 border border-black/[0.1] dark:border-white/[0.1] rounded-2xl p-4 relative z-20 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white" dir={TEXT_DIRECTION}>{locale == "ar" ? "البطاقات" : "Tags"}</h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map(({ id, count }) => (
              <li key={id}>
                <a
                  href={`/tags/${id}/page/1`}
                  className="px-2 py-1 rounded-md text-sm hover:bg-gray-700/50 dark:hover:bg-gray-200/20 text-neutral-800 dark:text-neutral-200 transition"
                >
                  {id}{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    ({count})
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </EvervaultCard>
    </aside>
  );
}

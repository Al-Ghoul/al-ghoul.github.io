import { cn } from "@lib/utils";
import type { CollectionEntry } from "astro:content";

interface AuthorCardProps {
  author: CollectionEntry<"authors">;
  locale?: "en" | "ar";
  className?: string;
}

export default function AuthorCard({ author, locale = "ar", className }: AuthorCardProps) {
  const data = author.data;
  const name = data.name?.[locale] ?? data.name?.ar ?? "";
  const bio = data.bio?.[locale] ?? data.bio?.ar ?? "";
  const avatar = data.avatar || "/assets/default-avatar.jpg"; // fallback
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 mb-4 rounded-xl border-b border-gray-600 bg-white/10 dark:bg-black/40 backdrop-blur-sm",
        className
      )}
      dir={dir}
    >
      <img
        src={avatar}
        alt={name}
        className="w-16 h-16 rounded-full border border-amber-500 object-cover"
      />
      <div className="flex-1 text-sm">
        <h3 className="font-semibold text-lg">{name}</h3>
        {bio && <p className="opacity-80 text-sm mt-1 leading-relaxed">{bio}</p>}

        {/* socials */}
        {data.socials && (
          <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
            {Object.entries(data.socials)
              .filter(([_, url]) => !!url)
              .map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline capitalize"
                >
                  {key}
                </a>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

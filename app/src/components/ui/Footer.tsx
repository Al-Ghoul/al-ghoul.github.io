"use client";
import { useI18nContext } from "@/i18n/i18n-react";
import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";
import { lemonBrushFont } from "./resizable-navbar";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { locale, LL } = useI18nContext();
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";
  
  return (
    <footer className="border-t bg-white/30 dark:bg-black/30" dir={TEXT_DIRECTION}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left side - Name/Brand */}
          <div className={cn("text-center md:text-left", { "text-right": TEXT_DIRECTION === "rtl" })}>
            <h3 className={`text-lg font-semibold text-foreground ${lemonBrushFont.className}`}>{LL.AUTHOR_NAME()}</h3>
            <p className="font-extralight">{LL.AUTHOR_ROLE()}</p>
          </div>

          {/* Center - Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Al-Ghoul"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/abdo-alghoul/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/abdo_alghoul"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="mailto:abdo.alghouul@gmail.com"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {LL.RESUME()}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <span className={"font-bold"}>{LL.AUTHOR_NAME()}</span>. {LL.DESCRIPTION()}.
          </p>
        </div>
      </div>
    </footer>
  )
}


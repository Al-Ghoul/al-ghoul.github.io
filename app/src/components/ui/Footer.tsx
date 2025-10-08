import { Github, Linkedin, Twitter, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white/30 dark:bg-black/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left side - Name/Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground">Abdulrahman AlGhoul</h3>
            <p className="text-sm text-muted-foreground">Software Developer & Tech Writer</p>
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
              Resume
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Abdulrahman AlGhoul. Built with Next.js and deployed on Github.
          </p>
        </div>
      </div>
    </footer>
  )
}


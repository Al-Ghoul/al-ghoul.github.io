import {
  NavbarWrapper,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLinkButton,
} from "../resizeable-navbar";
import { useState } from "react";
import { IconBrandGithub } from "@tabler/icons-react";
import type { LanguageSelectorProps } from "../LanguageSelector";
import LanguageSelector from "@components/ui/LanguageSelector";

export function Navbar({
  locale,
  logo,
  navItems,
  githubText,
  languageSelectorProps
}: {
  locale: string;
  logo: string;
  navItems: {
    name: string;
    link: string;
  }[];
  githubText: string;
  languageSelectorProps?: LanguageSelectorProps;
}
) {
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <NavbarWrapper>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo title={logo} />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4 relative z-30">
          <LanguageSelector {...languageSelectorProps} />
          <NavbarLinkButton url="https://github.com/Al-Ghoul/al-ghoul" dir={TEXT_DIRECTION}>
            <IconBrandGithub className="text-white dark:text-black" />
            <span>{githubText}</span>
          </NavbarLinkButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo title={logo} />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <LanguageSelector {...languageSelectorProps} />
            <NavbarLinkButton className="justify-center" url="https://github.com/Al-Ghoul/al-ghoul">
              <IconBrandGithub className="text-white dark:text-black" />
              <span>{githubText}</span>
            </NavbarLinkButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </NavbarWrapper>
  );
}

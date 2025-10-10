"use client";
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
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { IconBrandGithub } from "@tabler/icons-react";
import { useI18nContext } from "@/i18n/i18n-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { LL, locale } = useI18nContext();
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  const navItems = [
    {
      name: LL.HOME(),
      link: "/",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <NavbarWrapper>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4 relative z-30">
          <LanguageSelector />
          <NavbarLinkButton url="https://github.com/Al-Ghoul/al-ghoul">
            <IconBrandGithub className="text-white dark:text-black" />
            <span>{LL.GITHUB_REPOSITORY()}</span>
          </NavbarLinkButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
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
            <LanguageSelector />
            <NavbarLinkButton className="justify-center" url="https://github.com/Al-Ghoul/al-ghoul">
              <IconBrandGithub className="text-white dark:text-black" />
              <span>{LL.GITHUB_REPOSITORY()}</span>
            </NavbarLinkButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </NavbarWrapper>
  );
}



function LanguageSelector() {
  const { LL, locale, setLocale } = useI18nContext();
  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  return (
    <DropdownMenu dir={TEXT_DIRECTION}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{LL.LANGUAGE()}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{LL.PICK_A_LANGUAGE()}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={locale === "ar"}
          onCheckedChange={() => setLocale("ar")}
          dir="rtl"
        >
          العربية
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={locale === "en"}
          onCheckedChange={() => setLocale("en")}
        >
          English
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import FluidCanvas from "@/components/FluidCanvas";
import { Navbar } from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import I18NProvider from "@/components/I18NProvider";
import Preloader from "@/components/PreLoader";
import { loadAllLocalesAsync } from "@/i18n/i18n-util.async";
import { loadedLocales } from "@/i18n/i18n-util";
import type { Locales } from "@/i18n/i18n-types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>): Promise<Metadata> {
  await loadAllLocalesAsync();
  const { locale } = await params as { locale: Locales };
  const LL = loadedLocales;
  const BASE_URL = "https://al-ghoul.github.io";

  return {
    title: {
      template: `%s | ${LL[locale].AUTHOR_NAME}`,
      default: LL[locale].AUTHOR_NAME,
    },
    description: LL[locale].SITE_DESCRIPTION,
    applicationName: LL[locale].APPLICATION_NAME,
    category: "technology",
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    keywords: LL[locale].KEY_WORDS as unknown as string[],
    creator: LL[locale].AUTHOR_NAME,
    publisher: LL[locale].AUTHOR_NAME,
    authors: [{ name: LL[locale].AUTHOR_NAME }],
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title: LL[locale].AUTHOR_NAME,
      description: LL[locale].SITE_DESCRIPTION,
      type: "website",
      siteName: LL[locale].AUTHOR_NAME,
      alternateLocale: ["ar", "en"].filter((l) => l !== locale),
      locale,
      url: `${BASE_URL}/${locale}`,
      ttl: 3600,
      images: [
        {
          url:
            locale === "ar"
              ? `${BASE_URL}/ar_social_image.png`
              : `${BASE_URL}/en_social_image.png`,
          width: 1800,
          height: 826,
          alt: LL[locale].PREVIEW_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: LL[locale].AUTHOR_NAME,
      description: LL[locale].SITE_DESCRIPTION,
      site: "@abdo_alghoul",
      siteId: "960225296258564096",
      creator: "@abdo_alghoul",
      creatorId: "960225296258564096",
      images: [
        {
          url:
            locale === "ar"
              ? `${BASE_URL}/ar_social_image.png`
              : `${BASE_URL}/en_social_image.png`,
          width: 1800,
          height: 826,
          alt: LL[locale].PREVIEW_IMAGE_ALT,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {
  await loadAllLocalesAsync();
  const { locale } = await params as { locale: Locales };

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18NProvider locale={locale}>
          <Preloader >
            <Navbar />
            {children}
            <Footer />
          </Preloader>
          <FluidCanvas />
        </I18NProvider>
      </body>
    </html>
  );
}


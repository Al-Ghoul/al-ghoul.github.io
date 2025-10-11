"use client";
import TypesafeI18n from '@/i18n/i18n-react'
import type { Locales } from '@/i18n/i18n-types';
import { loadAllLocalesAsync } from '@/i18n/i18n-util.async'
import { useState, useEffect } from 'react'

export default function I18NProvider({
  children,
  locale
}: {
  children: React.ReactNode,
  locale: Locales
}) {
  const [localesLoaded, setLocalesLoaded] = useState(false);

  useEffect(() => {
    loadAllLocalesAsync().then(() => setLocalesLoaded(true))
  }, []);

  if (!localesLoaded) return null;

  return (
    <TypesafeI18n locale={locale}>
      {children}
    </TypesafeI18n>
  )
}

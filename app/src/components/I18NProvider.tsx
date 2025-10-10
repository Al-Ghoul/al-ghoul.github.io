"use client";
import TypesafeI18n from '@/i18n/i18n-react'
import { loadAllLocalesAsync } from '@/i18n/i18n-util.async'
import { useState, useEffect } from 'react'
import { detectLocale, navigatorDetector } from 'typesafe-i18n/detectors'

export default function I18NProvider({ children }: { children: React.ReactNode }) {
  const locale = detectLocale("en", ["en", "ar"], navigatorDetector)

  const [localesLoaded, setLocalesLoaded] = useState(false)
  useEffect(() => {
    loadAllLocalesAsync().then(() => setLocalesLoaded(true))
  }, [])

  if (!localesLoaded) return null;

  return (
    <TypesafeI18n locale={locale}>
      {children}
    </TypesafeI18n>
  )
}

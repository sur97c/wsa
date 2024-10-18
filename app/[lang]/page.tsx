// app/page.tsx
"use client"

import { useTranslations } from '@hooks/useTranslations'

export default function Home() {
  const { t, translations } = useTranslations()
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{t(translations.home.title)}</h1>
    </>
  )
}

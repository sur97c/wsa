// app/[lang]/error.tsx

"use client"

import ClientErrorPage from "@components/error/ClientErrorPage"
import { useTranslations } from "@hooks/useTranslations"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t, translations } = useTranslations()

  console.error(error, reset)
  return (
    <ClientErrorPage
      title={t(translations.errors.genericError.title)}
      message={t(translations.errors.genericError.message)}
      showBackButton={false}
      showHomeButton={true}
    />
  )
}

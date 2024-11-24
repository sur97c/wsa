//components/error/ClientErrorPage.tsx
"use client"

import { useTranslations } from "@hooks/useTranslations"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ErrorPageProps {
  title?: string
  message?: string
  showBackButton?: boolean
  showHomeButton?: boolean
}

export default function ClientErrorPage({
  title,
  message,
  showBackButton = true,
  showHomeButton = true,
}: ErrorPageProps) {
  const { t, translations } = useTranslations()
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl p-8 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          {title || t(translations.errors.notFound.title)}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {message || t(translations.errors.notFound.message)}
        </p>
        <div className="flex justify-center gap-4">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-800 text-white rounded transition-all duration-500
                hover:bg-[#FF8C00] hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t(translations.errors.back)}
            </button>
          )}
          {showHomeButton && (
            <Link href="/es" className="px-6 py-2 bg-[#FF8C00] text-white rounded transition-all duration-500
                hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5">
              {t(translations.errors.home)}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
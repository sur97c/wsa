// app/[lang]/claims/page.tsx

"use client"

import { useTranslations } from '@hooks/useTranslations'
import ProtectedRoute from '@components/protected-route/ProtectedRoute'
import { RoleKey } from "@utils/rolesDefinition"

export default function Management() {
    const { t, translations } = useTranslations()

    return (
        <ProtectedRoute allowedRoles={['claims'] as RoleKey[]} skeletonType="claims">
            <h1 className="text-2xl font-bold mb-4">{t(translations.claims.title)}</h1>
        </ProtectedRoute>
    )
} 
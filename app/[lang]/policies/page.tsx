// app/[lang]/policies/page.tsx

"use client"

import { useTranslations } from '@hooks/useTranslations'
import ProtectedRoute from '@components/protected-route/ProtectedRoute'
import { RoleKey } from "@utils/rolesDefinition"

export default function Management() {
    const { t, translations } = useTranslations()

    return (
        <ProtectedRoute allowedRoles={['policies'] as RoleKey[]} skeletonType="policies">
            <h1 className="text-2xl font-bold mb-4">{t(translations.policies.title)}</h1>
        </ProtectedRoute>
    )
} 
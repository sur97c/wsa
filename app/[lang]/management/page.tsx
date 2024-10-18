// app/[lang]/management/page.tsx

"use client"

import UserManagement from "@components/user-management/UserManagement"
import { useTranslations } from '@hooks/useTranslations'
import ProtectedRoute from '@components/protected-route/ProtectedRoute'
import { RoleKey } from "@utils/rolesDefinition"

export default function Management() {
    const { t, translations } = useTranslations()

    return (
        <ProtectedRoute allowedRoles={['management'] as RoleKey[]} skeletonType="management">
            <h1 className="text-2xl font-bold mb-4">{t(translations.management.title)}</h1>
            <UserManagement />
        </ProtectedRoute>
    )
} 
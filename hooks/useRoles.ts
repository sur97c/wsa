// hooks/useRoles.ts

import { useMemo } from 'react'
import { useTranslations } from './useTranslations'

export function useRoles() {
    const { translations } = useTranslations()

    const Roles = useMemo(() => [
        { key: 'home', menuLabel: translations.navigation.home, label: '' },
        { key: 'quotes', menuLabel: translations.navigation.quotes, label: translations.navigation.quotes },
        { key: 'policies', menuLabel: translations.navigation.policies, label: translations.navigation.policies },
        { key: 'claims', menuLabel: translations.navigation.claims, label: translations.navigation.claims },
        { key: 'payments', menuLabel: translations.navigation.payments, label: translations.navigation.payments },
        { key: 'clients', menuLabel: translations.navigation.clients, label: translations.navigation.clients },
        { key: 'management', menuLabel: translations.navigation.management, label: translations.navigation.management },
        { key: 'reports', menuLabel: translations.navigation.reports, label: translations.navigation.reports },
    ], [translations])

    return Roles
}
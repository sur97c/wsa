// utils/rolesDefinition.ts

export const RoleKeys = [
    'home',
    'quotes',
    'policies',
    'claims',
    'payments',
    'clients',
    'management',
    'reports',
] as const

export type RoleKey = typeof RoleKeys[number];

export function getRoles(t: (key: string) => string) {
    return RoleKeys.map(key => ({
        key,
        menuLabel: t(`navigation.${key}`),
        label: key === 'home' ? '' : t(`navigation.${key}`)
    }))
}
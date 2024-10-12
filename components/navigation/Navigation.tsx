// components/navigation/Navigation.tsx

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { RootState, useAppSelector } from "@lib/redux/store"
import { useTranslations } from '@hooks/useTranslations'
import { useRoles } from '@hooks/useRoles'
import { useLanguage } from '@hooks/useLanguage'
import { IUserClaims } from '@models/IUserClaims'
import { RoleKey } from '@utils/rolesDefinition'

export default function Navigation() {
    const { t, translations } = useTranslations()
    const Roles = useRoles()
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const auth = useAppSelector((state: RootState) => state.auth.auth)
    const userClaims = auth?.customClaims as IUserClaims | undefined
    const userRoles = userClaims?.roles || []
    const toggleMenu = () => setIsOpen(!isOpen)
    const { language } = useLanguage()

    const filteredRoles = Roles.filter(role =>
        auth?.isAuthenticated && (
            userRoles.includes(role.key as RoleKey) || role.key === 'home'
        )
    )

    return (
        <nav className="bg-secondary-light bg-opacity-80 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-dark text-lg font-bold hover:text-primary-hover hover:font-bold">
                    <Link href={`/${language}`}>{t(translations.navigation.title)}</Link>
                </div>
                <div className="hidden md:flex space-x-4">
                    {filteredRoles.map((role) => (
                        <Link
                            key={role.key}
                            href={role.key === 'home' ? `/${language}` : `/${language}/${role.key}`}
                            className={`text-dark hover:text-primary-hover hover:font-bold ${pathname === (role.key === 'home' ? `/${language}` : `/${language}/${role.key}`)
                                ? 'text-primary font-extrabold'
                                : ''
                                }`}
                        >
                            {role.menuLabel}
                        </Link>
                    ))}
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-dark w-6 h-6" />
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden mt-2">
                    {filteredRoles.map((role) => (
                        <Link
                            key={role.key}
                            href={role.key === 'home' ? `/${language}` : `/${language}/${role.key}`}
                            className={`block py-2 text-dark hover:text-primary-hover hover:font-bold ${pathname === (role.key === 'home' ? `/${language}` : `/${language}/${role.key}`)
                                ? 'text-primary font-extrabold'
                                : ''
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {role.menuLabel}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    )
}
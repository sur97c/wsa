// components/header/Header.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faSignOutAlt, faUserCircle, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useTranslations } from '@hooks/useTranslations'
import { RootState, useAppDispatch, useAppSelector } from "@lib/redux/store"
import { logoutUser, setShowLogin } from "@lib/redux/slices/authSlice"
import { useSafeRouter } from "@hooks/useSafeRouter"
import { useFlip } from "@providers/flip-provider"
import Image from 'next/image'
import LoginForm from "@components/header/LoginForm"
import LoadingButton from "@components/loading-button/LoadingButton"
import Navigation from "@components/navigation/Navigation"
import UserMenu from "@components/user-menu/UserMenu"
import '@fortawesome/fontawesome-svg-core/styles.css'

export default function Header() {
    const { t, translations } = useTranslations()
    const { safeNavigate } = useSafeRouter()
    const { isFlipped, toggleFlip } = useFlip()
    const { loading, error } = useAppSelector((state) => state.auth)
    const [isLoadingPage, setIsLoadingPage] = useState(true)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const auth = useAppSelector((state: RootState) => state.auth.auth)
    const showLogin = useAppSelector((state: RootState) => state.auth.showLogin)
    const dispatch = useAppDispatch()

    const toggleLogin = () => {
        if (isFlipped && toggleFlip)
            toggleFlip(() => dispatch(setShowLogin(!showLogin)))
        else
            dispatch(setShowLogin(!showLogin))
    }

    const handleLogoutUser = () => {
        dispatch(setShowLogin(false))
        dispatch(logoutUser())
        setIsUserMenuOpen(false)
        safeNavigate(`/`, true)
    }

    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    useEffect(() => {
        setIsLoadingPage(false);
    }, []);

    return (
        <>
            <header className="bg-light text-white">
                <nav className="container mx-auto flex justify-between">
                    <Image
                        src="/images/WSA-logo.png"
                        alt="WSA Logo"
                        width={16}
                        height={16}
                        priority={true}
                        className={`transition-all duration-500 m-2 w-24 h-24`}
                    />
                    <div className="flex items-center">
                        <div className="relative flex items-center justify-end m-2">
                            {
                                isLoadingPage ? (
                                    <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-primary" />
                                ) : (
                                    <>
                                        {error && <p className="flex justify-center mt-2 text-red-500">{error}</p>}
                                        {auth && auth?.isAuthenticated ? (
                                            <div className="relative">
                                                <div className="flex justify-center text-primary">
                                                    <button
                                                        onClick={toggleUserMenu}
                                                        className="flex items-center text-primary hover:text-primary-hover focus:outline-none"
                                                    >
                                                        <FontAwesomeIcon icon={faUserCircle} size="2x" className="mr-2" />
                                                        <div className="flex flex-col items-start">
                                                            <span>
                                                                {t(translations.header.welcome, { name: auth?.name || auth?.displayName || 'Usuario' })}
                                                            </span>
                                                        </div>
                                                    </button>
                                                    <div className="flex flex-row justify-center space-x-2 ml-4">
                                                        <LoadingButton
                                                            type="button"
                                                            onClick={handleLogoutUser}
                                                            aria-label={loading ? t(translations.header.closingSession) : t(translations.header.closeLogin)}
                                                            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover w-full md:w-auto flex items-center justify-center"
                                                            faIcon={faSignOutAlt}
                                                            loading={loading}
                                                        />
                                                    </div>
                                                </div>
                                                {isUserMenuOpen && <UserMenu onClose={() => setIsUserMenuOpen(false)} />}
                                            </div>
                                        ) : (
                                            <div className='relative'>
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={toggleLogin}
                                                        className="text-primary hover:text-primary-hover hover:font-bold flex items-center"
                                                        aria-label={showLogin ? 'Cerrar panel de inicio de sesión' : 'Abrir panel de inicio de sesión'}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={showLogin ? faTimes : faSignInAlt}
                                                            className="mr-2"
                                                        />
                                                        <span>{showLogin ? t(translations.header.closeLogin) : t(translations.header.showLogin)}</span>
                                                    </button>
                                                </div>
                                                <LoginForm showLogin={showLogin} />
                                            </div>
                                        )}
                                    </>
                                )
                            }
                        </div>
                    </div>
                </nav>
            </header>
            {auth && auth?.isAuthenticated && <Navigation />}
        </>
    );
}
// components/header/Header.tsx
'use client'

import { RootState, useAppDispatch, useAppSelector } from "@lib/redux/store"
import { logoutUser } from "@lib/redux/slices/authSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faSignOutAlt, faUserCircle, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useFlip } from "@providers/flip-provider"
import { useEffect, useState } from "react"
import Link from "next/link"
import LoginForm from "@components/header/LoginForm"
import Image from 'next/image'
import LoadingButton from "@components/loading-button/LoadingButton"
import '@fortawesome/fontawesome-svg-core/styles.css'
import ThemeToggle from "@components/theme-toggle/ThemeToggle"
import Navigation from "@components/navigation/Navigation"

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
    const { isFlipped, toggleFlip } = useFlip();
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const toggleLogin = () => {
        if (isFlipped && toggleFlip)
            toggleFlip(() => setIsLoginOpen(!isLoginOpen));
        if (!isFlipped)
            setIsLoginOpen(!isLoginOpen);
    };

    const handleLogoutUser = () => {
        setIsLoginOpen(false);
        dispatch(logoutUser());
    };

    useEffect(() => {
        setIsLoadingPage(false);
    }, []);

    return (
        <>
            <header className="bg-light text-white p-4">
                <nav className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <Image
                            src="/images/WSA-logo.png"
                            alt="WSA Logo"
                            width={16}
                            height={16}
                            priority={true}
                            className={`transition-all duration-500 ${isLoginOpen && !isAuthenticated ? "w-32 h-32" : "w-16 h-16"}`}
                        />
                        <div className="ml-4">
                            <ThemeToggle />
                        </div>
                    </div>
                    <div className="relative">
                        {
                            isLoadingPage ? (
                                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-primary" />
                            ) : (
                                <>
                                    {error && <p className="flex justify-center mt-2 text-red-500">{error}</p>}
                                    {
                                        isAuthenticated ? (
                                            <div>
                                                <div className="flex justify-center text-primary">
                                                    <Link href="/profile" className="ml-4 text-primary hover:text-secondary-light flex flex-row items-center space-x-2">
                                                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                                                        <div className="flex flex-col">
                                                            <h2>Bienvenido {user?.profile?.name}</h2>
                                                            <span>{user?.email}</span>
                                                        </div>
                                                    </Link>
                                                    <div className="flex flex-row justify-center space-x-2 ml-4">
                                                        <LoadingButton
                                                            type="button"
                                                            onClick={handleLogoutUser}
                                                            aria-label={loading ? "Cerrando sesión..." : "Cerrar sesión"}
                                                            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover w-full md:w-auto flex items-center justify-center"
                                                            faIcon={faSignOutAlt}
                                                            loading={loading}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={toggleLogin}
                                                        className="text-primary hover:text-secondary-light flex items-center"
                                                        aria-label={isLoginOpen ? 'Cerrar panel de inicio de sesión' : 'Abrir panel de inicio de sesión'}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={isLoginOpen ? faTimes : faSignInAlt}
                                                            className="mr-2"
                                                        />
                                                        <span>{isLoginOpen ? 'Cerrar' : 'Iniciar sesión'}</span>
                                                    </button>
                                                </div>
                                                <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isLoginOpen ? "max-h-96" : "max-h-0"}`}>
                                                    <div className="bg-white text-black p-4 mt-2 rounded shadow-lg">
                                                        <LoginForm />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }
                    </div>
                </nav>
            </header>
            {isAuthenticated && <Navigation />}
        </>
    );
}
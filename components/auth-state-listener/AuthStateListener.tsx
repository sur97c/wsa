// components/auth-state-listener/AuthStateListener.tsx

'use client'

import { useState, useEffect, useCallback } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@lib/redux/store'
import { logoutUser, updateLastActivity, checkUserStatus } from '@lib/redux/slices/authSlice'
import { useAuthListener } from '@hooks/useAuthListener.ts'
import { useSafeRouter } from "@hooks/useSafeRouter"
import { useTranslations } from '@hooks/useTranslations'
import Notification from '@components/notification/Notification'
import { faClock, faUserSlash } from '@fortawesome/free-solid-svg-icons'

export function AuthStateListener({ children }: { children: React.ReactNode }) {
    const { t, translations } = useTranslations()
    const { safeNavigate } = useSafeRouter()
    const [isSessionTimeoutDialogVisible, setIsSessionTimeoutDialogVisible] = useState(false)
    const [isDisabledDialogVisible, setIsDisabledDialogVisible] = useState(false)

    const [timeLeft, setTimeLeft] = useState(0)

    const authState = useAppSelector((state: RootState) => state.auth.auth)
    const dispatch = useAppDispatch()

    useAuthListener()

    const handleLogout = useCallback(async () => {
        dispatch(logoutUser())
        setIsSessionTimeoutDialogVisible(false)
        safeNavigate(`/`)
    }, [dispatch, safeNavigate])

    const handleExtendSession = () => {
        setIsSessionTimeoutDialogVisible(false)
        dispatch(updateLastActivity())
    }

    useEffect(() => {
        const checkSessionTimeout = () => {
            if (authState && authState.isAuthenticated && !authState.rememberMe) {
                const currentTime = Date.now()
                const timeSinceLastActivity = currentTime - (authState?.lastActivity ?? currentTime)

                if (timeSinceLastActivity > Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) - Number(process.env.NEXT_PUBLIC_DIALOG_TIMEOUT)) {
                    setIsSessionTimeoutDialogVisible(true)
                    setTimeLeft(Math.floor((Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) - timeSinceLastActivity) / 1000))
                }

                if (timeSinceLastActivity > Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT)) {
                    handleLogout()
                }
            }
        }
        const checkUserStatusAndUpdate = async () => {
            if (authState && authState.isAuthenticated) {
                try {
                    const result = await dispatch(checkUserStatus(authState.uid)).unwrap()
                    if (result.disabled) {
                        setIsDisabledDialogVisible(true)
                    }
                } catch (error) {
                    console.error('Error al verificar el estado del usuario:', error)
                }
            }
        }

        const sessionIntervalId = setInterval(checkSessionTimeout, 1000)
        const statusIntervalId = setInterval(checkUserStatusAndUpdate, 60000)
        return () => {
            clearInterval(sessionIntervalId)
            clearInterval(statusIntervalId)
        }

    }, [dispatch, authState, handleLogout])

    useEffect(() => {
        let countdownInterval: NodeJS.Timeout

        if (isSessionTimeoutDialogVisible && timeLeft > 0) {
            countdownInterval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
        }

        if (timeLeft === 0 && isSessionTimeoutDialogVisible) {
            handleLogout()
        }

        return () => clearInterval(countdownInterval)
    }, [isSessionTimeoutDialogVisible, timeLeft, dispatch, handleLogout])

    useEffect(() => {
        const handleActivity = () => {
            if (authState && authState?.isAuthenticated) {
                dispatch(updateLastActivity())
            }
        }

        window.addEventListener('mousemove', handleActivity)
        window.addEventListener('keydown', handleActivity)

        return () => {
            window.removeEventListener('mousemove', handleActivity)
            window.removeEventListener('keydown', handleActivity)
        }
    }, [dispatch, authState, authState?.isAuthenticated])

    return (
        <>
            {isSessionTimeoutDialogVisible && (
                <Notification
                    icon={faClock}
                    iconColor="text-primary"
                    title={t(translations.authStateListener.title)}
                    message={t(translations.authStateListener.message, { timeLeft: timeLeft.toString() })}
                    primaryButtonText={t(translations.authStateListener.extendSession)}
                    secondaryButtonText={t(translations.authStateListener.closeSession)}
                    onPrimaryButtonClick={handleExtendSession}
                    onSecondaryButtonClick={handleLogout}
                />
            )}
            {isDisabledDialogVisible && (
                <Notification
                    icon={faUserSlash}
                    iconColor="text-primary"
                    title={t(translations.authStateListener.title)}
                    message={t(translations.authStateListener.message, { timeLeft: timeLeft.toString() })}
                    primaryButtonText={t(translations.authStateListener.extendSession)}
                    secondaryButtonText={t(translations.authStateListener.closeSession)}
                    onPrimaryButtonClick={handleExtendSession}
                    onSecondaryButtonClick={handleLogout}
                />
            )}
            {children}
        </>
    )
}

export function useAuthState() {
    return useAppSelector((state: RootState) => state.auth.auth);
}

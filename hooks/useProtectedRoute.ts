// hooks/useProtectedRoute.ts

import { useEffect } from 'react'
import { RootState, useAppDispatch, useAppSelector } from "@lib/redux/store"
import { setShowLogin } from "@lib/redux/slices/authSlice"
import { useSafeRouter } from "@hooks/useSafeRouter"

export function useProtectedRoute() {
    const { safeNavigate } = useSafeRouter()
    const dispatch = useAppDispatch()
    const authState = useAppSelector((state: RootState) => state.auth.auth)

    useEffect(() => {
        if (!authState?.isAuthenticated) {
            dispatch(setShowLogin(true))
            safeNavigate('/', true)
        }
    }, [authState, safeNavigate, dispatch])

    return authState?.isAuthenticated
}
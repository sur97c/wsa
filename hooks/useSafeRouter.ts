// hooks/useSafeRouter.ts

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'

export function useSafeRouter() {
    const { language } = useLanguage()
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const safeNavigate = (path: string, supportLang: boolean = false) => {
        if (supportLang) 
            path = `${path}${language}`
        if (isMounted) {
            router.push(path)
        } else if (typeof window !== 'undefined') {
            window.location.href = path
        }
    };

    return { safeNavigate }
}
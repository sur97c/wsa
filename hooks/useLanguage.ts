// hooks/useLanguage.ts

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export function useLanguage() {
    const router = useRouter()
    const params = useParams()
    const [language, setLanguage] = useState<string>(params.lang as string || 'es')

    useEffect(() => {
        const storedLang = localStorage.getItem('preferredLanguage')
        if (storedLang && storedLang !== language) {
            setLanguage(storedLang)
            // Preserve the route group (public/protected) when changing language
            const path = window.location.pathname
            const segments = path.split('/').filter(Boolean)
            segments[0] = storedLang // Replace language segment
            router.push(`/${segments.join('/')}`)
        } else if (!storedLang) {
            localStorage.setItem('preferredLanguage', language)
        }
    }, [language, router])

    const changeLanguage = (newLang: string) => {
        localStorage.setItem('preferredLanguage', newLang)
        setLanguage(newLang)
        // Preserve the route group when changing language
        const path = window.location.pathname
        const segments = path.split('/').filter(Boolean)
        segments[0] = newLang // Replace language segment
        router.push(`/${segments.join('/')}`)
    }

    return { language, changeLanguage }
}
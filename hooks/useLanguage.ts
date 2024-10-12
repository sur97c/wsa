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
            router.push(`/${storedLang}${window.location.pathname.substring(3)}`)
        } else if (!storedLang) {
            localStorage.setItem('preferredLanguage', language)
        }
    }, [language, router])

    const changeLanguage = (newLang: string) => {
        localStorage.setItem('preferredLanguage', newLang)
        setLanguage(newLang)
        router.push(`/${newLang}${window.location.pathname.substring(3)}`)
    }

    return { language, changeLanguage }
}
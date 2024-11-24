// hooks/useMobile.ts
import { useState, useEffect } from 'react'

export const useMobile = () => {
  // Inicializamos con null para evitar hidratación incorrecta en SSR
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    // Función para actualizar el estado
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Verificación inicial
    checkMobile()

    // Añadir listener
    window.addEventListener('resize', checkMobile)

    // Limpiar listener
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Durante SSR, asumimos desktop
  return isMobile === null ? false : isMobile
}
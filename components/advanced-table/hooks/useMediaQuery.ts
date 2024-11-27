// hooks/useMediaQuery.ts

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // Crear el media query
    const mediaQuery = window.matchMedia(query)
    
    // Establecer el estado inicial
    setMatches(mediaQuery.matches)

    // Crear el listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Agregar el listener
    mediaQuery.addEventListener('change', handler)

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query]) // Re-ejecutar solo si cambia la query

  return matches
}
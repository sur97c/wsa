// hooks/useBreakpoint.ts
import { useState, useEffect } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

const getScreenWidth = () => {
  // Asegurarnos de que estamos en el cliente
  if (typeof window === 'undefined') return 0
  return window.innerWidth
}

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs')
  const [screenWidth, setScreenWidth] = useState(getScreenWidth())

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreenWidth(width)

      if (width < breakpoints.sm) {
        setBreakpoint('xs')
      } else if (width < breakpoints.md) {
        setBreakpoint('sm')
      } else if (width < breakpoints.lg) {
        setBreakpoint('md')
      } else if (width < breakpoints.xl) {
        setBreakpoint('lg')
      } else {
        setBreakpoint('xl')
      }
    }

    handleResize() // Establecer valores iniciales
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculamos el ancho disponible considerando márgenes
  const getAdjustedWidth = (margin: number = 32) => {
    return screenWidth - margin
  }

  return {
    breakpoint,
    screenWidth,
    getAdjustedWidth
  }
}
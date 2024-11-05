// components/navigation-loader/NavigationLoader.tsx
"use client"

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationLoaderContextType {
  isNavigating: boolean
  setIsNavigating: (value: boolean) => void
}

const NavigationLoaderContext = createContext<NavigationLoaderContextType>({
  isNavigating: false,
  setIsNavigating: () => {},
})

export const useNavigationLoader = () => useContext(NavigationLoaderContext)

interface NavigationLoaderProviderProps {
  children: ReactNode
}

export const NavigationLoaderProvider: React.FC<NavigationLoaderProviderProps> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <NavigationLoaderContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
      <NavigationLoader />
    </NavigationLoaderContext.Provider>
  )
}

const spinnerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

const NavigationLoader = () => {
  const { isNavigating } = useNavigationLoader()

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          variants={spinnerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-0 left-0 w-full h-screen bg-white bg-opacity-80 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
            <span className="text-primary font-medium">Loading...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
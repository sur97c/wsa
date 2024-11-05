// components/page-transition/PageTransition.tsx

'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

// HOC para envolver páginas fácilmente
export function withPageTransition<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  className?: string
) {
  return function WithPageTransitionComponent(props: P) {
    return (
      <PageTransition className={className}>
        <WrappedComponent {...props} />
      </PageTransition>
    )
  }
}

export default PageTransition
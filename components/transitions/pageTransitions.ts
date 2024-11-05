// components/transitions/pageTransitions.ts

import { Variants } from 'framer-motion'

export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.43, 0.13, 0.23, 0.96],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: [0.43, 0.13, 0.23, 0.96],
        },
    },
}

export const skeletonVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    },
}

export const spinnerVariants: Variants = {
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


// Tipos de transiciones disponibles
export const transitionTypes = ['default', 'slide', 'fade', 'scale'] as const
export type TransitionType = typeof transitionTypes[number]

// Variantes adicionales que podrías querer usar
export const transitionVariants: Record<TransitionType, Variants> = {
    default: pageVariants,
    slide: {
        initial: { x: -20, opacity: 0 },
        enter: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.43, 0.13, 0.23, 0.96],
            }
        },
        exit: {
            x: 20,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: [0.43, 0.13, 0.23, 0.96],
            }
        }
    },
    fade: {
        initial: { opacity: 0 },
        enter: {
            opacity: 1,
            transition: {
                duration: 0.4
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    },
    scale: {
        initial: { scale: 0.96, opacity: 0 },
        enter: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.43, 0.13, 0.23, 0.96],
            }
        },
        exit: {
            scale: 0.96,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: [0.43, 0.13, 0.23, 0.96],
            }
        }
    }
} as const
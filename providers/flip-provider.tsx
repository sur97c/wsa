// flip-provider.tsx
'use client'

import { createContext, useContext, useRef, useState } from "react";

type FlipContextType = {
    isFlipped: boolean;
    toggleFlip: (onAnimationEnd?: () => void) => void;
    flipElementRef: React.RefObject<HTMLDivElement>;
};

const FlipContext = createContext<FlipContextType | undefined>(undefined);

const FlipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const flipElementRef = useRef<HTMLDivElement | null>(null);

    const toggleFlip = (onAnimationEnd?: () => void) => {
        if (flipElementRef.current) {
            const element = flipElementRef.current;

            const handleAnimationEnd = () => {
                if (onAnimationEnd) onAnimationEnd();
                element.removeEventListener('transitionend', handleAnimationEnd);
            };

            element.addEventListener('transitionend', handleAnimationEnd);
        }
        setIsFlipped((prev) => !prev);
    };

    return (
        <FlipContext.Provider value={{ isFlipped, toggleFlip, flipElementRef }}>
            {children}
        </FlipContext.Provider>
    );
};

const useFlip = () => {
    const context = useContext(FlipContext);
    if (!context) throw new Error('useFlip must be used within a FlipProvider');
    return context;
};

export { useFlip, FlipProvider }
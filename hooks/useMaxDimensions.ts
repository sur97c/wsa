// hooks/useMaxDimensions.ts

import { useRef, useState, useEffect, RefObject } from 'react';

interface Dimensions {
  maxWidth: number | null;
  maxHeight: number | null;
}

const SMALL_DEVICE_THRESHOLD = 768;

function useMaxDimensions<T extends HTMLElement>(): {
  ref: RefObject<T>;
  dimensions: Dimensions;
} {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    maxWidth: null,
    maxHeight: null
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const calculateDimensions = () => {
      if (ref.current) {
        const isSmallDevice = window.innerWidth <= SMALL_DEVICE_THRESHOLD;
        const elementWidth = ref.current.scrollWidth;
        const elementHeight = ref.current.scrollHeight;

        setDimensions({
          maxWidth: isSmallDevice ? window.innerWidth - 15 : elementWidth + 30,
          maxHeight: elementHeight
        });
      }
    };

    const handleResize = () => {
      const newWindowWidth = window.innerWidth;
      if (newWindowWidth !== windowWidth) {
        setWindowWidth(newWindowWidth);
        calculateDimensions();
      }
    };

    calculateDimensions();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  return { ref, dimensions };
}

export default useMaxDimensions;

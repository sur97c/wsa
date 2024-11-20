import { useFlip } from "@providers/flip-provider";
import { useEffect, useRef, useCallback, useState } from "react";
import { useBreakpoint } from "@hooks/useBreakpoint";
import debounce from "lodash/debounce";
import styles from "./FlipCard.module.scss";

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  extraWidth?: number;
  mobileFullWidth?: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  frontContent,
  backContent,
  extraWidth = 20,
  mobileFullWidth = true,
}) => {
  const { isFlipped } = useFlip();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousWidthRef = useRef<number>(0);
  const { breakpoint, getAdjustedWidth } = useBreakpoint();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const measureContent = useCallback(() => {
    if (frontRef.current && backRef.current && containerRef.current) {
      let finalWidth: number;

      // Medimos el contenido
      const contentWidth = Math.max(
        frontRef.current.scrollWidth,
        backRef.current.scrollWidth
      );

      // Diferentes anchos según breakpoint
      if (breakpoint === "xs") {
        if (mobileFullWidth) {
          finalWidth = getAdjustedWidth(32); // Ancho completo menos márgenes, sin extra
        } else {
          finalWidth =
            Math.min(contentWidth, getAdjustedWidth(32)) + extraWidth;
        }
      } else if (breakpoint === "sm") {
        if (mobileFullWidth) {
          finalWidth = getAdjustedWidth(48); // Ancho completo menos márgenes, sin extra
        } else {
          finalWidth = Math.min(480, contentWidth) + extraWidth;
        }
      } else if (breakpoint === "md") {
        // Para tablets
        finalWidth = Math.min(contentWidth, 600) + extraWidth;
      } else {
        // Para desktop
        finalWidth = Math.min(contentWidth, 500) + extraWidth;
      }

      // Solo actualizar si hay un cambio significativo
      if (Math.abs(previousWidthRef.current - finalWidth) > 1) {
        previousWidthRef.current = finalWidth;
        containerRef.current.style.setProperty(
          "--flip-card-width",
          `${finalWidth}px`
        );
      }
    }
  }, [breakpoint, extraWidth, getAdjustedWidth, mobileFullWidth]);

  useEffect(() => {
    const debouncedMeasure = debounce(measureContent, 150);

    // Medición inicial
    measureContent();

    // Configuramos el observer
    const resizeObserver = new ResizeObserver((entries) => {
      const hasSignificantChange = entries.some((entry) => {
        const { width: newWidth } = entry.contentRect;
        return Math.abs(newWidth - previousWidthRef.current) > 1;
      });

      if (hasSignificantChange) {
        debouncedMeasure();
      }
    });

    // Observamos ambos contenedores
    if (frontRef.current) resizeObserver.observe(frontRef.current);
    if (backRef.current) resizeObserver.observe(backRef.current);

    // Limpieza
    return () => {
      resizeObserver.disconnect();
      debouncedMeasure.cancel();
    };
  }, [measureContent]);

  return (
    <div ref={containerRef} className={styles["flip-card"]}>
      <div
        className={`${styles["flip-card-inner"]} ${
          isFlipped && isMounted ? styles["rotate-y-180"] : ""
        }`}
      >
        <div ref={frontRef} className={styles["flip-card-front"]}>
          {frontContent}
        </div>
        <div
          ref={backRef}
          className={`${styles["flip-card-back"]} ${
            !isMounted ? "opacity-0" : ""
          }`}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;

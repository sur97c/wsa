import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina y resuelve conflictos entre clases de Tailwind
 * @param inputs - Lista de clases o condiciones para clases
 * @returns String con las clases combinadas y optimizadas
 * @example
 * // Uso básico
 * cn("px-2 py-1", "bg-blue-500") // => "px-2 py-1 bg-blue-500"
 * 
 * // Con condiciones
 * cn("base-class", {
 *   "active-class": isActive,
 *   "disabled-class": isDisabled
 * }) 
 * 
 * // Con clases que podrían conflictuar
 * cn("px-2 py-1", "px-4") // => "py-1 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Función de ayuda para delay en promesas
 * @param ms - Milisegundos a esperar
 * @returns Promise que se resuelve después del tiempo especificado
 * @example
 * await delay(1000) // espera 1 segundo
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Formatea una fecha en string ISO a un formato legible
 * @param date - Fecha en formato ISO string o instancia de Date
 * @param locale - Locale a usar para el formateo (default: 'es')
 * @returns String con la fecha formateada
 * @example
 * formatDate('2024-01-01T00:00:00.000Z') // => "1 de enero de 2024"
 */
export function formatDate(date: string | Date, locale: string = 'es'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Genera un ID único
 * @returns String con un ID único
 * @example
 * const id = generateId() // => "unique-id-123"
 */
export function generateId(): string {
  return `id-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Valida si una string es un email válido
 * @param email - Email a validar
 * @returns Boolean indicando si es válido
 * @example
 * isValidEmail('test@example.com') // => true
 * isValidEmail('invalid-email') // => false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
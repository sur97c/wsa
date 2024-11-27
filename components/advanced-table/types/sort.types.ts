// components/advanced-table/types/sort.types.ts

// Tipos básicos para dirección de ordenamiento
// Configuración de ordenamiento simple y múltiple
// Soporte para ordenamiento personalizado por tipo de dato
// Manejo de prioridades para ordenamiento múltiple
// Sistema de eventos para cambios de ordenamiento
// Gestión de estado de ordenamiento
// Props para componentes de UI
// Funciones helper para:

// Creación de configuraciones de ordenamiento
// Comparación por defecto
// Utilidades para ordenamiento múltiple
// Validación de configuraciones

// Sistema de presets de ordenamiento

// La estructura soporta casos de uso avanzados como:

// Ordenamiento múltiple con prioridades
// Ordenamiento personalizado por tipo de columna
// Posicionamiento configurable de valores nulos
// Transformación de valores antes de ordenar
// Ordenamiento sensible a configuración regional (locale)

import { DataItem } from './table.types'
import { ColumnType } from './column.types'

// Basic sort direction type
export type SortDirection = 'asc' | 'desc'

// Basic sort configuration for a single column
export interface Sort<T extends DataItem> {
  columnKey: keyof T                    // Column being sorted
  direction: SortDirection              // Sort direction
  priority?: number                     // Optional: Priority for multi-sort
  nullsPosition?: 'first' | 'last'     // Optional: Where to position null values
}

// Multi-sort configuration
export interface MultiSort<T extends DataItem> {
  sorts: Sort<T>[]                      // Array of active sorts
  maxSorts?: number                     // Maximum number of simultaneous sorts
  enableToggle?: boolean               // Allow toggling direction on click
  clearable?: boolean                  // Allow clearing all sorts
}

// Custom sort configuration by data type
export interface SortConfig {
  type: ColumnType                     // Column data type
  comparator?: <T>(a: T, b: T) => number // Optional custom comparator
  transformer?: <T>(value: T) => any   // Optional value transformer
  localeOptions?: Intl.CollatorOptions // Options for locale-aware sorting
}

// Sort priority change event
export interface SortPriorityChangeEvent<T extends DataItem> {
  sorts: Sort<T>[]                     // Updated sort configurations
  changed: Sort<T>                     // Sort whose priority changed
  oldPriority: number                  // Previous priority
  newPriority: number                  // New priority
}

// Sort state for managing UI
export interface SortState<T extends DataItem> {
  activeSorts: Sort<T>[]               // Currently active sorts
  priorityOrder: Array<keyof T>        // Order of sort priority
  lastChanged?: keyof T               // Last column whose sort changed
}

// Sort indicator props for UI components
export interface SortIndicatorProps<T extends DataItem> {
  columnKey: keyof T                   // Column being indicated
  active: boolean                      // If sort is active
  direction?: SortDirection            // Current direction if active
  priority?: number                    // Current priority if multi-sort
  className?: string                  // Optional custom styling
}

// Sort change event data
export interface SortChangeEvent<T extends DataItem> {
  sorts: Sort<T>[]                     // Updated sort configurations
  column: keyof T                      // Changed column
  previousSorts: Sort<T>[]             // Previous sort state
  action: 'add' | 'remove' | 'update' | 'clear' // Type of change
}

// Helper functions for sort management
export const createSort = <T extends DataItem>(
  columnKey: keyof T,
  direction: SortDirection = 'asc',
  priority?: number
): Sort<T> => ({
  columnKey,
  direction,
  priority
})

// Default comparator for basic types
export const defaultComparator = <T>(a: T, b: T): number => {
  if (a === b) return 0
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  return String(a).localeCompare(String(b))
}

// Multi-sort utility functions
export const sortByPriority = <T extends DataItem>(
  sorts: Sort<T>[]
): Sort<T>[] => {
  return [...sorts].sort((a, b) => (a.priority || 0) - (b.priority || 0))
}

export const getNextSortDirection = (
  currentDirection?: SortDirection
): SortDirection => {
  if (!currentDirection) return 'asc'
  return currentDirection === 'asc' ? 'desc' : 'asc'
}

// Type guard for sort validation
export const isValidSort = <T extends DataItem>(
  sort: Partial<Sort<T>>
): sort is Sort<T> => {
  return (
    typeof sort.columnKey === 'string' &&
    (sort.direction === 'asc' || sort.direction === 'desc')
  )
}

// Sort preset configuration
export interface SortPreset<T extends DataItem> {
  id: string                          // Preset identifier
  name: string                        // Display name
  sorts: Sort<T>[]                    // Preset sort configuration
  isDefault?: boolean                // Set as default preset
  description?: string               // Optional description
}
// components/advanced-table/utils/helpers/tableHelpers

import { DataItem } from '@components/advanced-table/types/table.types'
import { Alignment, Column, ColumnWidth } from '@components/advanced-table/types/column.types'
import { TABLE_CONSTANTS } from '@components/advanced-table/constants/tableConstants'

const { MIN_COLUMN_WIDTH, MAX_COLUMN_WIDTH } = TABLE_CONSTANTS

/**
 * Obtiene la clase CSS correspondiente a la alineación
 */
export const getAlignmentClass = (align?: Alignment): string => {
  switch (align) {
    case 'left':
      return 'text-left'
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    case 'justify':
      return 'text-justify'
    default:
      return 'text-left'
  }
}

/**
 * Obtiene el ancho de la columna considerando configuración responsive
 */
export const getColumnWidth = <T extends DataItem>(
  column: Column<T>,
  isMobile = false
): string => {
  if (!column.width) return 'auto'

  if (typeof column.width === 'object') {
    const width = column.width as ColumnWidth
    if (isMobile && width.mobile) {
      return width.mobile
    }
    return width.default || 'auto'
  }

  return column.width
}

/**
 * Valida y ajusta el ancho de la columna según los límites definidos
 */
export const validateColumnWidth = (width: number): number => {
  if (width < MIN_COLUMN_WIDTH) return MIN_COLUMN_WIDTH
  if (width > MAX_COLUMN_WIDTH) return MAX_COLUMN_WIDTH
  return width
}

/**
 * Calcula el ancho total de la tabla basado en las columnas visibles
 */
export const calculateTableWidth = <T extends DataItem>(
  columns: Column<T>[],
  visibleColumns: string[]
): number => {
  return columns
    .filter(col => visibleColumns.includes(String(col.key)) || col.alwaysVisible)
    .reduce((total, col) => {
      const width = getColumnWidth(col)
      if (width === 'auto') return total + MIN_COLUMN_WIDTH
      return total + parseInt(width, 10)
    }, 0)
}

/**
 * Determina si una columna es redimensionable
 */
export const isColumnResizable = <T extends DataItem>(column: Column<T>): boolean => {
  return column.resizable !== false // Por defecto las columnas son redimensionables
}

/**
 * Procesa el valor de una celda para su visualización
 */
export const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toLocaleString()
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/**
 * Calcula el número de filas visibles basado en la altura disponible
 */
export const calculateVisibleRows = (containerHeight: number, rowHeight: number): number => {
  return Math.floor(containerHeight / rowHeight)
}

/**
 * Calcula el índice de la fila a la que se debe hacer scroll
 */
export const calculateScrollToIndex = (
  currentIndex: number,
  totalRows: number,
  visibleRows: number
): number => {
  const maxStartIndex = Math.max(0, totalRows - visibleRows)
  return Math.min(currentIndex, maxStartIndex)
}

/**
 * Genera un ID único para elementos de la tabla
 */
export const generateTableId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Detecta si se debe cargar más datos basado en la posición del scroll
 */
export const shouldLoadMore = (
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  threshold = TABLE_CONSTANTS.SCROLL_THRESHOLD
): boolean => {
  return scrollHeight - scrollTop <= clientHeight * threshold
}
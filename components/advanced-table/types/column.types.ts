// components/advanced-table/types/column.types.ts

// Tipos básicos para alineación y tipos de datos
// Configuración de grid para layouts responsivos
// Manejo de anchos de columna con soporte responsive
// Opciones para columnas tipo select
// Interfaz principal Column con todas las propiedades posibles
// Manejo de visibilidad de columnas
// Soporte para eventos de resize y reordenamiento
// Soporte para agrupación de columnas

import { ReactNode } from 'react'
import { DataItem, CellValue } from './table.types'

// Text alignment options for column content
export type Alignment = 'left' | 'center' | 'right' | 'justify'

// Supported column data types
export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'select'

// Grid configuration for responsive layout
export interface GridConfig {
  column: number                         // Column position in the grid
  row?: number                          // Optional: Row position
  colSpan?: number                      // Optional: Number of columns to span
  rowSpan?: number                      // Optional: Number of rows to span
}

// Configuration for column width and responsive behavior
export interface ColumnWidth {
  default?: string                      // Default width (e.g., '200px', '20%')
  min?: string                          // Minimum width
  max?: string                          // Maximum width
  mobile?: string                       // Width on mobile devices
}

// Options for select-type columns
export interface SelectOption {
  label: string                         // Display label
  value: string | number                // Actual value
  disabled?: boolean                    // Optional: Disable specific options
}

// Main column configuration interface
export interface Column<T extends DataItem> {
  key: keyof T                          // Column identifier matching data property
  type: ColumnType                      // Data type of the column
  label?: string                        // Display label (used if no translation)
  render?: (                            // Custom render function
    value: T[keyof T],                  // Cell value
    item: T                             // Full row data
  ) => React.ReactNode
  align?: Alignment                     // Text alignment
  width?: ColumnWidth | string          // Width configuration
  visible?: boolean                     // Current visibility state
  defaultVisible?: boolean              // Default visibility state
  alwaysVisible?: boolean              // Prevent column from being hidden
  sortable?: boolean                   // Enable/disable sorting
  filterable?: boolean                 // Enable/disable filtering
  searchable?: boolean                 // Include in global search
  resizable?: boolean                  // Allow width resizing
  frozen?: boolean                     // Freeze column position
  grid?: GridConfig                    // Grid layout configuration
  className?: string                   // Custom CSS class
  headerClassName?: string             // Custom header CSS class
  cellClassName?: string               // Custom cell CSS class

  // Select type specific properties
  options?: SelectOption[]             // Options for select type columns
  fetchOptions?: () => Promise<string[]> // Async options fetching
}

// Column visibility state
export interface ColumnVisibility {
  key: string                          // Column identifier
  label: string                        // Display label
  visible: boolean                     // Current visibility state
  alwaysVisible?: boolean             // Cannot be hidden
  defaultVisible?: boolean            // Default visibility state
  width?: string                      // Current width
}

// Column resize event data
export interface ColumnResizeEvent {
  columnKey: string                    // Column being resized
  width: number                        // New width
  originalWidth: number               // Width before resize
}

// Column reorder event data
export interface ColumnReorderEvent {
  fromIndex: number                    // Original column position
  toIndex: number                      // New column position
  columnKey: string                    // Column being moved
}

// Column group configuration for nested headers
export interface ColumnGroup {
  title: string                        // Group title
  align?: Alignment                    // Group header alignment
  columns: string[]                    // Keys of grouped columns
  className?: string                  // Custom group header class
}
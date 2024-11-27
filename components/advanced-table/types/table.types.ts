// components/advanced-table/types/table.types.ts

// Tipos base para valores de celda (CellValue)
// Interfaz para elementos de datos (DataItem)
// Tipo para registros de tabla que extienden BaseEntity (TableRecord)
// Props base para componentes de tabla (BaseTableProps)
// Props para traducciones (TranslatedTableProps)
// Props combinados para el componente principal (AdvancedTableProps)
// Constantes de la tabla (TABLE_CONSTANTS)

import { ReactNode } from 'react'
import { BaseEntity } from '@models/BaseEntity'
import { TableTranslations } from './translation.types'
import { Column } from './column.types'
import { Filter } from './filter.types'
import { TableOption, RowOption } from './menu.types'

// Basic value types that can be displayed in table cells
export type CellValue = string | number | boolean | Date | null | ReactNode

// Base interface for data items, ensures each row has a unique identifier
export type DataItem<
  T extends Record<string, CellValue> = Record<string, CellValue>,
  IdType = string | number
> = {
  id: IdType
} & T

// Type for items that extend the base entity model with table record capabilities
export type TableRecord<T extends BaseEntity> = {
  [K in keyof T]: T[K] extends CellValue ? T[K] : CellValue
} & DataItem & {
  id: string
  // Required base entity fields
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}

// Base props shared by all table components
export interface BaseTableProps<T extends DataItem> {
  columns: Column<T>[]                   // Column definitions for the table
  fetchData: (                           // Function to fetch table data
    page: number,                        // Current page number
    itemsPerPage: number,                // Items per page
    searchTerm: string,                  // Global search term
    sortColumn: keyof T | null,          // Current sort column
    sortDirection: 'asc' | 'desc',       // Sort direction
    filters: Filter<T>[]                 // Active filters
  ) => Promise<T[]>
  itemsPerPage?: number                  // Optional: Number of items per page
  tableOptions?: TableOption[]           // Optional: Table-level options/actions
  rowOptions?: RowOption<T>[]            // Optional: Row-level options/actions
  enableFilters?: boolean                // Optional: Enable filtering functionality
  isEditing?: boolean                    // Optional: Table edit mode state
  editComponent?: ReactNode              // Optional: Component for editing
  onCloseEdit?: () => void              // Optional: Handler for closing edit mode
  onAdd?: () => void                     // Optional: Handler for adding new items
  searchPlaceholder?: string             // Optional: Custom search placeholder
  defaultVisibleColumns?: string[]       // Optional: Initially visible columns
  onColumnVisibilityChange?: (           // Optional: Column visibility change handler
    visibleColumns: string[]
  ) => void
  tableId?: string                       // Optional: Unique identifier for the table
  enableViewSelector?: boolean           // Optional: Enable view management
}

// Props including translations
export interface TranslatedTableProps<T extends DataItem> {
  translations: {
    columns: Column<T>[]                 // Translated column definitions
    tableOptions: TableOption[]          // Translated table options
    rowOptions: RowOption<T>[]           // Translated row options
    tableTranslations: TableTranslations // General table translations
  }
}

// Combined props for the AdvancedTable component
export type AdvancedTableProps<T extends DataItem> = BaseTableProps<T> &
  Partial<TranslatedTableProps<T>>

// Table constants
export const TABLE_CONSTANTS = {
  VISIBLE_HEIGHT: 380,                   // Default visible height of the table
  HEADER_HEIGHT: 48,                     // Height of the table header
  ROW_HEIGHT: 60,                        // Height of each table row
} as const
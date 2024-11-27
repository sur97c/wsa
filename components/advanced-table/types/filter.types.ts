// components/advanced-table/types/filter.types.ts

// Tipos de operadores de filtro extensibles
// Tipos de valores de filtro según el operador
// Configuración principal de filtros
// Soporte para grupos de filtros con lógica AND/OR
// Validación de filtros
// Soporte para componentes de filtro personalizados
// Gestión de estado de filtros
// Sistema de presets de filtros
// Eventos de cambio de filtros
// Funciones auxiliares y type guards

import { DataItem, CellValue } from './table.types'

// Available filter operators
export type FilterOperator = 
  | 'eq'        // Equals
  | 'neq'       // Not equals
  | 'gt'        // Greater than
  | 'gte'       // Greater than or equal
  | 'lt'        // Less than
  | 'lte'       // Less than or equal
  | 'between'   // Between range
  | 'contains'  // Contains string
  | 'startsWith'// Starts with
  | 'endsWith'  // Ends with
  | 'in'        // In array
  | 'notIn'     // Not in array
  | 'isNull'    // Is null
  | 'notNull'   // Is not null

// Filter value types based on operator
export type FilterValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | [string | number, string | number] // For 'between' operator
  | Array<string | number>             // For 'in' and 'notIn' operators
  | null

// Main filter configuration
export interface Filter<T extends DataItem> {
  column: keyof T                       // Column to filter
  operator: FilterOperator | null       // Filter operator
  value: FilterValue | null             // Filter value
  enabled?: boolean                     // Optional: Enable/disable filter
  id?: string                          // Optional: Unique identifier
}

// Filter group for complex filtering
export interface FilterGroup<T extends DataItem> {
  logic: 'and' | 'or'                  // Logic operator for group
  filters: (Filter<T> | FilterGroup<T>)[] // Nested filters or groups
  enabled?: boolean                     // Optional: Enable/disable group
}

// Configuration for filter operators by data type
export interface FilterOperatorConfig {
  type: string                         // Data type
  operators: FilterOperator[]          // Available operators for type
  defaultOperator: FilterOperator      // Default operator for type
}

// Filter validation rule
export interface FilterValidationRule {
  operator: FilterOperator              // Operator to validate
  validator: (value: FilterValue) => boolean // Validation function
  errorMessage: string                 // Error message on validation failure
}

// Interface for custom filter components
export interface CustomFilterProps<T extends DataItem> {
  column: keyof T                      // Column being filtered
  value: FilterValue                   // Current filter value
  operator: FilterOperator             // Current operator
  onChange: (value: FilterValue) => void // Value change handler
  onOperatorChange: (op: FilterOperator) => void // Operator change handler
  availableOperators: FilterOperator[] // Available operators
}

// Filter state for managing UI
export interface FilterState<T extends DataItem> {
  activeFilters: Filter<T>[]           // Currently active filters
  pendingFilter: Partial<Filter<T>>    // Filter being configured
  errorMessage?: string                // Current error message
}

// Filter preset configuration
export interface FilterPreset<T extends DataItem> {
  id: string                           // Preset identifier
  name: string                         // Display name
  filters: Filter<T>[]                 // Preset filters
  isDefault?: boolean                  // Set as default preset
  description?: string                 // Optional description
}

// Filter event data
export interface FilterChangeEvent<T extends DataItem> {
  filters: Filter<T>[]                 // Updated filters
  column?: keyof T                     // Changed column
  previousFilters: Filter<T>[]         // Previous filters
  action: 'add' | 'remove' | 'update' | 'clear' // Type of change
}

// Helper functions for type-safe filter creation
export const createFilter = <T extends DataItem>(
  column: keyof T,
  operator: FilterOperator,
  value: FilterValue
): Filter<T> => ({
  column,
  operator,
  value
})

// Type guards for filter validation
export const isFilterGroup = <T extends DataItem>(
  filter: Filter<T> | FilterGroup<T>
): filter is FilterGroup<T> => {
  return 'logic' in filter && 'filters' in filter
}

export const isValidFilterValue = (
  value: FilterValue,
  operator: FilterOperator
): boolean => {
  switch (operator) {
    case 'between':
      return Array.isArray(value) && value.length === 2
    case 'in':
    case 'notIn':
      return Array.isArray(value) && value.length > 0
    case 'isNull':
    case 'notNull':
      return true
    default:
      return value !== null && value !== undefined
  }
}
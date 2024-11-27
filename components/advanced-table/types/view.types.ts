// components/advanced-table/types/view.types.ts

// Configuraciones específicas para:

// Columnas en la vista
// Ordenamiento
// Filtros y grupos de filtros
// Paginación


// Interfaz principal ITableView que extiende BaseEntity
// Gestión de estado y eventos:

// ViewState para UI
// Eventos de cambio
// Eventos de guardado
// Eventos de eliminación


// Sistema de acciones para gestión de vistas:

// Cargar vistas
// Agregar vista
// Actualizar vista
// Eliminar vista
// Establecer vista por defecto
// Seleccionar vista


// Funciones helper:

// createEmptyView: Crea una vista vacía
// validateView: Valida una vista
// areViewsEqual: Compara vistas
// createViewFromState: Crea vista desde estado actual



// Características destacadas:

// Soporte para compartir vistas
// Permisos de lectura/escritura
// Validación de vistas
// Gestión de estado sucio
// Seguimiento de cambios
// Vistas por defecto
// Configuración flexible

import { DataItem } from './table.types'
import { Filter } from './filter.types'
import { Sort } from './sort.types'
import { BaseEntity } from '@models/BaseEntity'

// Column configuration within a view
export interface ViewColumnConfig {
  key: string                           // Column identifier
  visible: boolean                      // Visibility state
  width?: string                       // Optional custom width
  order?: number                       // Optional display order
  frozen?: boolean                     // Optional frozen state
}

// Sort configuration within a view
export interface ViewSortConfig {
  column: string                        // Column to sort
  direction: 'asc' | 'desc'            // Sort direction
  priority?: number                    // Optional sort priority
}

// Filter configuration within a view
export interface ViewFilterConfig<T extends DataItem> {
  filters: Filter<T>[]                  // Active filters
  logic?: 'and' | 'or'                 // Filter combination logic
  groups?: ViewFilterGroup<T>[]         // Optional filter groups
}

// Filter group configuration
export interface ViewFilterGroup<T extends DataItem> {
  filters: Filter<T>[]                  // Filters in group
  logic: 'and' | 'or'                  // Group logic
  name?: string                        // Optional group name
}

// View configuration data
export interface ViewConfig<T extends DataItem> {
  columns: ViewColumnConfig[]           // Column configurations
  filters: ViewFilterConfig<T>          // Filter configurations
  sorting: ViewSortConfig[]            // Sort configurations
  pageSize?: number                    // Items per page
  defaultVisibleColumns: string[]       // Initially visible columns
}

// Base view data
export interface ITableView<T extends DataItem = DataItem> extends BaseEntity {
  userId: string                        // Owner of the view
  tableId: string                       // Associated table identifier
  name: string                          // View name
  description?: string                 // Optional description
  isDefault: boolean                   // Default view flag
  config: ViewConfig<T>                // View configuration
  shared?: boolean                    // Whether view is shared
  permissions?: {                     // Optional sharing permissions
    read: string[]                    // Users with read access
    write: string[]                   // Users with write access
  }
}

// View state for UI management
export interface ViewState<T extends DataItem> {
  activeView: ITableView<T> | null      // Currently active view
  savedViews: ITableView<T>[]           // All available views
  isDirty: boolean                      // Unsaved changes flag
  lastSaved?: string                    // Last save timestamp
}

// View selection event
export interface ViewChangeEvent<T extends DataItem> {
  previousView: ITableView<T> | null    // Previously active view
  newView: ITableView<T> | null        // Newly selected view
  source: 'user' | 'system'            // Change source
}

// View save event
export interface ViewSaveEvent<T extends DataItem> {
  view: ITableView<T>                   // View being saved
  isNew: boolean                        // New view flag
  isDefault: boolean                    // Default view flag
}

// View delete event
export interface ViewDeleteEvent<T extends DataItem> {
  view: ITableView<T>                   // View being deleted
  wasDefault: boolean                   // Whether it was default
}

// View validation result
export interface ViewValidationResult {
  isValid: boolean                      // Validation status
  errors: string[]                      // Validation errors
}

// View management actions
export type ViewAction =
  | { type: 'LOAD_VIEWS'; payload: ITableView[] }
  | { type: 'ADD_VIEW'; payload: ITableView }
  | { type: 'UPDATE_VIEW'; payload: ITableView }
  | { type: 'DELETE_VIEW'; payload: string }
  | { type: 'SET_DEFAULT_VIEW'; payload: string }
  | { type: 'SELECT_VIEW'; payload: string | null }

// State interface for view management
export interface ITableViewState {
  views: ITableView[]                   // Available views
  selectedViewId: string | null         // Active view ID
  loading: boolean                      // Loading state
  error: string | null                  // Error state
}

// Helper functions for view management
export const createEmptyView = <T extends DataItem>(
  userId: string,
  tableId: string,
  name: string
): ITableView<T> => ({
  id: '',
  userId,
  tableId,
  name,
  isDefault: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: userId,
  updatedBy: userId,
  config: {
    columns: [],
    filters: {
      filters: []
    },
    sorting: [],
    defaultVisibleColumns: []
  }
})

// View validation functions
export const validateView = (view: ITableView): ViewValidationResult => {
  const errors: string[] = []

  if (!view.name?.trim()) {
    errors.push('View name is required')
  }

  if (!view.tableId) {
    errors.push('Table ID is required')
  }

  if (!view.userId) {
    errors.push('User ID is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Compare two views for equality
export const areViewsEqual = <T extends DataItem>(
  view1: ITableView<T>,
  view2: ITableView<T>
): boolean => {
  return JSON.stringify(view1.config) === JSON.stringify(view2.config)
}

// Create a view from current table state
export const createViewFromState = <T extends DataItem>(
  userId: string,
  tableId: string,
  name: string,
  columns: ViewColumnConfig[],
  filters: Filter<T>[],
  sorting: Sort<T>[],
  defaultVisibleColumns: string[]
): ITableView<T> => ({
  ...createEmptyView<T>(userId, tableId, name),
  config: {
    columns,
    filters: {
      filters
    },
    sorting: sorting.map(sort => ({
      column: String(sort.columnKey),
      direction: sort.direction,
      priority: sort.priority
    })),
    defaultVisibleColumns
  }
})
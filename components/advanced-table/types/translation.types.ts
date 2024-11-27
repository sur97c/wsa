// components/advanced-table/types/translation.types.ts

// Traducciones específicas para:

// Operadores de filtro
// Sistema de filtros
// Valores booleanos
// Visibilidad de columnas
// Gestión de vistas
// Paginación
// Acciones comunes
// Interfaz principal de traducciones (TableTranslations)
// Interfaz base para traducciones específicas de módulos (TableTranslationBase)
// Funciones helper:

// getDefaultTranslations: Proporciona traducciones por defecto
// formatTranslation: Formatea strings con variables
// createPartialTranslation: Crea traducciones parciales heredando valores por defecto

// La estructura soporta:

// Internacionalización completa
// Traducciones por defecto
// Traducciones parciales
// Formateo de strings con variables
// Traducciones específicas por módulo
// Traducciones para todas las características de la tabla

import { FilterOperator } from './filter.types'
import { DataItem } from './table.types'

// Operator translations
export type OperatorTranslations = {
  [K in FilterOperator]: string            // Translations for each filter operator
}

// Base translations for specific features
export interface FilterTranslations {
  selectColumn: string                     // "Select column" text
  selectOperator: string                   // "Select operator" text
  filterValue: string                      // "Filter value" text
  operators: OperatorTranslations          // Operator text translations
  minValue: string                         // "Min value" for range filters
  maxValue: string                         // "Max value" for range filters
  true: string                            // Text for boolean true
  false: string                           // Text for boolean false
  selectOption: string                    // "Select option" for select filters
  removeFilter: string                    // "Remove filter" text
  dateFormat: string                      // Date format pattern
}

export interface BooleanTranslations {
  true: string                            // Text for true values
  false: string                           // Text for false values
}

export interface ColumnVisibilityTranslations {
  title: string                           // "Column Visibility" text
  selectAll: string                       // "Select All" text
  deselectAll: string                     // "Deselect All" text
  defaultSelection: string                // "Default Selection" text
  buttonTitle: string                     // Column selector button text
}

export interface ViewTranslations {
  title: string                           // "Table Views" text
  saveView: string                        // "Save View" text
  deleteView: string                      // "Delete View" text
  setDefault: string                      // "Set as Default" text
  newView: string                         // "New View" text
  defaultView: string                     // "Default View" text
  confirmDelete: string                   // Delete confirmation text
  viewName: string                        // "View Name" text
  viewDescription: string                 // "View Description" text
}

export interface PaginationTranslations {
  showing: string                         // "Showing" text
  to: string                             // "to" text
  of: string                             // "of" text
  entries: string                         // "entries" text
  next: string                           // "Next" text
  previous: string                        // "Previous" text
}

export interface ActionTranslations {
  edit: string                           // "Edit" action text
  delete: string                         // "Delete" action text
  save: string                           // "Save" action text
  cancel: string                         // "Cancel" action text
  confirm: string                        // "Confirm" action text
  add: string                            // "Add" action text
}

// Main table translations interface
export interface TableTranslations {
  searchPlaceholder: string               // Search input placeholder
  loading: string                         // Loading state text
  noResults: string                       // No results text
  addButton: string                       // Add button text
  showingResults: string                  // Results count text template
  noMoreData: string                      // No more data text
  loadingMore: string                     // Loading more text
  page: string                            // "Page" text
  addEditTitle: string                    // Add/Edit modal title
  save: string                            // Save button text
  cancel: string                          // Cancel button text
  filters: FilterTranslations             // Filter-related translations
  boolean: BooleanTranslations           // Boolean value translations
  columnVisibility: ColumnVisibilityTranslations // Column visibility translations
  views: ViewTranslations                // View management translations
  pagination: PaginationTranslations     // Pagination translations
  actions: ActionTranslations            // Action button translations
}

// Module-specific translations base
export interface TableTranslationBase {
  columns: Record<string, string>         // Column header translations
  editCreate: {                          // Edit/Create form translations
    fields: Record<string, string>        // Field label translations
    dropDowns: Record<string, Record<string, string>> // Dropdown option translations
    edit: {
      title: string                       // Edit mode title
      successMessage: string              // Success message
      errorMessage: string                // Error message
    }
    create: {
      title: string                       // Create mode title
      successMessage: string              // Success message
      errorMessage: string                // Error message
    }
    buttons: {
      save: string                        // Save button text
      cancel: string                      // Cancel button text
    }
  }
  rowOptions?: Record<string, string>     // Row menu option translations
  tableOptions?: Record<string, string>   // Table menu option translations
}

// Helper functions for translations
export const getDefaultTranslations = (searchPlaceholder?: string): TableTranslations => ({
  searchPlaceholder: searchPlaceholder || "Search...",
  loading: "Loading...",
  noResults: "No results found",
  addButton: "Add",
  showingResults: "Showing {{count}} results, page {{page}}",
  noMoreData: "No more data to load",
  loadingMore: "Loading more results...",
  page: "Page",
  addEditTitle: "Add/Edit",
  save: "Save",
  cancel: "Cancel",
  filters: {
    selectColumn: "Select column",
    selectOperator: "Select operator",
    filterValue: "Filter value",
    operators: {
      eq: "Equals",
      neq: "Not equals",
      gt: "Greater than",
      gte: "Greater than or equal",
      lt: "Less than",
      lte: "Less than or equal",
      between: "Between",
      contains: "Contains",
      startsWith: "Starts with",
      endsWith: "Ends with",
      in: "In",
      notIn: "Not in",
      isNull: "Is null",
      notNull: "Is not null"
    },
    minValue: "Min value",
    maxValue: "Max value",
    true: "True",
    false: "False",
    selectOption: "Select option",
    removeFilter: "Remove filter",
    dateFormat: "MM/dd/yyyy"
  },
  boolean: {
    true: "Yes",
    false: "No"
  },
  columnVisibility: {
    title: "Column Visibility",
    selectAll: "Show All",
    deselectAll: "Hide All",
    defaultSelection: "Reset to Default",
    buttonTitle: "Columns"
  },
  views: {
    title: "Table Views",
    saveView: "Save View",
    deleteView: "Delete View",
    setDefault: "Set as Default",
    newView: "New View",
    defaultView: "Default View",
    confirmDelete: "Are you sure you want to delete this view?",
    viewName: "View Name",
    viewDescription: "View Description"
  },
  pagination: {
    showing: "Showing",
    to: "to",
    of: "of",
    entries: "entries",
    next: "Next",
    previous: "Previous"
  },
  actions: {
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    add: "Add"
  }
})

// Format translation string with variables
export const formatTranslation = (
  template: string,
  variables: Record<string, string | number>
): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(variables[key] ?? ''))
}

// Create a partial translation that inherits from defaults
export const createPartialTranslation = (
  partial: Partial<TableTranslations>,
  defaults = getDefaultTranslations()
): TableTranslations => ({
  ...defaults,
  ...partial,
  filters: { ...defaults.filters, ...partial.filters },
  boolean: { ...defaults.boolean, ...partial.boolean },
  columnVisibility: { ...defaults.columnVisibility, ...partial.columnVisibility },
  views: { ...defaults.views, ...partial.views },
  pagination: { ...defaults.pagination, ...partial.pagination },
  actions: { ...defaults.actions, ...partial.actions }
})
// components/advanced-table/types/menu.types.ts

// Interfaces base para opciones de menú
// Configuración específica para menús de tabla y fila
// Sistema de grupos de menú
// Configuración de posicionamiento
// Gestión de estado de menú
// Props para triggers de menú
// Sistema de eventos
// Soporte para renderizado personalizado
// Configuración general de menú
// Funciones helper para:


// Creación de opciones de menú
// Validación de grupos
// Posiciones predefinidas

// Características notables:

// Soporte para iconos y estilos personalizados
// Control de permisos
// Mensajes de confirmación
// Posicionamiento flexible
// Animaciones
// Accesibilidad
// Condiciones de visualización
// Agrupación de opciones

import { ReactNode } from 'react'
import { DataItem } from './table.types'

// Basic menu item interface
export interface MenuItem {
  key: string                           // Unique identifier for the item
  label: string                         // Display text
  icon?: ReactNode                      // Optional icon component
  disabled?: boolean                    // Optional disabled state
  className?: string                    // Optional custom styling
  tooltip?: string                      // Optional tooltip text
  visible?: boolean                     // Optional visibility control
}

// Table-level menu option
export interface TableOption extends MenuItem {
  action: () => void                    // Action to execute
  position?: 'left' | 'right'          // Optional positioning
  priority?: number                     // Optional display priority
  requiredPermission?: string          // Optional permission check
  confirmMessage?: string              // Optional confirmation message
}

// Row-level menu option
export interface RowOption<T extends DataItem> extends MenuItem {
  action: (item: T) => void            // Action to execute with row data
  showCondition?: (item: T) => boolean // Conditional display logic
  confirmMessage?: (item: T) => string // Dynamic confirmation message
  danger?: boolean                     // Marks as dangerous action
  requiredPermission?: string         // Optional permission check
}

// Menu group for organizing options
export interface MenuGroup {
  key: string                          // Group identifier
  label: string                        // Group label
  icon?: ReactNode                     // Optional group icon
  items: MenuItem[]                    // Items in group
  collapsed?: boolean                  // Initial collapsed state
}

// Menu position configuration
export interface MenuPosition {
  align?: 'left' | 'right' | 'center'             // Horizontal alignment
  verticalAlign?: 'top' | 'bottom'  | 'center'    // Vertical alignment
  offset?: [number, number]                       // [x, y] offset from anchor
  flip?: boolean                                  // Allow flipping when near viewport edge
  preventOverflow?: boolean                       // Prevent overflow from viewport
}

// Menu state for managing UI
export interface MenuState {
  isOpen: boolean                      // Current open state
  activeItem?: string                  // Currently active item key
  position?: MenuPosition              // Current menu position
  context?: any                        // Additional context data
}

// Menu trigger props
export interface MenuTriggerProps {
  className?: string                   // Optional custom styling
  disabled?: boolean                   // Optional disabled state
  tabIndex?: number                    // Optional tab index
  'aria-label'?: string               // Accessibility label
  children?: ReactNode                // Trigger content
}

// Menu events
export interface MenuEvents {
  onOpen?: () => void                  // Called when menu opens
  onClose?: () => void                // Called when menu closes
  onSelect?: (key: string) => void    // Called when item selected
  onChange?: (open: boolean) => void  // Called when open state changes
}

// Custom menu renderer
export interface CustomMenuRenderer<T extends DataItem> {
  renderTrigger?: (props: MenuTriggerProps) => ReactNode
  renderItem?: (item: MenuItem, index: number) => ReactNode
  renderGroup?: (group: MenuGroup) => ReactNode
  renderSeparator?: () => ReactNode
}

// Menu configuration
export interface MenuConfig extends MenuEvents {
  closeOnSelect?: boolean             // Close menu after selection
  closeOnClickOutside?: boolean       // Close when clicking outside
  preventScroll?: boolean            // Prevent page scroll when open
  trapFocus?: boolean               // Trap focus within menu
  placement?: string               // Menu placement relative to trigger
  animation?: {                   // Animation configuration
    enter: string
    leave: string
    duration: number
  }
}

// Helper functions for menu management
export const createTableOption = (
  key: string,
  label: string,
  action: () => void,
  options?: Partial<Omit<TableOption, 'key' | 'label' | 'action'>>
): TableOption => ({
  key,
  label,
  action,
  ...options
})

export const createRowOption = <T extends DataItem>(
  key: string,
  label: string,
  action: (item: T) => void,
  options?: Partial<Omit<RowOption<T>, 'key' | 'label' | 'action'>>
): RowOption<T> => ({
  key,
  label,
  action,
  ...options
})

// Type guard for menu groups
export const isMenuGroup = (item: MenuItem | MenuGroup): item is MenuGroup => {
  return 'items' in item
}

// Default menu positions
export const MENU_POSITIONS = {
  TOP_LEFT: { align: 'left', verticalAlign: 'top' } as MenuPosition,
  TOP_RIGHT: { align: 'right', verticalAlign: 'top' } as MenuPosition,
  BOTTOM_LEFT: { align: 'left', verticalAlign: 'bottom' } as MenuPosition,
  BOTTOM_RIGHT: { align: 'right', verticalAlign: 'bottom' } as MenuPosition,
  CENTER: { align: 'center', verticalAlign: 'center' } as MenuPosition
}
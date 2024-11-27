// constants/tableConstants.ts

export const TABLE_CONSTANTS = {
  VISIBLE_HEIGHT: 380,   // Default visible height of the table body
  HEADER_HEIGHT: 48,     // Height of the table header
  ROW_HEIGHT: 60,       // Height of each table row
  FOOTER_HEIGHT: 48,    // Height of the table footer
  MOBILE_BREAKPOINT: 768, // Mobile breakpoint in pixels
  MIN_COLUMN_WIDTH: 50,  // Minimum column width in pixels
  MAX_COLUMN_WIDTH: 500, // Maximum column width in pixels
  SCROLL_THRESHOLD: 1.5, // Threshold for infinite scroll trigger
} as const

export const TRANSITIONS = {
  DURATION: 300,        // Default transition duration in ms
  EDIT_PANEL: {         // Edit panel specific transitions
    ENTER: 'editRowTransitionEnter',
    ENTER_ACTIVE: 'editRowTransitionEnterActive',
    EXIT: 'editRowTransitionExit',
    EXIT_ACTIVE: 'editRowTransitionExitActive'
  }
} as const

// CSS class names used throughout the table
export const CLASS_NAMES = {
  TABLE_CONTAINER: 'tableContainer',
  TABLE_HEADER: 'tableHeader',
  TABLE_BODY: 'tableBody',
  TABLE_FOOTER: 'tableFooter',
  SCROLLABLE_CONTENT: 'scrollableContent',
  MOBILE_CARD: 'mobileCard',
  EDIT_ROW: 'editRow',
  OVERLAY: 'overlay'
} as const

// Event debounce delays
export const DEBOUNCE = {
  SCROLL: 150,          // Scroll event debounce delay
  SEARCH: 300,          // Search input debounce delay
  RESIZE: 250          // Window resize debounce delay
} as const

// Default values
export const DEFAULTS = {
  PAGE_SIZE: 10,        // Default items per page
  OVERSCAN_COUNT: 5,    // Default row overscan for virtualization
  MOBILE_PAGE_SIZE: 5   // Default items per page on mobile
} as const
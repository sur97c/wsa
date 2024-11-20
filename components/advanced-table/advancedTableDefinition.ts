// components/advanced-table/advancedTableDefinition.ts

// =======================================
// Base Types
// =======================================
export type CellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | React.ReactNode;

export type DataItem<
  T extends Record<string, CellValue> = Record<string, CellValue>,
  IdType = string | number
> = {
  id: IdType;
} & T;

// =======================================
// Column Definitions
// =======================================
export type Alignment = "left" | "center" | "right" | "justify";

export type ColumnType = "string" | "number" | "date" | "boolean" | "select";

export interface Column<T extends DataItem> {
  key: keyof T;
  type: ColumnType;
  label?: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  align?: Alignment;
  fetchOptions?: () => Promise<string[]>;
  width?: string;
}

// =======================================
// Table and Row Options
// =======================================
export interface TableOption {
  key: string;
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

export interface RowOption<T extends DataItem> {
  key: string;
  label: string;
  action: (item: T) => void;
  icon?: React.ReactNode;
}

// =======================================
// Filter Definitions
// =======================================
export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "contains";

export interface Filter<T extends DataItem> {
  column: keyof T;
  operator: FilterOperator | null;
  value: string | number | boolean | [string | number, string | number] | null;
}

export interface FilterOperatorOption {
  value: FilterOperator;
  label: string;
}

// =======================================
// Translation Interfaces
// =======================================
export type OperatorTranslations = {
  [K in FilterOperator]: string;
};

export interface TableTranslations {
  searchPlaceholder: string;
  loading: string;
  noResults: string;
  addButton: string;
  showingResults: string;
  noMoreData: string;
  loadingMore: string;
  page: string;
  actions: string;
  addEditTitle: string;
  save: string;
  cancel: string;
  filters: {
    selectColumn: string;
    selectOperator: string;
    filterValue: string;
    operators: OperatorTranslations;
    minValue: string;
    maxValue: string;
    true: string;
    false: string;
    selectOption: string;
    removeFilter: string;
    dateFormat: string;
  };
  boolean: {
    true: string;
    false: string;
  };
}

// =======================================
// Component Props
// =======================================
export interface BaseTableProps<T extends DataItem> {
  columns: Column<T>[];
  fetchData: (
    page: number,
    itemsPerPage: number,
    searchTerm: string,
    sortColumn: keyof T | null,
    sortDirection: "asc" | "desc",
    filters: Filter<T>[]
  ) => Promise<T[]>;
  itemsPerPage?: number;
  tableOptions?: TableOption[];
  rowOptions?: RowOption<T>[];
  enableFilters?: boolean;
  isEditing?: boolean;
  editComponent?: React.ReactNode;
  onCloseEdit?: () => void;
  onAdd?: () => void;
  searchPlaceholder?: string;
}

export interface TranslatedTableProps<T extends DataItem> {
  translations: {
    columns: Column<T>[];
    tableOptions: TableOption[];
    rowOptions: RowOption<T>[];
    tableTranslations: TableTranslations;
  };
}

export type AdvancedTableProps<T extends DataItem> = BaseTableProps<T> &
  Partial<TranslatedTableProps<T>>;

// =======================================
// Constants
// =======================================
export const TABLE_CONSTANTS = {
  VISIBLE_HEIGHT: 380,
  HEADER_HEIGHT: 48,
  ROW_HEIGHT: 60,
} as const;

// =======================================
// Helper Functions
// =======================================
export function getDefaultTranslations(searchPlaceholder: string | undefined): TableTranslations {
  return {
    searchPlaceholder: searchPlaceholder || "Search...",
    loading: "Loading...",
    noResults: "No results found",
    addButton: "Add",
    showingResults: "Showing {{count}} results, page {{page}}",
    noMoreData: "No more data to load",
    loadingMore: "Loading more results...",
    page: "Page",
    actions: "Actions",
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
      },
      minValue: "Min value",
      maxValue: "Max value",
      true: "True",
      false: "False",
      selectOption: "Select option",
      removeFilter: "Remove filter",
      dateFormat: "MM/dd/yyyy",
    },
    boolean: {
      true: "Yes",
      false: "No",
    },
  }
};
// advanced-table/advanceTableDefinition.ts

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

export type Alignment = "left" | "center" | "right" | "justify";

export type ColumnType = "string" | "number" | "date" | "boolean" | "select";

export interface Column<T extends DataItem> {
  key: keyof T;
  label: string;
  type: ColumnType;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  align?: Alignment;
  fetchOptions?: () => Promise<string[]>;
  width?: string;
}

export interface TableOption {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

export interface RowOption<T extends DataItem> {
  label: string;
  action: (item: T) => void;
  icon?: React.ReactNode;
}

export type FilterOperator =
  | "Select Operator"
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

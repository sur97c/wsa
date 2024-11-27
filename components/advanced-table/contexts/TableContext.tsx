// components/advanced-table/context/TableContext.tsx

import React, { createContext, useContext } from "react";
import { DataItem } from "../types/table.types";
import {
  TableState,
  TableStateActions,
  useTableState,
} from "../hooks/state/useTableState";

interface TableContextValue<T extends DataItem> {
  state: TableState<T>;
  actions: TableStateActions<T>;
}

interface TableProviderProps<T extends DataItem> {
  children: React.ReactNode;
  itemsPerPage: number;
  defaultVisibleColumns: string[];
}

// Crear el contexto con un valor inicial undefined
const TableContext = createContext<TableContextValue<any> | undefined>(
  undefined
);

// Hook personalizado para usar el contexto
export function useTableContext<T extends DataItem>() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error(
      "useTableContext debe ser usado dentro de un TableProvider"
    );
  }
  return context as TableContextValue<T>;
}

// Proveedor del contexto
export function TableProvider<T extends DataItem>({
  children,
  itemsPerPage,
  defaultVisibleColumns,
}: TableProviderProps<T>) {
  const [state, actions] = useTableState<T>(
    itemsPerPage,
    defaultVisibleColumns
  );

  const value = React.useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
}

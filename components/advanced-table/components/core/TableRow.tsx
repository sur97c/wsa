// components/advanced-table/components/core/TableRow.tsx

import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import type { DataItem } from "@components/advanced-table/types/table.types";
import type { Column } from "@components/advanced-table/types/column.types";
import {
  getColumnWidth,
  getAlignmentClass,
} from "@components/advanced-table/utils/helpers/tableHelpers";
import clsx from "clsx";

interface TableRowProps<T extends DataItem> {
  item: T;
  columns: Column<T>[];
  selected: boolean;
  onSelect: (id: string | number) => void;
  showMenu: boolean;
  onMenuToggle: (id: string | number | null) => void;
  renderCellContent: (column: Column<T>, item: T) => React.ReactNode;
}

const TableRow = <T extends DataItem>({
  item,
  columns,
  selected,
  onSelect,
  showMenu,
  onMenuToggle,
  renderCellContent,
}: TableRowProps<T>) => {
  const handleMenuToggle = useCallback(() => {
    onMenuToggle(showMenu ? null : item.id);
  }, [onMenuToggle, showMenu, item.id]);

  const handleSelect = useCallback(() => {
    onSelect(item.id);
  }, [onSelect, item.id]);

  return (
    <div
      className={clsx(
        "flex items-center bg-white border-b border-gray-200",
        "hover:bg-gray-50 transition-colors duration-150",
        { "bg-blue-50": selected }
      )}
    >
      {/* Checkbox column */}
      <div className="py-3 text-center w-12 flex-shrink-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleSelect}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Data columns */}
      {columns.map((column) => (
        <div
          key={String(column.key)}
          className={clsx(
            "py-3 px-2",
            getAlignmentClass(column.align),
            "truncate"
          )}
          style={{ width: getColumnWidth(column) }}
          title={String(item[column.key])}
        >
          {renderCellContent(column, item)}
        </div>
      ))}

      {/* Actions column */}
      <div className="py-3 text-center w-12 flex-shrink-0 relative">
        <button
          onClick={handleMenuToggle}
          className={clsx(
            "h-10 w-10 rounded-full flex items-center justify-center",
            "hover:bg-gray-200 transition-colors duration-150",
            { "bg-gray-100": showMenu }
          )}
          aria-label="Row actions"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </div>
    </div>
  );
};

export default TableRow;

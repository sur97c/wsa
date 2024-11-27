// components/advanced-table/components/core/TableRowMobile.tsx

import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import type { DataItem } from "@components/advanced-table/types/table.types";
import type { Column } from "@components/advanced-table/types/column.types";
import { getAlignmentClass } from "@components/advanced-table/utils/helpers/tableHelpers";
import clsx from "clsx";

interface TableRowMobileProps<T extends DataItem> {
  item: T;
  columns: Column<T>[];
  selected: boolean;
  onSelect: (id: string | number) => void;
  showMenu: boolean;
  onMenuToggle: (id: string | number | null) => void;
  renderCellContent: (column: Column<T>, item: T) => React.ReactNode;
}

const TableRowMobile = <T extends DataItem>({
  item,
  columns,
  selected,
  onSelect,
  showMenu,
  onMenuToggle,
  renderCellContent,
}: TableRowMobileProps<T>) => {
  const handleMenuToggle = useCallback(() => {
    onMenuToggle(showMenu ? null : item.id);
  }, [onMenuToggle, showMenu, item.id]);

  const handleSelect = useCallback(() => {
    onSelect(item.id);
  }, [onSelect, item.id]);

  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-sm border border-gray-200",
        "hover:border-gray-300 transition-colors duration-150",
        { "border-blue-500 bg-blue-50": selected }
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={handleSelect}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-600">
            ID: {item.id}
          </span>
        </div>
        <button
          onClick={handleMenuToggle}
          className={clsx(
            "h-8 w-8 rounded-full flex items-center justify-center",
            "hover:bg-gray-100 transition-colors duration-150",
            { "bg-gray-100": showMenu }
          )}
          aria-label="Row actions"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        {columns.map((column) => {
          if (column.key === "id") return null; // Skip ID column as it's shown in header

          return (
            <div key={String(column.key)} className="flex flex-col space-y-1">
              <span className="text-xs font-medium text-gray-500">
                {column.label}
              </span>
              <div className={clsx("text-sm", getAlignmentClass(column.align))}>
                {renderCellContent(column, item)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableRowMobile;

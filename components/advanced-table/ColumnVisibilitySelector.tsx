// components/advanced-table/ColumnVisibilitySelector.tsx

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faColumns,
  faCheck,
  faEye,
  faEyeSlash,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  Column,
  ColumnVisibility,
  TableTranslations,
} from "./advancedTableDefinition";
import { DataItem } from "./advancedTableDefinition";

interface ColumnVisibilitySelectorProps<T extends DataItem> {
  columns: Column<T>[];
  defaultVisibleColumns?: string[];
  onChange: (visibleColumns: string[]) => void;
  translations: TableTranslations;
}

const ColumnVisibilitySelector = <T extends DataItem>({
  columns,
  defaultVisibleColumns,
  onChange,
  translations,
}: ColumnVisibilitySelectorProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility[]>(
    []
  );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialVisibility = columns.map((column) => ({
      key: String(column.key),
      label: column.label || String(column.key),
      visible: defaultVisibleColumns
        ? defaultVisibleColumns.includes(String(column.key))
        : column.defaultVisible !== false,
      alwaysVisible: column.alwaysVisible,
    }));
    setColumnVisibility(initialVisibility);
    console.log(JSON.stringify(translations, null, 2));
  }, [columns, defaultVisibleColumns, translations]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    requestAnimationFrame(() => {
      document.addEventListener("mousedown", handleClickOutside);
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleColumn = (key: string) => {
    const newVisibility = columnVisibility?.map((col) => {
      if (col.key === key && !col.alwaysVisible) {
        return { ...col, visible: !col.visible };
      }
      return col;
    });
    setColumnVisibility(newVisibility);
    onChange(newVisibility.filter((col) => col.visible).map((col) => col.key));
  };

  const handleSelectAll = () => {
    const newVisibility = columnVisibility?.map((col) => ({
      ...col,
      visible: true,
    }));
    setColumnVisibility(newVisibility);
    onChange(newVisibility.filter((col) => col.visible).map((col) => col.key));
  };

  const handleDeselectAll = () => {
    const newVisibility = columnVisibility?.map((col) => ({
      ...col,
      visible: col.alwaysVisible || false,
    }));
    setColumnVisibility(newVisibility);
    onChange(newVisibility.filter((col) => col.visible).map((col) => col.key));
  };

  const handleResetToDefault = () => {
    const newVisibility = columnVisibility?.map((col) => ({
      ...col,
      visible: defaultVisibleColumns
        ? defaultVisibleColumns.includes(col.key)
        : col.defaultVisible !== false,
    }));
    setColumnVisibility(newVisibility);
    onChange(newVisibility.filter((col) => col.visible).map((col) => col.key));
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className={`
          flex items-center justify-center
          w-full px-3 py-2 rounded-md text-left
          md:w-10 md:h-10 md:rounded-full md:p-0
          ${
            isOpen
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={translations.columnVisibility?.buttonTitle}
      >
        <FontAwesomeIcon icon={faColumns} className="mr-2 md:mr-0" />
        <span className="block md:hidden">
          {translations.columnVisibility?.buttonTitle}
        </span>
      </button>

      {isOpen && (
        <div
          className="
          fixed inset-x-0 mx-4 mt-1
          bg-white rounded-md shadow-lg z-50 border border-gray-200
          md:inset-x-auto md:mx-0
          md:absolute md:right-0 md:mt-2 md:w-64"
          role="dialog"
          aria-label={translations.columnVisibility.title}
        >
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-2">
              <button
                type="button"
                className="flex items-center gap-2 px-2 py-1 text-sm text-blue-600 hover:text-blue-800 rounded hover:bg-gray-50"
                onClick={handleSelectAll}
              >
                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                <span>{translations.columnVisibility.selectAll}</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 px-2 py-1 text-sm text-blue-600 hover:text-blue-800 rounded hover:bg-gray-50"
                onClick={handleDeselectAll}
              >
                <FontAwesomeIcon icon={faEyeSlash} className="w-4 h-4" />
                <span>{translations.columnVisibility.deselectAll}</span>
              </button>
            </div>
            <div className="px-2 pb-2">
              <button
                type="button"
                className="flex items-center gap-2 w-full px-2 py-1 text-sm text-blue-600 hover:text-blue-800 rounded hover:bg-gray-50"
                onClick={handleResetToDefault}
              >
                <FontAwesomeIcon icon={faRotateLeft} className="w-4 h-4" />
                <span>{translations.columnVisibility.defaultSelection}</span>
              </button>
            </div>
          </div>
          <div className="overflow-y-auto bg-white max-h-[50vh] md:max-h-64">
            {columnVisibility?.map((col) => (
              <div
                key={col.key}
                className={`
                  flex items-center px-4 py-3 hover:bg-gray-50
                  ${
                    col.alwaysVisible
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                onClick={() =>
                  !col.alwaysVisible && handleToggleColumn(col.key)
                }
              >
                <div className="flex-1 text-sm">{col.label}</div>
                <div className="w-6 text-blue-600">
                  {col.visible && <FontAwesomeIcon icon={faCheck} size="sm" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilitySelector;

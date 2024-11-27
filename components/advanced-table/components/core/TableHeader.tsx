// components/core/TableHeader.tsx

import React, { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons'
import type { DataItem } from '@components/advanced-table/types/table.types'
import type { Column } from '@components/advanced-table/types/column.types'
import type { SortDirection } from '@components/advanced-table/types/sort.types'
import type { TableTranslations } from '@components/advanced-table/types/translation.types'
import { getAlignmentClass } from '@components/advanced-table/utils/helpers/tableHelpers'
import clsx from 'clsx'

interface TableHeaderProps<T extends DataItem> {
  columns: Column<T>[]
  sortColumn: keyof T | null
  sortDirection: SortDirection
  onSort: (column: string) => void
  visibleColumns: string[]
  searchTerm: string
  onSearch: (term: string) => void
  isEditing: boolean
  height: number
  translations: TableTranslations
}

const TableHeader = <T extends DataItem>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  visibleColumns,
  searchTerm,
  onSearch,
  isEditing,
  height,
  translations,
}: TableHeaderProps<T>) => {

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value)
    },
    [onSearch]
  )

  const renderSearchField = useCallback(() => (
    <div className="relative flex-grow mb-2 md:mb-0">
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2"
      />
      <input
        type="text"
        placeholder={translations.searchPlaceholder}
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
        onChange={handleSearch}
        value={searchTerm}
      />
    </div>
  ), [searchTerm, translations.searchPlaceholder, handleSearch])

  const getColumnWidth = useCallback((column: Column<T>): string => {
    if (!column.width) return 'auto'
    
    if (typeof column.width === 'object') {
      return column.width.default || 'auto'
    }
    
    return column.width
  }, [])

  const renderColumnHeaders = useCallback(() => (
    <div
      className="flex text-gray-600 text-sm bg-gray-100 tableHeader"
      style={{
        height: `${height}px`,
        filter: isEditing ? 'blur(0.1px)' : 'none',
        pointerEvents: isEditing ? 'none' : 'auto',
      }}
    >
      <div className="py-3 text-center w-12 flex-shrink-0">
        <input type="checkbox" disabled />
      </div>
      {columns.filter(col => 
        visibleColumns.includes(String(col.key)) || col.alwaysVisible
      ).map((column) => (
        <div
          key={String(column.key)}
          className={clsx(
            'py-3 px-2 cursor-pointer flex items-center justify-center text-center',
            getAlignmentClass(column.align)
          )}
          style={{ width: getColumnWidth(column) }}
          onClick={() => onSort(column.key as string)}
        >
          <div className="flex items-center justify-center">
            {column.label}
            {sortColumn === column.key && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={clsx('ml-1', {
                  'transform rotate-180': sortDirection === 'asc'
                })}
              />
            )}
          </div>
        </div>
      ))}
      <div className="py-3 text-center w-12 flex-shrink-0"></div>
    </div>
  ), [columns, height, isEditing, onSort, sortColumn, sortDirection, visibleColumns, getColumnWidth])

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {renderSearchField()}
      {renderColumnHeaders()}
    </div>
  )
}

export default TableHeader
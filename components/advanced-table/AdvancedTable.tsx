// components/advanced-table/AdvancedTable.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSearch,
    faEllipsisVertical,
    faChevronDown,
    faSpinner,
    faTimes,
    faFilter
} from '@fortawesome/free-solid-svg-icons'

export type CellValue = string | number | boolean | Date | null | React.ReactNode

export type DataItem<T extends Record<string, CellValue> = Record<string, CellValue>, IdType = string | number> = {
    id: IdType
} & T

type Alignment = 'left' | 'center' | 'right' | 'justify'

export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'select'

export interface Column<T extends DataItem> {
    key: keyof T
    label: string
    type: ColumnType
    render?: (value: T[keyof T], item: T) => React.ReactNode
    align?: Alignment
    fetchOptions?: () => Promise<string[]>
    width?: string
}

export interface TableOption {
    label: string
    action: () => void
    icon?: React.ReactNode
}

export interface RowOption<T extends DataItem> {
    label: string
    action: (item: T) => void
    icon?: React.ReactNode
}

type FilterOperator = 'Select Operator' | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'contains'

interface Filter<T extends DataItem> {
    column: keyof T
    operator: FilterOperator | null
    value: string | number | boolean | [string | number, string | number] | null
}

export interface AdvancedTableProps<T extends DataItem> {
    columns: Column<T>[]
    fetchData: (
        page: number,
        itemsPerPage: number,
        searchTerm: string,
        sortColumn: keyof T | null,
        sortDirection: 'asc' | 'desc',
        filters: Filter<T>[]
    ) => Promise<T[]>
    itemsPerPage?: number
    searchPlaceholder?: string
    tableOptions?: TableOption[]
    rowOptions?: RowOption<T>[]
    enableFilters?: boolean
}

function AdvancedTable<T extends DataItem>({
    columns,
    fetchData,
    itemsPerPage = 50,
    searchPlaceholder = 'Buscar...',
    tableOptions = [],
    rowOptions = [],
    enableFilters = false,
}: AdvancedTableProps<T>) {
    const [data, setData] = useState<T[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [selectedRows, setSelectedRows] = useState<(number | string)[]>([])
    const [allSelected, setAllSelected] = useState(false)
    const [showTableMenu, setShowTableMenu] = useState(false)
    const [showRowMenu, setShowRowMenu] = useState<number | string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [filters, setFilters] = useState<Filter<T>[]>([])
    const [selectedColumn, setSelectedColumn] = useState<Column<T> | null>(null)
    const [filterValue, setFilterValue] = useState<string | number | boolean | [string | number, string | number] | null>(null)
    const [selectedOperator, setSelectedOperator] = useState<FilterOperator | null>(null)
    const [selectOptions, setSelectOptions] = useState<string[]>([])

    const tableBodyRef = useRef<HTMLDivElement>(null)

    const loadMoreData = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setError(null);
        try {
            const newData = await fetchData(page, itemsPerPage, searchTerm, sortColumn, sortDirection, filters);
            if (newData.length < itemsPerPage) {
                setHasMore(false);
            }
            setData(prevData => [...prevData, ...newData]);
            if (hasMore && newData.length )
                setPage(prevPage => prevPage + 1);
            console.log('Loaded page:', page);
        } catch (err) {
            setError('Error fetching data. Please try again.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [page, itemsPerPage, searchTerm, sortColumn, sortDirection, filters, fetchData, loading, hasMore]);

    useEffect(() => {
        const handleScroll = () => {
            if (tableBodyRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current;
                if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
                    loadMoreData();
                }
            }
        };

        const currentTableBody = tableBodyRef.current;
        if (currentTableBody) {
            currentTableBody.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentTableBody) {
                currentTableBody.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading, hasMore, loadMoreData]);

    useEffect(() => {
        const initialLoad = async () => {
            if (data.length === 0) {
                setLoading(true);
                try {
                    const initialData = await fetchData(1, itemsPerPage, searchTerm, sortColumn, sortDirection, filters);
                    setData(initialData);
                    if (initialData.length < itemsPerPage) {
                        setHasMore(false);
                    }
                    setPage(2)
                } catch (err) {
                    setError('Error fetching initial data. Please try again.');
                    console.error('Error fetching initial data:', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        initialLoad();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(1)
        setData([])
        setHasMore(true)
    }

    const handleSort = (column: keyof T) => {
        setSortDirection(prevDirection =>
            sortColumn === column && prevDirection === 'asc' ? 'desc' : 'asc'
        )
        setSortColumn(column)
        setPage(1)
        setData([])
        setHasMore(true)
    }

    const handleRowSelect = (id: number | string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedRows([])
        } else {
            setSelectedRows(data.map(item => item.id))
        }
        setAllSelected(!allSelected)
    }

    const renderTableHeader = () => (
        <div className="bg-gray-200 text-gray-600 text-sm leading-normal hidden sm:flex">
            <div className="py-3 text-center w-12 flex-shrink-0">
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                />
            </div>
            {columns.map((column) => (
                <div
                    key={String(column.key)}
                    className={`py-3 px-2 cursor-pointer ${getAlignmentClass(column.align)}`}
                    style={{ width: column.width || 'auto' }}
                    onClick={() => handleSort(column.key)}
                >
                    <div className="flex items-center justify-center">
                        {column.label}
                        {sortColumn === column.key && (
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                            />
                        )}
                    </div>
                </div>
            ))}
            <div className="py-3 text-center w-24 flex-shrink-0">Actions</div>
        </div>
    )

    const renderCellContent = (column: Column<T>, item: T): React.ReactNode => {
        const value = item[column.key]
        let content: React.ReactNode

        if (column.render) {
            content = column.render(value, item)
        } else if (React.isValidElement(value)) {
            content = value
        } else if (typeof value === 'object') {
            content = JSON.stringify(value)
        } else {
            content = String(value)
        }

        const alignmentClass = getAlignmentClass(column.align)

        return <div className={`w-full ${alignmentClass}`}>{content}</div>
    }

    const getAlignmentClass = (align?: Alignment): string => {
        switch (align) {
            case 'left': return 'text-left'
            case 'center': return 'text-center'
            case 'right': return 'text-right'
            case 'justify': return 'text-justify'
            default: return 'text-left'
        }
    }

    const renderTableRow = (item: T) => (
        <div className="hidden sm:flex sm:items-center bg-white border-b border-gray-200 hover:bg-gray-100">
            <div className="py-3 text-center whitespace-nowrap w-12 flex-shrink-0">
                <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                />
            </div>
            {columns.map((column) => (
                <div
                    key={String(column.key)}
                    className={`py-3 px-2 ${getAlignmentClass(column.align)}`}
                    style={{ width: column.width || 'auto' }}>
                    {renderCellContent(column, item)}
                </div>
            ))}
            <div className="py-3 text-center whitespace-nowrap w-24 flex-shrink-0">
                <div className="relative">
                    <button
                        className="p-1 rounded-full hover:bg-gray-200"
                        onClick={() => setShowRowMenu(showRowMenu === item.id ? null : item.id)}
                    >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    {showRowMenu === item.id && renderRowMenu(item)}
                </div>
            </div>
        </div>
    )

    const renderCard = (item: T) => (
        <div className="sm:hidden bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
                <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                    className="mr-2"
                />
                <button
                    className="p-1 rounded-full hover:bg-gray-200"
                    onClick={() => setShowRowMenu(showRowMenu === item.id ? null : item.id)}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
            </div>
            {columns.map((column) => (
                <div key={String(column.key)} className="flex mb-2">
                    <span className="font-bold mr-2">{column.label}:</span>
                    <span>{renderCellContent(column, item)}</span>
                </div>
            ))}
            {showRowMenu === item.id && renderRowMenu(item)}
        </div>
    )

    const renderRowMenu = (item: T) => (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
            {rowOptions.map((option, index) => (
                <button
                    key={index}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                        option.action(item)
                        setShowRowMenu(null)
                    }}
                >
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                </button>
            ))}
        </div>
    )

    const renderTableMenu = () => (
        <div className='relative'>
            <div className="absolute right-0 mt-4 w-48 bg-white rounded-md shadow-lg z-20">
                {tableOptions.map((option, index) => (
                    <button
                        key={index}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                            option.action()
                            setShowRowMenu(null)
                        }}
                    >
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )

    const addFilter = () => {
        if (selectedColumn && filterValue) {
            setFilters(prev => [...prev, {
                column: selectedColumn.key,
                operator: selectedOperator,
                value: filterValue
            }])
            setSelectedColumn(null)
            setSelectedOperator('eq')
            setFilterValue('')
            setSelectOptions([])
            setPage(1)
            setData([])
            setHasMore(true)
        }
    }

    const removeFilter = (index: number) => {
        setFilters(prev => prev.filter((_, i) => i !== index))
        setPage(1)
        setData([])
        setHasMore(true)
    }

    const renderFilterInput = () => {
        if (!selectedColumn) return null

        switch (selectedColumn.type) {
            case 'string':
                return (
                    <input
                        type="text"
                        className="sm:mr-2 p-2 border rounded"
                        placeholder="Filter value"
                        value={filterValue as string}
                        onChange={(e) => setFilterValue(e.target.value)}
                    />
                )
            case 'number':
                if (selectedOperator === 'between') {
                    return (
                        <>
                            <input
                                type="number"
                                className="sm:mr-2 p-2 border rounded"
                                placeholder="Min value"
                                value={(filterValue as [number, number])[0] || ''}
                                onChange={(e) => setFilterValue([Number(e.target.value), (filterValue as [number, number])[1] || 0])}
                            />
                            <input
                                type="number"
                                className="sm:mr-2 p-2 border rounded"
                                placeholder="Max value"
                                value={(filterValue as [number, number])[1] || ''}
                                onChange={(e) => setFilterValue([(filterValue as [number, number])[0] || 0, Number(e.target.value)])}
                            />
                        </>
                    )
                }
                return (
                    <input
                        type="number"
                        className="sm:mr-2 p-2 border rounded"
                        placeholder="Filter value"
                        value={filterValue as number}
                        onChange={(e) => setFilterValue(Number(e.target.value))}
                    />
                )
            case 'date':
                if (selectedOperator === 'between') {
                    return (
                        <>
                            <input
                                type="date"
                                className="sm:mr-2 p-2 border rounded"
                                value={(filterValue as [string, string])[0] || ''}
                                onChange={(e) => setFilterValue([e.target.value, (filterValue as [string, string])[1] || ''])}
                            />
                            <input
                                type="date"
                                className="sm:mr-2 p-2 border rounded"
                                value={(filterValue as [string, string])[1] || ''}
                                onChange={(e) => setFilterValue([(filterValue as [string, string])[0] || '', e.target.value])}
                            />
                        </>
                    )
                }
                return (
                    <input
                        type="date"
                        className="sm:mr-2 p-2 border rounded"
                        value={filterValue as string}
                        onChange={(e) => setFilterValue(e.target.value)}
                    />
                )
            case 'boolean':
                return (
                    <div className="mr-2 flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={filterValue as boolean}
                            onChange={(e) => setFilterValue(e.target.checked)}
                        />
                        <span>{filterValue ? 'True' : 'False'}</span>
                    </div>
                )
            case 'select':
                return (
                    <select
                        className="sm:mr-2 p-2 border rounded"
                        value={filterValue as string}
                        onChange={(e) => setFilterValue(e.target.value)}
                    >
                        <option value="">Select option</option>
                        {selectOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )
            default:
                return null
        }
    }

    const renderFilterOperatorSelect = () => {
        if (!selectedColumn) return null

        const operators: FilterOperator[] = ['eq', 'neq']
        if (selectedColumn.type === 'number' || selectedColumn.type === 'date') {
            operators.push('gt', 'gte', 'lt', 'lte', 'between')
        }
        if (selectedColumn.type === 'string') {
            operators.push('contains')
        }

        return (
            <>
                <select
                    className="border border-gray-300 rounded-md bg-white whitespace-nowrap sm:mr-2"
                    value={selectedOperator || ''}
                    onChange={(e) => setSelectedOperator(e.target.value as FilterOperator)}
                >
                    {operators.map((op) => (
                        <option key={op} value={op}>
                            {op}
                        </option>
                    ))}
                </select>
                {
                    selectedOperator &&
                    <div className='flex flex-row'>
                        {renderFilterInput()}
                        {
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
                                onClick={addFilter}
                                disabled={!selectedColumn || !filterValue}
                            >
                                <FontAwesomeIcon icon={faFilter} />
                            </button>
                            // <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            //     </svg>
                            // </button>
                        }
                    </div>
                    //     <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    //     </svg>
                    // </button>
                }
            </>
        )
    }

    const renderFilterSection = () => (
        <div className="flex flex-wrap sm:flex-nowrap w-auto">
            <select
                className="border border-gray-300 rounded-md bg-white whitespace-nowrap sm:mr-2"
                value={selectedColumn ? String(selectedColumn.key) : ''}
                onChange={async (e) => {
                    const column = columns.find(col => String(col.key) === e.target.value)
                    setSelectedColumn(column || null)
                    setSelectedOperator('eq')
                    setFilterValue('')
                    if (column && column.type === 'select' && column.fetchOptions) {
                        const options = await column.fetchOptions()
                        setSelectOptions(options)
                    }
                }}
            >
                <option value="">Select column</option>
                {columns.map((column) => (
                    <option key={String(column.key)} value={String(column.key)}>
                        {column.label}
                    </option>
                ))}
            </select>
            {renderFilterOperatorSelect()}
        </div>

        // <div className="flex flex-row flex-wrap items-center mb-2 sm:flex-nowrap">
        //     <select
        //         className="p-2 border rounded"
        //         value={selectedColumn ? String(selectedColumn.key) : ''}
        //         onChange={async (e) => {
        //             const column = columns.find(col => String(col.key) === e.target.value)
        //             setSelectedColumn(column || null)
        //             setSelectedOperator('eq')
        //             setFilterValue('')
        //             if (column && column.type === 'select' && column.fetchOptions) {
        //                 const options = await column.fetchOptions()
        //                 setSelectOptions(options)
        //             }
        //         }}
        //     >
        //         <option value="">Select column</option>
        //         {columns.map((column) => (
        //             <option key={String(column.key)} value={String(column.key)}>
        //                 {column.label}
        //             </option>
        //         ))}
        //     </select>
        //     {renderFilterOperatorSelect()}
        //     {
        //         selectedOperator &&
        //         <div className='flex flex-row'>
        //             {renderFilterInput()}
        //             <button
        //                 className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 m-2"
        //                 onClick={addFilter}
        //                 disabled={!selectedColumn || !filterValue}
        //             >
        //                 <FontAwesomeIcon icon={faFilter} />
        //             </button>
        //         </div>
        //     }
        // </div>
    )

    return (
        <div className="border-2 border-gray-200 flex flex-col h-full rounded-lg shadow-lg w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 p-4 border-b-2">
                {/* Search Bar */}
                <div className='flex flex-wrap w-full'>
                    <div className="relative w-full sm:flex-grow">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                            onChange={handleSearch}
                            value={searchTerm}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>
                </div>
                {/* Filters Options */}
                {enableFilters && renderFilterSection()}
                {/* Table Options */}
                <button className="px-2 py-2 bg-gray-200 text-gray-600 rounded-md"
                    onClick={() => setShowTableMenu(!showTableMenu)}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
                {showTableMenu && renderTableMenu()}
            </div>
            {filters.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 p-4 border-b-2">
                    {/* Filter Tags */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {filters.map((filter, index) => (
                            <div key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                                <span>{`${String(filter.column)} ${filter.operator} ${filter.value}`}</span>
                                <button
                                    className="ml-2 text-gray-600 hover:text-gray-800"
                                    onClick={() => removeFilter(index)}
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && <div className="text-red-500 p-4">{error}</div>}

            {/* Table/Card Container */}
            <div className="flex-grow flex flex-col overflow-hidden">
                {renderTableHeader()}

                {/* Table Body / Card List */}
                <div
                    ref={tableBodyRef}
                    className="flex-grow overflow-y-auto"
                    style={{ maxHeight: 'calc(100vh - 300px)' }} // Ajusta este valor según sea necesario
                >
                    {data.map((item) => (
                        <React.Fragment key={item.id}>
                            {renderTableRow(item)}
                            {renderCard(item)}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 p-4">
                {/* Loading indicator */}
                {loading && (
                    <div className="text-center py-2">
                        <FontAwesomeIcon icon={faSpinner} spin size="lg" />
                    </div>
                )}

                {/* No more data message */}
                {!hasMore && data.length > 0 && (
                    <div className="text-center py-2 text-gray-500">No more data to load</div>
                )}

                {/* No data message */}
                {data.length === 0 && !loading && !error && (
                    <div className="text-center py-2 text-gray-500">No data available</div>
                )}

                {/* Results count */}
                {data.length > 0 && (
                    <div className="text-gray-500 text-sm">
                        Showing {data.length} results, page {page - 1}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdvancedTable
// components/advanced-table/AdvancedTable.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faEllipsisVertical,
    faChevronDown,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';

export type CellValue = string | number | boolean | Date | null | React.ReactNode;

export type DataItem<T extends Record<string, CellValue> = Record<string, CellValue>, IdType = string | number> = {
    id: IdType;
} & T;

type Alignment = 'left' | 'center' | 'right' | 'justify';

export interface Column<T extends DataItem> {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    align?: Alignment;
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

export interface AdvancedTableProps<T extends DataItem> {
    columns: Column<T>[];
    fetchData: (
        page: number,
        itemsPerPage: number,
        searchTerm: string,
        sortColumn: keyof T | null,
        sortDirection: 'asc' | 'desc'
    ) => Promise<T[]>;
    itemsPerPage?: number;
    searchPlaceholder?: string;
    tableOptions?: TableOption[];
    rowOptions?: RowOption<T>[];
}

function AdvancedTable<T extends DataItem>({
    columns,
    fetchData,
    itemsPerPage = 50,
    searchPlaceholder = 'Buscar...',
    tableOptions = [],
    rowOptions = [],
}: AdvancedTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
    const [allSelected, setAllSelected] = useState(false);
    const [showTableMenu, setShowTableMenu] = useState(false);
    const [showRowMenu, setShowRowMenu] = useState<number | string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const tableBodyRef = useRef<HTMLDivElement>(null);

    const loadMoreData = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setError(null);
        try {
            const newData = await fetchData(page, itemsPerPage, searchTerm, sortColumn, sortDirection);
            if (newData.length < itemsPerPage) {
                setHasMore(false);
            }
            setData(prevData => [...prevData, ...newData]);
        } catch (err) {
            setError('Error fetching data. Please try again.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, sortColumn, sortDirection, fetchData, itemsPerPage, hasMore, loading]);

    useEffect(() => {
        loadMoreData();
    }, [loadMoreData]);

    useEffect(() => {
        const handleScroll = () => {
            if (tableBodyRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current;
                if (scrollHeight - scrollTop <= clientHeight * 1.5) {
                    setPage(prevPage => prevPage + 1);
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
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
        setData([]);
        setHasMore(true);
    };

    const handleSort = (column: keyof T) => {
        setSortDirection(prevDirection =>
            sortColumn === column && prevDirection === 'asc' ? 'desc' : 'asc'
        );
        setSortColumn(column);
        setPage(1);
        setData([]);
        setHasMore(true);
    };

    const handleRowSelect = (id: number | string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.map(item => item.id));
        }
        setAllSelected(!allSelected);
    };

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
                    className={`py-3 flex-1 cursor-pointer ${getAlignmentClass(column.align)}`}
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
    );

    const renderCellContent = (column: Column<T>, item: T): React.ReactNode => {
        const value = item[column.key];
        let content: React.ReactNode;

        if (column.render) {
            content = column.render(value, item);
        } else if (React.isValidElement(value)) {
            content = value;
        } else if (typeof value === 'object') {
            content = JSON.stringify(value);
        } else {
            content = String(value);
        }

        const alignmentClass = getAlignmentClass(column.align);

        return <div className={`w-full ${alignmentClass}`}>{content}</div>;
    };

    const getAlignmentClass = (align?: Alignment): string => {
        switch (align) {
            case 'left': return 'text-left';
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            case 'justify': return 'text-justify';
            default: return 'text-left';
        }
    };

    const renderTableRow = (item: T) => (
        <div className="hidden sm:flex bg-white border-b border-gray-200 hover:bg-gray-100">
            <div className="py-3 text-center whitespace-nowrap w-12 flex-shrink-0">
                <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                />
            </div>
            {columns.map((column) => (
                <div key={String(column.key)} className={`py-3 flex-1 ${getAlignmentClass(column.align)}`}>
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
    );

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
                <div key={String(column.key)} className="mb-2">
                    <span className="font-bold">{column.label}: </span>
                    <span>{renderCellContent(column, item)}</span>
                </div>
            ))}
            {showRowMenu === item.id && renderRowMenu(item)}
        </div>
    );

    const renderRowMenu = (item: T) => (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
            {rowOptions.map((option, index) => (
                <button
                    key={index}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                        option.action(item);
                        setShowRowMenu(null);
                    }}
                >
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="border-2 border-gray-200 flex flex-col h-full rounded-lg shadow-lg w-full">
            {/* Header */}
            <div className="bg-white z-10 p-4 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                            onChange={handleSearch}
                            value={searchTerm}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Table Options */}
                    <div className="relative">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={() => setShowTableMenu(!showTableMenu)}
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {showTableMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                {tableOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            option.action();
                                            setShowTableMenu(false);
                                        }}
                                    >
                                        {option.icon && <span className="mr-2">{option.icon}</span>}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                        Showing {data.length} results
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdvancedTable;
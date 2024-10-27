// components/advanced-table/AdvancedTable.tsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEllipsisVertical,
  faChevronDown,
  faSpinner,
  faTimes,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FixedSizeList } from "react-window";
import debounce from "lodash/debounce";
import {
  Alignment,
  Column,
  DataItem,
  Filter,
  FilterOperator,
  RowOption,
  TableOption,
} from "./advancedTableDefinition";
import TableContainer from "@components/table-container/TableContainer";
import { CSSTransition } from "react-transition-group";
import styles from "./AdvancedTable.module.scss";
import clsx from "clsx";

const EXTRA_WIDTH_PADDING = 40;
const HEADER_HEIGHT = 48;
const ROW_HEIGHT = 70;

export interface AdvancedTableProps<T extends DataItem> {
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
  searchPlaceholder?: string;
  tableOptions?: TableOption[];
  rowOptions?: RowOption<T>[];
  enableFilters?: boolean;
  isEditing?: boolean;
  editComponent?: React.ReactNode;
  onCloseEdit?: () => void;
  onAdd?: () => void;
}

function AdvancedTable<T extends DataItem>({
  columns,
  fetchData,
  itemsPerPage = 50,
  searchPlaceholder = "Buscar...",
  tableOptions = [],
  rowOptions = [],
  enableFilters = false,
  isEditing = false,
  editComponent,
  onCloseEdit,
  onAdd,
}: AdvancedTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showRowMenu, setShowRowMenu] = useState<number | string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<Filter<T>[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<Column<T> | null>(null);
  const [filterValue, setFilterValue] = useState<
    string | number | boolean | [string | number, string | number] | null
  >(null);
  const [selectedOperator, setSelectedOperator] =
    useState<FilterOperator | null>(null);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const editRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  if (onCloseEdit) console.log(onCloseEdit);

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const newData = await fetchData(
        page,
        itemsPerPage,
        searchTerm,
        sortColumn,
        sortDirection,
        filters
      );

      if (newData.length < itemsPerPage) {
        setHasMore(false);
      }

      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      setError("Error fetching data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    itemsPerPage,
    searchTerm,
    sortColumn,
    sortDirection,
    filters,
    fetchData,
    loading,
    hasMore,
  ]);

  const initialLoad = async () => {
    if (data.length === 0) {
      setLoading(true);
      try {
        const initialData = await fetchData(
          1,
          itemsPerPage,
          searchTerm,
          sortColumn,
          sortDirection,
          filters
        );
        setData(initialData);
        if (initialData.length < itemsPerPage) {
          setHasMore(false);
        }
        setPage(2);
      } catch (err) {
        setError("Error fetching initial data. Please try again.");
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleScroll = useCallback(
    debounce(
      ({
        scrollOffset,
        scrollDirection,
      }: {
        scrollOffset: number;
        scrollDirection: "forward" | "backward";
      }) => {
        // Solo nos interesa el scroll hacia abajo
        if (scrollDirection === "backward") return;

        const visibleHeight = 400; // O usar una variable/prop para la altura de la lista
        const totalHeight = ROW_HEIGHT * data.length;

        // Cargar más datos cuando nos acercamos al final
        if (
          totalHeight - scrollOffset <= visibleHeight * 1.5 &&
          !loading &&
          hasMore
        ) {
          loadMoreData();
        }
      },
      150
    ),
    [loading, hasMore, loadMoreData, data.length, ROW_HEIGHT]
  );

  useEffect(() => {
    initialLoad();
  });

  useEffect(() => {
    if (editRef.current && isEditing) {
      const heightValue = editRef.current.offsetHeight;
      setHeight(heightValue);
      document.documentElement.style.setProperty(
        "--edit-height",
        `${height}px`
      );
    }
    return () => {
      document.documentElement.style.removeProperty("--edit-height");
    };
  }, [isEditing]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setData([]);
    setHasMore(true);
  };

  const handleSort = (column: keyof T) => {
    setSortDirection((prevDirection) =>
      sortColumn === column && prevDirection === "asc" ? "desc" : "asc"
    );
    setSortColumn(column);
    setPage(1);
    setData([]);
    setHasMore(true);
  };

  const handleRowSelect = (id: number | string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((item) => item.id));
    }
    setAllSelected(!allSelected);
  };

  const renderTableHeader = () => (
    <div
      className="flex text-gray-600 text-sm bg-gray-100"
      style={{
        height: `${HEADER_HEIGHT}px`,
        filter: isEditing ? "blur(0.1px)" : "none",
        pointerEvents: isEditing ? "none" : "auto",
      }}
    >
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
          className={`py-3 px-2 cursor-pointer flex items-center justify-center`}
          style={{ width: column.width || "auto" }}
          onClick={() => handleSort(column.key)}
        >
          <div className="flex items-center justify-center">
            {column.label}
            {sortColumn === column.key && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ml-1 ${
                  sortDirection === "asc" ? "transform rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>
      ))}
      <div className="py-3 text-center w-24 flex-shrink-0">Actions</div>
    </div>
  );

  const renderTableRowEdit = (containerWidth: number) => {
    if (!isEditing) return null;

    return (
      <CSSTransition
        in={isEditing}
        timeout={300}
        classNames={{
          enter: styles.editRowTransitionEnter,
          enterActive: styles.editRowTransitionEnterActive,
          exit: styles.editRowTransitionExit,
          exitActive: styles.editRowTransitionExitActive,
        }}
        unmountOnExit
      >
        <div
          ref={editRef}
          className={styles.editRow}
          style={{
            width: `${containerWidth + 40}px`,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            marginTop: "3rem",
          }}
        >
          {editComponent}
        </div>
      </CSSTransition>
    );
  };

  const renderCellContent = (column: Column<T>, item: T): React.ReactNode => {
    const value = item[column.key];
    let content: React.ReactNode;

    if (column.render) {
      content = column.render(value, item);
    } else if (React.isValidElement(value)) {
      content = value;
    } else if (typeof value === "object") {
      content = JSON.stringify(value);
    } else {
      content = String(value);
    }

    const alignmentClass = getAlignmentClass(column.align);

    return <div className={`w-full ${alignmentClass}`}>{content}</div>;
  };

  const getAlignmentClass = (align?: Alignment): string => {
    switch (align) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      default:
        return "text-left";
    }
  };

  const RowActions = <T extends DataItem>({
    item,
    showMenu,
    onMenuToggle,
    rowOptions = [],
  }: {
    item: T;
    showMenu: boolean;
    onMenuToggle: (id: string | number | null) => void;
    rowOptions: RowOption<T>[];
  }) => {
    return (
      <div className="relative">
        <button
          className="p-1 rounded-full hover:bg-gray-200"
          onClick={() => onMenuToggle(showMenu ? null : item.id)}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
            {rowOptions.map((option, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  option.action(item);
                  onMenuToggle(null);
                }}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = data[index];
      if (!item) return null;

      return (
        <div style={style}>
          <div className="flex items-center bg-white border-b border-gray-200 hover:bg-gray-50">
            <div className="py-3 text-center w-12 flex-shrink-0">
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
                style={{ width: column.width || "auto" }}
              >
                {renderCellContent(column, item)}
              </div>
            ))}
            <div className="py-3 text-center w-24 flex-shrink-0">
              <RowActions
                item={item}
                showMenu={showRowMenu === item.id}
                onMenuToggle={setShowRowMenu}
                rowOptions={rowOptions}
              />
            </div>
          </div>
        </div>
      );
    },
    [data, columns, selectedRows, showRowMenu, rowOptions]
  );

  const renderTableMenu = () => (
    <div className="relative">
      <div className="absolute right-0 mt-4 w-48 bg-white rounded-md shadow-lg z-20">
        {tableOptions.map((option, index) => (
          <button
            key={index}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              option.action();
              setShowRowMenu(null);
            }}
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const addFilter = () => {
    if (selectedColumn && filterValue) {
      setFilters((prev) => [
        ...prev,
        {
          column: selectedColumn.key,
          operator: selectedOperator,
          value: filterValue,
        },
      ]);
      setSelectedColumn(null);
      setSelectedOperator("eq");
      setFilterValue("");
      setSelectOptions([]);
      setPage(1);
      setData([]);
      setHasMore(true);
    }
  };

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
    setPage(1);
    setData([]);
    setHasMore(true);
  };

  const renderFilterInput = () => {
    if (!selectedColumn) return null;

    switch (selectedColumn.type) {
      case "string":
        return (
          <input
            type="text"
            className="sm:mr-2 p-2 border rounded"
            placeholder="Filter value"
            value={filterValue as string}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        );
      case "number":
        if (selectedOperator === "between") {
          return (
            <>
              <input
                type="number"
                className="sm:mr-2 p-2 border rounded"
                placeholder="Min value"
                value={(filterValue as [number, number])[0] || ""}
                onChange={(e) =>
                  setFilterValue([
                    Number(e.target.value),
                    (filterValue as [number, number])[1] || 0,
                  ])
                }
              />
              <input
                type="number"
                className="sm:mr-2 p-2 border rounded"
                placeholder="Max value"
                value={(filterValue as [number, number])[1] || ""}
                onChange={(e) =>
                  setFilterValue([
                    (filterValue as [number, number])[0] || 0,
                    Number(e.target.value),
                  ])
                }
              />
            </>
          );
        }
        return (
          <input
            type="number"
            className="sm:mr-2 p-2 border rounded"
            placeholder="Filter value"
            value={filterValue as number}
            onChange={(e) => setFilterValue(Number(e.target.value))}
          />
        );
      case "date":
        if (selectedOperator === "between") {
          return (
            <>
              <input
                type="date"
                className="sm:mr-2 p-2 border rounded"
                value={(filterValue as [string, string])[0] || ""}
                onChange={(e) =>
                  setFilterValue([
                    e.target.value,
                    (filterValue as [string, string])[1] || "",
                  ])
                }
              />
              <input
                type="date"
                className="sm:mr-2 p-2 border rounded"
                value={(filterValue as [string, string])[1] || ""}
                onChange={(e) =>
                  setFilterValue([
                    (filterValue as [string, string])[0] || "",
                    e.target.value,
                  ])
                }
              />
            </>
          );
        }
        return (
          <input
            type="date"
            className="sm:mr-2 p-2 border rounded"
            value={filterValue as string}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        );
      case "boolean":
        return (
          <div className="mr-2 flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={filterValue as boolean}
              onChange={(e) => setFilterValue(e.target.checked)}
            />
            <span>{filterValue ? "True" : "False"}</span>
          </div>
        );
      case "select":
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
        );
      default:
        return null;
    }
  };

  const renderFilterOperatorSelect = () => {
    if (!selectedColumn) return null;

    const operators: FilterOperator[] = ["eq", "neq"];
    if (selectedColumn.type === "number" || selectedColumn.type === "date") {
      operators.push("gt", "gte", "lt", "lte", "between");
    }
    if (selectedColumn.type === "string") {
      operators.push("contains");
    }

    return (
      <>
        <select
          className="border border-gray-300 rounded-md bg-white whitespace-nowrap sm:mr-2"
          value={selectedOperator || ""}
          onChange={(e) =>
            setSelectedOperator(e.target.value as FilterOperator)
          }
        >
          {operators.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        {
          selectedOperator && (
            <div className="flex flex-row">
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
          )
          //     <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          //     </svg>
          // </button>
        }
      </>
    );
  };

  const renderFilterSection = () => (
    <div className="flex flex-wrap sm:flex-nowrap w-auto">
      <select
        className="border border-gray-300 rounded-md bg-white whitespace-nowrap sm:mr-2"
        value={selectedColumn ? String(selectedColumn.key) : ""}
        onChange={async (e) => {
          const column = columns.find(
            (col) => String(col.key) === e.target.value
          );
          setSelectedColumn(column || null);
          setSelectedOperator("eq");
          setFilterValue("");
          if (column && column.type === "select" && column.fetchOptions) {
            const options = await column.fetchOptions();
            setSelectOptions(options);
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
  );

  const renderFooter = () => (
    <div className="grid grid-cols-3 items-center">
      <div className="text-gray-500 text-sm">
        {data.length > 0
          ? `Showing ${data.length} results, page ${page - 1}`
          : "No results found"}
      </div>
      <div className="flex justify-center">
        {loading && (
          <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400" />
        )}
      </div>
      <div className="text-right text-gray-500 text-sm">
        {!hasMore && data.length > 0 && "No more data to load"}
      </div>
    </div>
  );

  return (
    <TableContainer>
      {(containerWidth) => (
        <div className={styles.tableContainer}>
          {isEditing && <div className={styles.overlay} />}
          {/* Header */}
          <div className={styles.header}>
            {/* Search and Filters */}
            <div className={styles.searchSection}>
              {/* Search Bar */}
              <div className="flex flex-wrap sm:flex-nowrap w-full">
                <div className="relative flex items-center flex-grow">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute text-gray-400 left-3"
                  />
                </div>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </div>
              {/* Filters Options */}
              {enableFilters && renderFilterSection()}
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {onAdd && (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    onClick={onAdd}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Agregar</span>
                  </button>
                )}

                {/* Table Options */}
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowTableMenu(!showTableMenu)}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
              </div>
              {/* Table Options */}
              {showTableMenu && renderTableMenu()}
            </div>
            {/* Active Filters */}
            {enableFilters && filters.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 justify-center">
                {/* Filter Tags */}
                {filters.map((filter, index) => (
                  <div key={index} className={styles.filterTag}>
                    <span>{`${String(filter.column)} ${filter.operator} ${
                      filter.value
                    }`}</span>
                    <button
                      className={styles.closeButton}
                      onClick={() => removeFilter(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Error message */}
          {error && <div className="text-red-500 p-4">{error}</div>}
          {/* Contenedor principal con position relative */}
          <div style={{ position: "relative", width: "100%" }}>
            {/* Panel de edición */}
            {renderTableRowEdit(containerWidth)}

            {/* Table header y contenido */}
            <div
              className={clsx(styles.tableBody, {
                [styles.editing]: isEditing,
              })}
            >
              {renderTableHeader()}
              <div
                style={{
                  width: containerWidth,
                  // filter: isEditing ? "blur(0.1px)" : "none",
                  pointerEvents: isEditing ? "none" : "auto",
                  marginTop: `${isEditing ? height : 0}px`,
                }}
              >
                <FixedSizeList
                  height={isEditing ? 400 - height : 400}
                  width={containerWidth}
                  itemCount={data.length}
                  itemSize={ROW_HEIGHT}
                  onScroll={handleScroll}
                  className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  overscanCount={5}
                >
                  {Row}
                </FixedSizeList>
              </div>
            </div>
          </div>
          {/* Footer con el mismo ancho */}
          <div className={styles.footer} style={{ width: containerWidth }}>
            {renderFooter()}
          </div>
        </div>
      )}
    </TableContainer>
  );
}

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default AdvancedTable;

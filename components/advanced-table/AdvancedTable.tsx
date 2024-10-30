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
  itemsPerPage = 10,
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
  const [actualPage, setActualPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  if (onCloseEdit) console.log(onCloseEdit);

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore || data.length < itemsPerPage) return;

    try {
      setLoading(true);
      console.log("Loading More Data:", {
        currentPage: page,
        currentDataLength: data.length,
      });

      const newData = await fetchData(
        page,
        itemsPerPage,
        searchTerm,
        sortColumn,
        sortDirection,
        filters
      );

      console.log("Additional Data Received:", {
        receivedRecords: newData.length,
      });

      const uniqueNewData = newData.filter(
        (newItem) =>
          !data.some((existingItem) => existingItem.id === newItem.id)
      );

      if (uniqueNewData.length > 0) {
        setData((prev) => [...prev, ...uniqueNewData]);
        setActualPage(
          Math.ceil((data.length + uniqueNewData.length) / itemsPerPage)
        );
      }

      setHasMore(newData.length === itemsPerPage);

      if (newData.length === itemsPerPage) {
        setPage((p) => p + 1);
      }
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
    data,
  ]);

  const handleScroll = useCallback(
    debounce(
      ({
        scrollOffset,
        scrollDirection,
      }: {
        scrollOffset: number;
        scrollDirection: "forward" | "backward";
      }) => {
        if (scrollDirection === "backward") return;

        const visibleHeight = 400;
        const totalHeight = ROW_HEIGHT * data.length;

        if (
          totalHeight - scrollOffset <= visibleHeight * 1.5 &&
          !loading &&
          hasMore &&
          data.length >= itemsPerPage
        ) {
          loadMoreData();
        }
      },
      150
    ),
    [loading, hasMore, loadMoreData, data.length, ROW_HEIGHT, itemsPerPage]
  );

  const initialLoad = useCallback(async () => {
    if (data.length === 0 && !loading) {
      setLoading(true);
      try {
        console.log("Initial Load Started");
        const initialData = await fetchData(
          1,
          itemsPerPage,
          searchTerm,
          sortColumn,
          sortDirection,
          filters
        );

        console.log("Initial Data Received:", {
          receivedRecords: initialData.length,
        });

        setData(initialData);
        setActualPage(1);

        setHasMore(initialData.length === itemsPerPage);
        setPage(2);
      } catch (err) {
        setError("Error fetching initial data. Please try again.");
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [
    data.length,
    loading,
    fetchData,
    itemsPerPage,
    searchTerm,
    sortColumn,
    sortDirection,
    filters,
  ]);

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
  }, [isEditing, height]);

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
      className="flex text-gray-600 text-sm bg-gray-100 tableHeader"
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
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

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
            width: isMobile ? "100%" : `${containerWidth + 40}px`,
            position: isMobile ? "fixed" : "absolute",
            left: isMobile ? 0 : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            zIndex: 40,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            marginTop: isMobile ? 0 : "3rem",
            // Importante: removemos pointer-events: none
            pointerEvents: "auto",
          }}
        >
          <div className={styles.editContent} style={{ pointerEvents: "auto" }}>
            {editComponent}
          </div>
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

  const MobileCard = useCallback(
    ({ item }: { item: T }) => (
      <div className={styles.mobileCard}>
        <div className={styles.cardHeader}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={selectedRows.includes(item.id)}
              onChange={() => handleRowSelect(item.id)}
            />
            <span className="text-sm font-semibold text-gray-600">
              ID: {item.id}
            </span>
          </div>
          <div className={styles.actionsContainer}>
            <RowActions
              item={item}
              showMenu={showRowMenu === item.id}
              onMenuToggle={setShowRowMenu}
              rowOptions={rowOptions}
            />
          </div>
        </div>

        <div className={styles.cardContent}>
          {columns.map((column) => {
            if (column.key === "id") return null;

            return (
              <div key={String(column.key)} className={styles.cardField}>
                <div className={styles.fieldLabel}>{column.label}</div>
                <div className={styles.fieldValue}>
                  {renderCellContent(column, item)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    [
      columns,
      selectedRows,
      showRowMenu,
      rowOptions,
      handleRowSelect,
      renderCellContent,
    ]
  );

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = data[index];
      if (!item) return null;

      return (
        <div style={style}>
          {/* Vista móvil */}
          <div className="block md:hidden">
            <MobileCard item={item} />
          </div>
          {/* Vista desktop */}
          <div className="hidden md:flex items-center bg-white border-b border-gray-200 hover:bg-gray-50">
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
    [data, columns, selectedRows, showRowMenu, rowOptions, renderCellContent]
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
        {selectedOperator && (
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
            }
          </div>
        )}
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
  );

  const renderHeader = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

    if (isMobile) {
      return (
        <div className={styles.header}>
          {/* Barra de búsqueda y botones */}
          <div className="flex items-center gap-2">
            {/* Caja de búsqueda */}
            <div className="flex-grow relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-1">
              {/* Botón de Filtros */}
              {enableFilters && (
                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 ${
                    showMobileFilters
                      ? "bg-gray-100 text-blue-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </button>
              )}

              {/* Botón de Agregar */}
              {onAdd && (
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={onAdd}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}

              {/* Botón de Opciones */}
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={() => setShowTableMenu(!showTableMenu)}
              >
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="text-gray-600"
                />
              </button>
            </div>
          </div>

          {/* Sección de filtros con transición */}
          {enableFilters && (
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showMobileFilters
                  ? "max-h-96 opacity-100 mt-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="py-2">{renderFilterSection()}</div>
            </div>
          )}

          {/* Filtros activos - siempre visibles si existen */}
          {enableFilters && filters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 px-2">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className={`${styles.filterTag} bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center`}
                >
                  <span>{`${String(filter.column)} ${filter.operator} ${
                    filter.value
                  }`}</span>
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => removeFilter(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Menú de opciones de tabla */}
          {showTableMenu && (
            <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
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
      );
    }

    return (
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
    );
  };

  const renderFooter = () => (
    <div className="grid grid-cols-3 items-center">
      <div className="text-gray-500 text-sm">
        {data.length > 0
          ? loading
            ? `Loading more results...`
            : `Showing ${data.length} results, page ${actualPage}`
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
          {/* Overlay */}
          {isEditing && <div className={styles.overlay} />}

          {/* Header */}
          {renderHeader()}

          {/* Error message */}
          {error && <div className="text-red-500 p-4">{error}</div>}

          {/* Cuerpo con Scroll */}
          <div
            className={clsx(styles.tableBody, {
              [styles.editing]: isEditing && !isMobile, // Solo aplicamos editing al cuerpo de la tabla, no al panel
            })}
          >
            {/* Panel de Edición */}
            <div className={styles.editContainer}>
              {renderTableRowEdit(containerWidth)}
            </div>

            {/* Vista Desktop */}
            <div className="hidden md:block h-full">
              {renderTableHeader()}
              <div
                style={{
                  width: containerWidth,
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
                  className={styles.scrollableContent}
                  overscanCount={5}
                >
                  {Row}
                </FixedSizeList>
              </div>
            </div>

            {/* Vista Mobile */}
            <div className="block md:hidden h-full">
              <div
                className={styles.mobileScrollContainer}
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  if (
                    !loading &&
                    hasMore &&
                    target.scrollHeight - target.scrollTop <=
                      target.clientHeight * 1.5
                  ) {
                    loadMoreData();
                  }
                }}
              >
                <div className={styles.mobileContainer}>
                  {data.map((item) => (
                    <MobileCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer} style={{ width: containerWidth }}>
            {renderFooter()}
          </div>
        </div>
      )}
    </TableContainer>
  );
}

export default AdvancedTable;

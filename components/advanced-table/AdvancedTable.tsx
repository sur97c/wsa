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
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FixedSizeList } from "react-window";
import debounce from "lodash/debounce";
import {
  AdvancedTableProps,
  Alignment,
  Column,
  ColumnType,
  DataItem,
  Filter,
  FilterOperator,
  getDefaultTranslations,
  TABLE_CONSTANTS,
} from "./advancedTableDefinition";
import TableContainer from "@components/table-container/TableContainer";
import { CSSTransition } from "react-transition-group";
import styles from "./AdvancedTable.module.scss";
import clsx from "clsx";

const { VISIBLE_HEIGHT, HEADER_HEIGHT, ROW_HEIGHT } = TABLE_CONSTANTS;

function AdvancedTable<T extends DataItem>({
  columns,
  fetchData,
  itemsPerPage = 10,
  tableOptions = [],
  rowOptions = [],
  enableFilters = false,
  isEditing = false,
  editComponent,
  onAdd,
  searchPlaceholder,
  translations,
}: AdvancedTableProps<T>) {
  // ==============================================
  // Initialize Translations
  // ==============================================
  const {
    columns: translatedColumns,
    tableOptions: translatedTableOptions,
    rowOptions: translatedRowOptions,
    tableTranslations,
  } = translations || {
    columns,
    tableOptions,
    rowOptions,
    tableTranslations: getDefaultTranslations(searchPlaceholder),
  };

  // ==============================================
  // State Management
  // ==============================================
  // Table Data State
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [actualPage, setActualPage] = useState(1);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showRowMenu, setShowRowMenu] = useState<number | string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [height, setHeight] = useState(0);

  // Filter State
  const [filters, setFilters] = useState<Filter<T>[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<Column<T> | null>(null);
  const [filterValue, setFilterValue] = useState<
    string | number | boolean | [string | number, string | number] | null
  >(null);
  const [selectedOperator, setSelectedOperator] =
    useState<FilterOperator | null>(null);
  const [selectOptions, setSelectOptions] = useState<string[]>([]);

  // ==============================================
  // Refs
  // ==============================================
  const editRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // ==============================================
  // Data Loading Functions
  // ==============================================
  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore || data.length < itemsPerPage) return;

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

        const totalHeight = ROW_HEIGHT * data.length;
        if (
          totalHeight - scrollOffset <= VISIBLE_HEIGHT * 1.5 &&
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

  // ==============================================
  // Event Handlers
  // ==============================================

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

  // ==============================================
  // Helper Functions
  // ==============================================
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

  // ==============================================
  // Filter Functions
  // ==============================================
  const addFilter = useCallback(() => {
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
      setSelectedOperator(null);
      setFilterValue(null);
      setSelectOptions([]);
      setPage(1);
      setData([]);
      setHasMore(true);
    }
  }, [selectedColumn, selectedOperator, filterValue]);

  const removeFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
    setPage(1);
    setData([]);
    setHasMore(true);
  };

  const getOperatorOptions = (columnType: ColumnType): FilterOperator[] => {
    const baseOperators: FilterOperator[] = ["eq", "neq"];

    if (columnType === "number" || columnType === "date") {
      return [...baseOperators, "gt", "gte", "lt", "lte", "between"];
    }

    if (columnType === "string") {
      return [...baseOperators, "contains"];
    }

    return baseOperators;
  };

  const formatFilterValue = useCallback(
    (filter: Filter<T>): string => {
      const column = translatedColumns.find((col) => col.key === filter.column);
      if (!column) return String(filter.value);

      if (filter.operator === "between" && Array.isArray(filter.value)) {
        const [start, end] = filter.value;

        switch (column.type) {
          case "date":
            return `${new Date(
              start as string
            ).toLocaleDateString()} - ${new Date(
              end as string
            ).toLocaleDateString()}`;
          default:
            return `${start} - ${end}`;
        }
      }

      if (column.type === "date" && filter.value) {
        return new Date(filter.value as string).toLocaleDateString();
      }

      if (column.type === "boolean") {
        return filter.value
          ? tableTranslations.filters.true
          : tableTranslations.filters.false;
      }

      return String(filter.value);
    },
    [translatedColumns, tableTranslations]
  );

  // ==============================================
  // Effects
  // ==============================================
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--table-container-height",
      `${HEADER_HEIGHT + VISIBLE_HEIGHT}px`
    );
    document.documentElement.style.setProperty(
      "--header-height",
      `${headerRef.current?.offsetHeight || 0}px`
    );
    document.documentElement.style.setProperty(
      "--edit-panel-top",
      `${(headerRef.current?.offsetHeight || 0) + HEADER_HEIGHT}px`
    );
    document.documentElement.style.setProperty(
      "--footer-height",
      `${footerRef.current?.offsetHeight || 0}px`
    );
    if (data.length === 0 && !loading) {
      const loadInitialData = async () => {
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
          setActualPage(1);
          setHasMore(initialData.length === itemsPerPage);
          setPage(2);
        } catch (err) {
          setError("Error fetching initial data. Please try again.");
          console.error("Error fetching initial data:", err);
        } finally {
          setLoading(false);
        }
      };
      loadInitialData();
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
    if (editRef.current && isEditing) {
      const heightValue = editRef.current.offsetHeight;
      setHeight(heightValue);
      document.documentElement.style.setProperty(
        "--edit-height",
        `${heightValue}px`
      );
    }
    return () => {
      document.documentElement.style.removeProperty("--edit-height");
    };
  }, [isEditing]);

  useEffect(() => {
    if (!selectedColumn) {
      setSelectedOperator(null);
      setFilterValue(null);
      setSelectOptions([]);
      return;
    }
    if (selectedColumn.type === "select" && selectedColumn.fetchOptions) {
      const loadOptions = async () => {
        try {
          const options = await selectedColumn.fetchOptions?.();
          if (options) {
            setSelectOptions(options);
          }
        } catch (error) {
          console.error("Error loading options:", error);
          setSelectOptions([]);
        }
      };
      loadOptions();
    }
  }, [selectedColumn]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      `${headerRef.current?.offsetHeight || 0}px`
    );
    document.documentElement.style.setProperty(
      "--edit-panel-top",
      `${(headerRef.current?.offsetHeight || 0) + HEADER_HEIGHT}px`
    );
    document.documentElement.style.setProperty(
      "--footer-height",
      `${footerRef.current?.offsetHeight || 0}px`
    );
  }, [filters.length, showMobileFilters]);

  // ==============================================
  // Render Helper Functions
  // ==============================================
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

  const renderFilterInput = useCallback(() => {
    if (!selectedColumn) return null;

    switch (selectedColumn.type) {
      case "string":
        return (
          <input
            type="text"
            className="sm:mr-2 p-2 border rounded"
            placeholder={tableTranslations.filters.filterValue}
            value={(filterValue as string) || ""}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        );
      case "number":
        if (selectedOperator === "between") {
          const [min, max] = (filterValue as [number, number]) || [null, null];
          return (
            <div className="flex gap-2">
              <input
                type="number"
                className="sm:mr-2 p-2 border rounded w-24"
                placeholder={tableTranslations.filters.minValue}
                value={min ?? ""}
                onChange={(e) =>
                  setFilterValue([Number(e.target.value), max ?? null] as [
                    number,
                    number
                  ])
                }
              />
              <input
                type="number"
                className="sm:mr-2 p-2 border rounded w-24"
                placeholder={tableTranslations.filters.maxValue}
                value={max ?? ""}
                onChange={(e) =>
                  setFilterValue([min ?? null, Number(e.target.value)] as [
                    number,
                    number
                  ])
                }
              />
            </div>
          );
        }
        return (
          <input
            type="number"
            className="sm:mr-2 p-2 border rounded"
            placeholder={tableTranslations.filters.filterValue}
            value={(filterValue as number) || ""}
            onChange={(e) => setFilterValue(Number(e.target.value))}
          />
        );
      case "date":
        if (selectedOperator === "between") {
          const [startDate, endDate] = (filterValue as [string, string]) || [
            "",
            "",
          ];
          return (
            <div className="flex gap-2">
              <input
                type="date"
                className="sm:mr-2 p-2 border rounded"
                style={{ width: "9rem" }}
                value={startDate}
                onChange={(e) =>
                  setFilterValue([e.target.value, endDate] as [string, string])
                }
              />
              <input
                type="date"
                className="sm:mr-2 p-2 border rounded"
                style={{ width: "9rem" }}
                value={endDate}
                onChange={(e) =>
                  setFilterValue([startDate, e.target.value] as [
                    string,
                    string
                  ])
                }
              />
            </div>
          );
        }
        return (
          <input
            type="date"
            className="sm:mr-2 p-2 border rounded"
            style={{ width: "9rem" }}
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
              checked={(filterValue as boolean) || false}
              onChange={(e) => setFilterValue(e.target.checked)}
            />
            <span>
              {(filterValue as boolean)
                ? tableTranslations.filters.true
                : tableTranslations.filters.false}
            </span>
          </div>
        );
      case "select":
        return (
          <select
            className="sm:mr-2 p-2 border rounded"
            value={filterValue as string}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="">{tableTranslations.filters.selectOption}</option>
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
  }, [
    selectedColumn,
    selectedOperator,
    filterValue,
    selectOptions,
    tableTranslations,
  ]);

  // ==============================================
  // Render Components
  // ==============================================
  const RowActions = useCallback(
    ({
      item,
      showMenu,
      onMenuToggle,
    }: {
      item: T;
      showMenu: boolean;
      onMenuToggle: (id: string | number | null) => void;
    }) => {
      return (
        <div className="relative">
          <button
            className="h-10 w-10 rounded-full hover:bg-gray-200"
            onClick={() => onMenuToggle(showMenu ? null : item.id)}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              {translatedRowOptions.map((option, index) => (
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
    },
    [translatedRowOptions]
  );

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
            />
          </div>
        </div>
        <div className={styles.cardContent}>
          {translatedColumns.map((column) => {
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
      translatedColumns,
      selectedRows,
      showRowMenu,
      handleRowSelect,
      renderCellContent,
    ]
  ); //RowActions,

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const isMobile =
        typeof window !== "undefined" && window.innerWidth <= 768;
      const item = data[index];

      if (!item) return null;

      if (index === data.length) {
        return <div style={{ ...style, height: ROW_HEIGHT }} />;
      }

      return (
        <div style={style}>
          {isMobile ? (
            <div className="block">
              <MobileCard item={item} />
            </div>
          ) : (
            <div className="flex items-center bg-white border-b border-gray-200 hover:bg-gray-50">
              <div className="py-3 text-center w-12 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleRowSelect(item.id)}
                />
              </div>
              {translatedColumns.map((column) => (
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
                />
              </div>
            </div>
          )}
        </div>
      );
    },
    [
      data,
      translatedColumns,
      selectedRows,
      showRowMenu,
      handleRowSelect,
      renderCellContent,
    ]
  );
  // MobileCard, RowActions,

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
      {translatedColumns.map((column) => (
        <div
          key={String(column.key)}
          className={`py-3 px-2 cursor-pointer flex items-center justify-center text-center`}
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
      <div className="py-3 text-center w-24 flex-shrink-0">
        {tableTranslations.actions}
      </div>
    </div>
  );

  const renderTableRowEdit = useCallback(() => {
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
        <div ref={editRef} className={styles.editRow}>
          <div className={styles.editContent}>{editComponent}</div>
        </div>
      </CSSTransition>
    );
  }, [isEditing, editComponent]);

  const renderFilterSection = () => (
    <div className="flex flex-wrap sm:flex-nowrap w-auto">
      <select
        className="border border-gray-300 rounded-md bg-white whitespace-nowrap sm:mr-2"
        value={selectedColumn ? String(selectedColumn.key) : ""}
        onChange={async (e) => {
          const column = translatedColumns.find(
            (col) => String(col.key) === e.target.value
          );
          setSelectedColumn(column || null);
          setSelectedOperator("eq");
          setFilterValue(null);
          if (column?.type === "select" && column.fetchOptions) {
            try {
              const options = await column.fetchOptions();
              setSelectOptions(options);
            } catch (error) {
              console.error("Error fetching column options:", error);
              setSelectOptions([]);
            }
          }
        }}
      >
        <option value="">{tableTranslations.filters.selectColumn}</option>
        {translatedColumns.map((column) => (
          <option key={String(column.key)} value={String(column.key)}>
            {column.label}
          </option>
        ))}
      </select>
      {renderFilterOperatorSelect()}
    </div>
  );

  const renderFilterOperatorSelect = () => {
    if (!selectedColumn) return null;
    const operators = getOperatorOptions(selectedColumn.type);
    return (
      <>
        <select
          className="border border-gray-300 rounded-md bg-white whitespace-nowrap sm:mr-2"
          value={selectedOperator || ""}
          onChange={(e) =>
            setSelectedOperator(e.target.value as FilterOperator)
          }
        >
          <option value="">{tableTranslations.filters.selectOperator}</option>
          {operators.map((op) => (
            <option key={op} value={op}>
              {tableTranslations.filters.operators[op]}
            </option>
          ))}
        </select>
        {selectedOperator && (
          <div className="flex flex-row">
            {renderFilterInput()}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
              onClick={addFilter}
              disabled={!selectedColumn || !filterValue}
            >
              <FontAwesomeIcon icon={faFilter} />
            </button>
          </div>
        )}
      </>
    );
  };

  const renderTableMenu = () => (
    <div className="relative">
      <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
        {translatedTableOptions.map((option, index) => (
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
    </div>
  );

  const renderHeader = useCallback(() => {
    return (
      <div ref={headerRef} className={styles.header}>
        <div className="flex items-center gap-2">
          <div className="flex-grow relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              placeholder={tableTranslations.searchPlaceholder}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>

          <div className="flex items-center gap-1">
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

            {onAdd && (
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={onAdd}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}

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

        {enableFilters && (
          <div className={styles.filterSection}>
            <div
              className={clsx(
                "mt-2 transition-all duration-300 ease-in-out overflow-hidden",
                {
                  "max-h-96 opacity-100": showMobileFilters,
                  "max-h-0 opacity-0": !showMobileFilters,
                }
              )}
            >
              {renderFilterSection()}
            </div>
          </div>
        )}

        {enableFilters && filters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 px-2">
            {filters.map((filter, index) => {
              const columnLabel = translatedColumns.find(
                (col) => col.key === filter.column
              )?.label;
              const operatorLabel =
                tableTranslations.filters.operators[filter.operator || "eq"];
              const formattedValue = formatFilterValue(filter);

              return (
                <div
                  key={index}
                  className={`bg-gray-100 text-sm rounded-full px-3 py-1 text-xs flex items-center`}
                >
                  <span className="flex items-center gap-1 text-center">
                    <span className="font-medium">{columnLabel}</span>
                    <span className="text-gray-500 ml-2 mr-2">
                      {operatorLabel}
                    </span>
                    <span>{formattedValue}</span>
                  </span>
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => removeFilter(index)}
                    title={tableTranslations.filters.removeFilter}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {showTableMenu && renderTableMenu()}
      </div>
    );
  }, [
    tableTranslations,
    searchTerm,
    showMobileFilters,
    enableFilters,
    filters,
    translatedColumns,
    showTableMenu,
    handleSearch,
    onAdd,
  ]);

  const renderFooter = useCallback(
    () => (
      <div ref={footerRef} className="grid grid-cols-3 items-center">
        <div className="text-gray-500 text-sm">
          {data.length > 0
            ? loading
              ? tableTranslations.loadingMore
              : tableTranslations.showingResults
                  .replace("{{count}}", data.length.toString())
                  .replace("{{page}}", actualPage.toString())
            : tableTranslations.noResults}
        </div>
        <div className="flex justify-center">
          {loading && (
            <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400" />
          )}
        </div>
        <div className="text-right text-gray-500 text-sm">
          {!hasMore && data.length > 0 && tableTranslations.noMoreData}
        </div>
      </div>
    ),
    [data.length, loading, hasMore, actualPage, tableTranslations]
  );

  const renderMobileView = useCallback(
    () => (
      <div className="block h-full">
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
    ),
    [data, loading, hasMore, loadMoreData, MobileCard]
  );

  const renderDesktopView = useCallback(
    (containerWidth: number) => (
      <div className={styles.scrollContainer}>
        {renderTableHeader()}
        <div
          style={{
            width: containerWidth,
            pointerEvents: isEditing ? "none" : "auto",
            marginTop: `${isEditing ? height : 0}px`,
          }}
        >
          <FixedSizeList
            height={isEditing ? VISIBLE_HEIGHT - height : VISIBLE_HEIGHT}
            width={containerWidth}
            itemCount={data.length + 1}
            itemSize={ROW_HEIGHT}
            onScroll={handleScroll}
            className={styles.scrollableContent}
            overscanCount={5}
          >
            {Row}
          </FixedSizeList>
        </div>
      </div>
    ),
    [data.length, isEditing, height, handleScroll, Row, renderTableHeader]
  );

  // ==============================================
  // Main Render
  // ==============================================
  return (
    <TableContainer>
      {(containerWidth) => {
        const isMobile =
          typeof window !== "undefined" && window.innerWidth <= 768;
        return (
          <div className={styles.tableContainer}>
            {/* Overlay */}
            {isEditing && <div className={styles.overlay} />}
            {/* Header */}
            {renderHeader()}
            {/* Edit Panel */}
            <div className={styles.editContainer}>{renderTableRowEdit()}</div>
            {/* Error message */}
            {error && <div className="text-red-500 p-4">{error}</div>}
            {/* Table Body */}
            <div
              className={clsx(styles.tableBody, {
                [styles.editing]: isEditing && !isMobile,
                [styles.hasFilters]: filters.length > 0,
              })}
            >
              {!isMobile && renderDesktopView(containerWidth)}
              {isMobile && renderMobileView()}
            </div>
            {/* Footer */}
            <div className={styles.footer} style={{ width: containerWidth }}>
              {renderFooter()}
            </div>
          </div>
        );
      }}
    </TableContainer>
  );
}

export default AdvancedTable;

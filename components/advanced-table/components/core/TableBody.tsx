// components/advanced-table/components/core/TableBody.tsx

import React, { useCallback } from "react";
import { FixedSizeList } from "react-window";
import type { DataItem } from "@components/advanced-table/types/table.types";
import type { Column } from "@components/advanced-table/types/column.types";
import { TABLE_CONSTANTS } from "@components/advanced-table/constants/tableConstants";
import { useMediaQuery } from "@components/advanced-table/hooks/useMediaQuery";
import TableRow from "@components/advanced-table/components/core/TableRow";
import TableRowMobile from "@components/advanced-table/components/core/TableRowMobile";

const { VISIBLE_HEIGHT, ROW_HEIGHT } = TABLE_CONSTANTS;

interface TableBodyProps<T extends DataItem> {
  data: T[];
  columns: Column<T>[];
  visibleColumns: string[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
  showRowMenu: string | number | null;
  onRowMenuToggle: (id: string | number | null) => void;
  isEditing: boolean;
  editHeight: number;
  containerWidth: number;
  onScroll: (params: {
    scrollOffset: number;
    scrollDirection: "forward" | "backward";
  }) => void;
  renderCellContent: (column: Column<T>, item: T) => React.ReactNode;
}

const TableBody = <T extends DataItem>({
  data,
  columns,
  visibleColumns,
  selectedRows,
  onRowSelect,
  showRowMenu,
  onRowMenuToggle,
  isEditing,
  editHeight,
  containerWidth,
  onScroll,
  renderCellContent,
}: TableBodyProps<T>) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = data[index];

      if (!item) return null;

      if (index === data.length) {
        return <div style={{ ...style, height: ROW_HEIGHT }} />;
      }

      const props = {
        item,
        columns: columns.filter(
          (col) => visibleColumns.includes(String(col.key)) || col.alwaysVisible
        ),
        selected: selectedRows.includes(item.id),
        onSelect: onRowSelect,
        showMenu: showRowMenu === item.id,
        onMenuToggle: onRowMenuToggle,
        renderCellContent,
      };

      return (
        <div style={style}>
          {isMobile ? <TableRowMobile {...props} /> : <TableRow {...props} />}
        </div>
      );
    },
    [
      data,
      columns,
      visibleColumns,
      selectedRows,
      showRowMenu,
      onRowSelect,
      onRowMenuToggle,
      renderCellContent,
      isMobile,
    ]
  );

  if (isMobile) {
    return (
      <div className="block h-full">
        <div
          className="overflow-y-auto"
          style={{
            height: isEditing ? `calc(100% - ${editHeight}px)` : "100%",
          }}
          onScroll={(e) => {
            const target = e.currentTarget;
            onScroll({
              scrollOffset: target.scrollTop,
              scrollDirection: target.scrollTop > 0 ? "forward" : "backward",
            });
          }}
        >
          <div className="space-y-4 p-4">
            {data.map((item, index) => (
              <TableRowMobile
                key={item.id}
                item={item}
                columns={columns.filter(
                  (col) =>
                    visibleColumns.includes(String(col.key)) ||
                    col.alwaysVisible
                )}
                selected={selectedRows.includes(item.id)}
                onSelect={onRowSelect}
                showMenu={showRowMenu === item.id}
                onMenuToggle={onRowMenuToggle}
                renderCellContent={renderCellContent}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <div
        style={{
          width: containerWidth,
          pointerEvents: isEditing ? "none" : "auto",
          marginTop: isEditing ? editHeight : 0,
        }}
      >
        <FixedSizeList
          height={isEditing ? VISIBLE_HEIGHT - editHeight : VISIBLE_HEIGHT}
          width={containerWidth}
          itemCount={data.length + 1}
          itemSize={ROW_HEIGHT}
          onScroll={({ scrollOffset, scrollDirection }) =>
            onScroll({ scrollOffset, scrollDirection })
          }
          className="scrollableContent"
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      </div>
    </div>
  );
};

export default TableBody;

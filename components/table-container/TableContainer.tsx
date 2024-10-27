// components/table-container/TableContainer.tsx

import React, { useState } from "react";
import useResizeObserver from "use-resize-observer";

interface TableContainerProps {
  children: (width: number) => React.ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => {
      if (width) {
        setContainerWidth(width);
      }
    },
  });

  return (
    <div ref={ref} className="w-full h-full">
      {children(containerWidth)}
    </div>
  );
};

export default TableContainer;
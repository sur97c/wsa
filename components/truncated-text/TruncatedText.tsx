// components/truncated-text/TruncatedText.tsx

import React, { useState } from "react";
import { CellValue } from "@components/advanced-table/advancedTableDefinition";

interface TruncatedTextProps {
  value: CellValue;
  maxLength?: number;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  value,
  maxLength = 8,
  tooltipPosition = "bottom",
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [clickShow, setClickShow] = useState(false);

  const text = value?.toString() || "";

  const truncatedText =
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickShow(!clickShow);
  };

  const getTooltipPosition = () => {
    switch (tooltipPosition) {
      case "top":
        return "bottom-full mb-2";
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full mr-2";
      case "right":
        return "left-full ml-2";
      default:
        return "top-full mt-2";
    }
  };

  // Don't show tooltip/modal if text is not truncated
  if (text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className="relative inline-block">
      <span
        className={`cursor-pointer ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        {truncatedText}
      </span>

      {/* Hover Tooltip */}
      {showTooltip && !clickShow && (
        <div
          className={`
            absolute ${getTooltipPosition()} z-50 
            px-2 py-1 text-sm text-white bg-gray-800 
            rounded shadow-lg whitespace-nowrap
          `}
        >
          {text}
        </div>
      )}

      {/* Click Modal */}
      {clickShow && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-50
          "
          onClick={() => setClickShow(false)}
        >
          <div
            className="
              bg-white rounded-lg p-4 max-w-md w-full mx-4
              break-all
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-medium mb-2">ID Completo:</div>
            <div className="text-gray-600">{text}</div>
            <button
              className="
                mt-4 px-4 py-2 bg-gray-200 text-gray-700
                rounded hover:bg-gray-300 transition-colors
                w-full
              "
              onClick={() => setClickShow(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TruncatedText;

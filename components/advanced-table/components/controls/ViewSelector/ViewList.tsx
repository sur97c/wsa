// components/advanced-table/components/controls/ViewSelector/ViewList.tsx

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faStar,
  faEdit,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import { ITableView } from "@components/advanced-table/types/view.types";
import { DataItem } from "@components/advanced-table/types/table.types";
import { cn } from "@utils/utils";

interface ViewListProps<T extends DataItem> {
  views: ITableView<T>[];
  selectedViewId: string | null;
  onSelectView: (view: ITableView<T>) => void;
  onDeleteView: (view: ITableView<T>) => void;
  onSetDefaultView: (view: ITableView<T>) => void;
  onEditView: (view: ITableView<T>) => void;
  onDuplicateView: (view: ITableView<T>) => void;
  translations: {
    setDefault: string;
    deleteView: string;
    editView: string;
    duplicateView: string;
  };
}

export const ViewList = <T extends DataItem>({
  views,
  selectedViewId,
  onSelectView,
  onDeleteView,
  onSetDefaultView,
  onEditView,
  onDuplicateView,
  translations,
}: ViewListProps<T>) => {
  return (
    <div className="max-h-60 overflow-y-auto">
      {views.map((view) => (
        <div
          key={view.id}
          className={cn(
            "group flex items-center justify-between px-4 py-2 hover:bg-gray-50",
            "transition-colors duration-200 cursor-pointer",
            selectedViewId === view.id && "bg-gray-50"
          )}
          onClick={() => onSelectView(view)}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {view.isDefault && (
              <FontAwesomeIcon
                icon={faStar}
                className="text-yellow-400 w-4 h-4 flex-shrink-0"
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate">
                {view.name}
              </span>
              {view.description && (
                <span className="text-xs text-gray-500 truncate">
                  {view.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!view.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSetDefaultView(view);
                }}
                className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                title={translations.setDefault}
              >
                <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditView(view);
              }}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              title={translations.editView}
            >
              <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateView(view);
              }}
              className="p-1 text-gray-400 hover:text-green-500 transition-colors"
              title={translations.duplicateView}
            >
              <FontAwesomeIcon icon={faClone} className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteView(view);
              }}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title={translations.deleteView}
            >
              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewList;

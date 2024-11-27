// components/advanced-table/components/controls/ViewSelector/ViewSelector.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  type RootState,
} from "@lib/redux/store";
import { createGenericFirestoreSlice } from "@lib/redux/slices/genericFirestoreSlice";
import { DataItem } from "@components/advanced-table/types/table.types";
import {
  ITableView,
  ViewConfig,
} from "@components/advanced-table/types/view.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faPlus,
  faSave,
  faTrash,
  faStar,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

// Crear el slice para las vistas
const tableViewsSlice = createGenericFirestoreSlice<"tableViews", ITableView>(
  "tableViews",
  "tableViews"
);

interface ViewSelectorProps<T extends DataItem> {
  tableId: string;
  currentConfig?: Partial<ViewConfig<T>>;
  onViewChange: (view: ITableView<T> | null) => void;
  translations: {
    title: string;
    saveView: string;
    deleteView: string;
    setDefault: string;
    newView: string;
    defaultView: string;
    confirmDelete: string;
    viewName: string;
    viewDescription: string;
    save: string;
    cancel: string;
  };
}

const ViewSelector = <T extends DataItem>({
  tableId,
  currentConfig,
  onViewChange,
  translations,
}: ViewSelectorProps<T>) => {
  // Estado local
  const [isOpen, setIsOpen] = useState(false);
  const [isNewViewModalOpen, setIsNewViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [newViewDescription, setNewViewDescription] = useState("");
  const [selectedViewId, setSelectedViewId] = useState<string | number | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);

  // Redux state
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state: RootState) => state.auth);
  const { documents: views, status: loading } = useAppSelector(
    (state: RootState) => state.tableViews
  );

  // Efectos
  useEffect(() => {
    if (auth?.uid) {
      dispatch(tableViewsSlice.thunks.getFirestoreDocuments());
    }
  }, [dispatch, auth?.uid]);

  useEffect(() => {
    if (auth?.uid) {
      dispatch(tableViewsSlice.thunks.getFirestoreDocuments());
    }
  }, [dispatch, auth?.uid]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handlers
  const handleCreateView = async () => {
    if (!auth?.uid || !newViewName.trim()) return;

    try {
      const newView: Omit<ITableView<T>, "id"> = {
        userId: auth.uid,
        tableId,
        name: newViewName.trim(),
        description: newViewDescription.trim() || undefined,
        isDefault: views.length === 0, // Primera vista será la default
        config: currentConfig as ViewConfig<T>,
        createdBy: auth.uid,
        updatedBy: auth.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await dispatch(
        tableViewsSlice.thunks.createFirestoreDocument(newView)
      ).unwrap();

      setNewViewName("");
      setNewViewDescription("");
      setIsNewViewModalOpen(false);
    } catch (error) {
      console.error("Error creating view:", error);
    }
  };

  const handleDeleteView = async (viewId: string | number) => {
    if (!confirm(translations.confirmDelete)) return;
    try {
      await dispatch(
        tableViewsSlice.thunks.deleteFirestoreDocument(viewId)
      ).unwrap();

      if (selectedViewId === viewId) {
        setSelectedViewId(null);
        onViewChange(null);
      }
    } catch (error) {
      console.error("Error deleting view:", error);
    }
  };

  const handleSetDefaultView = async (view: ITableView) => {
    try {
      await dispatch(
        tableViewsSlice.thunks.updateFirestoreDocument({
          id: view.id,
          update: { isDefault: true },
        })
      ).unwrap();
    } catch (error) {
      console.error("Error setting default view:", error);
    }
  };

  // Render
  if (!auth?.uid) return null;

  const filteredViews = views.filter(
    (view: ITableView) => view.tableId === tableId
  );

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón principal */}
      <button
        type="button"
        className={`
          flex items-center justify-center
          px-3 py-2 rounded-md
          ${
            isOpen
              ? "bg-gray-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }
          md:w-10 md:h-10 md:rounded-full md:p-0
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faBookmark} className="mr-2 md:mr-0" />
        <span className="block md:hidden">{translations.title}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`ml-2 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            {/* Lista de vistas */}
            {filteredViews.map((view: ITableView) => (
              <div
                key={view.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
              >
                <button
                  className={`flex-1 text-left ${
                    selectedViewId === view.id
                      ? "text-blue-600 font-medium"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedViewId(view.id);
                    onViewChange(view as ITableView<T>);
                    setIsOpen(false);
                  }}
                >
                  {view.name}
                  {view.isDefault && (
                    <FontAwesomeIcon
                      icon={faStar}
                      className="ml-2 text-yellow-400"
                    />
                  )}
                </button>
                <div className="flex items-center gap-2">
                  {!view.isDefault && (
                    <button
                      className="text-gray-400 hover:text-yellow-400"
                      onClick={() => handleSetDefaultView(view)}
                      title={translations.setDefault}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  )}
                  <button
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDeleteView(view.id)}
                    title={translations.deleteView}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}

            {/* Acciones */}
            <div className="border-t border-gray-200 mt-1">
              <button
                className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => setIsNewViewModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                {translations.newView}
              </button>
              {currentConfig && selectedViewId && (
                <button
                  className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    if (selectedViewId) {
                      dispatch(
                        tableViewsSlice.thunks.updateFirestoreDocument({
                          id: selectedViewId,
                          update: { config: currentConfig },
                        })
                      );
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {translations.saveView}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para nueva vista */}
      {isNewViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">
              {translations.newView}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {translations.viewName}
                </label>
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {translations.viewDescription}
                </label>
                <textarea
                  value={newViewDescription}
                  onChange={(e) => setNewViewDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => {
                    setNewViewName("");
                    setNewViewDescription("");
                    setIsNewViewModalOpen(false);
                  }}
                >
                  {translations.cancel}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  onClick={handleCreateView}
                  disabled={!newViewName.trim() || loading === "loading"}
                >
                  {translations.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSelector;

// components/mock-data-control/MockDataControl.tsx

import React from "react"
import { useAppDispatch, useAppSelector } from "@lib/redux/store"
import {
  setGlobalMockConfig,
  resetMockConfig,
  EntityName,
  setEntityMockConfig,
} from "@lib/redux/slices/mockConfigSlice"

export const MockDataControl: React.FC = () => {
  const dispatch = useAppDispatch()
  const { useMockData, mockEntities } = useAppSelector(
    (state) => state.mockConfig
  )

  const handleGlobalToggle = () => {
    dispatch(setGlobalMockConfig(!useMockData))
  }

  const handleEntityToggle = (entity: EntityName) => {
    dispatch(setEntityMockConfig({ entity, useMock: !mockEntities[entity] }))
  }

  const handleReset = () => {
    dispatch(resetMockConfig())
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Configuración de Datos</h3>
        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={useMockData}
              onChange={handleGlobalToggle}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Usar datos mock (Global)</span>
          </label>
          <button
            onClick={handleReset}
            className="ml-4 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Restaurar configuración por defecto
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Configuración por entidad:</h4>
        {Object.entries(mockEntities).map(([entity, isEnabled]) => (
          <div key={entity} className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => handleEntityToggle(entity as EntityName)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 capitalize">{entity}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
